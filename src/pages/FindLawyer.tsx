
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserRound, Mail, Briefcase, Calendar, Award, Check, Clock, Phone, Filter } from "lucide-react";
import { User, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const CASE_TYPES = [
  { value: "all", label: "All Specializations" },
  { value: "civil", label: "Civil" },
  { value: "criminal", label: "Criminal" },
  { value: "family", label: "Family" },
  { value: "corporate", label: "Corporate" },
  { value: "immigration", label: "Immigration" },
  { value: "tax", label: "Tax" },
  { value: "intellectual_property", label: "Intellectual Property" },
  { value: "real_estate", label: "Real Estate" },
  { value: "labor", label: "Labor" },
  { value: "environmental", label: "Environmental" }
];

const FindLawyer = () => {
  const { user } = useAuth();
  const { users, createCaseRequest } = useData();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [selectedLawyer, setSelectedLawyer] = useState<User | null>(null);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user) return null;

  // Get all lawyers
  const lawyers = users.filter(u => u.role === 'lawyer');

  // Filter lawyers based on search query and specialization
  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (lawyer.email && lawyer.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialization = specialization === "all" || lawyer.specialization === specialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleRequestCase = async () => {
    if (!selectedLawyer) return;
    
    setIsSubmitting(true);
    try {
      await createCaseRequest({
        clientId: user.id,
        lawyerId: selectedLawyer.id,
        caseTitle,
        description: caseDescription
      });

      toast({
        title: "Request sent successfully",
        description: `Your case request has been sent to ${selectedLawyer.name}. You'll be notified when they respond.`,
      });

      setCaseTitle("");
      setCaseDescription("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error sending case request:", error);
      toast({
        title: "Error sending request",
        description: "There was a problem sending your case request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Find a Lawyer</h1>
        <p className="text-muted-foreground">Browse qualified lawyers and request legal representation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Lawyers</CardTitle>
          <CardDescription>
            Find the right lawyer for your case needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by specialization" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {CASE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLawyers.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No lawyers found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredLawyers.map(lawyer => (
            <Card key={lawyer.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={lawyer.avatarUrl} />
                      <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {lawyer.specialization || "General Practice"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Lawyer</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{lawyer.email}</span>
                  </div>
                  {lawyer.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{lawyer.phone}</span>
                    </div>
                  )}
                  {lawyer.licenseYear && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Licensed since {lawyer.licenseYear}</span>
                    </div>
                  )}
                  {typeof lawyer.casesHandled === 'number' && (
                    <div className="flex items-center text-sm">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{lawyer.casesHandled} cases handled</span>
                    </div>
                  )}
                  {typeof lawyer.casesWon === 'number' && (
                    <div className="flex items-center text-sm">
                      <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{lawyer.casesWon} cases won</span>
                    </div>
                  )}
                </div>

                <Dialog open={dialogOpen && selectedLawyer?.id === lawyer.id} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) setSelectedLawyer(null);
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedLawyer(lawyer);
                        setDialogOpen(true);
                      }}
                    >
                      Request Legal Help
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Request Legal Representation</DialogTitle>
                      <DialogDescription>
                        Send a case request to {lawyer.name}. The lawyer will review your case and decide whether to accept.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="case-title">Case Title</Label>
                        <Input
                          id="case-title"
                          placeholder="Brief description of your case"
                          value={caseTitle}
                          onChange={(e) => setCaseTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="case-description">Case Details</Label>
                        <Textarea
                          id="case-description"
                          placeholder="Provide details about your case..."
                          rows={5}
                          value={caseDescription}
                          onChange={(e) => setCaseDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        onClick={handleRequestCase}
                        disabled={isSubmitting || !caseTitle || !caseDescription}
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Send Request
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FindLawyer;
