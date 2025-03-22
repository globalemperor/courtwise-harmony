
// Local storage implementation using JSON files

import clerksData from '../../data/users_clerks.json';
import clientsData from '../../data/users_clients.json';
import lawyersData from '../../data/users_lawyers.json';
import judgesData from '../../data/users_judges.json';
import casesData from '../../data/cases.json';
import lawyerClerkChats from '../../data/chats_lawyer_clerk.json';
import clientLawyerChats from '../../data/chats_client_lawyer.json';
import clerkJudgeChats from '../../data/chats_clerk_judge.json';
import { UserRole, CaseStatus } from '@/types';

// Helper to save data to localStorage with JSON files backup
const saveData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  // In a real implementation, we would save to the JSON files here
  // But for client-side only, we'll rely on localStorage
};

// Helper to get data from localStorage with JSON files as fallback
const getData = (key: string, defaultData: any = []) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
    }
  }

  // Use default data from JSON files as fallback
  switch (key) {
    case 'courtwise_users_clerks':
      return clerksData.map(clerk => ({
        ...clerk,
        role: clerk.role as UserRole
      }));
    case 'courtwise_users_clients':
      return clientsData.map(client => ({
        ...client,
        role: client.role as UserRole
      }));
    case 'courtwise_users_lawyers':
      return lawyersData.map(lawyer => ({
        ...lawyer,
        role: lawyer.role as UserRole
      }));
    case 'courtwise_users_judges':
      return judgesData.map(judge => ({
        ...judge,
        role: judge.role as UserRole
      }));
    case 'courtwise_cases':
      return casesData.map(caseItem => ({
        ...caseItem,
        status: caseItem.status as CaseStatus
      }));
    case 'courtwise_chats_lawyer_clerk':
      return lawyerClerkChats;
    case 'courtwise_chats_client_lawyer':
      return clientLawyerChats;
    case 'courtwise_chats_clerk_judge':
      return clerkJudgeChats;
    default:
      return defaultData;
  }
};

// Helper to merge users from all types
const getAllUsers = () => {
  const clerks = getData('courtwise_users_clerks', clerksData);
  const clients = getData('courtwise_users_clients', clientsData);
  const lawyers = getData('courtwise_users_lawyers', lawyersData);
  const judges = getData('courtwise_users_judges', judgesData);
  
  return [...clerks, ...clients, ...lawyers, ...judges];
};

// Helper to get chats for specific roles
const getChats = (role1: string, role2: string) => {
  if ((role1 === 'lawyer' && role2 === 'clerk') || (role1 === 'clerk' && role2 === 'lawyer')) {
    return getData('courtwise_chats_lawyer_clerk', lawyerClerkChats);
  }
  if ((role1 === 'client' && role2 === 'lawyer') || (role1 === 'lawyer' && role2 === 'client')) {
    return getData('courtwise_chats_client_lawyer', clientLawyerChats);
  }
  if ((role1 === 'clerk' && role2 === 'judge') || (role1 === 'judge' && role2 === 'clerk')) {
    return getData('courtwise_chats_clerk_judge', clerkJudgeChats);
  }
  return [];
};

// Helper to save a chat
const saveChat = (role1: string, role2: string, chat: any) => {
  let key = '';
  
  if ((role1 === 'lawyer' && role2 === 'clerk') || (role1 === 'clerk' && role2 === 'lawyer')) {
    key = 'courtwise_chats_lawyer_clerk';
  }
  if ((role1 === 'client' && role2 === 'lawyer') || (role1 === 'lawyer' && role2 === 'client')) {
    key = 'courtwise_chats_client_lawyer';
  }
  if ((role1 === 'clerk' && role2 === 'judge') || (role1 === 'judge' && role2 === 'clerk')) {
    key = 'courtwise_chats_clerk_judge';
  }
  
  if (key) {
    const chats = getData(key, []);
    // Check if this chat already exists
    const existingIndex = chats.findIndex((c: any) => 
      (c.user1 === chat.user1 && c.user2 === chat.user2) || 
      (c.user1 === chat.user2 && c.user2 === chat.user1)
    );
    
    if (existingIndex >= 0) {
      // Update existing chat
      chats[existingIndex] = chat;
    } else {
      // Add new chat
      chats.push(chat);
    }
    
    saveData(key, chats);
  }
};

