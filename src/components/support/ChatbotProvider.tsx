
import React from "react";
import { Chatbot, ChatbotProps } from "./Chatbot";
import { useAuth } from "@/context/AuthContext";

// Define the knowledge base for law-related questions
export const legalKnowledgeBase = {
  greeting: {
    question: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "howdy", "greetings"],
    answer: [
      "Hello! How can I assist you with CourtWise today?",
      "Hi there! What can I help you with regarding court cases or legal processes?",
      "Greetings! I'm your CourtWise assistant. What information do you need today?",
      "Welcome to CourtWise support! How may I assist you with your legal queries?"
    ]
  },
  // General legal questions
  legalSystem: {
    question: ["legal system", "how does court work", "court system", "how courts work", "legal process"],
    answer: [
      "The legal system typically works in these steps:\n• Case filing - Submit required documents to initiate legal proceedings\n• Case assignment - Court assigns judge and schedules initial hearing\n• Discovery phase - Both parties exchange evidence and information\n• Pre-trial motions - Legal arguments made before the trial begins\n• Trial - Formal presentation of evidence and arguments\n• Judgment - Court decision on the case\n• Appeals - Option to challenge the decision in a higher court"
    ]
  },
  legalTerms: {
    question: ["legal terms", "court terms", "law terminology", "legal dictionary", "what does mean in law"],
    answer: [
      "Here are common legal terms you might encounter:\n• Plaintiff - The person/entity filing the lawsuit\n• Defendant - The person/entity being sued\n• Litigation - The process of taking legal action\n• Discovery - Evidence gathering process\n• Deposition - Sworn testimony given before trial\n• Motion - Formal request for a court to make a decision\n• Verdict - Final decision in a trial\n• Settlement - Resolution reached without a trial\n• Jurisdiction - Court's authority to hear a case"
    ]
  },
  evidenceTypes: {
    question: ["evidence types", "what is evidence", "types of evidence", "proof", "legal evidence", "how to submit evidence"],
    answer: [
      "Evidence in court cases can be categorized as:\n• Documentary evidence - Written documents, contracts, records\n• Testimonial evidence - Statements from witnesses\n• Physical evidence - Tangible objects related to the case\n• Digital evidence - Emails, text messages, social media posts\n• Demonstrative evidence - Charts, maps, models that illustrate points\n• Character evidence - Information about a person's reputation\n• Hearsay evidence - Second-hand information (often inadmissible)\n• Expert testimony - Opinions from qualified specialists"
    ]
  },
  witnessTypes: {
    question: ["witness types", "types of witnesses", "who can be witness", "witness information", "witness requirements"],
    answer: [
      "Different types of witnesses in legal proceedings include:\n• Eyewitnesses - People who directly observed relevant events\n• Expert witnesses - Specialists providing professional opinions\n• Character witnesses - People testifying about someone's reputation\n• Lay witnesses - Ordinary people with relevant knowledge\n• Hostile witnesses - Unwilling or adversarial witnesses\n• Fact witnesses - People testifying about facts they know"
    ]
  },
  filingCase: {
    question: ["how to file case", "filing a lawsuit", "start legal proceedings", "submit case", "file new case"],
    answer: [
      "To file a case through our platform:\n• Create an account or log in as a client\n• Navigate to the 'File Case' section\n• Complete the case information form with all required details\n• Add defendant information and case specifics\n• Upload any relevant documents or evidence\n• Add witness information if applicable\n• Submit your case for review\n• Pay any applicable filing fees\n• Wait for case assignment and scheduling information"
    ]
  },
  courtEtiquette: {
    question: ["court etiquette", "how to behave in court", "court rules", "courtroom behavior", "court dress code"],
    answer: [
      "Important court etiquette to follow:\n• Dress formally and conservatively\n• Arrive early to your hearings\n• Stand when the judge enters or leaves\n• Address the judge as 'Your Honor'\n• Speak clearly and avoid interrupting others\n• Turn off electronic devices\n• Demonstrate respect for all court officials\n• Avoid emotional outbursts or inappropriate language\n• Follow your attorney's guidance"
    ]
  },
  courtWise: {
    question: ["about courtwise", "what is courtwise", "courtwise features", "how to use courtwise", "courtwise platform"],
    answer: [
      "CourtWise is a comprehensive court case management system with these features:\n• User-friendly dashboard for cases and hearings\n• Role-based access for clients, lawyers, clerks, and judges\n• Secure document storage and sharing\n• Calendar integration for hearing schedules\n• Real-time notifications for case updates\n• Messaging system for client-lawyer communication\n• E-filing capabilities for court documents\n• Case tracking and status updates"
    ]
  },
  hearings: {
    question: ["hearing schedule", "court dates", "scheduling hearings", "view hearings", "upcoming hearings"],
    answer: [
      "To manage your hearing schedule in CourtWise:\n• View all hearings on the Schedule page\n• Filter by day, week, or month view\n• Click on a date to see detailed information\n• Receive notifications before upcoming hearings\n• Request rescheduling if needed (subject to approval)\n• Add the hearing to your personal calendar\n• Access hearing details including location and time"
    ]
  },
  documents: {
    question: ["document upload", "file documents", "submit evidence", "manage documents", "court documents"],
    answer: [
      "Managing documents in CourtWise is simple:\n• Upload documents from the case details page\n• Supported formats include PDF, DOC, DOCX, JPG, PNG\n• Add descriptions and tags for better organization\n• Control who can access each document\n• Receive notifications when documents are reviewed\n• Download or share documents securely\n• Keep track of document submission deadlines"
    ]
  },
  authentication: {
    question: ["login problems", "cannot login", "reset password", "account issues", "forgot password"],
    answer: [
      "If you're having trouble accessing your account:\n• Use the 'Forgot Password' link on the login page\n• Check your email for verification messages\n• Ensure you're using the correct email address\n• Contact support if you need to update your email\n• Make sure your account has been approved\n• Try clearing your browser cache\n• Use a supported browser (Chrome, Firefox, Safari, Edge)"
    ]
  }
};

export const ChatbotProvider = () => {
  const { isAuthenticated } = useAuth();
  
  // Only show chatbot for authenticated users
  if (!isAuthenticated) return null;
  
  return <Chatbot knowledgeBase={legalKnowledgeBase} />;
};
