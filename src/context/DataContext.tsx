import React, { createContext, useContext, useState, useEffect } from 'react';
import { Case, Message, Hearing, Evidence, User, UserRole } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DataContextType {
  cases: Case[];
  messages: Message[];
  hearings: Hearing[];
  evidences: Evidence[];
  users: User[];
  
  // Case operations
  getCaseById: (id: string) => Case | undefined;
  getCasesByUser: (userId: string, role: UserRole) => Promise<Case[]>;
  createCase: (newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Case>;
  updateCase: (caseId: string, updates: Partial<Case>) => Promise<Case>;
  
  // Message operations
  getMessagesByCaseId: (caseId: string) => Message[];
  getMessagesByUser: (userId: string) => Message[];
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => Promise<Message>;
  
  // Hearing operations
  getHearingsByCaseId: (caseId: string) => Hearing[];
  createHearing: (hearing: Omit<Hearing, 'id'>) => Promise<Hearing>;
  updateHearing: (hearingId: string, updates: Partial<Hearing>) => Promise<Hearing>;
  
  // Evidence operations
  getEvidenceByCaseId: (caseId: string) => Evidence[];
  addEvidence: (evidence: Omit<Evidence, 'id'>) => Promise<Evidence>;

  // User operations
  getUsersByRole: (role: UserRole) => User[];
  getUserById: (id: string) => User | undefined;
  
  // Case request operations
  acceptCaseRequest: (requestId: string) => Promise<void>;
  rejectCaseRequest: (requestId: string) => Promise<void>;
  
  // Case-lawyer relationship operations
  assignLawyerToCase: (caseId: string, lawyerId: string, role: string) => Promise<void>;
  removeLawyerFromCase: (caseId: string, lawyerId: string) => Promise<void>;
  getLawyersByCase: (caseId: string) => Promise<User[]>;
  
  // Data operations
  clearAllData: () => void;

  loading: boolean;
  refetch: () => void;
}

const INITIAL_USERS: User[] = [
  {
    id: '5',
    name: 'Michael Williams',
    email: 'michael@example.com',
    role: 'client',
    avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Williams&background=random'
  },
  {
    id: '6',
    name: 'Sarah Davis',
    email: 'sarah@example.com',
    role: 'client',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Davis&background=random'
  },
  {
    id: '7',
    name: 'Robert Parker',
    email: 'robert@example.com',
    role: 'lawyer',
    avatarUrl: 'https://ui-avatars.com/api/?name=Robert+Parker&background=random'
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [caseRequests, setCaseRequests] = useState<any[]>([]);
  const [caseLawyers, setCaseLawyers] = useState<any[]>([]);

  const loadInitialData = async () => {
    setLoading(true);
    
    if (user) {
      try {
        await fetchDataFromSupabase();
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
    
    setLoading(false);
  };

  const fetchDataFromSupabase = async () => {
    if (!user) return;
    
    try {
      let casesQuery;
      
      if (user.role === 'client') {
        casesQuery = supabase.from('cases').select('*').eq('client_id', user.id);
      } else if (user.role === 'lawyer') {
        const { data: lawyerCases } = await supabase
          .from('case_lawyers')
          .select('case_id')
          .eq('lawyer_id', user.id);
          
        if (lawyerCases && lawyerCases.length > 0) {
          const caseIds = lawyerCases.map(lc => lc.case_id);
          casesQuery = supabase.from('cases').select('*').in('id', caseIds);
        } else {
          casesQuery = supabase.from('cases').select('*').eq('primary_lawyer_id', user.id);
        }
      } else if (user.role === 'judge') {
        casesQuery = supabase.from('cases').select('*').eq('judge_id', user.id);
      } else {
        casesQuery = supabase.from('cases').select('*');
      }
      
      const { data: casesData, error: casesError } = await casesQuery;
      
      if (casesError) throw casesError;
      
      if (casesData) {
        setCases(casesData.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          caseNumber: c.case_number,
          status: c.status,
          clientId: c.client_id,
          lawyerId: c.primary_lawyer_id,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          nextHearingDate: c.next_hearing_date,
          filedDate: c.filed_date,
          courtRoom: c.court_room,
          judgeName: undefined
        })));
      }
      
      const { data: caseLawyersData, error: caseLawyersError } = await supabase
        .from('case_lawyers')
        .select('*');
        
      if (caseLawyersError) throw caseLawyersError;
      
      if (caseLawyersData) {
        setCaseLawyers(caseLawyersData);
      }
    } catch (error) {
      console.error('Error in fetchDataFromSupabase:', error);
      throw error;
    }
  };

  const loadFromLocalStorage = () => {
    const loadFromStorage = <T,>(key: string, initialData: T[] = []): T[] => {
      const stored = localStorage.getItem(`courtwise_${key}`);
      if (stored) {
        try {
          return JSON.parse(stored) as T[];
        } catch (error) {
          console.error(`Error parsing ${key} from localStorage:`, error);
          return initialData;
        }
      }
      return initialData;
    };
    
    const storedCases = loadFromStorage<Case>('cases', []);
    const storedMessages = loadFromStorage<Message>('messages', []);
    const storedHearings = loadFromStorage<Hearing>('hearings', []);
    const storedEvidences = loadFromStorage<Evidence>('evidences', []);
    const storedCaseRequests = loadFromStorage('caseRequests', []);
    const storedCaseLawyers = loadFromStorage('caseLawyers', []);
    
    const storedUserData = localStorage.getItem('courtwise_user');
    let authUser: User | null = null;
    
    if (storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        if (parsedUser && 
            typeof parsedUser.id === 'string' && 
            typeof parsedUser.name === 'string' && 
            typeof parsedUser.email === 'string' && 
            typeof parsedUser.role === 'string') {
          authUser = parsedUser as User;
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
    
    const storedUsers = loadFromStorage<User>('users', []);
    
    let combinedUsers: User[] = [...storedUsers];
    
    if (authUser) {
      const userExists = combinedUsers.some(u => u.id === authUser!.id);
      if (!userExists) {
        combinedUsers.push(authUser);
      } else {
        combinedUsers = combinedUsers.map(u => 
          u.id === authUser!.id ? authUser! : u
        );
      }
    }
    
    if (combinedUsers.length === 0) {
      combinedUsers = INITIAL_USERS;
    }
    
    setCases(storedCases);
    setMessages(storedMessages);
    setHearings(storedHearings);
    setEvidences(storedEvidences);
    setUsers(combinedUsers);
    setCaseRequests(storedCaseRequests);
    setCaseLawyers(storedCaseLawyers);
    
    if (storedCases.length === 0) localStorage.setItem('courtwise_cases', JSON.stringify([]));
    if (storedMessages.length === 0) localStorage.setItem('courtwise_messages', JSON.stringify([]));
    if (storedHearings.length === 0) localStorage.setItem('courtwise_hearings', JSON.stringify([]));
    if (storedEvidences.length === 0) localStorage.setItem('courtwise_evidences', JSON.stringify([]));
    if (storedCaseRequests.length === 0) localStorage.setItem('courtwise_caseRequests', JSON.stringify([]));
    if (storedCaseLawyers.length === 0) localStorage.setItem('courtwise_caseLawyers', JSON.stringify([]));
    
    if (storedUsers.length === 0) {
      localStorage.setItem('courtwise_users', JSON.stringify(combinedUsers));
    }
  };

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('courtwise_cases', JSON.stringify(cases));
      localStorage.setItem('courtwise_messages', JSON.stringify(messages));
      localStorage.setItem('courtwise_hearings', JSON.stringify(hearings));
      localStorage.setItem('courtwise_evidences', JSON.stringify(evidences));
      localStorage.setItem('courtwise_users', JSON.stringify(users));
      localStorage.setItem('courtwise_caseRequests', JSON.stringify(caseRequests));
      localStorage.setItem('courtwise_caseLawyers', JSON.stringify(caseLawyers));
    }
  }, [cases, messages, hearings, evidences, users, caseRequests, caseLawyers, loading]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const getCaseById = (id: string) => cases.find(c => c.id === id);
  
  const getCasesByUser = async (userId: string, role: UserRole): Promise<Case[]> => {
    if (user) {
      try {
        let casesQuery;
        
        switch (role) {
          case 'client':
            casesQuery = supabase.from('cases').select('*').eq('client_id', userId);
            break;
          case 'lawyer':
            const { data: lawyerCases } = await supabase
              .from('case_lawyers')
              .select('case_id')
              .eq('lawyer_id', userId);
              
            if (lawyerCases && lawyerCases.length > 0) {
              const caseIds = lawyerCases.map(lc => lc.case_id);
              casesQuery = supabase.from('cases').select('*').in('id', caseIds);
            } else {
              casesQuery = supabase.from('cases').select('*').eq('primary_lawyer_id', userId);
            }
            break;
          case 'judge':
            casesQuery = supabase.from('cases').select('*').eq('judge_id', userId);
            break;
          default:
            casesQuery = supabase.from('cases').select('*');
        }
        
        const { data, error } = await casesQuery;
        
        if (error) throw error;
        
        if (data) {
          return data.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            caseNumber: c.case_number,
            status: c.status,
            clientId: c.client_id,
            lawyerId: c.primary_lawyer_id,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            nextHearingDate: c.next_hearing_date,
            filedDate: c.filed_date,
            courtRoom: c.court_room,
            judgeName: undefined
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching cases by user:', error);
        switch (role) {
          case 'client':
            return cases.filter(c => c.clientId === userId);
          case 'lawyer':
            return cases.filter(c => c.lawyerId === userId);
          case 'clerk':
          case 'judge':
            return cases;
          default:
            return [];
        }
      }
    } else {
      switch (role) {
        case 'client':
          return cases.filter(c => c.clientId === userId);
        case 'lawyer':
          return cases.filter(c => c.lawyerId === userId);
        case 'clerk':
        case 'judge':
          return cases;
        default:
          return [];
      }
    }
  };

  const createCase = async (newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('cases')
          .insert({
            title: newCase.title,
            description: newCase.description,
            case_number: newCase.caseNumber,
            status: newCase.status,
            client_id: newCase.clientId,
            primary_lawyer_id: newCase.lawyerId,
            next_hearing_date: newCase.nextHearingDate,
            filed_date: newCase.filedDate,
            court_room: newCase.courtRoom,
            judge_id: null
          })
          .select()
          .single();
        
        if (error) throw error;
        
        if (data) {
          if (newCase.lawyerId) {
            const { error: caseLawyerError } = await supabase
              .from('case_lawyers')
              .insert({
                case_id: data.id,
                lawyer_id: newCase.lawyerId,
                role: 'primary'
              });
            
            if (caseLawyerError) console.error('Error creating case lawyer relationship:', caseLawyerError);
          }
          
          const caseToAdd: Case = {
            id: data.id,
            title: data.title,
            description: data.description,
            caseNumber: data.case_number,
            status: data.status,
            clientId: data.client_id,
            lawyerId: data.primary_lawyer_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            nextHearingDate: data.next_hearing_date,
            filedDate: data.filed_date,
            courtRoom: data.court_room,
            judgeName: undefined
          };
          
          setCases(prev => [...prev, caseToAdd]);
          return caseToAdd;
        }
        
        throw new Error('Failed to create case');
      } catch (error) {
        console.error('Error creating case in Supabase:', error);
        toast({
          title: 'Failed to create case',
          description: 'There was an error creating the case. Please try again.',
          variant: 'destructive',
        });
        
        const caseToAdd: Case = {
          ...newCase,
          id: `${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setCases(prev => [...prev, caseToAdd]);
        return caseToAdd;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const caseToAdd: Case = {
        ...newCase,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCases(prev => [...prev, caseToAdd]);
      return caseToAdd;
    }
  };

  const updateCase = async (caseId: string, updates: Partial<Case>) => {
    if (user) {
      try {
        const supabaseUpdates: any = {};
        
        if (updates.title) supabaseUpdates.title = updates.title;
        if (updates.description) supabaseUpdates.description = updates.description;
        if (updates.status) supabaseUpdates.status = updates.status;
        if (updates.nextHearingDate) supabaseUpdates.next_hearing_date = updates.nextHearingDate;
        if (updates.courtRoom) supabaseUpdates.court_room = updates.courtRoom;
        if (updates.filedDate) supabaseUpdates.filed_date = updates.filedDate;
        
        supabaseUpdates.updated_at = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('cases')
          .update(supabaseUpdates)
          .eq('id', caseId)
          .select()
          .single();
        
        if (error) throw error;
        
        if (data) {
          if (updates.lawyerId && updates.lawyerId !== data.primary_lawyer_id) {
            const { data: existingEntry } = await supabase
              .from('case_lawyers')
              .select('*')
              .eq('case_id', caseId)
              .eq('role', 'primary')
              .maybeSingle();
            
            if (existingEntry) {
              await supabase
                .from('case_lawyers')
                .update({ lawyer_id: updates.lawyerId })
                .eq('case_id', caseId)
                .eq('role', 'primary');
            } else {
              await supabase
                .from('case_lawyers')
                .insert({
                  case_id: caseId,
                  lawyer_id: updates.lawyerId,
                  role: 'primary'
                });
            }
            
            await supabase
              .from('cases')
              .update({ primary_lawyer_id: updates.lawyerId })
              .eq('id', caseId);
          }
          
          const updatedCase: Case = {
            id: data.id,
            title: data.title,
            description: data.description,
            caseNumber: data.case_number,
            status: data.status,
            clientId: data.client_id,
            lawyerId: data.primary_lawyer_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            nextHearingDate: data.next_hearing_date,
            filedDate: data.filed_date,
            courtRoom: data.court_room,
            judgeName: undefined
          };
          
          setCases(prev => prev.map(c => c.id === caseId ? updatedCase : c));
          return updatedCase;
        }
        
        throw new Error('Failed to update case');
      } catch (error) {
        console.error('Error updating case in Supabase:', error);
        toast({
          title: 'Failed to update case',
          description: 'There was an error updating the case. Please try again.',
          variant: 'destructive',
        });
        
        const updatedCases = cases.map(c => 
          c.id === caseId 
            ? { ...c, ...updates, updatedAt: new Date().toISOString() } 
            : c
        );
        
        setCases(updatedCases);
        return updatedCases.find(c => c.id === caseId) as Case;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedCases = cases.map(c => 
        c.id === caseId 
          ? { ...c, ...updates, updatedAt: new Date().toISOString() } 
          : c
      );
      
      setCases(updatedCases);
      return updatedCases.find(c => c.id === caseId) as Case;
    }
  };

  const getMessagesByCaseId = (caseId: string) => messages.filter(m => m.caseId === caseId);
  
  const getMessagesByUser = (userId: string) => 
    messages.filter(m => m.senderId === userId || m.recipientId === userId);
  
  const sendMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage: Message = {
      ...message,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const getHearingsByCaseId = (caseId: string) => hearings.filter(h => h.caseId === caseId);
  
  const createHearing = async (hearing: Omit<Hearing, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newHearing: Hearing = {
      ...hearing,
      id: `${Date.now()}`
    };
    
    setHearings(prev => [...prev, newHearing]);
    return newHearing;
  };
  
  const updateHearing = async (hearingId: string, updates: Partial<Hearing>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedHearings = hearings.map(h => 
      h.id === hearingId ? { ...h, ...updates } : h
    );
    
    setHearings(updatedHearings);
    return updatedHearings.find(h => h.id === hearingId) as Hearing;
  };

  const getEvidenceByCaseId = (caseId: string) => evidences.filter(e => e.caseId === caseId);
  
  const addEvidence = async (evidence: Omit<Evidence, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEvidence: Evidence = {
      ...evidence,
      id: `${Date.now()}`
    };
    
    setEvidences(prev => [...prev, newEvidence]);
    return newEvidence;
  };

  const getUsersByRole = (role: UserRole) => users.filter(u => u.role === role);
  
  const getUserById = (id: string) => users.find(u => u.id === id);

  const acceptCaseRequest = async (requestId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const request = caseRequests.find(r => r.id === requestId);
    if (!request) return;
    
    setCaseRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: "accepted" } : r)
    );
    
    if (user && user.role === 'lawyer') {
      const newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'> = {
        title: request.caseTitle,
        description: request.description,
        caseNumber: `CV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
        clientId: request.clientId,
        lawyerId: user.id,
        nextHearingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        filedDate: new Date().toISOString(),
        courtRoom: 'To be assigned',
        judgeName: 'To be assigned'
      };
      
      await createCase(newCase);
    }
  };

  const rejectCaseRequest = async (requestId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCaseRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: "rejected" } : r)
    );
  };

  const assignLawyerToCase = async (caseId: string, lawyerId: string, role: string) => {
    if (user) {
      try {
        const { data: existingRelationship, error: checkError } = await supabase
          .from('case_lawyers')
          .select('*')
          .eq('case_id', caseId)
          .eq('lawyer_id', lawyerId)
          .maybeSingle();
        
        if (checkError) throw checkError;
        
        if (existingRelationship) {
          const { error: updateError } = await supabase
            .from('case_lawyers')
            .update({ role })
            .eq('case_id', caseId)
            .eq('lawyer_id', lawyerId);
          
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('case_lawyers')
            .insert({
              case_id: caseId,
              lawyer_id: lawyerId,
              role
            });
          
          if (insertError) throw insertError;
        }
        
        if (role === 'primary') {
          const { error: caseUpdateError } = await supabase
            .from('cases')
            .update({ primary_lawyer_id: lawyerId })
            .eq('id', caseId);
          
          if (caseUpdateError) throw caseUpdateError;
          
          setCases(prev => prev.map(c => 
            c.id === caseId ? { ...c, lawyerId } : c
          ));
        }
        
        const { data: relationships } = await supabase
          .from('case_lawyers')
          .select('*')
          .eq('case_id', caseId);
        
        if (relationships) {
          setCaseLawyers(prev => {
            const filtered = prev.filter(cl => cl.case_id !== caseId);
            return [...filtered, ...relationships];
          });
        }
        
        toast({
          title: 'Lawyer assigned',
          description: 'The lawyer has been successfully assigned to the case.',
        });
      } catch (error) {
        console.error('Error assigning lawyer to case:', error);
        toast({
          title: 'Failed to assign lawyer',
          description: 'There was an error assigning the lawyer to the case. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      const newRelationship = {
        case_id: caseId,
        lawyer_id: lawyerId,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCaseLawyers(prev => [...prev, newRelationship]);
      
      if (role === 'primary') {
        setCases(prev => prev.map(c => 
          c.id === caseId ? { ...c, lawyerId } : c
        ));
      }
    }
  };

  const removeLawyerFromCase = async (caseId: string, lawyerId: string) => {
    if (user) {
      try {
        const { data: relationship, error: getError } = await supabase
          .from('case_lawyers')
          .select('role')
          .eq('case_id', caseId)
          .eq('lawyer_id', lawyerId)
          .maybeSingle();
        
        if (getError) throw getError;
        
        const { error: deleteError } = await supabase
          .from('case_lawyers')
          .delete()
          .eq('case_id', caseId)
          .eq('lawyer_id', lawyerId);
        
        if (deleteError) throw deleteError;
        
        if (relationship && relationship.role === 'primary') {
          const { error: caseUpdateError } = await supabase
            .from('cases')
            .update({ primary_lawyer_id: null })
            .eq('id', caseId);
          
          if (caseUpdateError) throw caseUpdateError;
          
          setCases(prev => prev.map(c => 
            c.id === caseId ? { ...c, lawyerId: undefined } : c
          ));
        }
        
        setCaseLawyers(prev => prev.filter(cl => 
          !(cl.case_id === caseId && cl.lawyer_id === lawyerId)
        ));
        
        toast({
          title: 'Lawyer removed',
          description: 'The lawyer has been successfully removed from the case.',
        });
      } catch (error) {
        console.error('Error removing lawyer from case:', error);
        toast({
          title: 'Failed to remove lawyer',
          description: 'There was an error removing the lawyer from the case. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      setCaseLawyers(prev => prev.filter(cl => 
        !(cl.case_id === caseId && cl.lawyer_id === lawyerId)
      ));
      
      const relationship = caseLawyers.find(cl => 
        cl.case_id === caseId && cl.lawyer_id === lawyerId
      );
      
      if (relationship && relationship.role === 'primary') {
        setCases(prev => prev.map(c => 
          c.id === caseId ? { ...c, lawyerId: undefined } : c
        ));
      }
    }
  };

  const getLawyersByCase = async (caseId: string): Promise<User[]> => {
    if (user) {
      try {
        const { data: relationships, error: relationshipsError } = await supabase
          .from('case_lawyers')
          .select('lawyer_id, role')
          .eq('case_id', caseId);
        
        if (relationshipsError) throw relationshipsError;
        
        if (relationships && relationships.length > 0) {
          const lawyerIds = relationships.map(r => r.lawyer_id);
          
          const { data: lawyerProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', lawyerIds);
          
          if (profilesError) throw profilesError;
          
          if (lawyerProfiles) {
            return lawyerProfiles.map(profile => ({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              avatarUrl: profile.avatar_url
            }));
          }
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching lawyers by case:', error);
        
        const caseLawyerRelationships = caseLawyers.filter(cl => cl.case_id === caseId);
        const lawyerIds = caseLawyerRelationships.map(cl => cl.lawyer_id);
        return users.filter(u => lawyerIds.includes(u.id) && u.role === 'lawyer');
      }
    } else {
      const caseLawyerRelationships = caseLawyers.filter(cl => cl.case_id === caseId);
      const lawyerIds = caseLawyerRelationships.map(cl => cl.lawyer_id);
      return users.filter(u => lawyerIds.includes(u.id) && u.role === 'lawyer');
    }
  };

  const clearAllData = () => {
    localStorage.removeItem('courtwise_cases');
    localStorage.removeItem('courtwise_messages');
    localStorage.removeItem('courtwise_hearings');
    localStorage.removeItem('courtwise_evidences');
    localStorage.removeItem('courtwise_users');
    localStorage.removeItem('courtwise_caseRequests');
    localStorage.removeItem('courtwise_caseLawyers');
    
    setCases([]);
    setMessages([]);
    setHearings([]);
    setEvidences([]);
    setUsers(INITIAL_USERS);
    setCaseRequests([]);
    setCaseLawyers([]);
  };

  const refetch = () => {
    loadInitialData();
  };

  return (
    <DataContext.Provider
      value={{
        cases,
        messages,
        hearings,
        evidences,
        users,
        getCaseById,
        getCasesByUser,
        createCase,
        updateCase,
        getMessagesByCaseId,
        getMessagesByUser,
        sendMessage,
        getHearingsByCaseId,
        createHearing,
        updateHearing,
        getEvidenceByCaseId,
        addEvidence,
        getUsersByRole,
        getUserById,
        acceptCaseRequest,
        rejectCaseRequest,
        assignLawyerToCase,
        removeLawyerFromCase,
        getLawyersByCase,
        clearAllData,
        loading,
        refetch
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
