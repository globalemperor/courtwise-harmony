
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
    // Check for active session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoading(true);

      if (session) {
        // Get user data from local storage or Supabase
        try {
          const storedUserData = localStorage.getItem('courtwise_user');
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
          } else {
            // Fallback to fetch from Supabase if local storage is empty
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
                // Additional properties would be included here
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile from Supabase
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
                // Add other profile fields here
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

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signIn({ email, password });
      
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
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            // Add other metadata as needed
          }
        }
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

  // New function to update user profile
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
