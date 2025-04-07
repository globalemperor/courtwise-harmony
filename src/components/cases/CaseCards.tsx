
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Clock, Calendar, FileText, MoreHorizontal, ChevronRight } from "lucide-react";
import { Case } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";

interface CaseCardsProps {
  cases: Case[];
  title?: string;
}

export const CaseCards = ({ cases, title = "New Cases" }: CaseCardsProps) => {
  const navigate = useNavigate();
  const { updateCase } = useData();
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "active":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "in_progress":
        return "bg-purple-500";
      case "on_hold":
        return "bg-gray-500";
      case "dismissed":
        return "bg-red-500";
      case "closed":
        return "bg-gray-700";
      default:
        return "bg-gray-500";
    }
  };
  
  const handleProcessCase = (caseItem: Case) => {
    updateCase(caseItem.id, { 
      status: "active",
      updatedAt: new Date().toISOString() 
    });
    
    toast({
      title: "Case Processed",
      description: `Case ${caseItem.title} has been processed and is now active`,
    });
    
    navigate(`/cases/${caseItem.id}`);
  };
  
  const viewCaseDetails = (caseItem: Case) => {
    setSelectedCase(caseItem);
  };
  
  const getCaseTypeIcon = (type: string) => {
    switch (type) {
      case "civil":
        return "🏛️";
      case "criminal":
        return "⚖️";
      case "family":
        return "👪";
      case "corporate":
        return "🏢";
      case "real_estate":
        return "🏠";
      default:
        return "📄";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((caseItem) => (
          <Card key={caseItem.id} className="flex flex-col transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                <Badge className={`${getStatusColor(caseItem.status)} hover:${getStatusColor(caseItem.status)}`}>
                  {caseItem.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-2 flex-grow">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <span className="mr-2">{getCaseTypeIcon(caseItem.type || '')}</span>
                <span className="capitalize">{caseItem.type?.replace('_', ' ') || 'General'}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Filed: {caseItem.filedDate ? format(new Date(caseItem.filedDate), 'MMM d, yyyy') : 'N/A'}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Updated: {format(new Date(caseItem.updatedAt), 'MMM d, yyyy')}</span>
              </div>
              
              <p className="line-clamp-2 mt-3 text-sm">
                {caseItem.description}
              </p>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => viewCaseDetails(caseItem)}>
                    <FileText className="h-4 w-4 mr-2" /> 
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  {selectedCase && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          <span>{selectedCase.title}</span>
                          <Badge className={`${getStatusColor(selectedCase.status)} hover:${getStatusColor(selectedCase.status)}`}>
                            {selectedCase.status.replace('_', ' ')}
                          </Badge>
                        </DialogTitle>
                        <DialogDescription>
                          Case #{selectedCase.caseNumber || selectedCase.id.substring(0, 8)} • Filed on {selectedCase.filedDate}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <h3 className="font-medium mb-2">Case Information</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="capitalize">{selectedCase.type?.replace('_', ' ') || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Court:</span>
                              <span className="capitalize">{selectedCase.courtRoom?.replace('_', ' ') || 'Not assigned'}</span>
                            </div>
                            {selectedCase.judgeName && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Judge:</span>
                                <span>{selectedCase.judgeName}</span>
                              </div>
                            )}
                            {selectedCase.nextHearingDate && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Next Hearing:</span>
                                <span>{format(new Date(selectedCase.nextHearingDate), 'MMM d, yyyy')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Parties</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Plaintiff:</span>
                              <span>{selectedCase.clientId}</span>
                            </div>
                            {selectedCase.defendantInfo && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Defendant:</span>
                                <span>{selectedCase.defendantInfo.name}</span>
                              </div>
                            )}
                            {selectedCase.lawyerId && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Lawyer:</span>
                                <span>{selectedCase.lawyerId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-sm">{selectedCase.description}</p>
                      </div>
                      
                      {selectedCase.witnesses && selectedCase.witnesses.length > 0 && (
                        <div className="py-2">
                          <h3 className="font-medium mb-2">Witnesses ({selectedCase.witnesses.length})</h3>
                          <div className="text-sm">
                            {selectedCase.witnesses.map((witness, index) => (
                              <div key={index} className="border-b py-1 last:border-0">
                                <div className="font-medium">{witness.name}</div>
                                <div className="text-muted-foreground">{witness.relation}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedCase.evidence && selectedCase.evidence.length > 0 && (
                        <div className="py-2">
                          <h3 className="font-medium mb-2">Evidence ({selectedCase.evidence.length})</h3>
                          <div className="text-sm">
                            {selectedCase.evidence.map((evidence, index) => (
                              <div key={index} className="border-b py-1 last:border-0">
                                <div className="font-medium">{evidence.title}</div>
                                <div className="text-muted-foreground">{evidence.type}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <DialogFooter>
                        <Button 
                          variant="default" 
                          onClick={() => handleProcessCase(selectedCase)}
                          disabled={selectedCase.status !== "pending"}
                        >
                          {selectedCase.status === "pending" ? "Process Case" : "View Full Details"}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleProcessCase(caseItem)}
                disabled={caseItem.status !== "pending"}
              >
                Process
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {cases.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No cases found</p>
        </div>
      )}
    </div>
  );
};
