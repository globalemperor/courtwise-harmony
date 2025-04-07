
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { FileText, Users, UserPlus } from "lucide-react";

// Mock case requests data structure
interface CaseRequest {
  id: string;
  clientId: string;
  lawyerId: string;
  caseTitle: string;
  description: string;
  status: "pending" | "accepted" | "rejected";
  type: "new_case" | "defense";
  createdAt: string;
}

const CaseRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { users, cases } = useData();
  const [selectedRequest, setSelectedRequest] = useState<CaseRequest | null>(null);
  
  // Mock case requests - would come from your DataContext in a real app
  const [caseRequests, setCaseRequests] = useState<CaseRequest[]>([
    {
      id: "req1",
      clientId: "client1",
      lawyerId: "lawyer1",
      caseTitle: "Personal Injury Claim",
      description: "Seeking representation for a personal injury case following a car accident.",
      status: "pending",
      type: "new_case",
      createdAt: "2023-08-18T09:30:00Z"
    },
    {
      id: "req2",
      clientId: "client2",
      lawyerId: "lawyer1",
      caseTitle: "Contract Dispute",
      description: "Need help with a business contract dispute with a supplier.",
      status: "pending",
      type: "new_case",
      createdAt: "2023-08-15T14:45:00Z"
    },
    {
      id: "req3",
      clientId: "client1",
      lawyerId: "lawyer1",
      caseTitle: "Defense: Smith vs Jones",
      description: "I'm the defendant in a property dispute case and need representation.",
      status: "pending",
      type: "defense",
      createdAt: "2023-08-10T11:20:00Z"
    }
  ]);
  
  // Helper to get client data by ID
  const getClientById = (clientId: string): User | undefined => {
    return users.find(u => u.id === clientId);
  };
  
  // Handle accepting a case request
  const handleAccept = (requestId: string) => {
    setCaseRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "accepted" } : req
      )
    );
    
    toast({
      title: "Case Request Accepted",
      description: "You have accepted the case request. It has been added to your active cases.",
    });
  };
  
  // Handle rejecting a case request
  const handleReject = (requestId: string) => {
    setCaseRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "rejected" } : req
      )
    );
    
    toast({
      title: "Case Request Rejected",
      description: "You have rejected the case request.",
    });
  };
  
  // Filter requests by type and render
  const newCaseRequests = caseRequests.filter(req => req.type === "new_case" && req.status === "pending");
  const defenseRequests = caseRequests.filter(req => req.type === "defense" && req.status === "pending");
  const acceptedRequests = caseRequests.filter(req => req.status === "accepted");
  const rejectedRequests = caseRequests.filter(req => req.status === "rejected");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Case Requests</h1>
        <p className="text-muted-foreground">Manage incoming client requests for legal representation</p>
      </div>
      
      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">
            New Cases{" "}
            {newCaseRequests.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {newCaseRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="defense">
            Defense Requests{" "}
            {defenseRequests.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {defenseRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="mt-6">
          {newCaseRequests.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {newCaseRequests.map(request => {
                const client = getClientById(request.clientId);
                
                return (
                  <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle>{request.caseTitle}</CardTitle>
                        <Badge>New Case</Badge>
                      </div>
                      <CardDescription>
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={client?.avatarUrl} alt={client?.name} />
                          <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client?.name}</p>
                          <p className="text-sm text-muted-foreground">{client?.email}</p>
                        </div>
                      </div>
                      <p className="text-sm line-clamp-3">{request.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedRequest(request)}>View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>{request.caseTitle}</DialogTitle>
                            <DialogDescription>
                              Case request from {client?.name} on {new Date(request.createdAt).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <ScrollArea className="h-[200px] rounded-md border p-4">
                              <p>{request.description}</p>
                            </ScrollArea>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={client?.avatarUrl} alt={client?.name} />
                                <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{client?.name}</p>
                                <p className="text-sm text-muted-foreground">{client?.email}</p>
                                {client?.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="space-x-2">
                            <Button variant="outline" onClick={() => handleReject(request.id)}>
                              Reject
                            </Button>
                            <Button onClick={() => handleAccept(request.id)}>
                              Accept Case
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleReject(request.id)}>
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleAccept(request.id)}>
                          Accept
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-10">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No new case requests</h3>
              <p className="text-muted-foreground">
                You don't have any pending requests for new cases at the moment.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="defense" className="mt-6">
          {defenseRequests.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {defenseRequests.map(request => {
                const client = getClientById(request.clientId);
                
                return (
                  <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle>{request.caseTitle}</CardTitle>
                        <Badge variant="secondary">Defense</Badge>
                      </div>
                      <CardDescription>
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={client?.avatarUrl} alt={client?.name} />
                          <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client?.name}</p>
                          <p className="text-sm text-muted-foreground">{client?.email}</p>
                        </div>
                      </div>
                      <p className="text-sm line-clamp-3">{request.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedRequest(request)}>View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>{request.caseTitle}</DialogTitle>
                            <DialogDescription>
                              Defense request from {client?.name} on {new Date(request.createdAt).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <ScrollArea className="h-[200px] rounded-md border p-4">
                              <p>{request.description}</p>
                            </ScrollArea>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={client?.avatarUrl} alt={client?.name} />
                                <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{client?.name}</p>
                                <p className="text-sm text-muted-foreground">{client?.email}</p>
                                {client?.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="space-x-2">
                            <Button variant="outline" onClick={() => handleReject(request.id)}>
                              Reject
                            </Button>
                            <Button onClick={() => handleAccept(request.id)}>
                              Accept Case
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleReject(request.id)}>
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleAccept(request.id)}>
                          Accept
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-10">
              <Users className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No defense requests</h3>
              <p className="text-muted-foreground">
                You don't have any pending requests for defense representation at the moment.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="accepted" className="mt-6">
          {acceptedRequests.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {acceptedRequests.map(request => {
                const client = getClientById(request.clientId);
                
                return (
                  <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle>{request.caseTitle}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>
                      </div>
                      <CardDescription>
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={client?.avatarUrl} alt={client?.name} />
                          <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client?.name}</p>
                          <p className="text-sm text-muted-foreground">{client?.email}</p>
                        </div>
                      </div>
                      <p className="text-sm line-clamp-3">{request.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button asChild className="w-full">
                        <a href="/cases">View in Active Cases</a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-10">
              <UserPlus className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No accepted requests</h3>
              <p className="text-muted-foreground">
                You haven't accepted any case requests yet.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {rejectedRequests.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {rejectedRequests.map(request => {
                const client = getClientById(request.clientId);
                
                return (
                  <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow opacity-70">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle>{request.caseTitle}</CardTitle>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
                      </div>
                      <CardDescription>
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={client?.avatarUrl} alt={client?.name} />
                          <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client?.name}</p>
                          <p className="text-sm text-muted-foreground">{client?.email}</p>
                        </div>
                      </div>
                      <p className="text-sm line-clamp-3">{request.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-10">
              <h3 className="text-lg font-medium">No rejected requests</h3>
              <p className="text-muted-foreground">
                You haven't rejected any case requests.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseRequests;
