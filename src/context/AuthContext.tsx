import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoading(true);

      if (session) {
        try {
          const storedUserData = localStorage.getItem('courtwise_user');
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
          } else {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileData) {
              const userData: User = {
                id: profileData.id,
                name: profileData.name,
                email: profileData.email,
                role: profileData.role as UserRole,
                avatarUrl: profileData.avatar_url,
              };
              setUser(userData);
              localStorage.setItem('courtwise_user', JSON.stringify(userData));
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileData) {
              const userData: User = {
                id: profileData.id,
                name: profileData.name,
                email: profileData.email,
                role: profileData.role as UserRole,
                avatarUrl: profileData.avatar_url,
              };
              setUser(userData);
              localStorage.setItem('courtwise_user', JSON.stringify(userData));
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('courtwise_user');
        }
      }
    );

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signIn({ 
        email, 
        password 
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const userMeta: Record<string, any> = {
        name: userData.name,
        role: userData.role,
      };
      
      if (userData.role === 'lawyer') {
        const lawyerData = userData as any;
        if (lawyerData.specialization) userMeta.specialization = lawyerData.specialization;
        if (lawyerData.barId) userMeta.barId = lawyerData.barId;
        if (lawyerData.yearsOfExperience) userMeta.yearsOfExperience = lawyerData.yearsOfExperience;
      } else if (userData.role === 'clerk') {
        const clerkData = userData as any;
        if (clerkData.courtId) userMeta.courtId = clerkData.courtId;
        if (clerkData.department) userMeta.department = clerkData.department;
      } else if (userData.role === 'judge') {
        const judgeData = userData as any;
        if (judgeData.chamberNumber) userMeta.chamberNumber = judgeData.chamberNumber;
        if (judgeData.courtDistrict) userMeta.courtDistrict = judgeData.courtDistrict;
        if (judgeData.yearsOnBench) userMeta.yearsOnBench = judgeData.yearsOnBench;
      }
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('courtwise_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('courtwise_user', JSON.stringify(userData));
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
