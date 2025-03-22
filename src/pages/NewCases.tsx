
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, UserPlus, Search, Calendar, FileText, Gavel, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

// Mock new case data
const MOCK_NEW_CASES = [
  {
    id: "1",
    title: "Thompson Custody Dispute",
    description: "Custody dispute for 2 children, ages 5 and 7",
    caseType: "Family",
    clientName: "Maria Thompson",
    clientId: "5",
    clientAvatar: "https://ui-avatars.com/api/?name=Maria+Thompson&background=random",
    submittedDate: "2023-06-22T10:30:00Z",
    status: "pending",
    defendantName: "John Thompson",
    defendantId: null
  },
  {
    id: "2",
    title: "Black vs. Smith Construction",
    description: "Contract dispute over incomplete construction work",
    caseType: "Civil",
    clientName: "Robert Black",
    clientId: "6",
    clientAvatar: "https://ui-avatars.com/api/?name=Robert+Black&background=random",
    submittedDate: "2023-06-21T15:45:00Z",
    status: "pending",
    defendantName: "Smith Construction LLC",
    defendantId: null
  },
  {
    id: "3",
    title: "Martinez Traffic Violation",
    description: "Contesting a speeding ticket with radar evidence",
    caseType: "Traffic",
    clientName: "Carlos Martinez",
    clientId: "5",
    clientAvatar: "https://ui-avatars.com/api/?name=Carlos+Martinez&background=random",
    submittedDate: "2023-06-20T09:15:00Z",
    status: "pending",
    defendantName: "State",
    defendantId: null
  }
];

