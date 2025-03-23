
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a random avatar using different services for variety
const generateRandomAvatar = (name: string): string => {
  const services = [
    // UI Avatars with random background
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`,
    // DiceBear avatars with different styles
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(name)}`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
  ];
  
  // Use a combination of name and timestamp to create randomness
  const randomIndex = Math.floor((name.length * Date.now()) % services.length);
  return services[randomIndex];
};

// Mock user data for demo purposes
const MOCK_USERS: Record<string, User & { password: string }> = {
  'client@example.com': {
    id: '1',
    name: 'John Client',
    email: 'client@example.com',
    role: 'client',
    password: 'password',
    avatarUrl: generateRandomAvatar('John Client')
  },
  'lawyer@example.com': {
    id: '2',
    name: 'Jane Lawyer',
    email: 'lawyer@example.com',
    role: 'lawyer',
    password: 'password',
    avatarUrl: generateRandomAvatar('Jane Lawyer')
  },
  'clerk@example.com': {
    id: '3',
    name: 'Sam Clerk',
    email: 'clerk@example.com',
    role: 'clerk',
    password: 'password',
    avatarUrl: generateRandomAvatar('Sam Clerk')
  },
  'judge@example.com': {
    id: '4',
    name: 'Honor Judge',
    email: 'judge@example.com',
    role: 'judge',
    password: 'password',
    avatarUrl: generateRandomAvatar('Honor Judge')
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('courtwise_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem('courtwise_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = MOCK_USERS[email];
      
      if (mockUser && mockUser.password === password && mockUser.role === role) {
        const { password, ...userWithoutPassword } = mockUser;
        setUser(userWithoutPassword);
        localStorage.setItem('courtwise_user', JSON.stringify(userWithoutPassword));
        navigate('/dashboard');
        toast({
          title: "Login successful",
          description: `Welcome back, ${userWithoutPassword.name}!`,
        });
      } else {
        throw new Error('Invalid credentials or role');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message || "Invalid credentials",
        variant: "destructive",
      });
      // Navigate back to login page with the selected role
      if (location.pathname.includes('/login/')) {
        const rolePath = location.pathname.split('/login/')[1];
        navigate(`/login/${rolePath}`);
      } else {
        navigate(`/login/${role}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
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
        avatarUrl: generateRandomAvatar(name),
      };
      
      // In a real app, this would be an API call to create a user
      MOCK_USERS[email] = { ...newUser, password };
      
      setUser(newUser);
      localStorage.setItem('courtwise_user', JSON.stringify(newUser));
      
      navigate('/dashboard');
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      
      // Navigate back to signup page
      if (location.pathname.includes('/login/signup')) {
        navigate(`/login/signup?role=${role}`);
      } else {
        navigate(`/login/${role}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('courtwise_user', JSON.stringify(updatedUser));
    
    // Update the mock users data as well
    if (MOCK_USERS[user.email]) {
      const { password } = MOCK_USERS[user.email];
      MOCK_USERS[user.email] = { ...updatedUser, password };
      
      // If email changed, update the key in the MOCK_USERS object
      if (data.email && data.email !== user.email) {
        MOCK_USERS[data.email] = MOCK_USERS[user.email];
        delete MOCK_USERS[user.email];
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('courtwise_user');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout, 
      updateProfile,
      loading 
    }}>
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
