
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  canCommunicateWith: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAllUsers = () => {
  try {
    const clerks = JSON.parse(localStorage.getItem('courtwise_users_clerks') || '[]');
    const clients = JSON.parse(localStorage.getItem('courtwise_users_clients') || '[]');
    const lawyers = JSON.parse(localStorage.getItem('courtwise_users_lawyers') || '[]');
    const judges = JSON.parse(localStorage.getItem('courtwise_users_judges') || '[]');
    
    return [
      ...clerks.map((clerk: any) => ({ ...clerk, role: 'clerk' as UserRole })),
      ...clients.map((client: any) => ({ ...client, role: 'client' as UserRole })),
      ...lawyers.map((lawyer: any) => ({ ...lawyer, role: 'lawyer' as UserRole })),
      ...judges.map((judge: any) => ({ ...judge, role: 'judge' as UserRole }))
    ];
  } catch (error) {
    console.error('Error parsing user data:', error);
    return [];
  }
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
      const user = allUsers.find(u => u.email === email);
      
      if (!user || user.password !== password) {
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
        phone: userData.phone || '',
        idType: userData.idType || '',
        idNumber: userData.idNumber || '',
      };
      
      // Add role-specific data
      if (userData.role === 'client') {
        const clientData = userData as any;
        if (clientData.phone) (newUser as any).phone = clientData.phone;
        if (clientData.idType) (newUser as any).idType = clientData.idType;
        if (clientData.idNumber) (newUser as any).idNumber = clientData.idNumber;
      } else if (userData.role === 'lawyer') {
        const lawyerData = userData as any;
        if (lawyerData.specialization) (newUser as any).specialization = lawyerData.specialization;
        if (lawyerData.barId) (newUser as any).barId = lawyerData.barId;
        if (lawyerData.yearsOfExperience) (newUser as any).yearsOfExperience = lawyerData.yearsOfExperience;
        if (lawyerData.phone) (newUser as any).phone = lawyerData.phone;
        if (lawyerData.idType) (newUser as any).idType = lawyerData.idType;
        if (lawyerData.idNumber) (newUser as any).idNumber = lawyerData.idNumber;
      } else if (userData.role === 'clerk') {
        const clerkData = userData as any;
        if (clerkData.courtId) (newUser as any).courtId = clerkData.courtId;
        if (clerkData.department) (newUser as any).department = clerkData.department;
        if (clerkData.phone) (newUser as any).phone = clerkData.phone;
        if (clerkData.idType) (newUser as any).idType = clerkData.idType;
        if (clerkData.idNumber) (newUser as any).idNumber = clerkData.idNumber;
      } else if (userData.role === 'judge') {
        const judgeData = userData as any;
        if (judgeData.chamberNumber) (newUser as any).chamberNumber = judgeData.chamberNumber;
        if (judgeData.courtDistrict) (newUser as any).courtDistrict = judgeData.courtDistrict;
        if (judgeData.yearsOnBench) (newUser as any).yearsOnBench = judgeData.yearsOnBench;
        if (judgeData.phone) (newUser as any).phone = judgeData.phone;
        if (judgeData.idType) (newUser as any).idType = judgeData.idType;
        if (judgeData.idNumber) (newUser as any).idNumber = judgeData.idNumber;
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
      
      // No need to navigate here as we'll handle it in the component
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

  // Function to determine if the current user can communicate with a given role
  const canCommunicateWith = (role: UserRole): boolean => {
    if (!user) return false;
    
    // Define communication rules
    switch (user.role) {
      case 'client':
        // Clients can only communicate with lawyers
        return role === 'lawyer';
      case 'lawyer':
        // Lawyers can communicate with clients and clerks, but not judges directly
        return role === 'client' || role === 'clerk';
      case 'clerk':
        // Clerks can communicate with lawyers and judges
        return role === 'lawyer' || role === 'judge';
      case 'judge':
        // Judges can only communicate with clerks
        return role === 'clerk';
      default:
        return false;
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
        updateUser,
        canCommunicateWith
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
