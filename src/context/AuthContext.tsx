
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, mapSupabaseProfileToUser } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Check active session and set up auth state listener
  useEffect(() => {
    console.log("Initializing auth state...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession?.user) {
            try {
              console.log("Getting profile for user:", newSession.user.id);
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', newSession.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching user profile:', error);
                // Wait a moment and try one more time - the trigger might be delayed
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const { data: retryProfile, error: retryError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', newSession.user.id)
                  .single();
                  
                if (retryError) {
                  console.error('Error on retry fetching profile:', retryError);
                  
                  // Create profile if it doesn't exist after retry
                  const { error: createError } = await supabase
                    .from('profiles')
                    .insert({
                      id: newSession.user.id,
                      name: newSession.user.email?.split('@')[0] || 'User',
                      email: newSession.user.email || '',
                      role: 'client',
                      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(newSession.user.email?.split('@')[0] || 'User')}&background=random`
                    });
                    
                  if (createError) {
                    console.error('Failed to create profile on auth state change:', createError);
                    toast({
                      title: 'Profile setup failed',
                      description: 'Could not set up your profile. Please try logging out and in again.',
                      variant: 'destructive',
                    });
                  } else {
                    // Get the newly created profile
                    const { data: newProfile } = await supabase
                      .from('profiles')
                      .select('*')
                      .eq('id', newSession.user.id)
                      .single();
                      
                    if (newProfile) {
                      const typedProfile = {
                        ...newProfile,
                        role: newProfile.role as UserRole
                      };
                      setUser(mapSupabaseProfileToUser(typedProfile));
                      toast({
                        title: 'Profile created',
                        description: 'Your profile has been created successfully!',
                      });
                    }
                  }
                } else if (retryProfile) {
                  const typedProfile = {
                    ...retryProfile,
                    role: retryProfile.role as UserRole
                  };
                  setUser(mapSupabaseProfileToUser(typedProfile));
                }
              } else if (profile) {
                const typedProfile = {
                  ...profile,
                  role: profile.role as UserRole
                };
                setUser(mapSupabaseProfileToUser(typedProfile));
                
                if (event === 'SIGNED_IN') {
                  toast({
                    title: 'Welcome back!',
                    description: `Logged in as ${profile.name}`,
                  });
                }
              }
            } catch (error) {
              console.error('Unexpected error processing auth state change:', error);
            }
          } else {
            setUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          toast({
            title: 'Logged out',
            description: 'You have been successfully logged out.',
          });
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      console.log("Checking for existing session:", existingSession?.user?.id);
      setSession(existingSession);
      
      if (existingSession?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingSession.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile on init:', error);
            setUser(null);
          } else if (profile) {
            console.log("Found existing profile:", profile);
            const typedProfile = {
              ...profile,
              role: profile.role as UserRole
            };
            setUser(mapSupabaseProfileToUser(typedProfile));
          }
        } catch (error) {
          console.error('Error checking session:', error);
          setUser(null);
        }
      }
      
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      console.log("Attempting to login:", email, role);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Login successful:", data);
      
      // The auth state change listener will handle setting the user
      // We don't need to do anything else here
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      setLoading(false);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      console.log("Attempting to signup:", name, email, role);
      
      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });
      
      if (error) throw error;
      
      console.log("Signup successful:", data);
      
      if (data.user) {
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify profile was created or create it manually
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
          
        if (profileError || !existingProfile) {
          console.log("Profile not found, creating manually");
          
          // Create profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name,
              email,
              role,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            });
            
          if (insertError) {
            console.error('Error creating profile after signup:', insertError);
            toast({
              title: 'Profile setup failed',
              description: 'Your account was created, but profile setup failed. Please try logging in again.',
              variant: 'destructive',
            });
            
            // The auth state change listener will attempt to create a profile again
          } else {
            toast({
              title: 'Account created',
              description: 'Your account has been created successfully!',
            });
          }
        } else {
          toast({
            title: 'Account created',
            description: 'Your account has been created successfully!',
          });
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // The auth state change listener will handle clearing the user
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'An error occurred during logout',
        variant: 'destructive',
      });
    }
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
