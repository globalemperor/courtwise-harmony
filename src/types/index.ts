
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
  password?: string; // Add password as an optional property
  // New lawyer-specific fields
  licenseYear?: string;
  casesHandled?: number;
  casesWon?: number;
  caseTypes?: string[];
}

export type CaseStatus = 
  | 'pending' 
  | 'active' 
  | 'scheduled' 
  | 'in_progress' 
  | 'on_hold' 
  | 'dismissed' 
  | 'closed';

export interface Case {
  id: string;
  title: string;
  description: string;
  caseNumber: string;
  status: CaseStatus;
  clientId: string;
  lawyerId?: string;
  createdAt: string;
  updatedAt: string;
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
  judgement?: Judgement; // Add judgement property to the Case interface
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: UserRole;
  recipientId: string;
  recipientRole: UserRole;
  caseId?: string;
  content: string;
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
}

export interface Hearing {
  id: string;
  caseId: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
  participants?: string[];
  notes?: string;
  rescheduled?: boolean;
  reschedulingHistory?: ReschedulingRecord[];
}

export interface Evidence {
  id: string;
  caseId: string;
  title: string;
  description: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  fileType?: string;
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
