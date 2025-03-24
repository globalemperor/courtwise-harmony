import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Search, PlusCircle, Send, User, Info, AlertOctagon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { UserRole, Case } from "@/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const canCommunicate = (
  senderRole: UserRole,
  recipientRole: UserRole,
  senderId: string,
  recipientId: string,
  cases: Case[]
): boolean => {
  const isInvolvedInCommonCase = () => {
    for (const caseItem of cases) {
      if (
        (senderRole === 'client' && recipientRole === 'lawyer' && 
         caseItem.clientId === senderId && caseItem.lawyerId === recipientId) ||
        (senderRole === 'lawyer' && recipientRole === 'client' && 
         caseItem.lawyerId === senderId && caseItem.clientId === recipientId)
      ) {
        return true;
      }
      
      if (
        (senderRole === 'lawyer' && (recipientRole === 'clerk' || recipientRole === 'judge') && 
         caseItem.lawyerId === senderId) ||
        ((senderRole === 'clerk' || senderRole === 'judge') && recipientRole === 'lawyer' && 
         caseItem.lawyerId === recipientId)
      ) {
        return true;
      }
      
      if (
        (senderRole === 'clerk' && recipientRole === 'judge') ||
        (senderRole === 'judge' && recipientRole === 'clerk')
      ) {
        return true;
      }
    }
    return false;
  };

  return isInvolvedInCommonCase();
};

const MessageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MessageConversation = ({ 
  userId, 
  userRole,
  partnerId, 
  caseId,
  onSendMessage,
  messageContent,
  setMessageContent,
  userCases,
  messages,
  getUserById
}: { 
  userId: string, 
  userRole: UserRole,
  partnerId: string,
  caseId: string | null,
  onSendMessage: () => void,
  messageContent: string,
  setMessageContent: (value: string) => void,
  userCases: Case[],
  messages: any[],
  getUserById: (id: string) => any
}) => {
  const partner = getUserById(partnerId);
  
  if (!partner) return null;
  
  const isCommunicationAllowed = canCommunicate(
    userRole, 
    partner.role, 
    userId, 
    partnerId,
    userCases
  );
  
  const conversation = messages
    .filter(msg => 
      (msg.senderId === userId && msg.recipientId === partnerId) ||
      (msg.senderId === partnerId && msg.recipientId === userId)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };
  
  return (
    <Card className="flex flex-col h-[calc(100vh-13rem)]">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={partner.avatarUrl} />
            <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{partner.name}</CardTitle>
            <CardDescription>{partner.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {!isCommunicationAllowed && (
          <div className="flex justify-center my-4">
            <div className="bg-red-50 text-red-800 px-4 py-3 rounded-md flex items-center space-x-2 max-w-md">
              <AlertOctagon className="h-5 w-5 text-red-600" />
              <p className="text-sm">
                You are not authorized to communicate with this user.
                Communication is restricted based on case assignments.
              </p>
            </div>
          </div>
        )}
        
        {conversation.length > 0 ? (
          conversation.map(msg => {
            const isIncoming = msg.senderId === partnerId;
            const sender = getUserById(msg.senderId);
            
            return (
              <div 
                key={msg.id} 
                className={`flex ${isIncoming ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`
                  max-w-[75%] p-3 rounded-lg
                  ${isIncoming 
                    ? 'bg-accent rounded-tl-none' 
                    : 'bg-primary text-primary-foreground rounded-tr-none'}
                `}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isIncoming ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                    {format(new Date(msg.createdAt), "h:mm a, MMM d")}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-4">
              <MessageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start a conversation with {partner.name}</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <div className="flex w-full space-x-2">
          <Textarea 
            placeholder={isCommunicationAllowed 
              ? "Type a message..." 
              : "Communication is restricted"
            }
            className="min-h-[60px] flex-1"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!isCommunicationAllowed}
          />
          <Button 
            onClick={onSendMessage} 
            className="self-end"
            disabled={!isCommunicationAllowed}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const Messages = () => {
  const { user } = useAuth();
  const { 
    messages, 
    users, 
    sendMessage, 
    getUserById, 
    cases, 
    getCasesByUser,
    getCaseById 
  } = useData();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const caseIdFromUrl = searchParams.get('case');
  const recipientIdFromUrl = searchParams.get('recipient');

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(caseIdFromUrl);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

  const userCases = user ? getCasesByUser(user.id, user.role) : [];

  useEffect(() => {
    if (caseIdFromUrl && user) {
      const caseDetail = getCaseById(caseIdFromUrl);
      
      if (caseDetail) {
        if (user.role === 'client' && caseDetail.lawyerId) {
          setSelectedUser(caseDetail.lawyerId);
        } else if (user.role === 'lawyer' && caseDetail.clientId) {
          setSelectedUser(caseDetail.clientId);
        }
        setSelectedCaseId(caseIdFromUrl);
      }
    }

    if (recipientIdFromUrl) {
      setSelectedUser(recipientIdFromUrl);
    }
  }, [caseIdFromUrl, recipientIdFromUrl, user, getCaseById]);

  if (!user) return null;

  const userMessages = messages
    .filter(msg => msg.senderId === user.id || msg.recipientId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const conversationPartners = Array.from(
    new Set(
      userMessages.map(msg => 
        msg.senderId === user.id ? msg.recipientId : msg.senderId
      )
    )
  );

  const getAllowedUsers = () => {
    const result: string[] = [];
    
    users.forEach(potentialRecipient => {
      if (potentialRecipient.id === user.id) return;
      
      if (canCommunicate(
        user.role, 
        potentialRecipient.role, 
        user.id, 
        potentialRecipient.id,
        userCases
      )) {
        result.push(potentialRecipient.id);
      }
    });
    
    return result;
  };

  const allowedUserIds = getAllowedUsers();

  const getFilteredUsers = () => {
    let partners = conversationPartners.filter(partnerId => {
      const partner = getUserById(partnerId);
      return partner && allowedUserIds.includes(partner.id);
    });

    if (searchQuery) {
      partners = partners.filter(partnerId => {
        const partner = getUserById(partnerId);
        return partner && 
          (partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           partner.email.toLowerCase().includes(searchQuery.toLowerCase()));
      });
    }

    if (userTypeFilter !== "all") {
      partners = partners.filter(partnerId => {
        const partner = getUserById(partnerId);
        return partner && partner.role === userTypeFilter;
      });
    }

    return partners;
  };

  const filteredConversationPartners = getFilteredUsers();

  const getPotentialRecipients = () => {
    let recipients = users.filter(
      u => allowedUserIds.includes(u.id) && !conversationPartners.includes(u.id)
    );

    if (userTypeFilter !== "all") {
      recipients = recipients.filter(u => u.role === userTypeFilter);
    }

    return recipients;
  };

  const potentialRecipients = getPotentialRecipients();

  const getFilterOptions = () => {
    const options = [{ value: "all", label: "All" }];
    
    if (user.role === 'clerk') {
      options.push({ value: "judge", label: "Judges" });
      options.push({ value: "lawyer", label: "Lawyers" });
    } else if (user.role === 'judge') {
      options.push({ value: "clerk", label: "Clerks" });
      options.push({ value: "lawyer", label: "Lawyers" });
    } else if (user.role === 'lawyer') {
      options.push({ value: "client", label: "Clients" });
      options.push({ value: "judge", label: "Judges" });
      options.push({ value: "clerk", label: "Clerks" });
    } else if (user.role === 'client') {
      options.push({ value: "lawyer", label: "Lawyers" });
    }
    
    return options;
  };

  const filterOptions = getFilterOptions();

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedUser) {
      toast({
        title: "Cannot send message",
        description: "Please select a recipient and enter a message",
        variant: "destructive"
      });
      return;
    }

    try {
      const recipient = getUserById(selectedUser);
      if (!recipient) {
        toast({
          title: "Recipient not found",
          description: "The selected recipient could not be found",
          variant: "destructive"
        });
        return;
      }

      if (!canCommunicate(user.role, recipient.role, user.id, recipient.id, userCases)) {
        toast({
          title: "Communication restricted",
          description: `You are not authorized to send messages to this ${recipient.role}`,
          variant: "destructive"
        });
        return;
      }

      await sendMessage({
        content: messageContent,
        senderId: user.id,
        senderRole: user.role,
        recipientId: selectedUser,
        recipientRole: recipient.role,
        caseId: selectedCaseId || undefined
      });

      setMessageContent("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully"
      });
      
      setShowNewMessageForm(false);
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message",
        variant: "destructive"
      });
    }
  };

  const getCommunicationInstructions = () => {
    switch (user.role) {
      case 'client':
        return "As a client, you can only communicate with lawyers assigned to your cases.";
      case 'lawyer':
        return "As a lawyer, you can communicate with your clients, court clerks, and judges related to your cases.";
      case 'clerk':
        return "As a court clerk, you can only communicate with lawyers involved in cases and judges assigned to those cases.";
      case 'judge':
        return "As a judge, you can only communicate with lawyers involved in your assigned cases and court clerks.";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with authorized court personnel</p>
        </div>
        
        <Button onClick={() => setShowNewMessageForm(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800">{getCommunicationInstructions()}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Conversations</CardTitle>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm mr-2">Filter:</span>
                  <ToggleGroup 
                    type="single" 
                    value={userTypeFilter}
                    onValueChange={(value) => value && setUserTypeFilter(value)}
                    className="flex-wrap"
                  >
                    {filterOptions.map(option => (
                      <ToggleGroupItem 
                        key={option.value} 
                        value={option.value}
                        size="sm"
                        className="text-xs"
                      >
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredConversationPartners.length > 0 ? (
                <div className="space-y-1">
                  {filteredConversationPartners.map(partnerId => {
                    const partner = getUserById(partnerId);
                    if (!partner) return null;
                    
                    if (!allowedUserIds.includes(partner.id)) return null;
                    
                    const lastMessage = userMessages.find(
                      msg => msg.senderId === partnerId || msg.recipientId === partnerId
                    );
                    
                    return (
                      <div
                        key={partnerId}
                        className={`flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer ${selectedUser === partnerId ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedUser(partnerId)}
                      >
                        <Avatar>
                          <AvatarImage src={partner.avatarUrl} />
                          <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="font-medium">{partner.name}</p>
                            {lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(lastMessage.createdAt), "MMM d")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {partner.role}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {searchQuery || userTypeFilter !== "all"
                      ? "No conversations match your filters" 
                      : "No conversations yet"}
                  </p>
                  {!searchQuery && !showNewMessageForm && userTypeFilter === "all" && (
                    <Button 
                      variant="link" 
                      onClick={() => setShowNewMessageForm(true)}
                      className="mt-2"
                    >
                      Start a new conversation
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {showNewMessageForm ? (
            <Card>
              <CardHeader>
                <CardTitle>New Message</CardTitle>
                <CardDescription>Send a message to an authorized user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Type</label>
                  <ToggleGroup 
                    type="single" 
                    value={userTypeFilter} 
                    onValueChange={(value) => value && setUserTypeFilter(value)}
                  >
                    {filterOptions.map(option => (
                      option.value !== "all" && (
                        <ToggleGroupItem key={option.value} value={option.value}>
                          {option.label}
                        </ToggleGroupItem>
                      )
                    ))}
                  </ToggleGroup>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient</label>
                  <Select 
                    value={selectedUser} 
                    onValueChange={setSelectedUser}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredConversationPartners.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                            Recent Conversations
                          </div>
                          {filteredConversationPartners.map(partnerId => {
                            const partner = getUserById(partnerId);
                            if (!partner || !allowedUserIds.includes(partner.id)) return null;
                            
                            if (userTypeFilter !== "all" && partner.role !== userTypeFilter) return null;
                            
                            return (
                              <SelectItem key={`existing-${partner.id}`} value={partner.id}>
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={partner.avatarUrl} />
                                    <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span>{partner.name}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      ({partner.role})
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                          
                          {potentialRecipients.length > 0 && (
                            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground mt-2">
                              Other Users
                            </div>
                          )}
                        </>
                      )}
                      
                      {potentialRecipients.map(recipient => (
                        <SelectItem key={`new-${recipient.id}`} value={recipient.id}>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={recipient.avatarUrl} />
                              <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span>{recipient.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({recipient.role})
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Type your message here..." 
                    className="min-h-[120px]"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowNewMessageForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>
          ) : selectedUser ? (
            <MessageConversation 
              userId={user.id}
              userRole={user.role}
              partnerId={selectedUser}
              caseId={selectedCaseId}
              onSendMessage={handleSendMessage}
              messageContent={messageContent}
              setMessageContent={setMessageContent}
              userCases={userCases}
              messages={messages}
              getUserById={getUserById}
            />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select an existing conversation or start a new one
                </p>
                <Button onClick={() => setShowNewMessageForm(true)}>
                  Start New Conversation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
