
// This file now contains a mock client implementation with no actual Supabase connection
// You can replace this with your own backend implementation later

// Mock types to maintain interface compatibility
type MockDatabase = any;

// Create a mock client that does nothing but maintains the interface shape
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    signUp: () => Promise.resolve({ data: {}, error: null }),
    signIn: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: null, error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
};
