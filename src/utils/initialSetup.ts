
import { User, Case } from '@/types';
import emptyUsers from '@/data/empty_users.json';
import emptyCases from '@/data/empty_cases.json';

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
  }
};

export default setupTestEnvironment;
