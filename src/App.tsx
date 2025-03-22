
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
import FileCasePage from "./pages/FileCasePage"; // Add the new page import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Navigate to="/login/client" />} />
              <Route path="/login/:role" element={<Login />} />
              <Route path="/login/signup" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Case Management */}
                <Route path="cases" element={<Cases />} />
                <Route path="cases/:id" element={<CaseDetails />} />
                <Route path="file-case" element={<FileCasePage />} /> {/* Add the new route */}
                
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
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
