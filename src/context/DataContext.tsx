import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Case, CaseStatus, Evidence, Hearing, Message, ReschedulingRecord, User } from '@/types';

// Import sample data
import casesData from '@/data/cases.json';
import clientsData from '@/data/users_clients.json';
import lawyersData from '@/data/users_lawyers.json';
import judgesData from '@/data/users_judges.json';
import clerksData from '@/data/users_clerks.json';
import clientLawyerChats from '@/data/chats_client_lawyer.json';
import lawyerClerkChats from '@/data/chats_lawyer_clerk.json';
import clerkJudgeChats from '@/data/chats_clerk_judge.json';

// Define the context type
export type DataContextType = {
  cases: Case[];
  users: User[];
  messages: Message[];
  hearings: Hearing[];
  evidence: Evidence[];
  getCaseById: (id: string) => Case | undefined;
  getUserById: (id: string) => User | undefined;
  getMessagesByCaseId: (caseId: string) => Message[];
  getHearingsByCaseId: (caseId: string) => Hearing[];
  getEvidenceByCaseId: (caseId: string) => Evidence[];
  updateCase: (id: string, updates: Partial<Case>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  addMessage: (message: Message) => void;
  addHearing: (hearing: Hearing) => void;
  addEvidence: (evidence: Evidence) => void;
  getClientsByLawyerId: (lawyerId: string) => User[];
  getLawyersByClientId: (clientId: string) => User[];
  sendCaseRequest: (clientId: string, lawyerId: string, caseTitle: string, description: string) => void;
  getLawyerCaseRequests: (lawyerId: string) => any[];
  acceptCaseRequest: (requestId: string) => void;
  rejectCaseRequest: (requestId: string) => void;
  addReschedulingHistory: (hearingId: string, record: ReschedulingRecord) => void; // Add this method
};

// Create the context
export const DataContext = createContext<DataContextType | undefined>(undefined);

// Create the provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize state with sample data
  const [cases, setCases] = useState<Case[]>(casesData as Case[]);
  const [users, setUsers] = useState<User[]>([
    ...clientsData as User[],
    ...lawyersData as User[],
    ...judgesData as User[],
    ...clerksData as User[]
  ]);
  const [messages, setMessages] = useState<Message[]>([
    ...clientLawyerChats as Message[],
    ...lawyerClerkChats as Message[],
    ...clerkJudgeChats as Message[]
  ]);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [caseRequests, setCaseRequests] = useState<any[]>([]);

  // Filter cases based on user role
  useEffect(() => {
    if (user) {
      // No filtering needed for now, but could be added later
    }
  }, [user]);

  // Helper functions
  const getCaseById = (id: string) => cases.find(c => c.id === id);
  
  const getUserById = (id: string) => users.find(u => u.id === id);
  
  const getMessagesByCaseId = (caseId: string) => 
    messages.filter(m => m.caseId === caseId);
  
  const getHearingsByCaseId = (caseId: string) => 
    hearings.filter(h => h.caseId === caseId);
  
  const getEvidenceByCaseId = (caseId: string) => 
    evidence.filter(e => e.caseId === caseId);
  
  const updateCase = (id: string, updates: Partial<Case>) => {
    setCases(prevCases => 
      prevCases.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    );
  };
  
  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === id ? { ...u, ...updates } : u
      )
    );
  };
  
  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };
  
  const addHearing = (hearing: Hearing) => {
    setHearings(prevHearings => [...prevHearings, hearing]);
  };
  
  const addEvidence = (evidence: Evidence) => {
    setEvidence(prevEvidence => [...prevEvidence, evidence]);
  };
  
  const getClientsByLawyerId = (lawyerId: string) => {
    // Get all cases where this lawyer is assigned
    const lawyerCases = cases.filter(c => c.lawyerId === lawyerId);
    
    // Get unique client IDs from these cases
    const clientIds = [...new Set(lawyerCases.map(c => c.clientId))];
    
    // Return client users
    return users.filter(u => clientIds.includes(u.id) && u.role === 'client');
  };
  
  const getLawyersByClientId = (clientId: string) => {
    // Get all cases for this client
    const clientCases = cases.filter(c => c.clientId === clientId);
    
    // Get unique lawyer IDs from these cases
    const lawyerIds = [...new Set(clientCases.map(c => c.lawyerId).filter(Boolean) as string[])];
    
    // Return lawyer users
    return users.filter(u => lawyerIds.includes(u.id) && u.role === 'lawyer');
  };
  
  // Case request system
  const sendCaseRequest = (clientId: string, lawyerId: string, caseTitle: string, description: string) => {
    const newRequest = {
      id: `req-${Date.now()}`,
      clientId,
      lawyerId,
      caseTitle,
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setCaseRequests(prev => [...prev, newRequest]);
  };
  
  const getLawyerCaseRequests = (lawyerId: string) => {
    return caseRequests.filter(req => req.lawyerId === lawyerId);
  };
  
  const acceptCaseRequest = (requestId: string) => {
    // Find the request
    const request = caseRequests.find(req => req.id === requestId);
    if (!request) return;
    
    // Update request status
    setCaseRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' } : req
      )
    );
    
    // Create a new case
    const newCase: Case = {
      id: `case-${Date.now()}`,
      title: request.caseTitle,
      description: request.description,
      caseNumber: `C-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'active',
      clientId: request.clientId,
      lawyerId: request.lawyerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      filedDate: new Date().toISOString()
    };
    
    setCases(prev => [...prev, newCase]);
  };
  
  const rejectCaseRequest = (requestId: string) => {
    setCaseRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    );
  };

  // Add the addReschedulingHistory method
  const addReschedulingHistory = (hearingId: string, record: ReschedulingRecord) => {
    setHearings(prevHearings => 
      prevHearings.map(hearing => {
        if (hearing.id === hearingId) {
          const updatedHearing = { 
            ...hearing, 
            rescheduled: true,
            reschedulingHistory: [...(hearing.reschedulingHistory || []), record]
          };
          return updatedHearing;
        }
        return hearing;
      })
    );
  };
  
  return (
    <DataContext.Provider
      value={{
        cases,
        users,
        messages,
        hearings,
        evidence,
        getCaseById,
        getUserById,
        getMessagesByCaseId,
        getHearingsByCaseId,
        getEvidenceByCaseId,
        updateCase,
        updateUser,
        addMessage,
        addHearing,
        addEvidence,
        getClientsByLawyerId,
        getLawyersByClientId,
        sendCaseRequest,
        getLawyerCaseRequests,
        acceptCaseRequest,
        rejectCaseRequest,
        addReschedulingHistory, // Add this method to the context value
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Create a hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