// Create a mock client that uses our JSON files
export const supabase = {
  auth: {
    getSession: () => {
      const sessionStr = localStorage.getItem('courtwise_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      return Promise.resolve({ data: { session } });
    },
    signUp: ({ email, password }: { email: string; password: string }) => {
      // Get all users to check if email exists
      const allUsers = getAllUsers();
      const existingUser = allUsers.find((u: any) => u.email === email);
      
      if (existingUser) {
        return Promise.resolve({ 
          data: {}, 
          error: { message: "Email already in use" } 
        });
      }
      
      const roleFromEmail = email.split('@')[0];
      const role = ['client', 'lawyer', 'clerk', 'judge'].includes(roleFromEmail) 
        ? roleFromEmail 
        : 'client';
      
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In a real app, this would be hashed
        name: email.split('@')[0],
        role,
        createdAt: new Date().toISOString(),
        avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
      };
      
      // Save to appropriate role-based JSON
      const roleKey = `courtwise_users_${role}s`;
      const usersForRole = getData(roleKey, []);
      usersForRole.push(newUser);
      saveData(roleKey, usersForRole);
      
      // Create a session
      const session = {
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name
        },
        access_token: `mock_token_${Date.now()}`
      };
      
      localStorage.setItem('courtwise_session', JSON.stringify(session));
      localStorage.setItem('courtwise_user', JSON.stringify(newUser));
      
      return Promise.resolve({ data: { user: newUser, session }, error: null });
    },
    signIn: ({ email, password }: { email: string; password: string }) => {
      // Get all users
      const allUsers = getAllUsers();
      const user = allUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        return Promise.resolve({ 
          data: {}, 
          error: { message: "Invalid login credentials" } 
        });
      }
      
      // Create a session
      const session = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        access_token: `mock_token_${Date.now()}`
      };
      
      localStorage.setItem('courtwise_session', JSON.stringify(session));
      localStorage.setItem('courtwise_user', JSON.stringify(user));
      
      return Promise.resolve({ data: { user, session }, error: null });
    },
    signOut: () => {
      localStorage.removeItem('courtwise_session');
      localStorage.removeItem('courtwise_user');
      return Promise.resolve({ error: null });
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // This is a simplified version that doesn't actually listen for changes
      // In a real app, we would set up event listeners
      const session = localStorage.getItem('courtwise_session');
      if (session) {
        callback('SIGNED_IN', JSON.parse(session));
      } else {
        callback('SIGNED_OUT', null);
      }
      
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: (table: string) => {
    return {
      select: (columns?: string) => ({ 
        eq: (column: string, value: any) => {
          let data = null;
          
          // Determine which JSON file to use based on the table
          switch (table) {
            case 'cases':
              data = getData('courtwise_cases', casesData).filter((item: any) => item[column] === value);
              break;
            case 'profiles':
            case 'users':
              data = getAllUsers().filter((item: any) => item[column] === value);
              break;
            case 'messages':
              // Get messages from appropriate chat based on participants
              const chats = getChats(value.role1, value.role2);
              const chat = chats.find((c: any) => 
                (c.user1 === value.user1 && c.user2 === value.user2) || 
                (c.user1 === value.user2 && c.user2 === value.user1)
              );
              data = chat ? chat.messages : [];
              break;
          }
          
          return {
            data,
            error: null,
            single: () => Promise.resolve({ data: data ? data[0] : null, error: null })
          };
        },
        data: null, 
        error: null 
      }),
      insert: (data: any) => {
        let result = null;
        
        // Determine which JSON file to use based on the table
        switch (table) {
          case 'cases':
            const cases = getData('courtwise_cases', casesData);
            data.id = data.id || `case_${Date.now()}`;
            data.createdAt = data.createdAt || new Date().toISOString();
            data.updatedAt = data.updatedAt || new Date().toISOString();
            cases.push(data);
            saveData('courtwise_cases', cases);
            result = data;
            break;
          case 'messages':
            // Add message to appropriate chat
            const { senderId, senderRole, recipientId, recipientRole, content, caseId } = data;
            
            // Find or create chat
            const chats = getChats(senderRole, recipientRole);
            const chat = chats.find((c: any) => 
              (c.user1 === senderId && c.user2 === recipientId) || 
              (c.user1 === recipientId && c.user2 === senderId)
            ) || { user1: senderId, user2: recipientId, messages: [] };
            
            // Add message to chat
            const message = {
              id: `msg_${Date.now()}`,
              senderId,
              content,
              caseId,
              timestamp: new Date().toISOString(),
              read: false
            };
            
            chat.messages.unshift(message); // Add to beginning (latest first)
            saveChat(senderRole, recipientRole, chat);
            result = message;
            break;
        }
        
        return { 
          select: () => Promise.resolve({ data: result, error: null }),
          data: result, 
          error: null 
        };
      },
      update: (data: any) => { 
        return { 
          eq: (column: string, value: any) => {
            let result = null;
            
            // Determine which JSON file to use based on the table
            switch (table) {
              case 'cases':
                const cases = getData('courtwise_cases', casesData);
                const caseIndex = cases.findIndex((c: any) => c[column] === value);
                if (caseIndex >= 0) {
                  cases[caseIndex] = { ...cases[caseIndex], ...data, updatedAt: new Date().toISOString() };
                  saveData('courtwise_cases', cases);
                  result = cases[caseIndex];
                }
                break;
              // Add other tables as needed
            }
            
            return Promise.resolve({ data: result, error: null });
          },
          match: (criteria: any) => {
            // Similar to eq but with multiple criteria
            return Promise.resolve({ data: null, error: null });
          },
          data: null, 
          error: null 
        };
      },
      delete: () => { 
        return { 
          eq: (column: string, value: any) => {
            let result = null;
            
            // Determine which JSON file to use based on the table
            switch (table) {
              case 'cases':
                const cases = getData('courtwise_cases', casesData);
                const filteredCases = cases.filter((c: any) => c[column] !== value);
                saveData('courtwise_cases', filteredCases);
                result = { success: true };
                break;
              // Add other tables as needed
            }
            
            return Promise.resolve({ data: result, error: null });
          },
          match: (criteria: any) => {
            // Similar to eq but with multiple criteria
            return Promise.resolve({ data: null, error: null });
          },
          data: null, 
          error: null 
        };
      },
      // Enhanced mocks for case filing
      upsert: (data: any) => {
        let result = null;
        
        // Determine which JSON file to use based on the table
        switch (table) {
          case 'cases':
            const cases = getData('courtwise_cases', casesData);
            if (data.id) {
              // Update existing case
              const caseIndex = cases.findIndex((c: any) => c.id === data.id);
              if (caseIndex >= 0) {
                cases[caseIndex] = { ...cases[caseIndex], ...data, updatedAt: new Date().toISOString() };
                result = cases[caseIndex];
              } else {
                // Add new case with provided ID
                data.createdAt = data.createdAt || new Date().toISOString();
                data.updatedAt = data.updatedAt || new Date().toISOString();
                cases.push(data);
                result = data;
              }
            } else {
              // Add new case with generated ID
              data.id = `case_${Date.now()}`;
              data.createdAt = data.createdAt || new Date().toISOString();
              data.updatedAt = data.updatedAt || new Date().toISOString();
              cases.push(data);
              result = data;
            }
            saveData('courtwise_cases', cases);
            break;
          // Add other tables as needed
        }
        
        return Promise.resolve({ data: result, error: null });
      },
      match: (criteria: any) => {
        // Filter data based on criteria
        return {
          data: null,
          error: null
        };
      }
    };
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => {
        // In a real app, we would actually store the file
        // For now, just pretend we did
        return Promise.resolve({ 
          data: { path, publicUrl: URL.createObjectURL(file) }, 
          error: null 
        });
      },
      getPublicUrl: (path: string) => ({ 
        data: { publicUrl: path } 
      }),
      list: (prefix: string) => Promise.resolve({ data: [], error: null }),
      remove: (paths: string[]) => Promise.resolve({ data: {}, error: null })
    })
  },
  functions: {
    invoke: (name: string, options?: { body?: any }) => {
      // Mock function invocation
      return Promise.resolve({ data: {}, error: null });
    }
  }
};
