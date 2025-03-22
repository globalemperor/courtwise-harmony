import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Calendar, 
  FileText, 
  Scale, 
  Gavel, 
  UserCog, 
  Briefcase, 
  Users, 
  CheckSquare, 
  AlertCircle,
  FilePlus,
  MessageSquare,
  ClipboardCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <FileText className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800">Need Legal Help?</AlertTitle>
              <AlertDescription className="text-blue-700">
                Find a qualified lawyer to represent you in court.{' '}
                <Link to="/find-lawyer" className="font-medium underline">Browse lawyers now</Link>.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <Link to="/find-lawyer" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Scale className="h-7 w-7 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Find a Lawyer</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-4">
                  <Link to="/cases" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Briefcase className="h-7 w-7 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">My Cases</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
                <CardContent className="p-4">
                  <Link to="/hearings" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Calendar className="h-7 w-7 text-violet-600" />
                    <span className="text-sm font-medium text-violet-800">Hearings</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <Link to="/messages" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <MessageSquare className="h-7 w-7 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Messages</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      case 'lawyer':
        return (
          <>
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Case Requests Available</AlertTitle>
              <AlertDescription className="text-green-700">
                You have pending case requests from potential clients.{' '}
                <Link to="/case-requests" className="font-medium underline">Review them now</Link>.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-4">
                  <Link to="/file-case" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <FilePlus className="h-7 w-7 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">File New Case</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <Link to="/clients" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Users className="h-7 w-7 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">My Clients</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <Link to="/case-requests" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <CheckSquare className="h-7 w-7 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Case Requests</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
                <CardContent className="p-4">
                  <Link to="/schedule" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Calendar className="h-7 w-7 text-violet-600" />
                    <span className="text-sm font-medium text-violet-800">My Schedule</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
                <CardContent className="p-4">
                  <Link to="/cases" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Briefcase className="h-7 w-7 text-rose-600" />
                    <span className="text-sm font-medium text-rose-800">Active Cases</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardContent className="p-4">
                  <Link to="/messages" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <MessageSquare className="h-7 w-7 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-800">Messages</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      case 'clerk':
        return (
          <>
            <Alert className="mb-4 bg-purple-50 border-purple-200">
              <UserCog className="h-5 w-5 text-purple-600" />
              <AlertTitle className="text-purple-800">New Cases Require Processing</AlertTitle>
              <AlertDescription className="text-purple-700">
                There are new cases waiting to be processed and assigned to judges.{' '}
                <Link to="/new-cases" className="font-medium underline">Process new cases</Link>.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <Link to="/new-cases" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <FileText className="h-7 w-7 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Process New Cases</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
                <CardContent className="p-4">
                  <Link to="/hearings" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Calendar className="h-7 w-7 text-rose-600" />
                    <span className="text-sm font-medium text-rose-800">Schedule Hearings</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <Link to="/messages" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <MessageSquare className="h-7 w-7 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Communications</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <Link to="/cases" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Briefcase className="h-7 w-7 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">All Cases</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      case 'judge':
        return (
          <>
            <Alert className="mb-4 bg-red-50 border-red-200">
              <Gavel className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800">Today's Docket</AlertTitle>
              <AlertDescription className="text-red-700">
                You have hearings scheduled today that require your attention.{' '}
                <Link to="/docket" className="font-medium underline">Review your docket</Link>.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-4">
                  <Link to="/docket" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Gavel className="h-7 w-7 text-red-600" />
                    <span className="text-sm font-medium text-red-800">My Docket</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <Link to="/hearings" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <Calendar className="h-7 w-7 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Upcoming Hearings</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-4">
                  <Link to="/case-summary" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <ClipboardCheck className="h-7 w-7 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Issue Verdicts</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <Link to="/messages" className="flex flex-col items-center text-center gap-2 h-full justify-center py-2">
                    <MessageSquare className="h-7 w-7 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Communications</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{roleBasedTitle()}</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      {/* Role-specific content */}
      {renderRoleSpecificContent()}

      <DashboardStats />
    </div>
  );
};

export default Dashboard;
