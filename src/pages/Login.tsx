
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Gavel, User, UserCog, Scale, PenLine, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { UserRole } from "@/types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useData } from "@/context/DataContext";

// Role icon component with dropdown
const RoleIcon = ({ role, showDropdown = false }: { role: UserRole, showDropdown?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname.includes("signup");
  const path = isSignUp ? "/login/signup?role=" : "/login/";
  
  let Icon, color;
  
  switch (role) {
    case 'client':
      Icon = User;
      color = "text-blue-500";
      break;
    case 'lawyer':
      Icon = Scale;
      color = "text-green-500";
      break;
    case 'clerk':
      Icon = UserCog;
      color = "text-purple-500";
      break;
    case 'judge':
      Icon = Gavel;
      color = "text-red-500";
      break;
    default:
      Icon = User;
      color = "text-blue-500";
  }
  
  if (!showDropdown) {
    return <Icon className={`h-10 w-10 ${color}`} />;
  }
  
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer relative group">
                <Icon className={`h-10 w-10 ${color}`} />
                <div className="absolute -right-1 -bottom-1 bg-gray-100 rounded-full p-0.5 border border-gray-200 shadow-sm group-hover:bg-gray-200 transition-colors">
                  <PenLine className="h-3.5 w-3.5 text-gray-600" />
                </div>
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change role</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DropdownMenuContent align="center">
        <DropdownMenuItem onClick={() => navigate(`${path}client`)}>
          <User className="h-4 w-4 text-blue-500 mr-2" /> Client
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`${path}lawyer`)}>
          <Scale className="h-4 w-4 text-green-500 mr-2" /> Lawyer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`${path}clerk`)}>
          <UserCog className="h-4 w-4 text-purple-500 mr-2" /> Clerk
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`${path}judge`)}>
          <Gavel className="h-4 w-4 text-red-500 mr-2" /> Judge
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getRoleTitle = (role: UserRole) => {
  switch (role) {
    case 'client': return "Client";
    case 'lawyer': return "Lawyer";
    case 'clerk': return "Clerk";
    case 'judge': return "Judge";
  }
};

const TestAccountsAlert = ({ role }: { role: UserRole }) => {
  const { useEmptyData, setUseEmptyData } = useData();
  const [displayMode, setDisplayMode] = useState(useEmptyData ? 'test' : 'demo');
  
  const handleModeChange = (mode: string) => {
    setUseEmptyData(mode === 'test');
    setDisplayMode(mode);
  };
  
  const getTestAccount = () => {
    switch (role) {
      case 'client': return "testclient@example.com";
      case 'lawyer': return "testlawyer1@example.com or testlawyer2@example.com";
      case 'clerk': return "testclerk@example.com";
      case 'judge': return "testjudge@example.com";
      default: return "";
    }
  };
  
  const getDemoAccount = () => {
    switch (role) {
      case 'client': return "client@example.com";
      case 'lawyer': return "lawyer@example.com or jennifer@example.com";
      case 'clerk': return "clerk@example.com";
      case 'judge': return "judge@example.com";
      default: return "";
    }
  };
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold flex items-center">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          Test Accounts
        </h3>
        <div className="flex space-x-2 text-sm">
          <button 
            className={`px-2 py-1 rounded ${displayMode === 'test' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleModeChange('test')}
          >
            Test Mode
          </button>
          <button 
            className={`px-2 py-1 rounded ${displayMode === 'demo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleModeChange('demo')}
          >
            Demo Mode
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Email:</span> {displayMode === 'test' ? getTestAccount() : getDemoAccount()}
        <br />
        <span className="font-medium">Password:</span> password
      </p>
    </div>
  );
};

const Login = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);
  const location = useLocation();
  const { role } = useParams<{ role?: string }>();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") as UserRole || "client";
  
  const isSignUp = location.pathname.includes("signup");

  // Ensure role is a valid UserRole
  const validRole = (role as UserRole) || defaultRole;

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-court-gray to-court-blue/10 p-4">
      {/* Left side - branding (hidden on mobile) */}
      <div className={`hidden md:flex flex-col items-center md:items-start space-y-8 md:w-1/2 p-8 transition-all duration-700 ease-in-out ${showAnimation ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-court-blue flex items-center justify-center">
            <Gavel className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-court-blue">CourtWise</h1>
            <p className="text-muted-foreground">Court Case Management System</p>
          </div>
        </div>
        
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-3 text-court-blue-dark">Justice Made Efficient</h2>
          <p className="text-muted-foreground mb-6">
            CourtWise helps streamline court case management, connecting clients, lawyers, 
            clerks, and judges in one seamless platform.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-court-blue hover:underline font-medium text-sm flex items-center">
                <Info className="h-4 w-4 mr-1" /> How to use CourtWise
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Getting Started with CourtWise</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="border-b pb-3">
                      <h3 className="text-lg font-semibold mb-2">For Clients</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Sign up or log in as a client</li>
                        <li>Browse available lawyers and send case requests</li>
                        <li>Once connected with a lawyer, track your case progress</li>
                        <li>Communicate directly with your lawyer through the messaging system</li>
                        <li>Receive notifications about upcoming hearings and case updates</li>
                      </ol>
                    </div>
                    
                    <div className="border-b pb-3">
                      <h3 className="text-lg font-semibold mb-2">For Lawyers</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Sign up or log in as a lawyer</li>
                        <li>View and accept client case requests</li>
                        <li>File cases through the system</li>
                        <li>Manage all your clients and cases from your dashboard</li>
                        <li>Communicate with clients, clerks, and indirectly with judges</li>
                      </ol>
                    </div>
                    
                    <div className="border-b pb-3">
                      <h3 className="text-lg font-semibold mb-2">For Clerks</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Sign up or log in as a court clerk</li>
                        <li>Process new case filings</li>
                        <li>Coordinate with lawyers and judges</li>
                        <li>Manage court schedules and hearing assignments</li>
                        <li>Maintain court records and documentation</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">For Judges</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Sign up or log in as a judge</li>
                        <li>View your docket of assigned cases</li>
                        <li>Schedule and reschedule hearings when necessary</li>
                        <li>Review case details and submitted evidence</li>
                        <li>Issue judgments and rulings directly through the platform</li>
                      </ol>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Got it</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Right side - auth form */}
      <div className={`md:w-1/2 w-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${showAnimation ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        {/* Mobile branding - visible only on small screens */}
        <div className="md:hidden flex flex-col items-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-court-blue flex items-center justify-center">
              <Gavel className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">CourtWise</h1>
          <p className="text-muted-foreground">Court Case Management System</p>
        </div>
        
        {/* Test accounts info */}
        <TestAccountsAlert role={validRole} />
        
        {isSignUp ? (
          <SignUpForm defaultRole={validRole} />
        ) : (
          <SignInForm role={validRole} />
        )}
      </div>
    </div>
  );
};

export default Login;
