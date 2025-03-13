
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Hearing } from "@/types";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function UpcomingHearings() {
  const { user } = useAuth();
  const { cases, hearings, getCaseById } = useData();

  if (!user) return null;

  let userCases = [];
  
  if (user.role === 'client') {
    userCases = cases.filter(c => c.clientId === user.id);
  } else if (user.role === 'lawyer') {
    userCases = cases.filter(c => c.lawyerId === user.id);
  } else {
    userCases = cases; // Clerks and judges see all cases
  }

  const userHearings = hearings
    .filter(h => 
      userCases.some(c => c.id === h.caseId) && 
      h.status === "scheduled" && 
      new Date(h.date) > new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Hearings</CardTitle>
        <CardDescription>Your next scheduled court appearances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userHearings.length > 0 ? (
            userHearings.map((hearing) => (
              <HearingCard key={hearing.id} hearing={hearing} getCaseById={getCaseById} />
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No upcoming hearings scheduled
            </p>
          )}
        </div>
        {userHearings.length > 0 && (
          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/hearings">View All Hearings</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface HearingCardProps {
  hearing: Hearing;
  getCaseById: (id: string) => any;
}

function HearingCard({ hearing, getCaseById }: HearingCardProps) {
  const caseItem = getCaseById(hearing.caseId);
  
  if (!caseItem) return null;
  
  return (
    <div className="border rounded-lg p-3 hover:bg-accent transition-colors">
      <h4 className="font-medium text-sm mb-1">
        {caseItem.title || `Case #${caseItem.caseNumber}`}
      </h4>
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{format(new Date(hearing.date), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>{hearing.time}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{hearing.location}</span>
        </div>
      </div>
    </div>
  );
}
