
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const HearingStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'scheduled':
      return <Badge className="bg-blue-500">Scheduled</Badge>;
    case 'completed':
      return <Badge className="bg-green-500">Completed</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const Hearings = () => {
  const { user } = useAuth();
  const { hearings, cases, getCaseById } = useData();
  
  if (!user) return null;
  
  // Filter hearings based on user role
  const getUserHearings = () => {
    switch (user.role) {
      case 'client':
        // Get all cases where the user is a client
        const clientCases = cases.filter(c => c.clientId === user.id);
        return hearings.filter(h => clientCases.some(c => c.id === h.caseId));
      case 'lawyer':
        // Get all cases where the user is a lawyer
        const lawyerCases = cases.filter(c => c.lawyerId === user.id);
        return hearings.filter(h => lawyerCases.some(c => c.id === h.caseId));
      case 'judge':
      case 'clerk':
        // Judges and clerks can see all hearings
        return hearings;
      default:
        return [];
    }
  };

  const userHearings = getUserHearings().sort((a, b) => {
    // Sort by date, then by time
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hearings</h1>
        <p className="text-muted-foreground">View and manage court hearings</p>
      </div>

      <div className="grid gap-4">
        {userHearings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hearings scheduled</p>
            </CardContent>
          </Card>
        ) : (
          userHearings.map(hearing => {
            const relatedCase = getCaseById(hearing.caseId);
            
            return (
              <Card key={hearing.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {relatedCase?.title || `Case #${hearing.caseId}`}
                    </CardTitle>
                    <HearingStatusBadge status={hearing.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {relatedCase?.caseNumber || 'Unknown Case'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{hearing.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{hearing.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{hearing.location}</span>
                    </div>
                    <p className="text-sm mt-2">{hearing.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Hearings;
