
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Government ID types
const GOV_ID_TYPES = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "passport", label: "Passport" },
  { value: "pan", label: "PAN Card" },
  { value: "voter", label: "Voter ID" },
  { value: "driving", label: "Driving License" },
];

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  caseType: z.string().min(1, { message: "Please select a case type" }),
  defendant: z.object({
    name: z.string().min(2, { message: "Defendant name is required" }),
    contactNumber: z.string().min(10, { message: "Valid contact number is required" }),
    govIdType: z.string().min(1, { message: "Please select an ID type" }),
    govIdNumber: z.string().min(4, { message: "Government ID number is required" })
  })
});

type FormValues = z.infer<typeof formSchema>;

const FileCasePage = () => {
  const { user } = useAuth();
  const { createCase, getUsersByRole } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get all available lawyers
  const lawyers = getUsersByRole("lawyer");

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      caseType: "",
      defendant: {
        name: "",
        contactNumber: "",
        govIdType: "",
        govIdNumber: ""
      }
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to file a case",
        variant: "destructive",
      });
      return;
    }

    try {
      // Format defendant info to include in the case
      const defendantInfo = {
        name: data.defendant.name,
        contactNumber: data.defendant.contactNumber,
        idType: data.defendant.govIdType,
        idNumber: data.defendant.govIdNumber
      };

      // Create the case
      const newCase = await createCase({
        title: data.title,
        description: `${data.description}\n\nDefendant Information:\nName: ${defendantInfo.name}\nContact: ${defendantInfo.contactNumber}\nID Type: ${defendantInfo.idType}\nID Number: ${defendantInfo.idNumber}`,
        caseNumber: `CV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "pending",
        clientId: user.id,
        filedDate: new Date().toISOString(),
      });

      toast({
        title: "Case filed successfully",
        description: `Your case has been filed with case number ${newCase.caseNumber}`,
      });

      navigate("/cases");
    } catch (error) {
      console.error("Error filing case:", error);
      toast({
        title: "Error filing case",
        description: "There was a problem filing your case. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">File a New Case</h1>
        <p className="text-muted-foreground">
          Complete the form below to file a new case with the court
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
              <CardDescription>
                Provide the details about your case
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Property Dispute at 123 Main Street" {...field} />
                    </FormControl>
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
                        placeholder="Provide a detailed description of your case..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
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
                        <SelectItem value="property">Property</SelectItem>
                        <SelectItem value="employment">Employment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Defendant Information</CardTitle>
              <CardDescription>
                Information about the opposing party
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="defendant.name"
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
                name="defendant.contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Defendant's contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="defendant.govIdType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Government ID Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GOV_ID_TYPES.map(idType => (
                            <SelectItem key={idType.value} value={idType.value}>
                              {idType.label}
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
                  name="defendant.govIdNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Government ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">File Case</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default FileCasePage;
