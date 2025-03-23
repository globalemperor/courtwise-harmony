
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, AlertCircle } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  clientId: z.string().min(1, "Client must be selected"),
  caseType: z.string().min(1, "Case type must be selected"),
  defendantName: z.string().min(2, "Defendant name is required"),
  defendantPhone: z.string().min(10, "Valid phone number is required"),
  defendantIdType: z.string().min(1, "ID type must be selected"),
  defendantIdNumber: z.string().min(1, "ID number is required"),
  defendantLawyer: z.string().optional(),
  courtId: z.string().min(1, "Court must be selected"),
  evidence: z.string().optional(),
});

const caseTypes = [
  "Civil",
  "Criminal",
  "Family",
  "Commercial",
  "Immigration",
  "Intellectual Property",
  "Personal Injury",
  "Real Estate",
  "Tax",
  "Employment",
];

const idTypes = [
  "Aadhar Card",
  "Passport",
  "PAN Card",
  "Voter ID",
  "Driving License",
  "Other Government ID"
];

const FileCasePage = () => {
  const { user } = useAuth();
  const { getUsersByRole, createCase, sendMessage, users } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filing, setFiling] = useState(false);

  const clients = getUsersByRole("client");
  const clerks = getUsersByRole("clerk");
  
  const courts = [
    { id: "court1", name: "Superior Court of Justice" },
    { id: "court2", name: "District Court" },
    { id: "court3", name: "Family Court" },
    { id: "court4", name: "Municipal Court" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      clientId: "",
      caseType: "",
      defendantName: "",
      defendantPhone: "",
      defendantIdType: "",
      defendantIdNumber: "",
      defendantLawyer: "",
      courtId: "",
      evidence: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setFiling(true);
    
    try {
      // Store defendant information in the description field since there's no dedicated field for it
      const defendantInfoText = `Defendant: ${values.defendantName} (${values.defendantPhone})
ID: ${values.defendantIdType} ${values.defendantIdNumber}
Lawyer: ${values.defendantLawyer || "Not specified"}`;
      
      const fullDescription = `${values.description}\n\n${defendantInfoText}`;
      
      const newCase = await createCase({
        title: values.title,
        description: fullDescription,
        caseNumber: `CV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "pending",
        clientId: values.clientId,
        lawyerId: user.id,
        filedDate: new Date().toISOString(),
        courtRoom: "To be assigned",
        judgeName: "To be assigned"
      });
      
      const selectedClerk = clerks.length > 0 ? clerks[0] : null;
      
      if (selectedClerk) {
        await sendMessage({
          content: `A new case "${values.title}" has been filed by ${user.name} and needs processing. Details: ${values.description}. Defendant: ${values.defendantName} (${values.defendantPhone}). Defendant's ID: ${values.defendantIdType} ${values.defendantIdNumber}. Defendant's lawyer: ${values.defendantLawyer || "Not provided"}. Case type: ${values.caseType}.`,
          senderId: user.id,
          senderRole: "lawyer",
          recipientId: selectedClerk.id,
          recipientRole: "clerk",
          caseId: newCase.id
        });
      }
      
      const client = users.find(u => u.id === values.clientId);
      if (client) {
        await sendMessage({
          content: `I've filed your case "${values.title}" with the court. The case number is ${newCase.caseNumber}. I'll keep you updated on the proceedings.`,
          senderId: user.id,
          senderRole: "lawyer",
          recipientId: client.id,
          recipientRole: "client",
          caseId: newCase.id
        });
      }
      
      toast({
        title: "Case filed successfully",
        description: `Case #${newCase.caseNumber} has been created and the court clerk has been notified.`,
      });
      
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error("Error filing case:", error);
      toast({
        title: "Error filing case",
        description: "There was a problem filing the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFiling(false);
    }
  };

  if (!user || user.role !== "lawyer") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          Only lawyers can file new cases. Please login with a lawyer account.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">File a New Case</h1>
        <p className="text-muted-foreground">Submit a new case to the court on behalf of your client</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Case Information
          </CardTitle>
          <CardDescription>
            Fill in all required information about the case you're filing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a descriptive title for the case" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select case type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {caseTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the case"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courtId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select court to file in" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courts.map((court) => (
                            <SelectItem key={court.id} value={court.id}>
                              {court.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold pt-2">Defendant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="defendantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Defendant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter defendant's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defendantPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Defendant Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter defendant's contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="defendantIdType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {idTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
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
                        <Input placeholder="Enter defendant's ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="defendantLawyer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Defendant's Lawyer (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter defendant's lawyer if known" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evidence (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any evidence you plan to submit"
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={filing}>
                  {filing ? "Filing Case..." : "File Case"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileCasePage;
