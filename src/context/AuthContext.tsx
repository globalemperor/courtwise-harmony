
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'courtwise_user';
const USERS_STORAGE_KEY = 'courtwise_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  // Helper to get stored users
  const getStoredUsers = (): User[] => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    try {
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error('Error parsing stored users:', error);
      return [];
    }
  };

  // Helper to save users
  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Find user in local storage
      const users = getStoredUsers();
      const foundUser = users.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }
      
      // In a real app, we would check password hash, but for simplicity we'll skip that
      
      // Set the current user
      setUser(foundUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${foundUser.name}!`,
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Check if user already exists
      const users = getStoredUsers();
      if (users.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };
      
      // Save to local storage
      saveUsers([...users, newUser]);
      
      // Set as current user
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully!',
      });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
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
