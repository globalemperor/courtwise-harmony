
import { useState } from "react";
import { Case, EvidenceItem, Witness } from "@/types";
import { FileUploader } from "@/components/cases/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";
import { Trash2, Plus, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

interface CaseEvidenceProps {
  caseData: Case;
}

export const CaseEvidence = ({ caseData }: CaseEvidenceProps) => {
  const { updateCase } = useData();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("evidence");
  const [witnesses, setWitnesses] = useState<Witness[]>(caseData.witnesses || []);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(caseData.evidence || []);
  const [newWitness, setNewWitness] = useState<{
    name: string;
    contactNumber: string;
    relation: string;
    statement: string;
  }>({
    name: "",
    contactNumber: "",
    relation: "",
    statement: "",
  });

  const addWitness = () => {
    if (newWitness.name && newWitness.contactNumber && newWitness.relation) {
      const updatedWitnesses = [...witnesses, { ...newWitness }];
      setWitnesses(updatedWitnesses);
      
      // Update the case with new witnesses
      updateCase(caseData.id, { 
        witnesses: updatedWitnesses,
        updatedAt: new Date().toISOString()
      });
      
      setNewWitness({
        name: "",
        contactNumber: "",
        relation: "",
        statement: "",
      });
      
      toast({
        title: "Witness Added",
        description: "The witness has been added to the case",
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required witness fields",
        variant: "destructive",
      });
    }
  };

  const removeWitness = (index: number) => {
    const updatedWitnesses = witnesses.filter((_, i) => i !== index);
    setWitnesses(updatedWitnesses);
    
    // Update the case with new witnesses
    updateCase(caseData.id, { 
      witnesses: updatedWitnesses,
      updatedAt: new Date().toISOString()
    });
    
    toast({
      title: "Witness Removed",
      description: "The witness has been removed from the case",
    });
  };

  const addEvidence = (item: EvidenceItem) => {
    const updatedEvidence = [...evidence, item];
    setEvidence(updatedEvidence);
    
    // Update the case with new evidence
    updateCase(caseData.id, { 
      evidence: updatedEvidence,
      updatedAt: new Date().toISOString()
    });
    
    toast({
      title: "Evidence Added",
      description: "The evidence has been added to the case",
    });
  };

  const removeEvidence = (index: number) => {
    const updatedEvidence = evidence.filter((_, i) => i !== index);
    setEvidence(updatedEvidence);
    
    // Update the case with new evidence
    updateCase(caseData.id, { 
      evidence: updatedEvidence,
      updatedAt: new Date().toISOString()
    });
    
    toast({
      title: "Evidence Removed",
      description: "The evidence has been removed from the case",
    });
  };

  // Check if the user has permission to edit
  const canEdit = () => {
    if (!user) return false;
    
    // Lawyers, judges and clerks can edit
    if (user.role === 'lawyer' || user.role === 'judge' || user.role === 'clerk') {
      return true;
    }
    
    // Clients can only edit their own cases
    if (user.role === 'client' && caseData.clientId === user.id) {
      return true;
    }
    
    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Evidence & Witnesses</CardTitle>
        <CardDescription>
          Manage evidence and witness testimony for this case
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="witnesses">Witnesses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="evidence" className="pt-4 space-y-4">
            {canEdit() && (
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Upload New Evidence</h3>
                <FileUploader onFileUploaded={addEvidence} />
              </div>
            )}
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Evidence List ({evidence.length})</h3>
              {evidence.length > 0 ? (
                <div className="space-y-4">
                  {evidence.map((item, index) => (
                    <div key={index} className="border rounded-md p-3 flex justify-between items-start bg-muted/10">
                      <div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <h4 className="font-medium">{item.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                        {item.description && (
                          <p className="text-sm mt-1">{item.description}</p>
                        )}
                        {item.fileUrl && (
                          <div className="mt-2">
                            <a 
                              href={item.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View File
                            </a>
                          </div>
                        )}
                      </div>
                      {canEdit() && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeEvidence(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No evidence has been added to this case yet.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="witnesses" className="pt-4 space-y-4">
            {canEdit() && (
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Add New Witness</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="witness-name">Full Name</Label>
                    <Input 
                      id="witness-name"
                      value={newWitness.name}
                      onChange={(e) => setNewWitness({...newWitness, name: e.target.value})}
                      placeholder="Full name of witness"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness-contact">Contact Number</Label>
                    <Input 
                      id="witness-contact"
                      value={newWitness.contactNumber}
                      onChange={(e) => setNewWitness({...newWitness, contactNumber: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="witness-relation">Relation to Case</Label>
                    <Select 
                      value={newWitness.relation}
                      onValueChange={(value) => setNewWitness({...newWitness, relation: value})}
                    >
                      <SelectTrigger id="witness-relation">
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eyewitness">Eyewitness</SelectItem>
                        <SelectItem value="character">Character Witness</SelectItem>
                        <SelectItem value="expert">Expert Witness</SelectItem>
                        <SelectItem value="family">Family Member</SelectItem>
                        <SelectItem value="associate">Associate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="witness-statement">Witness Statement (Optional)</Label>
                  <Textarea 
                    id="witness-statement"
                    value={newWitness.statement}
                    onChange={(e) => setNewWitness({...newWitness, statement: e.target.value})}
                    placeholder="Summarize what the witness will testify about"
                    className="min-h-20"
                  />
                </div>

                <Button type="button" onClick={addWitness}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Witness
                </Button>
              </div>
            )}

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Witness List ({witnesses.length})</h3>
              {witnesses.length > 0 ? (
                <div className="space-y-4">
                  {witnesses.map((witness, index) => (
                    <div key={index} className="border rounded-md p-3 bg-muted/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{witness.name}</h4>
                          <p className="text-sm text-muted-foreground">{witness.relation}</p>
                        </div>
                        {canEdit() && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeWitness(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Contact: </span>
                          {witness.contactNumber}
                        </div>
                        {witness.statement && (
                          <div className="col-span-2 mt-1">
                            <span className="text-muted-foreground">Statement: </span>
                            {witness.statement}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No witnesses have been added to this case yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
