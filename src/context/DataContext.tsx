
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Case, Message, Hearing, Evidence, User, UserRole } from '@/types';
import { useAuth } from './AuthContext';

interface DataContextType {
  cases: Case[];
  messages: Message[];
  hearings: Hearing[];
  evidences: Evidence[];
  users: User[];
  
  // Case operations
  getCaseById: (id: string) => Case | undefined;
  getCasesByUser: (userId: string, role: UserRole) => Case[];
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
  
  // Data operations
  clearAllData: () => void;

  loading: boolean;
  refetch: () => void;
}

// Initial data
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
  const [cases, setCases] = useState<Case[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [caseRequests, setCaseRequests] = useState<any[]>([]);

  const loadInitialData = () => {
    setLoading(true);
    
    // Load data from localStorage or use initial values
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
    
    // Load all data
    const storedCases = loadFromStorage<Case>('cases', []);
    const storedMessages = loadFromStorage<Message>('messages', []);
    const storedHearings = loadFromStorage<Hearing>('hearings', []);
    const storedEvidences = loadFromStorage<Evidence>('evidences', []);
    const storedCaseRequests = loadFromStorage('caseRequests', []);
    
    // Fix the type error by properly handling the localStorage data
    const storedUserData = localStorage.getItem('courtwise_user');
    let authUser: User | null = null;
    
    if (storedUserData) {
      try {
        // Parse the data and ensure it has the required User properties
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
    
    // Get stored users
    const storedUsers = loadFromStorage<User>('users', INITIAL_USERS);
    
    // Combine auth user (if valid) with stored users, ensuring no duplicates
    let combinedUsers: User[] = [...storedUsers];
    
    if (authUser) {
      const userExists = combinedUsers.some(u => u.id === authUser!.id);
      if (!userExists) {
        combinedUsers.push(authUser);
      } else {
        // Update existing user with latest data
        combinedUsers = combinedUsers.map(u => 
          u.id === authUser!.id ? authUser! : u
        );
      }
    }
    
    setCases(storedCases);
    setMessages(storedMessages);
    setHearings(storedHearings);
    setEvidences(storedEvidences);
    setUsers(combinedUsers);
    setCaseRequests(storedCaseRequests);
    
    // Save initial data if not exists
    if (storedCases.length === 0) localStorage.setItem('courtwise_cases', JSON.stringify([]));
    if (storedMessages.length === 0) localStorage.setItem('courtwise_messages', JSON.stringify([]));
    if (storedHearings.length === 0) localStorage.setItem('courtwise_hearings', JSON.stringify([]));
    if (storedEvidences.length === 0) localStorage.setItem('courtwise_evidences', JSON.stringify([]));
    if (storedCaseRequests.length === 0) localStorage.setItem('courtwise_caseRequests', JSON.stringify([]));
    
    if (storedUsers.length === 0) {
      localStorage.setItem('courtwise_users', JSON.stringify(INITIAL_USERS));
      setUsers(INITIAL_USERS);
    }
    
    setLoading(false);
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('courtwise_cases', JSON.stringify(cases));
      localStorage.setItem('courtwise_messages', JSON.stringify(messages));
      localStorage.setItem('courtwise_hearings', JSON.stringify(hearings));
      localStorage.setItem('courtwise_evidences', JSON.stringify(evidences));
      localStorage.setItem('courtwise_users', JSON.stringify(users));
      localStorage.setItem('courtwise_caseRequests', JSON.stringify(caseRequests));
    }
  }, [cases, messages, hearings, evidences, users, caseRequests, loading]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Case operations
  const getCaseById = (id: string) => cases.find(c => c.id === id);
  
  const getCasesByUser = (userId: string, role: UserRole) => {
    switch (role) {
      case 'client':
        return cases.filter(c => c.clientId === userId);
      case 'lawyer':
        return cases.filter(c => c.lawyerId === userId);
      case 'clerk':
      case 'judge':
        return cases; // Clerks and judges can see all cases
      default:
        return [];
    }
  };
  
  const createCase = async (newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const caseToAdd: Case = {
      ...newCase,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCases(prev => [...prev, caseToAdd]);
    return caseToAdd;
  };
  
  const updateCase = async (caseId: string, updates: Partial<Case>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedCases = cases.map(c => 
      c.id === caseId 
        ? { ...c, ...updates, updatedAt: new Date().toISOString() } 
        : c
    );
    
    setCases(updatedCases);
    return updatedCases.find(c => c.id === caseId) as Case;
  };
  
  // Message operations
  const getMessagesByCaseId = (caseId: string) => messages.filter(m => m.caseId === caseId);
  
  const getMessagesByUser = (userId: string) => 
    messages.filter(m => m.senderId === userId || m.recipientId === userId);
  
  const sendMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    // Simulate API call
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
  
  // Hearing operations
  const getHearingsByCaseId = (caseId: string) => hearings.filter(h => h.caseId === caseId);
  
  const createHearing = async (hearing: Omit<Hearing, 'id'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newHearing: Hearing = {
      ...hearing,
      id: `${Date.now()}`
    };
    
    setHearings(prev => [...prev, newHearing]);
    return newHearing;
  };
  
  const updateHearing = async (hearingId: string, updates: Partial<Hearing>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedHearings = hearings.map(h => 
      h.id === hearingId ? { ...h, ...updates } : h
    );
    
    setHearings(updatedHearings);
    return updatedHearings.find(h => h.id === hearingId) as Hearing;
  };
  
  // Evidence operations
  const getEvidenceByCaseId = (caseId: string) => evidences.filter(e => e.caseId === caseId);
  
  const addEvidence = async (evidence: Omit<Evidence, 'id'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEvidence: Evidence = {
      ...evidence,
      id: `${Date.now()}`
    };
    
    setEvidences(prev => [...prev, newEvidence]);
    return newEvidence;
  };
  
  // User operations
  const getUsersByRole = (role: UserRole) => users.filter(u => u.role === role);
  
  const getUserById = (id: string) => users.find(u => u.id === id);

  // Case request operations
  const acceptCaseRequest = async (requestId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const request = caseRequests.find(r => r.id === requestId);
    if (!request) return;
    
    // Update request status
    setCaseRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: "accepted" } : r)
    );
    
    // Create a new case from the request
    if (user && user.role === 'lawyer') {
      const newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'> = {
        title: request.caseTitle,
        description: request.description,
        caseNumber: `CV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
        clientId: request.clientId || '5', // Default if not specified
        lawyerId: user.id,
        nextHearingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
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
  
  // Utility to clear all data (for testing)
  const clearAllData = () => {
    localStorage.removeItem('courtwise_cases');
    localStorage.removeItem('courtwise_messages');
    localStorage.removeItem('courtwise_hearings');
    localStorage.removeItem('courtwise_evidences');
    localStorage.removeItem('courtwise_users');
    localStorage.removeItem('courtwise_caseRequests');
    
    setCases([]);
    setMessages([]);
    setHearings([]);
    setEvidences([]);
    setUsers(INITIAL_USERS);
    setCaseRequests([]);
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
