
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentCases } from "@/components/dashboard/RecentCases";
import { UpcomingHearings } from "@/components/dashboard/UpcomingHearings";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, FileText, Scale, Gavel, UserCog, Briefcase, Users, CheckSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const roleBasedTitle = () => {
    switch (user.role) {
      case 'client':
        return "Client Dashboard";
      case 'lawyer':
        return "Lawyer Dashboard";
      case 'clerk':
        return "Court Clerk Dashboard";
      case 'judge':
        return "Judge Dashboard";
      default:
        return "Dashboard";
    }
  };

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'client':
        return (
          <>
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <FileText className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800">Your Cases</AlertTitle>
              <AlertDescription className="text-blue-700">
                Track your ongoing cases and stay informed about updates. Need legal help?{' '}
                <Link to="/find-lawyer" className="font-medium underline">Find a lawyer</Link>.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/find-lawyer">
                  <Scale className="h-8 w-8 text-green-500" />
                  <span>Find a Lawyer</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/cases">
                  <Briefcase className="h-8 w-8 text-blue-500" />
                  <span>View My Cases</span>
                </Link>
              </Button>
            </div>
          </>
        );
      
      case 'lawyer':
        return (
          <>
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Case Requests</AlertTitle>
              <AlertDescription className="text-green-700">
                You have new case requests waiting for your response.{' '}
                <Link to="/case-requests" className="font-medium underline">Review them now</Link>.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/clients">
                  <Users className="h-8 w-8 text-indigo-500" />
                  <span>My Clients</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/case-requests">
                  <CheckSquare className="h-8 w-8 text-amber-500" />
                  <span>Case Requests</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/schedule">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <span>My Schedule</span>
                </Link>
              </Button>
            </div>
          </>
        );
      
      case 'clerk':
        return (
          <>
            <Alert className="mb-6 bg-purple-50 border-purple-200">
              <UserCog className="h-5 w-5 text-purple-600" />
              <AlertTitle className="text-purple-800">Court Administration</AlertTitle>
              <AlertDescription className="text-purple-700">
                There are new cases that need to be processed and assigned to judges.{' '}
                <Link to="/new-cases" className="font-medium underline">Process new cases</Link>.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/new-cases">
                  <FileText className="h-8 w-8 text-purple-500" />
                  <span>New Cases</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/hearings">
                  <Calendar className="h-8 w-8 text-red-500" />
                  <span>Hearing Schedule</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/cases">
                  <Briefcase className="h-8 w-8 text-blue-500" />
                  <span>All Cases</span>
                </Link>
              </Button>
            </div>
          </>
        );
      
      case 'judge':
        return (
          <>
            <Alert className="mb-6 bg-red-50 border-red-200">
              <Gavel className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800">Your Docket</AlertTitle>
              <AlertDescription className="text-red-700">
                You have upcoming hearings that require your attention.{' '}
                <Link to="/docket" className="font-medium underline">View your docket</Link>.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/docket">
                  <Gavel className="h-8 w-8 text-red-500" />
                  <span>My Docket</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/hearings">
                  <Calendar className="h-8 w-8 text-amber-500" />
                  <span>Hearings</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col p-4 justify-between items-center gap-2" asChild>
                <Link to="/case-summary">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <span>Case Summaries</span>
                </Link>
              </Button>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{roleBasedTitle()}</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      {/* Role-specific content */}
      {renderRoleSpecificContent()}

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentCases />
        <UpcomingHearings />
        <RecentMessages />
      </div>
    </div>
  );
};

export default Dashboard;
