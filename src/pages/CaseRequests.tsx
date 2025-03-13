
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock case requests data
const MOCK_CASE_REQUESTS = [
  {
    id: "1",
    clientName: "John Smith",
    clientAvatar: "https://ui-avatars.com/api/?name=John+Smith&background=random",
    caseTitle: "Property Dispute",
    description: "Need legal assistance with a property boundary dispute with my neighbor.",
    requestDate: "2023-06-18T12:30:00Z",
    status: "pending"
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    clientAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    caseTitle: "Divorce Filing",
    description: "Looking for representation in my upcoming divorce proceedings.",
    requestDate: "2023-06-20T09:15:00Z",
    status: "pending"
  },
  {
    id: "3",
    clientName: "Michael Williams",
    clientAvatar: "https://ui-avatars.com/api/?name=Michael+Williams&background=random",
    caseTitle: "Contract Review",
    description: "Need a lawyer to review a business contract before signing.",
    requestDate: "2023-06-17T15:45:00Z",
    status: "pending"
  }
];

const CaseRequests = () => {
  const [caseRequests, setCaseRequests] = useState(MOCK_CASE_REQUESTS);
  const { toast } = useToast();

  const handleAccept = (id: string) => {
    setCaseRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: "accepted" } : request
      )
    );
    
    toast({
      title: "Case request accepted",
      description: "The case has been added to your caseload.",
    });
  };

  const handleReject = (id: string) => {
    setCaseRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: "rejected" } : request
      )
    );
    
    toast({
      title: "Case request rejected",
      description: "The case request has been declined.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Case Requests</h1>
        <p className="text-muted-foreground">Review and respond to new case requests</p>
      </div>

      <div className="grid gap-4">
        {caseRequests.filter(request => request.status === "pending").length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No pending case requests</p>
            </CardContent>
          </Card>
        ) : (
          caseRequests
            .filter(request => request.status === "pending")
            .map(request => (
              <Card key={request.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={request.clientAvatar} />
                        <AvatarFallback>{request.clientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{request.caseTitle}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          From: {request.clientName}
                        </div>
                      </div>
                    </div>
                    <Badge>New Request</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm mb-2">{request.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Requested on {format(new Date(request.requestDate), "PPP 'at' p")}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" /> Decline
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleAccept(request.id)}
                  >
                    <Check className="h-4 w-4 mr-1" /> Accept
                  </Button>
                </CardFooter>
              </Card>
            ))
        )}
      </div>

      {/* Accepted/Rejected Requests */}
      {caseRequests.some(request => request.status !== "pending") && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Past Requests</h2>
          <div className="grid gap-4">
            {caseRequests
              .filter(request => request.status !== "pending")
              .map(request => (
                <Card key={request.id} className={
                  request.status === "accepted" 
                    ? "border-l-4 border-l-green-500" 
                    : "border-l-4 border-l-red-500"
                }>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{request.caseTitle}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          From: {request.clientName}
                        </div>
                      </div>
                      <Badge variant={request.status === "accepted" ? "default" : "destructive"}>
                        {request.status === "accepted" ? "Accepted" : "Rejected"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {request.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseRequests;
