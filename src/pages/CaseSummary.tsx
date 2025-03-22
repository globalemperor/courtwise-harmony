
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Gavel, Calendar, FileCheck, Search, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { CaseStatus, Case } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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

interface VerdictFormData {
  decision: 'guilty' | 'not_guilty' | 'settled' | 'dismissed';
  reasoning: string;
  penalties?: string;
  jailTime?: string;
  fine?: string;
}

const CaseSummary = () => {
  const { cases, getUserById, updateCase, sendMessage } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [verdictFormData, setVerdictFormData] = useState<VerdictFormData>({
    decision: 'guilty',
    reasoning: '',
    penalties: '',
    jailTime: '',
    fine: ''
  });
  const [showVerdictDialog, setShowVerdictDialog] = useState(false);

  // Filter cases based on active tab and search query
  const filteredCases = cases.filter(caseItem => {
    // First filter by tab
    if (activeTab !== "all" && caseItem.status !== activeTab) {
      return false;
    }
    
    // Then filter by search query if present
    if (searchQuery) {
      const client = getUserById(caseItem.clientId);
      const lawyer = caseItem.lawyerId ? getUserById(caseItem.lawyerId) : null;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        caseItem.title.toLowerCase().includes(searchLower) ||
        caseItem.caseNumber.toLowerCase().includes(searchLower) ||
        caseItem.description.toLowerCase().includes(searchLower) ||
        (client && client.name.toLowerCase().includes(searchLower)) ||
        (lawyer && lawyer.name.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  const handleVerdictFormChange = (
    field: keyof VerdictFormData, 
    value: string
  ) => {
    setVerdictFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmitVerdict = async () => {
    if (!selectedCase || !user || user.role !== 'judge') return;
    
    // Validate required fields
    if (!verdictFormData.reasoning) {
      toast({
        title: "Missing information",
        description: "Please provide reasoning for your decision",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Build verdict summary
      let verdictSummary = `VERDICT: ${verdictFormData.decision.replace('_', ' ').toUpperCase()}\n\n`;
      verdictSummary += `REASONING: ${verdictFormData.reasoning}\n\n`;
      
      if (verdictFormData.decision === 'guilty') {
        // Add penalties for guilty verdicts
        verdictSummary += "PENALTIES:\n";
        
        if (verdictFormData.jailTime) {
          verdictSummary += `- Jail Time: ${verdictFormData.jailTime}\n`;
        }
        
        if (verdictFormData.fine) {
          verdictSummary += `- Fine: $${verdictFormData.fine}\n`;
        }
        
        if (verdictFormData.penalties) {
          verdictSummary += `- Additional Penalties: ${verdictFormData.penalties}\n`;
        }
      }
      
      // Update case status based on verdict
      let newStatus: CaseStatus = 'closed';
      if (verdictFormData.decision === 'dismissed') {
        newStatus = 'dismissed';
      }
      
      // Update the case with verdict and change status
      await updateCase(selectedCase.id, {
        status: newStatus,
        // In a real app, you would add a verdict field to the Case type
        // For now, we'll use the existing description field to append the verdict
        description: `${selectedCase.description}\n\n--- VERDICT ---\n${verdictSummary}`
      });
      
      // Notify the lawyer
      if (selectedCase.lawyerId) {
        const lawyer = getUserById(selectedCase.lawyerId);
        if (lawyer) {
          await sendMessage({
            content: `A verdict has been issued for case ${selectedCase.caseNumber}: ${verdictFormData.decision.replace('_', ' ').toUpperCase()}. Please check the case details for the full verdict.`,
            senderId: user.id,
            senderRole: "judge",
            recipientId: lawyer.id,
            recipientRole: "lawyer",
            caseId: selectedCase.id
          });
        }
      }
      
      // Close dialog and reset form
      setShowVerdictDialog(false);
      setVerdictFormData({
        decision: 'guilty',
        reasoning: '',
        penalties: '',
        jailTime: '',
        fine: ''
      });
      
      toast({
        title: "Verdict recorded",
        description: "The verdict has been recorded and relevant parties have been notified."
      });
      
    } catch (error) {
      toast({
        title: "Error recording verdict",
        description: "There was a problem recording the verdict. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Case Summary</h1>
        <p className="text-muted-foreground">View summaries of all court cases</p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cases by title, number, client..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All Cases</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4">
            {filteredCases.length > 0 ? (
              filteredCases.map(caseItem => {
                const client = getUserById(caseItem.clientId);
                const lawyer = caseItem.lawyerId ? getUserById(caseItem.lawyerId) : null;
                
                // Only show verdict button for judges and active cases
                const canIssueVerdict = user?.role === 'judge' && 
                  (caseItem.status === 'active' || caseItem.status === 'in_progress');
                
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
                      
                      <div className="flex justify-end space-x-2">
                        {canIssueVerdict && (
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedCase(caseItem);
                            setShowVerdictDialog(true);
                          }}>
                            <Gavel className="h-4 w-4 mr-2" />
                            Issue Verdict
                          </Button>
                        )}
                        <Button size="sm" asChild>
                          <Link to={`/cases/${caseItem.id}`}>Full Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No cases found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Verdict Dialog */}
      <Dialog open={showVerdictDialog} onOpenChange={setShowVerdictDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Issue Verdict for Case #{selectedCase?.caseNumber}</DialogTitle>
            <DialogDescription>
              Record your final verdict for this case. This will close the case and notify all relevant parties.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="decision">Decision</Label>
              <Select 
                value={verdictFormData.decision} 
                onValueChange={(value) => handleVerdictFormChange('decision', value)}
              >
                <SelectTrigger id="decision">
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guilty">Guilty</SelectItem>
                  <SelectItem value="not_guilty">Not Guilty</SelectItem>
                  <SelectItem value="settled">Settled</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reasoning">Reasoning</Label>
              <Textarea 
                id="reasoning"
                placeholder="Provide detailed reasoning for your decision..."
                className="min-h-[100px]"
                value={verdictFormData.reasoning}
                onChange={(e) => handleVerdictFormChange('reasoning', e.target.value)}
              />
            </div>
            
            {verdictFormData.decision === 'guilty' && (
              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="font-medium">Penalties</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jailTime">Jail Time (if applicable)</Label>
                    <Input 
                      id="jailTime"
                      placeholder="e.g., 2 years"
                      value={verdictFormData.jailTime}
                      onChange={(e) => handleVerdictFormChange('jailTime', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fine">Fine Amount (if applicable)</Label>
                    <Input 
                      id="fine"
                      placeholder="e.g., 5000"
                      value={verdictFormData.fine}
                      onChange={(e) => handleVerdictFormChange('fine', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="penalties">Additional Penalties</Label>
                  <Textarea 
                    id="penalties"
                    placeholder="Describe any additional penalties or requirements..."
                    value={verdictFormData.penalties}
                    onChange={(e) => handleVerdictFormChange('penalties', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerdictDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitVerdict}>
              <Gavel className="h-4 w-4 mr-2" />
              Record Verdict
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseSummary;
