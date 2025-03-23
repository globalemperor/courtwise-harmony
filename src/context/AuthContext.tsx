import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import clerksData from '@/data/users_clerks.json';
import clientsData from '@/data/users_clients.json';
import lawyersData from '@/data/users_lawyers.json';
import judgesData from '@/data/users_judges.json';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAllUsers = () => {
  const typedClerksData = clerksData.map(clerk => ({
    ...clerk,
    role: clerk.role as UserRole
  }));

  const typedClientsData = clientsData.map(client => ({
    ...client,
    role: client.role as UserRole
  }));

  const typedLawyersData = lawyersData.map(lawyer => ({
    ...lawyer,
    role: lawyer.role as UserRole
  }));

  const typedJudgesData = judgesData.map(judge => ({
    ...judge,
    role: judge.role as UserRole
  }));

  return [
    ...typedClerksData, 
    ...typedClientsData, 
    ...typedLawyersData, 
    ...typedJudgesData
  ];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedSession = localStorage.getItem('courtwise_session');
      
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          const storedUserData = localStorage.getItem('courtwise_user');
          
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
          } else {
            const allUsers = getAllUsers();
            const userFromJson = allUsers.find(u => u.id === session.user.id);
            
            if (userFromJson) {
              setUser(userFromJson);
              localStorage.setItem('courtwise_user', JSON.stringify(userFromJson));
            }
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('courtwise_session');
          localStorage.removeItem('courtwise_user');
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const allUsers = getAllUsers();
      const user = allUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { error: { message: "Invalid login credentials" } };
      }
      
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
      
      setUser(user);
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const allUsers = getAllUsers();
      const existingUser = allUsers.find(u => u.email === email);
      
      if (existingUser) {
        return { error: { message: "Email already in use" } };
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        password,
        name: userData.name || email.split('@')[0],
        role: userData.role || 'client',
        avatarUrl: userData.avatarUrl || `https://ui-avatars.com/api/?name=${userData.name || email.split('@')[0]}&background=random`,
      };
      
      if (userData.role === 'lawyer') {
        const lawyerData = userData as any;
        if (lawyerData.specialization) (newUser as any).specialization = lawyerData.specialization;
        if (lawyerData.barId) (newUser as any).barId = lawyerData.barId;
        if (lawyerData.yearsOfExperience) (newUser as any).yearsOfExperience = lawyerData.yearsOfExperience;
      } else if (userData.role === 'clerk') {
        const clerkData = userData as any;
        if (clerkData.courtId) (newUser as any).courtId = clerkData.courtId;
        if (clerkData.department) (newUser as any).department = clerkData.department;
      } else if (userData.role === 'judge') {
        const judgeData = userData as any;
        if (judgeData.chamberNumber) (newUser as any).chamberNumber = judgeData.chamberNumber;
        if (judgeData.courtDistrict) (newUser as any).courtDistrict = judgeData.courtDistrict;
        if (judgeData.yearsOnBench) (newUser as any).yearsOnBench = judgeData.yearsOnBench;
      }
      
      const existingUsersKey = `courtwise_users_${newUser.role}s`;
      const existingUsers = JSON.parse(localStorage.getItem(existingUsersKey) || '[]');
      existingUsers.push(newUser);
      localStorage.setItem(existingUsersKey, JSON.stringify(existingUsers));
      
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
      
      setUser(newUser);
      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('courtwise_session');
      localStorage.removeItem('courtwise_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('courtwise_user', JSON.stringify(userData));
    
    const usersKey = `courtwise_users_${userData.role}s`;
    try {
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
      const updatedUsers = users.map((u: User) => 
        u.id === userData.id ? userData : u
      );
      localStorage.setItem(usersKey, JSON.stringify(updatedUsers));
    } catch (error) {
      console.error(`Error updating user in ${usersKey}:`, error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
