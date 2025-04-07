// Original user types
export type UserRole = "client" | "lawyer" | "clerk" | "judge";

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
  | "pending"
  | "active"
  | "scheduled"
  | "in_progress"
  | "on_hold"
  | "dismissed"
  | "closed";

export interface Case {
  id: string;
  title: string;
  description: string;
  caseNumber?: string; // Make caseNumber optional to accommodate empty_cases.json
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
  decision: "approved" | "denied" | "partial";
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
