
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Case } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export function RecentCases() {
  const { user } = useAuth();
  const { cases } = useData();

  if (!user) return null;

  let userCases = [];
  
  if (user.role === 'client') {
    userCases = cases.filter(c => c.clientId === user.id);
  } else if (user.role === 'lawyer') {
    userCases = cases.filter(c => c.lawyerId === user.id);
  } else {
    userCases = cases; // Clerks and judges see all cases
  }

  // Sort by most recently updated
  const recentCases = [...userCases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Cases</CardTitle>
        <CardDescription>Your most recently updated cases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCases.length > 0 ? (
            recentCases.map((caseItem) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} />
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No cases found
            </p>
          )}
        </div>
        {recentCases.length > 0 && (
          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/cases">View All Cases</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CaseCardProps {
  caseItem: Case;
}

function CaseCard({ caseItem }: CaseCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    active: "bg-green-100 text-green-800 hover:bg-green-200",
    scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    in_progress: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    on_hold: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    dismissed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    closed: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  const statusColor = statusColors[caseItem.status] || statusColors.pending;

  return (
    <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium mb-1">{caseItem.title}</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Case #{caseItem.caseNumber}
          </p>
        </div>
        <Badge className={statusColor}>{caseItem.status.replace("_", " ")}</Badge>
      </div>
      <p className="text-sm line-clamp-2 mb-2">{caseItem.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(caseItem.updatedAt), { addSuffix: true })}
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/cases/${caseItem.id}`}>View Case</Link>
        </Button>
      </div>
    </div>
  );
}
