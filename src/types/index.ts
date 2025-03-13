
export type UserRole = 'client' | 'lawyer' | 'clerk' | 'judge';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

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
}

export type CaseStatus = 
  | 'pending' 
  | 'active' 
  | 'scheduled' 
  | 'in_progress' 
  | 'on_hold' 
  | 'dismissed' 
  | 'closed';

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

export interface Hearing {
  id: string;
  caseId: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  summary?: string;
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
