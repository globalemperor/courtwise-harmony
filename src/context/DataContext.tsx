
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

  loading: boolean;
  refetch: () => void;
}

// Sample data
const MOCK_CASES: Case[] = [
  {
    id: '1',
    title: 'Smith vs. Johnson',
    description: 'Property dispute over boundary lines',
    caseNumber: 'CV-2023-1001',
    status: 'active',
    clientId: '1',
    lawyerId: '2',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z',
    nextHearingDate: '2023-07-15T09:00:00Z',
    filedDate: '2023-01-10T10:15:00Z',
    courtRoom: 'Room 302',
    judgeName: 'Judge Honor'
  },
  {
    id: '2',
    title: 'State vs. Williams',
    description: 'Criminal case for theft',
    caseNumber: 'CR-2023-0568',
    status: 'scheduled',
    clientId: '5',
    lawyerId: '2',
    createdAt: '2023-03-05T10:30:00Z',
    updatedAt: '2023-06-18T11:45:00Z',
    nextHearingDate: '2023-07-20T10:30:00Z',
    filedDate: '2023-03-01T09:00:00Z',
    courtRoom: 'Room 201',
    judgeName: 'Judge Honor'
  },
  {
    id: '3',
    title: 'Davis Divorce',
    description: 'Divorce settlement and custody',
    caseNumber: 'FM-2023-0442',
    status: 'in_progress',
    clientId: '6',
    lawyerId: '7',
    createdAt: '2023-02-20T14:15:00Z',
    updatedAt: '2023-06-25T16:00:00Z',
    nextHearingDate: '2023-07-10T13:00:00Z',
    filedDate: '2023-02-18T11:30:00Z',
    courtRoom: 'Room 405',
    judgeName: 'Judge Walker'
  }
];

// Mock users beyond our auth users
const MOCK_ADDITIONAL_USERS: User[] = [
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

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderRole: 'client',
    recipientId: '2',
    recipientRole: 'lawyer',
    caseId: '1',
    content: 'When is our next court date?',
    read: true,
    createdAt: '2023-06-15T09:30:00Z'
  },
  {
    id: '2',
    senderId: '2',
    senderRole: 'lawyer',
    recipientId: '1',
    recipientRole: 'client',
    caseId: '1',
    content: 'Our next court date is scheduled for July 15th at 9:00 AM in Room 302.',
    read: true,
    createdAt: '2023-06-15T10:15:00Z'
  },
  {
    id: '3',
    senderId: '2',
    senderRole: 'lawyer',
    recipientId: '3',
    recipientRole: 'clerk',
    caseId: '1',
    content: 'Could we get a copy of the latest filing for the Smith case?',
    read: false,
    createdAt: '2023-06-18T14:20:00Z'
  }
];

const MOCK_HEARINGS: Hearing[] = [
  {
    id: '1',
    caseId: '1',
    date: '2023-07-15',
    time: '09:00',
    location: 'Room 302',
    description: 'Initial hearing for property dispute',
    status: 'scheduled'
  },
  {
    id: '2',
    caseId: '2',
    date: '2023-07-20',
    time: '10:30',
    location: 'Room 201',
    description: 'First hearing for criminal theft case',
    status: 'scheduled'
  },
  {
    id: '3',
    caseId: '3',
    date: '2023-07-10',
    time: '13:00',
    location: 'Room 405',
    description: 'Divorce settlement negotiation',
    status: 'scheduled'
  }
];

const MOCK_EVIDENCES: Evidence[] = [
  {
    id: '1',
    caseId: '1',
    title: 'Property Deed',
    description: 'Official property deed showing boundary lines',
    fileUrl: '/documents/property-deed.pdf',
    uploadedBy: '2',
    uploadedAt: '2023-05-20T11:30:00Z',
    fileType: 'application/pdf'
  },
  {
    id: '2',
    caseId: '1',
    title: 'Survey Map',
    description: 'Professional survey of the property boundaries',
    fileUrl: '/documents/survey-map.jpg',
    uploadedBy: '1',
    uploadedAt: '2023-05-22T14:45:00Z',
    fileType: 'image/jpeg'
  },
  {
    id: '3',
    caseId: '2',
    title: 'Security Camera Footage',
    description: 'Video evidence from store security camera',
    fileUrl: '/documents/security-footage.mp4',
    uploadedBy: '2',
    uploadedAt: '2023-04-15T09:20:00Z',
    fileType: 'video/mp4'
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

  const loadInitialData = () => {
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setCases(MOCK_CASES);
      setMessages(MOCK_MESSAGES);
      setHearings(MOCK_HEARINGS);
      setEvidences(MOCK_EVIDENCES);
      
      // Combine auth users and additional mock users
      const authUsers = Object.values(JSON.parse(localStorage.getItem('courtwise_user') || '{}')).filter(Boolean);
      setUsers([...(Array.isArray(authUsers) ? authUsers : [authUsers]), ...MOCK_ADDITIONAL_USERS]);
      
      setLoading(false);
    }, 1000);
  };

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
      id: `${cases.length + 1}`,
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
      id: `${messages.length + 1}`,
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
      id: `${hearings.length + 1}`
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
      id: `${evidences.length + 1}`
    };
    
    setEvidences(prev => [...prev, newEvidence]);
    return newEvidence;
  };
  
  // User operations
  const getUsersByRole = (role: UserRole) => users.filter(u => u.role === role);
  
  const getUserById = (id: string) => users.find(u => u.id === id);

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