const NewCases = () => {
  const [newCases, setNewCases] = useState(MOCK_NEW_CASES);
  const [searchQuery, setSearchQuery] = useState("");
  const { getUsersByRole, sendMessage } = useData();
  const { toast } = useToast();
  
  // Get all judges and lawyers
  const judges = getUsersByRole('judge');
  const lawyers = getUsersByRole('lawyer');
  
  // Track selected values for each case
  const [selectedValues, setSelectedValues] = useState<Record<string, {
    judgeId: string;
    prosecutorId: string;
    defenseId: string;
    date: string;
    time: string;
    room: string;
  }>>({});

  // Track booked slots to prevent conflicts
  const [bookedSlots, setBookedSlots] = useState<{
    judges: Record<string, string[]>,
    lawyers: Record<string, string[]>,
    rooms: Record<string, string[]>,
    clients: Record<string, string[]>
  }>({
    judges: {},
    lawyers: {},
    rooms: {},
    clients: {}
  });

  // Initialize selected values for each case
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    newCases.forEach(c => {
      initialValues[c.id] = {
        judgeId: "",
        prosecutorId: "",
        defenseId: "",
        date: "",
        time: "",
        room: ""
      };
    });
    setSelectedValues(initialValues);
  }, [newCases]);

  // Helper to format date-time string
  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return null;
    return `${date}T${time}`;
  };

  // Check if a slot is booked
  const isSlotBooked = (caseId: string, slotType: 'judges' | 'lawyers' | 'rooms' | 'clients', id: string, dateTime: string | null) => {
    if (!dateTime) return false;
    
    // Don't check conflicts for the current case
    const slots = Object.entries(bookedSlots[slotType]).filter(([bookedId]) => bookedId !== id);
    
    for (const [bookedId, bookedTimes] of slots) {
      if (bookedTimes.includes(dateTime)) {
        return true;
      }
    }
    
    return false;
  };

  // Update selected values
  const handleSelectChange = (caseId: string, field: string, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [caseId]: {
        ...prev[caseId],
        [field]: value
      }
    }));
  };

  // Filter cases based on search query
  const filteredCases = newCases.filter(c => 
    c.status === "pending" && 
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     c.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleProcessCase = async (caseId: string) => {
    const caseData = newCases.find(c => c.id === caseId);
    const selections = selectedValues[caseId];
    
    // Validate all required fields are filled
    if (!selections.judgeId || !selections.prosecutorId || !selections.defenseId || 
        !selections.date || !selections.time || !selections.room) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before processing the case",
        variant: "destructive",
      });
      return;
    }

    // Format date and time for checking conflicts
    const dateTime = formatDateTime(selections.date, selections.time);
    
    // Check for conflicts
    if (dateTime) {
      // Check judge conflict
      if (isSlotBooked(caseId, 'judges', selections.judgeId, dateTime)) {
        toast({
          title: "Schedule conflict",
          description: "The selected judge is already assigned to another case at this time",
          variant: "destructive",
        });
        return;
      }
      
      // Check prosecutor lawyer conflict
      if (isSlotBooked(caseId, 'lawyers', selections.prosecutorId, dateTime)) {
        toast({
          title: "Schedule conflict",
          description: "The selected prosecutor is already assigned to another case at this time",
          variant: "destructive",
        });
        return;
      }
      
      // Check defense lawyer conflict
      if (isSlotBooked(caseId, 'lawyers', selections.defenseId, dateTime)) {
        toast({
          title: "Schedule conflict",
          description: "The selected defense attorney is already assigned to another case at this time",
          variant: "destructive",
        });
        return;
      }
      
      // Check room conflict
      if (isSlotBooked(caseId, 'rooms', selections.room, dateTime)) {
        toast({
          title: "Schedule conflict",
          description: "The selected courtroom is already booked at this time",
          variant: "destructive",
        });
        return;
      }
      
      // Check client conflict (if client has another case at the same time)
      if (caseData && isSlotBooked(caseId, 'clients', caseData.clientId, dateTime)) {
        toast({
          title: "Schedule conflict",
          description: "The client is already scheduled for another case at this time",
          variant: "destructive",
        });
        return;
      }
      
      // If no conflicts, update booked slots
      setBookedSlots(prev => {
        const newBookedSlots = { ...prev };
        
        // Add judge booking
        if (!newBookedSlots.judges[selections.judgeId]) {
          newBookedSlots.judges[selections.judgeId] = [];
        }
        newBookedSlots.judges[selections.judgeId].push(dateTime);
        
        // Add prosecutor booking
        if (!newBookedSlots.lawyers[selections.prosecutorId]) {
          newBookedSlots.lawyers[selections.prosecutorId] = [];
        }
        newBookedSlots.lawyers[selections.prosecutorId].push(dateTime);
        
        // Add defense booking
        if (!newBookedSlots.lawyers[selections.defenseId]) {
          newBookedSlots.lawyers[selections.defenseId] = [];
        }
        newBookedSlots.lawyers[selections.defenseId].push(dateTime);
        
        // Add room booking
        if (!newBookedSlots.rooms[selections.room]) {
          newBookedSlots.rooms[selections.room] = [];
        }
        newBookedSlots.rooms[selections.room].push(dateTime);
        
        // Add client booking
        if (caseData) {
          if (!newBookedSlots.clients[caseData.clientId]) {
            newBookedSlots.clients[caseData.clientId] = [];
          }
          newBookedSlots.clients[caseData.clientId].push(dateTime);
        }
        
        return newBookedSlots;
      });
    }

    // Update case status
    setNewCases(prev => 
      prev.map(c => 
        c.id === caseId ? { ...c, status: "processed" } : c
      )
    );
    
    // Send notifications to all parties involved
    try {
      // Get user objects
      const judge = judges.find(j => j.id === selections.judgeId);
      const prosecutor = lawyers.find(l => l.id === selections.prosecutorId);
      const defense = lawyers.find(l => l.id === selections.defenseId);
      
      if (judge) {
        await sendMessage({
          content: `You have been assigned to case: ${caseData?.title}. Hearing scheduled for ${selections.date} at ${selections.time} in Room ${selections.room}.`,
          senderId: "system",
          senderRole: "clerk",
          recipientId: judge.id,
          recipientRole: "judge",
          caseId: caseId
        });
      }
      
      if (prosecutor) {
        await sendMessage({
          content: `You have been assigned as prosecutor for case: ${caseData?.title}. Hearing scheduled for ${selections.date} at ${selections.time} in Room ${selections.room}.`,
          senderId: "system",
          senderRole: "clerk",
          recipientId: prosecutor.id,
          recipientRole: "lawyer",
          caseId: caseId
        });
      }
      
      if (defense) {
        await sendMessage({
          content: `You have been assigned as defense attorney for case: ${caseData?.title}. Hearing scheduled for ${selections.date} at ${selections.time} in Room ${selections.room}.`,
          senderId: "system",
          senderRole: "clerk",
          recipientId: defense.id,
          recipientRole: "lawyer",
          caseId: caseId
        });
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
    
    toast({
      title: "Case processed",
      description: "The case has been assigned and scheduled successfully.",
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
                            {caseItem.clientName} (Client)
                          </p>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Defendant: {caseItem.defendantName}
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
                          <Label htmlFor={`judge-${caseItem.id}`}>Assign Judge <span className="text-red-500">*</span></Label>
                          <Select 
                            value={selectedValues[caseItem.id]?.judgeId || ""}
                            onValueChange={(value) => handleSelectChange(caseItem.id, 'judgeId', value)}
                          >
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
                          <Label htmlFor={`prosecutor-${caseItem.id}`}>Assign Prosecutor <span className="text-red-500">*</span></Label>
                          <Select
                            value={selectedValues[caseItem.id]?.prosecutorId || ""}
                            onValueChange={(value) => handleSelectChange(caseItem.id, 'prosecutorId', value)}
                          >
                            <SelectTrigger id={`prosecutor-${caseItem.id}`}>
                              <SelectValue placeholder="Select prosecutor" />
                            </SelectTrigger>
                            <SelectContent>
                              {lawyers.map(lawyer => (
                                <SelectItem 
                                  key={lawyer.id} 
                                  value={lawyer.id}
                                  disabled={lawyer.id === selectedValues[caseItem.id]?.defenseId}
                                >
                                  {lawyer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`defense-${caseItem.id}`}>Assign Defense Attorney <span className="text-red-500">*</span></Label>
                        <Select
                          value={selectedValues[caseItem.id]?.defenseId || ""}
                          onValueChange={(value) => handleSelectChange(caseItem.id, 'defenseId', value)}
                        >
                          <SelectTrigger id={`defense-${caseItem.id}`}>
                            <SelectValue placeholder="Select defense attorney" />
                          </SelectTrigger>
                          <SelectContent>
                            {lawyers.map(lawyer => (
                              <SelectItem 
                                key={lawyer.id} 
                                value={lawyer.id}
                                disabled={lawyer.id === selectedValues[caseItem.id]?.prosecutorId}
                              >
                                {lawyer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`date-${caseItem.id}`}>Initial Hearing Date <span className="text-red-500">*</span></Label>
                          <Input
                            id={`date-${caseItem.id}`}
                            type="date"
                            value={selectedValues[caseItem.id]?.date || ""}
                            onChange={(e) => handleSelectChange(caseItem.id, 'date', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`time-${caseItem.id}`}>Hearing Time <span className="text-red-500">*</span></Label>
                          <Input
                            id={`time-${caseItem.id}`}
                            type="time"
                            value={selectedValues[caseItem.id]?.time || ""}
                            onChange={(e) => handleSelectChange(caseItem.id, 'time', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`room-${caseItem.id}`}>Court Room <span className="text-red-500">*</span></Label>
                        <Select
                          value={selectedValues[caseItem.id]?.room || ""}
                          onValueChange={(value) => handleSelectChange(caseItem.id, 'room', value)}
                        >
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
                      
                      {/* Conflict warnings */}
                      {selectedValues[caseItem.id]?.date && selectedValues[caseItem.id]?.time && (
                        <div className="text-xs space-y-1">
                          <p className="font-medium">Availability check:</p>
                          <ul className="space-y-1">
                            {selectedValues[caseItem.id]?.judgeId && isSlotBooked(
                              caseItem.id, 
                              'judges', 
                              selectedValues[caseItem.id]?.judgeId, 
                              formatDateTime(selectedValues[caseItem.id]?.date, selectedValues[caseItem.id]?.time)
                            ) && (
                              <li className="flex items-center text-red-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Judge is already booked at this time
                              </li>
                            )}
                            
                            {selectedValues[caseItem.id]?.prosecutorId && isSlotBooked(
                              caseItem.id, 
                              'lawyers', 
                              selectedValues[caseItem.id]?.prosecutorId, 
                              formatDateTime(selectedValues[caseItem.id]?.date, selectedValues[caseItem.id]?.time)
                            ) && (
                              <li className="flex items-center text-red-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Prosecutor is already booked at this time
                              </li>
                            )}
                            
                            {selectedValues[caseItem.id]?.defenseId && isSlotBooked(
                              caseItem.id, 
                              'lawyers', 
                              selectedValues[caseItem.id]?.defenseId, 
                              formatDateTime(selectedValues[caseItem.id]?.date, selectedValues[caseItem.id]?.time)
                            ) && (
                              <li className="flex items-center text-red-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Defense attorney is already booked at this time
                              </li>
                            )}
                            
                            {selectedValues[caseItem.id]?.room && isSlotBooked(
                              caseItem.id, 
                              'rooms', 
                              selectedValues[caseItem.id]?.room, 
                              formatDateTime(selectedValues[caseItem.id]?.date, selectedValues[caseItem.id]?.time)
                            ) && (
                              <li className="flex items-center text-red-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Room is already booked at this time
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
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
