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

// Import empty data for clean start
import emptyUsers from '@/data/empty_users.json';
import emptyCases from '@/data/empty_cases.json';

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
  addReschedulingHistory: (hearingId: string, record: ReschedulingRecord) => void;
  getUsersByRole: (role: string) => User[];
  sendMessage: (message: Partial<Message>) => void;
  getCasesByUser: (userId: string, role: string) => Case[];
  updateHearing: (hearingId: string, updates: Partial<Hearing>) => void;
  createCase: (caseData: Partial<Case>) => Case;
  createCaseRequest: (requestData: any) => void;
  getCasesByUserId: (userId: string) => Case[];
  getAcceptedLawyers: (clientId: string) => User[];
  getAllLawyers: () => User[];
  resetData: () => void;
  useEmptyData: boolean;
  setUseEmptyData: (value: boolean) => void;
};

// Create the context
export const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to flatten chat data to Message array
const flattenChatData = (chatData: any[]): Message[] => {
  const messages: Message[] = [];
  
  chatData.forEach(chat => {
    chat.messages.forEach((msg: any) => {
      // Extract user roles based on the chat type
      let senderRole: 'client' | 'lawyer' | 'clerk' | 'judge' = 'client';
      let recipientRole: 'client' | 'lawyer' | 'clerk' | 'judge' = 'lawyer';
      
      // Determine sender and recipient roles based on IDs
      if (msg.senderId.startsWith('lawyer')) {
        senderRole = 'lawyer';
        recipientRole = chat.user1 === msg.senderId ? 'client' : 'clerk';
      } else if (msg.senderId.startsWith('clerk')) {
        senderRole = 'clerk';
        recipientRole = chat.user1 === msg.senderId ? 'lawyer' : 'judge';
      } else if (msg.senderId.startsWith('judge')) {
        senderRole = 'judge';
        recipientRole = 'clerk';
      } else if (msg.senderId.startsWith('client')) {
        senderRole = 'client';
        recipientRole = 'lawyer';
      }
      
      // Find the recipientId
      const recipientId = msg.senderId === chat.user1 ? chat.user2 : chat.user1;
      
      messages.push({
        id: msg.id,
        senderId: msg.senderId,
        senderRole,
        recipientId,
        recipientRole,
        caseId: msg.caseId || undefined,
        content: msg.content,
        read: msg.read,
        createdAt: msg.timestamp
      });
    });
  });
  
  return messages;
};

