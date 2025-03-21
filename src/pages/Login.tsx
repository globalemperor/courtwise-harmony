
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Gavel } from "lucide-react";
import { useEffect, useState } from "react";

// Stats display component
const UserStats = () => {
  // Mock stats for demo
  const stats = {
    clients: 1245,
    lawyers: 678,
    judges: 123,
    clerks: 356,
    totalCases: 4892
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md max-w-sm w-full">
      <h3 className="text-lg font-semibold mb-3 text-court-blue">CourtWise Statistics</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="text-2xl font-bold text-blue-500">{stats.clients.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Clients</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-2xl font-bold text-green-500">{stats.lawyers.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Lawyers</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded">
          <div className="text-2xl font-bold text-purple-500">{stats.clerks.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Clerks</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="text-2xl font-bold text-red-500">{stats.judges.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Judges</div>
        </div>
      </div>
      <div className="text-center mt-3 p-2 bg-court-blue/10 rounded">
        <div className="text-2xl font-bold text-court-blue">{stats.totalCases.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">Total Cases Managed</div>
      </div>
    </div>
  );
};

const Login = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);
  const location = useLocation();

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
      {/* Left side - branding and stats (hidden on mobile) */}
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
          
          <UserStats />
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
        
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
