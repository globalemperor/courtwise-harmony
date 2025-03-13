
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentCases } from "@/components/dashboard/RecentCases";
import { UpcomingHearings } from "@/components/dashboard/UpcomingHearings";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { useAuth } from "@/context/AuthContext";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{roleBasedTitle()}</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

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
