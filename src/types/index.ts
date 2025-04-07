export type UserRole = "Client" | "Lawyer" | "Clerk" | "Judge";

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
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
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
