import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Check, X, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CaseRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  lawyerId?: string;
  lawyerName?: string;
  caseTitle: string;
  description: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const INITIAL_CASE_REQUESTS: CaseRequest[] = [
  {
    id: "1",
    clientId: "5",
    clientName: "Michael Williams",
    clientAvatar: "https://ui-avatars.com/api/?name=Michael+Williams&background=random",
    caseTitle: "Property Dispute",
    description: "Need legal assistance with a property boundary dispute with my neighbor.",
    requestDate: "2023-06-18T12:30:00Z",
    status: "pending"
  },
  {
    id: "2",
    clientId: "6",
    clientName: "Sarah Johnson",
    clientAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    caseTitle: "Divorce Filing",
    description: "Looking for representation in my upcoming divorce proceedings.",
    requestDate: "2023-06-20T09:15:00Z",
    status: "pending"
  }
];

const CaseRequests = () => {
  const { user } = useAuth();
  const { acceptCaseRequest, rejectCaseRequest, getUsersByRole, getUserById, cases } = useData();
  const [caseRequests, setCaseRequests] = useState<CaseRequest[]>([]);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseDescription, setNewCaseDescription] = useState("");
  const [selectedLawyerId, setSelectedLawyerId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedRequests = localStorage.getItem('courtwise_caseRequests');
    if (storedRequests) {
      try {
        const parsedRequests = JSON.parse(storedRequests);
        if (Array.isArray(parsedRequests)) {
          setCaseRequests(parsedRequests);
        } else {
          setCaseRequests([]);
          localStorage.setItem('courtwise_caseRequests', JSON.stringify([]));
        }
      } catch (error) {
        console.error("Error parsing case requests:", error);
        setCaseRequests([]);
        localStorage.setItem('courtwise_caseRequests', JSON.stringify([]));
      }
    } else {
      setCaseRequests([]);
      localStorage.setItem('courtwise_caseRequests', JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('courtwise_caseRequests', JSON.stringify(caseRequests));
  }, [caseRequests]);

  const handleAccept = async (id: string) => {
    try {
      await acceptCaseRequest(id);
      
      setCaseRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status: "accepted" } : request
        )
      );
      
      toast({
        title: "Case request accepted",
        description: "The case has been added to your caseload.",
      });
    } catch (error) {
      toast({
        title: "Error accepting case",
        description: "There was a problem accepting the case request.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectCaseRequest(id);
      
      setCaseRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status: "rejected" } : request
        )
      );
      
      toast({
        title: "Case request rejected",
        description: "The case request has been declined.",
      });
    } catch (error) {
      toast({
        title: "Error rejecting case",
        description: "There was a problem rejecting the case request.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateCaseRequest = () => {
    if (!newCaseTitle || !newCaseDescription) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    let lawyerName;
    if (selectedLawyerId) {
      const selectedLawyer = getUserById(selectedLawyerId);
      lawyerName = selectedLawyer?.name;
    }
    
    const newRequest: CaseRequest = {
      id: `${Date.now()}`,
      clientId: user?.id || "",
      clientName: user?.name || "",
      clientAvatar: user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "")}&background=random`,
      lawyerId: selectedLawyerId || undefined,
      lawyerName: lawyerName,
      caseTitle: newCaseTitle,
      description: newCaseDescription,
      requestDate: new Date().toISOString(),
      status: "pending"
    };
    
    setCaseRequests(prev => [...prev, newRequest]);
    
    toast({
      title: "Case request created",
      description: "Your legal assistance request has been submitted successfully.",
    });
    
    setNewCaseTitle("");
    setNewCaseDescription("");
    setSelectedLawyerId("");
  };

  const filteredRequests = caseRequests.filter(request => {
    if (!user) return false;
    
    if (user.role === 'lawyer') {
      return request.lawyerId === user.id || !request.lawyerId;
    } else if (user.role === 'client') {
      return request.clientId === user.id;
    } else {
      return true;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Case Requests</h1>
          <p className="text-muted-foreground">
            {user?.role === 'lawyer' 
              ? "Review and respond to legal assistance requests" 
              : "Submit and track requests for legal assistance"}
          </p>
        </div>
        
        {user?.role === 'client' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" /> Request Legal Help
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Legal Assistance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lawyer (Optional)</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedLawyerId}
                    onChange={(e) => setSelectedLawyerId(e.target.value)}
                  >
                    <option value="">Any available lawyer</option>
                    {getUsersByRole('lawyer').map(lawyer => (
                      <option key={lawyer.id} value={lawyer.id}>
                        {lawyer.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Case Title*</label>
                  <Input
                    value={newCaseTitle}
                    onChange={(e) => setNewCaseTitle(e.target.value)}
                    placeholder="e.g., Property Dispute, Divorce Filing"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description*</label>
                  <Textarea
                    value={newCaseDescription}
                    onChange={(e) => setNewCaseDescription(e.target.value)}
                    placeholder="Describe your legal matter in detail..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateCaseRequest}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {filteredRequests.filter(request => request.status === "pending").length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No pending case requests</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests
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
                  {user?.role === 'lawyer' && (
                    <>
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
                    </>
                  )}
                </CardFooter>
              </Card>
            ))
        )}
      </div>

      {filteredRequests.some(request => request.status !== "pending") && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Past Requests</h2>
          <div className="grid gap-4">
            {filteredRequests
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
                    {request.status === "accepted" && (
                      <div className="mt-2 pt-2 border-t border-dashed">
                        <p className="text-xs font-medium">Related cases:</p>
                        <div className="mt-1">
                          {cases
                            .filter(c => 
                              c.clientId === request.clientId && 
                              c.title.includes(request.caseTitle)
                            )
                            .map(c => (
                              <Badge key={c.id} variant="outline" className="mr-2 mb-1">
                                {c.caseNumber}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
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
