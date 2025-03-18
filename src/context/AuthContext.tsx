
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, mapSupabaseProfileToUser } from '@/types';
import { supabase } from '@/integrations/supabase/client';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check active session and set up auth state listener
  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Found existing session:", session.user.id);
          // Fetch the user profile from the profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          } else if (profile) {
            console.log("Found profile:", profile);
            // Type assertion to ensure the role is treated as UserRole
            const typedProfile = {
              ...profile,
              role: profile.role as UserRole
            };
            setUser(mapSupabaseProfileToUser(typedProfile));
          }
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        if (event === 'SIGNED_IN' && session) {
          // Fetch the user profile when signed in
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
            
            // Attempt to create a profile if it doesn't exist
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: 'client',
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email?.split('@')[0] || 'User')}&background=random`
              });
              
            if (createError) {
              console.error('Error creating profile after sign in:', createError);
              toast({
                title: 'Error creating profile',
                description: 'Your profile could not be created. Please try again.',
                variant: 'destructive',
              });
            } else {
              // Fetch the newly created profile
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (newProfile) {
                const typedNewProfile = {
                  ...newProfile,
                  role: newProfile.role as UserRole
                };
                setUser(mapSupabaseProfileToUser(typedNewProfile));
                toast({
                  title: 'Profile created',
                  description: 'Your profile has been created successfully!',
                });
              }
            }
          } else if (profile) {
            // Type assertion to ensure the role is treated as UserRole
            const typedProfile = {
              ...profile,
              role: profile.role as UserRole
            };
            setUser(mapSupabaseProfileToUser(typedProfile));
            toast({
              title: 'Welcome back!',
              description: `Logged in as ${profile.name}`,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    // Cleanup subscription on unmount
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
      
      // Immediately try to fetch and set user profile
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile during login:', profileError);
          
          // Create profile if it doesn't exist
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: data.user.email?.split('@')[0] || 'User',
              email: data.user.email || '',
              role,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.email?.split('@')[0] || 'User')}&background=random`
            });
            
          if (createError) {
            console.error('Error creating profile during login:', createError);
            toast({
              title: 'Profile setup failed',
              description: 'Your login was successful but profile setup failed. Please try again.',
              variant: 'destructive',
            });
          } else {
            // Fetch the newly created profile
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            if (newProfile) {
              const typedNewProfile = {
                ...newProfile,
                role: newProfile.role as UserRole
              };
              setUser(mapSupabaseProfileToUser(typedNewProfile));
              toast({
                title: 'Login successful',
                description: 'Your profile has been created.',
              });
            }
          }
        } else if (profile) {
          // Type assertion to ensure the role is treated as UserRole
          const typedProfile = {
            ...profile,
            role: profile.role as UserRole
          };
          setUser(mapSupabaseProfileToUser(typedProfile));
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
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
      
      // Always manually create the profile
      if (data.user) {
        // Wait for a brief moment to ensure auth signup processing is complete
        // This helps with potential race conditions
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
          
        if (!existingProfile) {
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name,
              email,
              role,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            toast({
              title: 'Profile creation failed',
              description: 'Your account was created, but profile setup failed. Please try logging in to fix this issue.',
              variant: 'destructive',
            });
            
            // Log the user out so they can try signing in again
            await supabase.auth.signOut();
            setUser(null);
            throw new Error('Profile creation failed');
          } else {
            toast({
              title: 'Account created',
              description: 'Your account and profile have been created successfully!',
            });
            
            // Set the user immediately after successful signup and profile creation
            const newUser: User = {
              id: data.user.id,
              name,
              email,
              role,
              avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            };
            setUser(newUser);
          }
        } else {
          // Profile already exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profile) {
            const typedProfile = {
              ...profile,
              role: profile.role as UserRole
            };
            setUser(mapSupabaseProfileToUser(typedProfile));
            toast({
              title: 'Welcome back!',
              description: `Logged in as ${profile.name}`,
            });
          }
        }
      }
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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
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
