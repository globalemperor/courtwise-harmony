
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, FileText, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const CaseStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-500">Scheduled</Badge>;
    case 'in_progress':
      return <Badge className="bg-yellow-500">In Progress</Badge>;
    case 'on_hold':
      return <Badge className="bg-orange-500">On Hold</Badge>;
    case 'dismissed':
      return <Badge className="bg-red-500">Dismissed</Badge>;
    case 'closed':
      return <Badge className="bg-gray-500">Closed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const Docket = () => {
  const { cases, hearings } = useData();
  
  // Group cases by status
  const activeCases = cases.filter(c => ['active', 'in_progress'].includes(c.status));
  const scheduledCases = cases.filter(c => c.status === 'scheduled');
  const closedCases = cases.filter(c => ['dismissed', 'closed'].includes(c.status));
  
  // Get today's hearings
  const today = new Date().toISOString().split('T')[0];
  const todaysHearings = hearings.filter(h => h.date === today);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Docket</h1>
        <p className="text-muted-foreground">Manage your court schedule and case assignments</p>
      </div>

      {todaysHearings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Hearings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysHearings.map(hearing => {
                const relatedCase = cases.find(c => c.id === hearing.caseId);
                
                return (
                  <div key={hearing.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                    <div className="flex flex-col">
                      <div className="font-medium">{relatedCase?.title || `Case #${hearing.caseId}`}</div>
                      <div className="text-sm text-muted-foreground">{hearing.description}</div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs">{hearing.time}</span>
                        <MapPin className="h-3 w-3 mx-1 text-muted-foreground" />
                        <span className="text-xs">{hearing.location}</span>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/cases/${hearing.caseId}`}>View Case</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="active">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="active">Active Cases ({activeCases.length})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({scheduledCases.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedCases.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          {activeCases.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No active cases</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeCases.map(caseItem => (
                <Card key={caseItem.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                      <CaseStatusBadge status={caseItem.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {caseItem.caseNumber}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm mb-4">{caseItem.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Filed: {caseItem.filedDate ? formatDistanceToNow(new Date(caseItem.filedDate), { addSuffix: true }) : 'Unknown'}</span>
                      </div>
                      <div className="flex items-center">
                        <Gavel className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{caseItem.judgeName || 'Not assigned'}</span>
                      </div>
                      {caseItem.nextHearingDate && (
                        <div className="flex items-center col-span-2">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Next hearing: {formatDistanceToNow(new Date(caseItem.nextHearingDate), { addSuffix: true })}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" asChild>
                        <Link to={`/cases/${caseItem.id}`}>Case Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-4">
          {scheduledCases.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No scheduled cases</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {scheduledCases.map(caseItem => (
                <Card key={caseItem.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{caseItem.title}</CardTitle>
                      <CaseStatusBadge status={caseItem.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{caseItem.description}</p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link to={`/cases/${caseItem.id}`}>View</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="closed" className="mt-4">
          {closedCases.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No closed cases</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {closedCases.map(caseItem => (
                <Card key={caseItem.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{caseItem.title}</CardTitle>
                      <CaseStatusBadge status={caseItem.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{caseItem.description}</p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link to={`/cases/${caseItem.id}`}>View</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Docket;
