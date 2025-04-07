import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Briefcase, 
  Gavel, 
  FileText, 
  MessageCircle, 
  Calendar, 
  Lock, 
  HelpCircle,
  Bot
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  roles: string[];
  id: string;
}

const Faq = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  
  const faqItems: FAQItem[] = [
    // General FAQs
    {
      question: "What is CourtWise?",
      answer: "CourtWise is a comprehensive court case management platform designed to streamline the legal process by connecting clients, lawyers, clerks, and judges in a secure digital environment. It offers case management, secure communication, document storage, and scheduling features tailored to each user role.",
      category: "general",
      roles: ["client", "lawyer", "clerk", "judge"],
      id: "what-is-courtwise"
    },
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Get Started' or 'Sign Up' button on the homepage. Select your user role (client, lawyer, clerk, or judge), provide your email address, create a password, and fill in your personal/professional information. You'll need to verify your email address to complete the registration process.",
      category: "general",
      roles: ["client", "lawyer", "clerk", "judge"],
      id: "create-account"
    },
    {
      question: "Is my data secure on CourtWise?",
      answer: "Yes, CourtWise takes data security very seriously. We implement enterprise-grade encryption, secure authentication protocols, and regular security audits. All data is encrypted both in transit and at rest, and we comply with legal data protection standards including GDPR and other relevant regulations.",
      category: "security",
      roles: ["client", "lawyer", "clerk", "judge"],
      id: "data-security"
    },
    
    // Client-specific FAQs
    {
      question: "How do I find a lawyer on the platform?",
      answer: "As a client, you can find a lawyer by navigating to the 'Find Lawyer' section in your dashboard. You can search for lawyers based on specialization, experience, location, and ratings. Once you find a suitable lawyer, you can view their profile and send them a case request with details about your legal matter.",
      category: "using-platform",
      roles: ["client"],
      id: "find-lawyer"
    },
    {
      question: "How can I track the progress of my case?",
      answer: "You can track your case progress through your dashboard. The 'My Cases' section provides an overview of all your cases with their current status. Clicking on a specific case will show you detailed information, including documents, hearing dates, and updates from your lawyer. You'll also receive notifications for important case events.",
      category: "case-management",
      roles: ["client"],
      id: "track-case"
    },
    {
      question: "Can I communicate directly with the judge handling my case?",
      answer: "No, clients cannot communicate directly with judges. This restriction is in place to maintain the integrity of the legal process. You can communicate with your lawyer, who will represent your interests in court. Your lawyer can communicate with court clerks who serve as intermediaries for communication with judges when necessary.",
      category: "communication",
      roles: ["client"],
      id: "client-judge-communication"
    },
    
    // Lawyer-specific FAQs
    {
      question: "How do I accept a new client request?",
      answer: "Client requests can be viewed and managed in the 'Case Requests' section of your dashboard. Review the case details provided by the client, and click 'Accept' if you wish to take on the case. You can also decline requests or request more information before making a decision. Once accepted, the client will be notified and the case will appear in your active cases list.",
      category: "using-platform",
      roles: ["lawyer"],
      id: "accept-client"
    },
    {
      question: "How do I file a new case?",
      answer: "To file a new case, go to the 'File Case' section in your dashboard. Fill out the required case information, including case type, client details, court jurisdiction, and attach any relevant documents. Review all information before submission. Once submitted, the case will be processed by court clerks who may request additional information if needed.",
      category: "case-management",
      roles: ["lawyer"],
      id: "file-case"
    },
    {
      question: "Can I communicate with court clerks and judges?",
      answer: "Lawyers can communicate directly with court clerks through the platform's messaging system. Communication with judges is generally handled through the clerks to maintain proper court procedure. For formal communications related to a case, use the appropriate case filing features rather than direct messages.",
      category: "communication",
      roles: ["lawyer"],
      id: "lawyer-communication"
    },
    
    // Court Official (Clerk & Judge) FAQs
    {
      question: "How do I process new case filings?",
      answer: "As a clerk, new case filings appear in the 'New Cases' section of your dashboard. Review the case details and documents, verify that all required information is provided, and assign the case to the appropriate court division. You can request additional information from lawyers if needed. Once processed, the case will be added to the court docket.",
      category: "case-management",
      roles: ["clerk"],
      id: "process-filings"
    },
    {
      question: "How do I schedule court hearings?",
      answer: "To schedule a hearing, go to the 'Hearings' section in your dashboard. Select the case, choose an available date and time slot, assign a courtroom, and specify the hearing type and expected duration. The system will check for conflicts and notify all relevant parties once the hearing is scheduled.",
      category: "scheduling",
      roles: ["clerk"],
      id: "schedule-hearings"
    },
    {
      question: "How do I access my docket as a judge?",
      answer: "As a judge, your case docket is available in the 'My Docket' section of your dashboard. It shows all cases assigned to you, organized by date and status. You can filter cases by type, priority, or hearing date. Clicking on a case provides access to all case documents, history, and relevant information needed for hearings and decisions.",
      category: "using-platform",
      roles: ["judge"],
      id: "judge-docket"
    },
    
    // Technical FAQs
    {
      question: "What browsers are supported by CourtWise?",
      answer: "CourtWise supports all modern browsers, including the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated to the latest version. Internet Explorer is not supported due to security and performance limitations.",
      category: "technical",
      roles: ["client", "lawyer", "clerk", "judge"],
      id: "browser-support"
    },
    {
      question: "I can't log in to my account. What should I do?",
      answer: "If you're having trouble logging in, first ensure you're using the correct email address and password. Check if Caps Lock is enabled. You can use the 'Forgot Password' link on the login page to reset your password. If you continue to experience issues, clear your browser cache and cookies, or try using a different browser. For persistent problems, contact our support team.",
      category: "technical",
      roles: ["client", "lawyer", "clerk", "judge"],
      id: "login-issues"
    },
    {
      question: "Can I use CourtWise on my mobile device?",
      answer: "Yes, CourtWise is fully responsive and works on smartphones and tablets. For the best mobile experience, we recommend using our mobile app available for iOS and Android devices. The app provides additional features like push notifications and offline access to certain documents.",
      category: "technical",
      roles: ["client", "lawyer", "clerk", "judge"],
      id: "mobile-access"
    }
  ];

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "general", label: "General", icon: HelpCircle },
    { id: "using-platform", label: "Using the Platform", icon: Users },
    { id: "case-management", label: "Case Management", icon: FileText },
    { id: "communication", label: "Communication", icon: MessageCircle },
    { id: "scheduling", label: "Scheduling", icon: Calendar },
    { id: "security", label: "Security & Privacy", icon: Lock },
    { id: "technical", label: "Technical Support", icon: HelpCircle }
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaqs(faqItems);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = faqItems.filter(
        item => 
          item.question.toLowerCase().includes(lowerQuery) || 
          item.answer.toLowerCase().includes(lowerQuery)
      );
      setFilteredFaqs(filtered);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const getFaqsByCategory = (category: string) => {
    if (category === "all") return filteredFaqs;
    return filteredFaqs.filter(item => item.category === category);
  };

  return (
    <div className="min-h-screen bg-court-gray">
      <header className="bg-court-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/help" className="inline-flex items-center text-white hover:text-white/80 mb-6">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Help Center
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
            Find quick answers to common questions about using CourtWise.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for answers..."
                className="pl-10 py-6 bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-white/70" />
              <Button type="submit" className="absolute right-1 top-1 bg-white text-court-blue hover:bg-white/90">
                Search
              </Button>
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <TabsList className="w-full bg-transparent justify-start overflow-x-auto flex-nowrap">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 rounded-md"
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <category.icon className="h-5 w-5 mr-2" />
                  {category.label === "all" ? "Frequently Asked Questions" : `${category.label} Questions`}
                </h2>
                
                {getFaqsByCategory(category.id).length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-4">
                    {getFaqsByCategory(category.id).map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`faq-${index}`}
                        className="border rounded-lg px-2 py-1"
                      >
                        <AccordionTrigger className="hover:no-underline font-medium text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-2 pb-4 px-2">
                          <p>{faq.answer}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            {faq.roles.includes("client") && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                Client
                              </span>
                            )}
                            {faq.roles.includes("lawyer") && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <Briefcase className="h-3 w-3 mr-1" />
                                Lawyer
                              </span>
                            )}
                            {faq.roles.includes("clerk") && (
                              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                Clerk
                              </span>
                            )}
                            {faq.roles.includes("judge") && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <Gavel className="h-3 w-3 mr-1" />
                                Judge
                              </span>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-6">
                    <HelpCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No questions found matching your search criteria.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-2/3">
              <h2 className="text-xl font-bold mb-2">Didn't find what you were looking for?</h2>
              <p className="text-muted-foreground mb-4">
                Try our AI assistant available in the bottom-right corner of your screen when logged in. 
                For more complex inquiries, our support team is ready to help you.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default" className="bg-court-blue hover:bg-court-blue-dark">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/documentation">Browse Documentation</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="h-12 w-12 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-court-blue flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-court-blue-dark text-white/80 py-6 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2023 CourtWise. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/terms" className="text-sm hover:text-white">Terms</Link>
            <Link to="/privacy" className="text-sm hover:text-white">Privacy</Link>
            <Link to="/cookies" className="text-sm hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Faq;
