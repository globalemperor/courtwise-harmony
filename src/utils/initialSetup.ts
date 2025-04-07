
import { User, Case } from '@/types';

// Function to create and save test data if needed
export const setupTestEnvironment = () => {
  // Only initialize if data doesn't already exist
  if (!localStorage.getItem('courtwise_users_clients')) {
    console.log("Setting up environment with empty data structure");
    
    // Store empty user collections by role in local storage
    localStorage.setItem('courtwise_users_clients', JSON.stringify([]));
    localStorage.setItem('courtwise_users_lawyers', JSON.stringify([]));
    localStorage.setItem('courtwise_users_judges', JSON.stringify([]));
    localStorage.setItem('courtwise_users_clerks', JSON.stringify([]));
    
    // Store empty cases array
    localStorage.setItem('courtwise_cases', JSON.stringify([]));
    
    // Store empty messages by conversation type
    localStorage.setItem('courtwise_messages_client_lawyer', JSON.stringify([]));
    localStorage.setItem('courtwise_messages_lawyer_clerk', JSON.stringify([]));
    localStorage.setItem('courtwise_messages_clerk_judge', JSON.stringify([]));
    
    // Store empty hearings
    localStorage.setItem('courtwise_hearings', JSON.stringify([]));

    // Add test accounts
    addTestAccounts();
  }
};

// Add test accounts for demo/testing purposes
export const addTestAccounts = () => {
  // Test Client
  const testClient: User = {
    id: 'test-client-001',
    name: 'Test Client',
    email: 'client@test.com',
    password: 'password',
    role: 'client',
    avatarUrl: 'https://ui-avatars.com/api/?name=Test+Client&background=blue'
  };
  
  // Test Lawyer
  const testLawyer: User = {
    id: 'test-lawyer-001',
    name: 'Test Lawyer',
    email: 'lawyer@test.com',
    password: 'password',
    role: 'lawyer',
    avatarUrl: 'https://ui-avatars.com/api/?name=Test+Lawyer&background=green',
    barId: 'BAR-12345',
    yearsOfExperience: '5',
    specialization: 'corporate law'
  };
  
  // Test Judge
  const testJudge: User = {
    id: 'test-judge-001',
    name: 'Test Judge',
    email: 'judge@test.com',
    password: 'password',
    role: 'judge',
    avatarUrl: 'https://ui-avatars.com/api/?name=Test+Judge&background=red',
    chamberNumber: '101',
    courtDistrict: 'Central District',
    yearsOnBench: '10'
  };
  
  // Test Clerk
  const testClerk: User = {
    id: 'test-clerk-001',
    name: 'Test Clerk',
    email: 'clerk@test.com',
    password: 'password',
    role: 'clerk',
    avatarUrl: 'https://ui-avatars.com/api/?name=Test+Clerk&background=purple',
    courtId: 'COURT-101',
    department: 'Civil Division'
  };
  
  // Save test accounts
  localStorage.setItem('courtwise_users_clients', JSON.stringify([testClient]));
  localStorage.setItem('courtwise_users_lawyers', JSON.stringify([testLawyer]));
  localStorage.setItem('courtwise_users_judges', JSON.stringify([testJudge]));
  localStorage.setItem('courtwise_users_clerks', JSON.stringify([testClerk]));
};

export default setupTestEnvironment;
