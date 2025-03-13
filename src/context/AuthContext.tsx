
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS: Record<string, User & { password: string }> = {
  'client@example.com': {
    id: '1',
    name: 'John Client',
    email: 'client@example.com',
    role: 'client',
    password: 'password',
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Client&background=random'
  },
  'lawyer@example.com': {
    id: '2',
    name: 'Jane Lawyer',
    email: 'lawyer@example.com',
    role: 'lawyer',
    password: 'password',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Lawyer&background=random'
  },
  'clerk@example.com': {
    id: '3',
    name: 'Sam Clerk',
    email: 'clerk@example.com',
    role: 'clerk',
    password: 'password',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sam+Clerk&background=random'
  },
  'judge@example.com': {
    id: '4',
    name: 'Honor Judge',
    email: 'judge@example.com',
    role: 'judge',
    password: 'password',
    avatarUrl: 'https://ui-avatars.com/api/?name=Honor+Judge&background=random'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('courtwise_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = MOCK_USERS[email];
    
    if (mockUser && mockUser.password === password && mockUser.role === role) {
      const { password, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('courtwise_user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid credentials or role');
    }
    
    setLoading(false);
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (MOCK_USERS[email]) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: `${Object.keys(MOCK_USERS).length + 1}`,
      name,
      email,
      role,
      avatarUrl: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`,
    };
    
    // In a real app, this would be an API call to create a user
    MOCK_USERS[email] = { ...newUser, password };
    
    setUser(newUser);
    localStorage.setItem('courtwise_user', JSON.stringify(newUser));
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('courtwise_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, loading }}>
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
