<<<<<<< HEAD
export type UserRole = "Client" | "Lawyer" | "Clerk" | "Judge";
=======
// Original user types
export type UserRole = 'client' | 'lawyer' | 'clerk' | 'judge';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  specialization?: string;
  governmentId?: {
    type: string;
    number: string;
  };
  idType?: string; // Added for government ID type
  idNumber?: string; // Added for government ID number
  password?: string; // Add password as an optional property
  // New lawyer-specific fields
  licenseYear?: string;
  casesHandled?: number;
  casesWon?: number;
  caseTypes?: string[];
  // Add missing properties for different user roles
  barId?: string; // For lawyers
  yearsOfExperience?: string; // For lawyers
  chamberNumber?: string; // For judges
  courtDistrict?: string; // For judges
  yearsOnBench?: string; // For judges
  courtId?: string; // For clerks
  department?: string; // For clerks
}

export type CaseStatus = 
  | 'pending' 
  | 'active' 
  | 'scheduled' 
  | 'in_progress' 
  | 'on_hold' 
  | 'dismissed' 
  | 'closed';

export interface Witness {
  name: string;
  contactNumber: string;
  relation: string;
  statement?: string;
}

export interface EvidenceItem {
  title: string;
  description?: string;
  type: string;
  fileUrl?: string;
}
>>>>>>> 17cf6e4 (New UI)

export interface Case {
  id: string;
  title: string;
  description: string;
  caseNumber: string;
  type: string;
  status: string;
  clientId: string;
  lawyerId: string;
  judgeId: string;
  createdAt: string;
  updatedAt: string;
<<<<<<< HEAD
  filingDate: string;
  nextHearingDate: string;
  documents: Document[];
  parties: Party[];
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Party {
  id: string;
  name: string;
  role: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarUrl?: string;
  // Lawyer specific fields
  barId?: string;
  yearsOfExperience?: string;
  specialization?: string;
  // Judge specific fields
  chamberNumber?: string;
  courtDistrict?: string;
  yearsOnBench?: string;
  // Clerk specific fields
  courtId?: string;
  department?: string;
=======
  nextHearingDate?: string;
  filedDate?: string;
  courtRoom?: string;
  judgeName?: string;
  defendantInfo?: {
    name: string;
    contactNumber: string;
    idType: string;
    idNumber: string;
  };
  judgement?: Judgement;
  // Add these fields to match empty_cases.json structure
  type?: string;
  judgeId?: string;
  filingDate?: string;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
  }>;
  parties?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  // Add new fields for witnesses and evidence
  witnesses?: Witness[];
  evidence?: EvidenceItem[];
>>>>>>> 17cf6e4 (New UI)
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
<<<<<<< HEAD
  timestamp: string;
=======
  read: boolean;
  createdAt: string;
}

export interface Judgement {
  decision: 'approved' | 'denied' | 'partial';
  ruling: string;
  issuedAt: string;
  issuedBy: string;
  judgeName: string;
  courtRoomNumber: string;
}

export interface ReschedulingRecord {
  previousDate: string;
  newDate: string;
  reason: string;
  judgeId: string;
  rescheduledAt: string;
>>>>>>> 17cf6e4 (New UI)
}

export interface Hearing {
  id: string;
  caseId: string;
  date: string;
  time: string;
  location: string;
  judgeId: string;
  description: string;
}

// Supabase specific types - these are interfaces that match our Supabase tables
// These can be used when interacting with Supabase directly

export interface SupabaseProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  // New lawyer fields for Supabase
  license_year?: string;
  cases_handled?: number;
  cases_won?: number;
  case_types?: string[];
}

export interface SupabaseCase {
  id: string;
  case_number: string;
  title: string;
  client_id: string;
  primary_lawyer_id?: string;
  secondary_lawyer_id?: string;
  defendant_id?: string;
  court_id?: string;
  type: string;
  status: CaseStatus;
  description: string;
  next_hearing_date?: string;
  judge_id?: string;
  filed_date?: string;
  court_room?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseMessage {
  id: string;
  sender_id: string;
  sender_role: UserRole;
  recipient_id: string;
  recipient_role: UserRole;
  case_id?: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface SupabaseHearing {
  id: string;
  case_id: string;
  date: string;
  time: string;
  court_id: string;
  judge_id: string;
  location: string;
  abstract: string;
  details?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  summary?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseEvidence {
  id: string;
  case_id: string;
  title: string;
  description: string;
  type?: string;
  file_url?: string;
  uploaded_by: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCaseRequest {
  id: string;
  client_id: string;
  lawyer_id: string;
  case_title: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Mapping functions to convert between Supabase and app types
export function mapSupabaseProfileToUser(profile: SupabaseProfile): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    avatarUrl: profile.avatar_url,
    // New lawyer fields
    licenseYear: profile.license_year,
    casesHandled: profile.cases_handled,
    casesWon: profile.cases_won,
    caseTypes: profile.case_types
  };
}

export function mapSupabaseCaseToCase(supCase: SupabaseCase): Case {
  return {
    id: supCase.id,
    title: supCase.title,
    description: supCase.description,
    caseNumber: supCase.case_number,
    status: supCase.status,
    clientId: supCase.client_id,
    lawyerId: supCase.primary_lawyer_id,
    createdAt: supCase.created_at,
    updatedAt: supCase.updated_at,
    nextHearingDate: supCase.next_hearing_date,
    filedDate: supCase.filed_date,
    courtRoom: supCase.court_room,
    judgeName: undefined // This would need to be filled in separately
  };
}

export function mapSupabaseMessageToMessage(message: SupabaseMessage): Message {
  return {
    id: message.id,
    senderId: message.sender_id,
    senderRole: message.sender_role,
    recipientId: message.recipient_id,
    recipientRole: message.recipient_role,
    caseId: message.case_id,
    content: message.content,
    read: message.read,
    createdAt: message.created_at
  };
}