// Create the provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [useEmptyData, setUseEmptyData] = useState(() => {
    // Check localStorage for preference
    const storedPreference = localStorage.getItem('courtwise_use_empty_data');
    return storedPreference === 'true';
  });
  
  // Initialize sample test users if using empty data
  const testUsers: User[] = [
    {
      id: "test-client",
      name: "Test Client",
      email: "testclient@example.com",
      password: "password",
      role: "client",
      avatarUrl: "https://ui-avatars.com/api/?name=Test+Client&background=blue"
    },
    {
      id: "test-lawyer1",
      name: "Test Lawyer 1",
      email: "testlawyer1@example.com",
      password: "password",
      role: "lawyer",
      avatarUrl: "https://ui-avatars.com/api/?name=Test+Lawyer&background=green",
      barId: "TEST-BAR-1",
      yearsOfExperience: "5",
      specialization: "corporate"
    },
    {
      id: "test-lawyer2",
      name: "Test Lawyer 2",
      email: "testlawyer2@example.com",
      password: "password",
      role: "lawyer",
      avatarUrl: "https://ui-avatars.com/api/?name=Test+Lawyer+2&background=orange",
      barId: "TEST-BAR-2",
      yearsOfExperience: "8",
      specialization: "criminal"
    },
    {
      id: "test-judge",
      name: "Test Judge",
      email: "testjudge@example.com",
      password: "password",
      role: "judge",
      avatarUrl: "https://ui-avatars.com/api/?name=Test+Judge&background=red",
      chamberNumber: "TEST-101",
      courtDistrict: "Test District",
      yearsOnBench: "10"
    },
    {
      id: "test-clerk",
      name: "Test Clerk",
      email: "testclerk@example.com",
      password: "password",
      role: "clerk",
      avatarUrl: "https://ui-avatars.com/api/?name=Test+Clerk&background=purple",
      courtId: "TEST-COURT-1",
      department: "Test Department"
    }
  ];
  
  // Initialize state with sample data or empty data based on preference
  const [cases, setCases] = useState<Case[]>(useEmptyData ? emptyCases as Case[] : casesData as Case[]);
  const [users, setUsers] = useState<User[]>(() => {
    if (useEmptyData) {
      return testUsers;
    } else {
      return [
        ...clientsData as User[],
        ...lawyersData as User[],
        ...judgesData as User[],
        ...clerksData as User[]
      ];
    }
  });
  
  // Convert chat data to messages array
  const [messages, setMessages] = useState<Message[]>(() => {
    if (useEmptyData) {
      return [];
    } else {
      return [
        ...flattenChatData(clientLawyerChats),
        ...flattenChatData(lawyerClerkChats),
        ...flattenChatData(clerkJudgeChats)
      ];
    }
  });
  
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [caseRequests, setCaseRequests] = useState<any[]>([]);

  // Reset data function
  const resetData = () => {
    const newUseEmptyData = !useEmptyData;
    setUseEmptyData(newUseEmptyData);
    localStorage.setItem('courtwise_use_empty_data', String(newUseEmptyData));
    
    if (newUseEmptyData) {
      setCases(emptyCases as Case[]);
      setUsers(testUsers);
      setMessages([]);
      setHearings([]);
      setEvidence([]);
      setCaseRequests([]);
    } else {
      setCases(casesData as Case[]);
      setUsers([
        ...clientsData as User[],
        ...lawyersData as User[],
        ...judgesData as User[],
        ...clerksData as User[]
      ]);
      setMessages([
        ...flattenChatData(clientLawyerChats),
        ...flattenChatData(lawyerClerkChats),
        ...flattenChatData(clerkJudgeChats)
      ]);
      setHearings([]);
      setEvidence([]);
      setCaseRequests([]);
    }
  };

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
  
  // Add missing functions implementation
  const getUsersByRole = (role: string) => {
    return users.filter(u => u.role === role);
  };
  
  const sendMessage = (messageData: Partial<Message>) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: messageData.senderId || '',
      senderRole: messageData.senderRole || 'client',
      recipientId: messageData.recipientId || '',
      recipientRole: messageData.recipientRole || 'lawyer',
      caseId: messageData.caseId,
      content: messageData.content || '',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  const getCasesByUser = (userId: string, role: string) => {
    if (role === 'lawyer') {
      return cases.filter(c => c.lawyerId === userId);
    } else if (role === 'client') {
      return cases.filter(c => c.clientId === userId);
    } else if (role === 'judge') {
      // Assume judgeName field contains judge ID
      return cases.filter(c => c.judgeName === userId);
    }
    return [];
  };
  
  const updateHearing = (hearingId: string, updates: Partial<Hearing>) => {
    setHearings(prevHearings =>
      prevHearings.map(h =>
        h.id === hearingId ? { ...h, ...updates } : h
      )
    );
  };
  
  const createCase = (caseData: Partial<Case>) => {
    const newCase: Case = {
      id: `case-${Date.now()}`,
      title: caseData.title || '',
      description: caseData.description || '',
      caseNumber: caseData.caseNumber || `C-${Math.floor(10000 + Math.random() * 90000)}`,
      status: caseData.status || 'pending',
      clientId: caseData.clientId || '',
      lawyerId: caseData.lawyerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      filedDate: caseData.filedDate || new Date().toISOString(),
      nextHearingDate: caseData.nextHearingDate,
      courtRoom: caseData.courtRoom,
      judgeName: caseData.judgeName,
      defendantInfo: caseData.defendantInfo
    };
    
    setCases(prev => [...prev, newCase]);
    return newCase;
  };
  
  const createCaseRequest = (requestData: any) => {
    const newRequest = {
      id: `req-${Date.now()}`,
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setCaseRequests(prev => [...prev, newRequest]);
    return newRequest;
  };
  
  // Add new functions needed based on errors
  const getCasesByUserId = (userId: string) => {
    return cases.filter(c => 
      c.clientId === userId || 
      c.lawyerId === userId || 
      c.judgeName === userId || 
      (c.defendantInfo && c.defendantInfo.name === userId)
    );
  };
  
  const getAcceptedLawyers = (clientId: string) => {
    // Get all cases for this client
    const clientCases = cases.filter(c => c.clientId === clientId);
    
    // Get unique lawyer IDs from these cases
    const lawyerIds = [...new Set(clientCases
      .map(c => c.lawyerId)
      .filter(Boolean) as string[])];
    
    // Return lawyer users
    return users.filter(u => lawyerIds.includes(u.id) && u.role === 'lawyer');
  };
  
  const getAllLawyers = () => {
    return users.filter(u => u.role === 'lawyer');
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
        addReschedulingHistory,
        getUsersByRole,
        sendMessage,
        getCasesByUser,
        updateHearing,
        createCase,
        createCaseRequest,
        getCasesByUserId,
        getAcceptedLawyers,
        getAllLawyers,
        resetData,
        useEmptyData,
        setUseEmptyData
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
