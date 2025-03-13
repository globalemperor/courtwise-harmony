
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, UserPlus, Search, Calendar, FileText, Gavel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock new case data
const MOCK_NEW_CASES = [
  {
    id: "1",
    title: "Thompson Custody Dispute",
    description: "Custody dispute for 2 children, ages 5 and 7",
    caseType: "Family",
    clientName: "Maria Thompson",
    clientAvatar: "https://ui-avatars.com/api/?name=Maria+Thompson&background=random",
    submittedDate: "2023-06-22T10:30:00Z",
    status: "pending"
  },
  {
    id: "2",
    title: "Black vs. Smith Construction",
    description: "Contract dispute over incomplete construction work",
    caseType: "Civil",
    clientName: "Robert Black",
    clientAvatar: "https://ui-avatars.com/api/?name=Robert+Black&background=random",
    submittedDate: "2023-06-21T15:45:00Z",
    status: "pending"
  },
  {
    id: "3",
    title: "Martinez Traffic Violation",
    description: "Contesting a speeding ticket with radar evidence",
    caseType: "Traffic",
    clientName: "Carlos Martinez",
    clientAvatar: "https://ui-avatars.com/api/?name=Carlos+Martinez&background=random",
    submittedDate: "2023-06-20T09:15:00Z",
    status: "pending"
  }
];

const NewCases = () => {
  const [newCases, setNewCases] = useState(MOCK_NEW_CASES);
  const [searchQuery, setSearchQuery] = useState("");
  const { getUsersByRole } = useData();
  const { toast } = useToast();
  
  // Get all judges
  const judges = getUsersByRole('judge');
  
  // Filter cases based on search query
  const filteredCases = newCases.filter(c => 
    c.status === "pending" && 
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     c.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleProcessCase = (caseId: string) => {
    setNewCases(prev => 
      prev.map(c => 
        c.id === caseId ? { ...c, status: "processed" } : c
      )
    );
    
    toast({
      title: "Case processed",
      description: "The case has been assigned and scheduled.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Cases</h1>
        <p className="text-muted-foreground">Process and assign newly filed cases</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by case title or client name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="pending">Pending Cases</TabsTrigger>
          <TabsTrigger value="processed">Processed Cases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          {filteredCases.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No pending cases found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCases.map(caseItem => (
                <Card key={caseItem.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={caseItem.clientAvatar} />
                            <AvatarFallback>{caseItem.clientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-muted-foreground">
                            {caseItem.clientName}
                          </p>
                        </div>
                      </div>
                      <Badge>{caseItem.caseType}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm mb-4">{caseItem.description}</p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`judge-${caseItem.id}`}>Assign Judge</Label>
                          <Select>
                            <SelectTrigger id={`judge-${caseItem.id}`}>
                              <SelectValue placeholder="Select a judge" />
                            </SelectTrigger>
                            <SelectContent>
                              {judges.map(judge => (
                                <SelectItem key={judge.id} value={judge.id}>
                                  {judge.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`date-${caseItem.id}`}>Initial Hearing Date</Label>
                          <Input
                            id={`date-${caseItem.id}`}
                            type="date"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`time-${caseItem.id}`}>Hearing Time</Label>
                          <Input
                            id={`time-${caseItem.id}`}
                            type="time"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`room-${caseItem.id}`}>Court Room</Label>
                          <Select>
                            <SelectTrigger id={`room-${caseItem.id}`}>
                              <SelectValue placeholder="Select a room" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="room101">Room 101</SelectItem>
                              <SelectItem value="room201">Room 201</SelectItem>
                              <SelectItem value="room302">Room 302</SelectItem>
                              <SelectItem value="room405">Room 405</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Submitted: {new Date(caseItem.submittedDate).toLocaleDateString()}
                    </div>
                    <Button onClick={() => handleProcessCase(caseItem.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Process Case
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="processed" className="mt-4">
          <div className="grid gap-4">
            {newCases
              .filter(c => c.status === "processed")
              .map(caseItem => (
                <Card key={caseItem.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {caseItem.clientName}
                        </p>
                      </div>
                      <Badge variant="outline">Processed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {caseItem.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Processed on {new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Case Type: {caseItem.caseType}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
            {newCases.filter(c => c.status === "processed").length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No processed cases yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewCases;
