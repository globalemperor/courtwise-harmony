
import { User, Case } from '@/types';

// Test accounts that are created by default in "test mode"
export const testUsers: User[] = [
  {
    id: "test-client",
    name: "Test Client",
    email: "testclient@example.com",
    password: "password",
    role: "client",
    avatarUrl: "https://ui-avatars.com/api/?name=Test+Client&background=blue"
  },
  {
    id: "test-lawyer1",
    name: "Test Lawyer 1",
    email: "testlawyer1@example.com",
    password: "password",
    role: "lawyer",
    avatarUrl: "https://ui-avatars.com/api/?name=Test+Lawyer&background=green",
    barId: "TEST-BAR-1",
    yearsOfExperience: "5",
    specialization: "corporate"
  },
  {
    id: "test-lawyer2",
    name: "Test Lawyer 2",
    email: "testlawyer2@example.com",
    password: "password",
    role: "lawyer",
    avatarUrl: "https://ui-avatars.com/api/?name=Test+Lawyer+2&background=orange",
    barId: "TEST-BAR-2",
    yearsOfExperience: "8",
    specialization: "criminal"
  },
  {
    id: "test-judge",
    name: "Test Judge",
    email: "testjudge@example.com",
    password: "password",
    role: "judge",
    avatarUrl: "https://ui-avatars.com/api/?name=Test+Judge&background=red",
    chamberNumber: "TEST-101",
    courtDistrict: "Test District", 
    yearsOnBench: "10"
  },
  {
    id: "test-clerk",
    name: "Test Clerk",
    email: "testclerk@example.com",
    password: "password",
    role: "clerk",
    avatarUrl: "https://ui-avatars.com/api/?name=Test+Clerk&background=purple",
    courtId: "TEST-COURT-1",
    department: "Test Department"
  }
];

// Function to create and save test data if needed
export const setupTestEnvironment = () => {
  const useEmptyData = localStorage.getItem('courtwise_use_empty_data') === 'true';
  
  if (useEmptyData) {
    console.log("Setting up test environment with empty initial data");
    localStorage.setItem('courtwise_users_test', JSON.stringify(testUsers));
  }
};

export default setupTestEnvironment;
