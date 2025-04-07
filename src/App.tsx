
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetails from "./pages/CaseDetails";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { useEffect } from "react";
import setupTestEnvironment from "./utils/initialSetup";
import { ScrollToTop } from "./components/ScrollToTop";
import NotificationService from "./services/NotificationService";
import { useData } from "./context/DataContext";

// New page imports
import Messages from "./pages/Messages";
import Hearings from "./pages/Hearings";
import Clients from "./pages/Clients";
import CaseRequests from "./pages/CaseRequests";
import FindLawyer from "./pages/FindLawyer";
import Docket from "./pages/Docket";
import Schedule from "./pages/Schedule";
import CaseSummary from "./pages/CaseSummary";
import NewCases from "./pages/NewCases";
import FileCasePage from "./pages/FileCasePage";
import ProfileEdit from "./pages/ProfileEdit";
import { useAuth } from "./context/AuthContext";

// Import the new pages for quick links
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import HelpCenter from "./pages/HelpCenter";
import Documentation from "./pages/Documentation";
import UserGuides from "./pages/UserGuides";
import Faq from "./pages/Faq";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import GdprCompliance from "./pages/GdprCompliance";

// Create a protected route component for lawyer-only routes
const LawyerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'lawyer') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

// Run the initial setup once on app load
setupTestEnvironment();

// Component to handle notifications
const NotificationManager = () => {
  const { hearings, cases } = useData();
  
  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    notificationService.setupHearingReminders(hearings, cases);
    
    // Clean up on unmount
    return () => {
      // Nothing to clean up here since the service handles its own cleanup
    };
  }, [hearings, cases]);
  
  return null;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <NotificationManager />
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/login/:role" element={<Login />} />
              <Route path="/login/signup" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Profile Management */}
                <Route path="profile/edit" element={<ProfileEdit />} />
                
                {/* Case Management */}
                <Route path="cases" element={<Cases />} />
                <Route path="cases/:id" element={<CaseDetails />} />
                <Route path="file-case" element={
                  <LawyerRoute>
                    <FileCasePage />
                  </LawyerRoute>
                } />
                
                {/* Communication */}
                <Route path="messages" element={<Messages />} />
                
                {/* Scheduling */}
                <Route path="hearings" element={<Hearings />} />
                <Route path="schedule" element={<Schedule />} />
                
                {/* Client Management */}
                <Route path="clients" element={<Clients />} />
                <Route path="find-lawyer" element={<FindLawyer />} />
                
                {/* Lawyer Specific */}
                <Route path="case-requests" element={<CaseRequests />} />
                
                {/* Judge Specific */}
                <Route path="docket" element={<Docket />} />
                <Route path="case-summary" element={<CaseSummary />} />
                
                {/* Clerk Specific */}
                <Route path="new-cases" element={<NewCases />} />
              </Route>
              
              {/* Quick Links pages */}
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              
              {/* Help pages */}
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/guides" element={<UserGuides />} />
              <Route path="/faq" element={<Faq />} />
              
              {/* Legal pages */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/gdpr" element={<GdprCompliance />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
