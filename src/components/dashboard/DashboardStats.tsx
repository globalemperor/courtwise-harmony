
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export function DashboardStats() {
  const { user } = useAuth();
  const { cases, hearings } = useData();

  if (!user) return null;

  let userCases = [];
  
  if (user.role === 'client') {
    userCases = cases.filter(c => c.clientId === user.id);
  } else if (user.role === 'lawyer') {
    userCases = cases.filter(c => c.lawyerId === user.id);
  } else {
    userCases = cases; // Clerks and judges see all cases
  }

  const activeCases = userCases.filter(
    (c) => c.status !== "closed" && c.status !== "dismissed"
  ).length;
  
  const totalCases = userCases.length;
  
  const upcomingHearings = hearings.filter(
    h => userCases.some(c => c.id === h.caseId) && 
    h.status === "scheduled" && 
    new Date(h.date) > new Date()
  ).length;
  
  const pendingActions = Math.floor(Math.random() * 5); // Mock data

  // Data for doughnut chart
  const chartData = {
    labels: ['Active Cases', 'Closed Cases', 'Upcoming Hearings', 'Pending Actions'],
    datasets: [
      {
        data: [activeCases, totalCases - activeCases, upcomingHearings, pendingActions],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(16, 185, 129, 0.8)', // green
          'rgba(245, 158, 11, 0.8)', // amber
          'rgba(239, 68, 68, 0.8)',  // red
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
    cutout: '65%',
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Case Summary</CardTitle>
            <CardDescription>Overview of your current workload</CardDescription>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48">
            <Doughnut data={chartData} options={options} />
          </div>
          <div className="flex flex-col justify-center space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                <span>Active Cases</span>
              </div>
              <span className="font-bold">{activeCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                <span>Closed Cases</span>
              </div>
              <span className="font-bold">{totalCases - activeCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
                <span>Upcoming Hearings</span>
              </div>
              <span className="font-bold">{upcomingHearings}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                <span>Pending Actions</span>
              </div>
              <span className="font-bold">{pendingActions}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
