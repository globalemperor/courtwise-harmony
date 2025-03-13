
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Gavel, Calendar, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

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

const CaseSummary = () => {
  const { cases, getUserById } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Case Summary</h1>
        <p className="text-muted-foreground">View summaries of all court cases</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All Cases</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4">
            {cases.map(caseItem => {
              const client = getUserById(caseItem.clientId);
              const lawyer = caseItem.lawyerId ? getUserById(caseItem.lawyerId) : null;
              
              return (
                <Card key={caseItem.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {caseItem.caseNumber}
                        </p>
                      </div>
                      <CaseStatusBadge status={caseItem.status} />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm mb-4">{caseItem.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Client</h3>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={client?.avatarUrl} />
                            <AvatarFallback>{client?.name.charAt(0) || 'C'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{client?.name || 'Unknown Client'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Attorney</h3>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={lawyer?.avatarUrl} />
                            <AvatarFallback>{lawyer?.name.charAt(0) || 'A'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{lawyer?.name || 'Not Assigned'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        <span>Filed: {caseItem.filedDate ? format(parseISO(caseItem.filedDate), 'PP') : 'Unknown'}</span>
                      </div>
                      <div className="flex items-center">
                        <Gavel className="h-3 w-3 mr-1" />
                        <span>Judge: {caseItem.judgeName || 'Not assigned'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Next hearing: {caseItem.nextHearingDate ? format(parseISO(caseItem.nextHearingDate), 'PP') : 'Not scheduled'}</span>
                      </div>
                      <div className="flex items-center">
                        <FileCheck className="h-3 w-3 mr-1" />
                        <span>Last updated: {format(parseISO(caseItem.updatedAt), 'PP')}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button size="sm" asChild>
                        <Link to={`/cases/${caseItem.id}`}>Full Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>Active cases filter will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>Scheduled cases filter will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="closed" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>Closed cases filter will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseSummary;
