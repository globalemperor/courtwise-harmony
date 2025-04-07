
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/context/DataContext";
import { PlaintiffSelector } from "@/components/cases/PlaintiffSelector";
import { CaseStatus, User, Witness, EvidenceItem } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/cases/FileUploader";
import { Trash2 } from "lucide-react";

const FileCasePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createCase } = useData();
  const [selectedPlaintiff, setSelectedPlaintiff] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
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

  const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    type: z.string().min(1, { message: "Please select a case type" }),
    description: z.string().min(20, { message: "Description must be at least 20 characters" }),
    court: z.string().min(1, { message: "Please select a court" }),
    defendantName: z.string().min(2, { message: "Defendant name is required" }),
    defendantContact: z.string().optional(),
    defendantIdType: z.string().min(1, { message: "ID type is required" }),
    defendantIdNumber: z.string().min(1, { message: "ID number is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      description: "",
      court: "",
      defendantName: "",
      defendantContact: "",
      defendantIdType: "",
      defendantIdNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedPlaintiff) {
      toast({
        title: "Error",
        description: "Please select a plaintiff for this case",
        variant: "destructive",
      });
      return;
    }

    const newCase = {
      id: `case_${Date.now()}`,
      title: values.title,
      description: values.description,
      clientId: selectedPlaintiff.id,
      lawyerId: user?.id,
      status: "pending" as CaseStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: values.type,
      filedDate: new Date().toISOString().split('T')[0],
      courtRoom: values.court,
      defendantInfo: {
        name: values.defendantName,
        contactNumber: values.defendantContact || "",
        idType: values.defendantIdType,
        idNumber: values.defendantIdNumber,
      },
      witnesses: witnesses,
      evidence: evidenceItems,
    };

    createCase(newCase);

    toast({
      title: "Case Filed Successfully",
      description: "The new case has been filed and is pending review",
    });

    navigate("/cases");
  };

  const addWitness = () => {
    if (newWitness.name && newWitness.contactNumber && newWitness.relation) {
      setWitnesses([...witnesses, { ...newWitness }]);
      setNewWitness({
        name: "",
        contactNumber: "",
        relation: "",
        statement: "",
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
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };

  const addEvidenceItem = (item: EvidenceItem) => {
    setEvidenceItems([...evidenceItems, item]);
  };

  const removeEvidenceItem = (index: number) => {
    setEvidenceItems(evidenceItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">File a New Case</h1>
        <p className="text-muted-foreground">Submit details to file a new court case</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Filing Form</CardTitle>
          <CardDescription>
            Please provide complete and accurate information for this legal filing
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="plaintiff">Plaintiff</TabsTrigger>
              <TabsTrigger value="details">Case Details</TabsTrigger>
              <TabsTrigger value="defendant">Defendant</TabsTrigger>
              <TabsTrigger value="witnesses">Witnesses</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="plaintiff" className="mt-6 space-y-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select the plaintiff (person filing the case) from your client list or add a new client.
                    </p>
                    
                    <PlaintiffSelector 
                      value={selectedPlaintiff}
                      onChange={setSelectedPlaintiff}
                    />

                    {selectedPlaintiff && (
                      <div className="mt-4 space-y-2">
                        <h3 className="text-sm font-medium">Plaintiff Details</h3>
                        <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/20">
                          <div>
                            <p className="text-xs text-muted-foreground">Full Name</p>
                            <p className="font-medium">{selectedPlaintiff.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium">{selectedPlaintiff.email}</p>
                          </div>
                          {selectedPlaintiff.phone && (
                            <div>
                              <p className="text-xs text-muted-foreground">Phone</p>
                              <p className="font-medium">{selectedPlaintiff.phone}</p>
                            </div>
                          )}
                          {selectedPlaintiff.address && (
                            <div>
                              <p className="text-xs text-muted-foreground">Address</p>
                              <p className="font-medium">{selectedPlaintiff.address}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setActiveTab("details")}>
                        Next: Case Details
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="mt-6 space-y-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Case Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Smith vs. Jones" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a clear and concise title for the case
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Case Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select case type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="civil">Civil</SelectItem>
                              <SelectItem value="criminal">Criminal</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                              <SelectItem value="corporate">Corporate</SelectItem>
                              <SelectItem value="real_estate">Real Estate</SelectItem>
                              <SelectItem value="bankruptcy">Bankruptcy</SelectItem>
                              <SelectItem value="tax">Tax</SelectItem>
                              <SelectItem value="immigration">Immigration</SelectItem>
                              <SelectItem value="intellectual_property">Intellectual Property</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the appropriate legal category for this case
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Case Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a detailed description of the case..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include all relevant facts and circumstances
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="court"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Court</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select court" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="district_court">District Court</SelectItem>
                              <SelectItem value="high_court">High Court</SelectItem>
                              <SelectItem value="supreme_court">Supreme Court</SelectItem>
                              <SelectItem value="family_court">Family Court</SelectItem>
                              <SelectItem value="tax_court">Tax Court</SelectItem>
                              <SelectItem value="bankruptcy_court">Bankruptcy Court</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the court where the case will be filed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("plaintiff")}>
                      Back: Plaintiff
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("defendant")}>
                      Next: Defendant
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="defendant" className="mt-6 space-y-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="defendantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Defendant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name of the defendant" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="defendantContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Defendant Contact Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="defendantIdType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select ID type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="passport">Passport</SelectItem>
                                <SelectItem value="driver_license">Driver's License</SelectItem>
                                <SelectItem value="national_id">National ID</SelectItem>
                                <SelectItem value="ssn">Social Security Number</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="defendantIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                      Back: Case Details
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("witnesses")}>
                      Next: Witnesses
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="witnesses" className="mt-6 space-y-4">
                  <div className="space-y-6">
                    <div className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-4">Add Witness</h3>
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
                        Add Witness
                      </Button>
                    </div>

                    {witnesses.length > 0 && (
                      <div className="border rounded-md p-4">
                        <h3 className="text-lg font-medium mb-4">Witness List ({witnesses.length})</h3>
                        <div className="space-y-4">
                          {witnesses.map((witness, index) => (
                            <div key={index} className="border rounded-md p-3 bg-muted/10">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{witness.name}</h4>
                                  <p className="text-sm text-muted-foreground">{witness.relation}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeWitness(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("defendant")}>
                      Back: Defendant
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("evidence")}>
                      Next: Evidence
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="evidence" className="mt-6 space-y-4">
                  <div className="space-y-6">
                    <div className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-4">Upload Evidence</h3>
                      <FileUploader onFileUploaded={addEvidenceItem} />
                    </div>

                    {evidenceItems.length > 0 && (
                      <div className="border rounded-md p-4">
                        <h3 className="text-lg font-medium mb-4">Evidence List ({evidenceItems.length})</h3>
                        <div className="space-y-4">
                          {evidenceItems.map((item, index) => (
                            <div key={index} className="border rounded-md p-3 flex justify-between items-center bg-muted/10">
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.type}</p>
                                {item.description && (
                                  <p className="text-sm mt-1">{item.description}</p>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeEvidenceItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("witnesses")}>
                      Back: Witnesses
                    </Button>
                    <Button type="submit" className="bg-primary">
                      Submit Case Filing
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileCasePage;
