
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Calendar, ClipboardCheck, Clock, FileText } from "lucide-react";

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Active Cases"
        value={activeCases}
        description="Currently active cases"
        icon={FileText}
        color="bg-blue-100 text-blue-700"
      />
      <StatsCard
        title="Total Cases"
        value={totalCases}
        description="All-time cases"
        icon={ClipboardCheck}
        color="bg-green-100 text-green-700"
      />
      <StatsCard
        title="Upcoming Hearings"
        value={upcomingHearings}
        description="Scheduled in next 30 days"
        icon={Calendar}
        color="bg-amber-100 text-amber-700"
      />
      <StatsCard
        title="Pending Actions"
        value={pendingActions}
        description="Require your attention"
        icon={Clock}
        color="bg-red-100 text-red-700"
      />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: string;
}

function StatsCard({ title, value, description, icon: Icon, color }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
