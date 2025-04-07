import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Calendar, FileText, User, Users, FileBarChart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Evidence, Hearing, Message } from "@/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    getCaseById, 
    getUserById, 
    getMessagesByCaseId, 
    getHearingsByCaseId, 
    getEvidenceByCaseId,
    getCasesByUserId
  } = useData();

  const [selectedParty, setSelectedParty] = useState<{id: string, name: string, role: string} | null>(null);
  const [showPartyHistory, setShowPartyHistory] = useState(false);

  if (!id || !user) return null;

  const caseItem = getCaseById(id);
  if (!caseItem) return <div>Case not found</div>;

  const client = getUserById(caseItem.clientId);
  const lawyer = caseItem.lawyerId ? getUserById(caseItem.lawyerId) : null;
  
  const caseMessages = getMessagesByCaseId(id);
  const caseHearings = getHearingsByCaseId(id);
  const caseEvidence = getEvidenceByCaseId(id);
  
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

  const pastCases = selectedParty ? getCasesByUserId(selectedParty.id) : [];

  const defendantInfo = caseItem.defendantInfo;
  
  const parties = [
    { id: client?.id || '', name: client?.name || 'Unknown Client', role: 'Plaintiff' },
    { id: lawyer?.id || '', name: lawyer?.name || 'No Lawyer', role: 'Plaintiff\'s Lawyer' },
  ];
  
  if (defendantInfo) {
    parties.push({ id: 'defendant-' + caseItem.id, name: defendantInfo.name, role: 'Defendant' });
  }
  
  const handlePartyClick = (party: {id: string, name: string, role: string}) => {
    setSelectedParty(party);
    setShowPartyHistory(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{caseItem.title}</h1>
          <p className="text-muted-foreground">Case #{caseItem.caseNumber}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to="/cases">Back to Cases</Link>
          </Button>
          {(user.role === 'lawyer' || user.role === 'clerk' || user.role === 'judge') && (
            <Button asChild>
              <Link to={`/cases/${caseItem.id}/manage`}>Manage Case</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Case Details</span>
              <Badge className={statusColor}>{caseItem.status.replace("_", " ")}</Badge>
            </CardTitle>
            <CardDescription>Information about this case</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">Description</h3>
                <p className="mt-1">{caseItem.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Filed Date</h3>
                  <p className="mt-1">
                    {caseItem.filedDate 
                      ? format(new Date(caseItem.filedDate), "MMMM d, yyyy") 
                      : "Not filed"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Court Room</h3>
                  <p className="mt-1">{caseItem.courtRoom || "Not assigned"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Judge</h3>
                  <p className="mt-1">{caseItem.judgeName || "Not assigned"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Next Hearing</h3>
                  <p className="mt-1">
                    {caseItem.nextHearingDate 
                      ? format(new Date(caseItem.nextHearingDate), "MMMM d, yyyy") 
                      : "Not scheduled"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Involved Parties</CardTitle>
            <CardDescription>People associated with this case</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parties.map((party) => (
                party.id ? (
                  <div key={party.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{party.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <button 
                        onClick={() => handlePartyClick(party)} 
                        className="font-medium hover:text-primary hover:underline focus:outline-none"
                      >
                        {party.name}
                      </button>
                      <p className="text-xs text-muted-foreground">{party.role}</p>
                    </div>
                  </div>
                ) : null
              ))}
              
              <Separator />
              
              {!lawyer && user.role === 'client' && (
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No Lawyer Assigned</p>
                    <p className="text-xs text-muted-foreground">
                      <Link to="/find-lawyer" className="text-primary">Find a lawyer</Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hearings">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="hearings" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Hearings</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span>Evidence</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>Messages</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="hearings" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Scheduled Hearings</CardTitle>
                {(user.role === 'clerk' || user.role === 'judge') && (
                  <Button size="sm" asChild>
                    <Link to={`/schedule-hearing/${id}`}>Schedule Hearing</Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {caseHearings.length > 0 ? (
                <div className="space-y-4">
                  {caseHearings.map(hearing => (
                    <HearingListItem key={hearing.id} hearing={hearing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No hearings scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evidence" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Case Evidence</CardTitle>
                {(user.role === 'lawyer' || user.role === 'clerk') && (
                  <Button size="sm">Add Evidence</Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {caseEvidence.length > 0 ? (
                <div className="space-y-4">
                  {caseEvidence.map(evidence => (
                    <EvidenceListItem 
                      key={evidence.id} 
                      evidence={evidence} 
                      getUserById={getUserById}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No evidence has been submitted</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Case Communication</CardTitle>
                <Button size="sm" asChild>
                  <Link to={`/messages?case=${id}`}>Send Message</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {caseMessages.length > 0 ? (
                <div className="space-y-4">
                  {caseMessages.map(message => (
                    <MessageListItem 
                      key={message.id} 
                      message={message} 
                      getUserById={getUserById}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showPartyHistory} onOpenChange={setShowPartyHistory}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5" />
              Case History for {selectedParty?.name}
              <Badge>{selectedParty?.role}</Badge>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {pastCases.length > 0 ? (
              <div className="space-y-4">
                {pastCases.map(caseItem => (
                  <Card key={caseItem.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                        <Badge className={statusColors[caseItem.status] || ""}>{caseItem.status}</Badge>
                      </div>
                      <CardDescription>
                        Case #{caseItem.caseNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm line-clamp-2">{caseItem.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {caseItem.filedDate 
                            ? format(new Date(caseItem.filedDate), "MMM d, yyyy") 
                            : "Not filed"}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/cases/${caseItem.id}`}>
                            View Case
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No previous cases found</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const HearingListItem = ({ hearing }: { hearing: Hearing }) => {
  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-medium">{hearing.description}</h4>
            <Badge className={statusColors[hearing.status] || "bg-gray-100"}>
              {hearing.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-3 mt-2 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              {format(new Date(hearing.date), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center">
              <Badge variant="outline">{hearing.time}</Badge>
            </div>
            <div className="flex items-center">
              <Badge variant="outline">{hearing.location}</Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>
    </div>
  );
};

const EvidenceListItem = ({ evidence, getUserById }: { evidence: Evidence, getUserById: (id: string) => any }) => {
  const uploader = getUserById(evidence.uploadedBy);
  
  const iconMap: Record<string, React.ReactNode> = {
    'application/pdf': <FileText className="h-5 w-5" />,
    'image/jpeg': <img src="/placeholder.svg" alt="Document preview" className="h-10 w-10 object-cover rounded" />,
    'image/png': <img src="/placeholder.svg" alt="Document preview" className="h-10 w-10 object-cover rounded" />,
    'video/mp4': <div className="h-10 w-10 bg-muted flex items-center justify-center rounded">Video</div>,
  };
  
  const icon = iconMap[evidence.fileType || ''] || <FileText className="h-5 w-5" />;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex space-x-3">
        <div className="h-10 w-10 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{evidence.title}</h4>
          <p className="text-sm text-muted-foreground">{evidence.description}</p>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-muted-foreground">
              Uploaded by {uploader?.name || 'Unknown'} on {format(new Date(evidence.uploadedAt), "MMM d, yyyy")}
            </div>
            <Button variant="outline" size="sm">View Document</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageListItem = ({ message, getUserById }: { message: Message, getUserById: (id: string) => any }) => {
  const sender = getUserById(message.senderId);
  
  if (!sender) return null;
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex space-x-3">
        <Avatar>
          <AvatarImage src={sender.avatarUrl} alt={sender.name} />
          <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">{sender.name}</h4>
              <Badge variant="outline" className="text-xs capitalize">{sender.role}</Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), "MMM d, yyyy h:mm a")}
            </span>
          </div>
          <p className="mt-2">{message.content}</p>
        </div>
      </div>
    </div>
  );
};
