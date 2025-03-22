
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
  from: (table: string) => ({
    select: (columns?: string) => ({ 
      eq: (column: string, value: any) => ({
        data: null, 
        error: null,
        single: () => Promise.resolve({ data: null, error: null })
      }),
      data: null, 
      error: null 
    }),
    insert: (data: any) => ({ 
      select: () => Promise.resolve({ data: null, error: null }),
      data: null, 
      error: null 
    }),
    update: (data: any) => ({ 
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      match: (criteria: any) => Promise.resolve({ data: null, error: null }),
      data: null, 
      error: null 
    }),
    delete: () => ({ 
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      match: (criteria: any) => Promise.resolve({ data: null, error: null }),
      data: null, 
      error: null 
    }),
    // Enhanced mocks for case filing
    upsert: (data: any) => Promise.resolve({ data, error: null }),
    match: (criteria: any) => ({
      data: null,
      error: null
    })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' } }),
      list: (prefix: string) => Promise.resolve({ data: [], error: null }),
      remove: (paths: string[]) => Promise.resolve({ data: {}, error: null })
    })
  },
  functions: {
    invoke: (name: string, options?: { body?: any }) => Promise.resolve({ data: {}, error: null })
  }
};
