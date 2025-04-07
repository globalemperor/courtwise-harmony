import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { ArrowRightIcon, MessageCircle, SearchIcon, Send, UserCircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSearchParams } from "react-router-dom";

const Messages = () => {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    getUserById, 
    getCaseById,
    getAcceptedLawyers
  } = useData();
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();
  
  const caseId = searchParams.get('case');
  const caseItem = caseId ? getCaseById(caseId) : null;

  useEffect(() => {
    if (caseItem && user) {
      if (user.role === 'client' && caseItem.lawyerId) {
        setSelectedUser(caseItem.lawyerId);
      } else if ((user.role === 'lawyer' || user.role === 'judge' || user.role === 'clerk') && caseItem.clientId) {
        setSelectedUser(caseItem.clientId);
      }
    }
  }, [caseItem, user]);

  if (!user) return null;

  const getUsers = () => {
    const allUsers = [];

    if (user.role === 'client') {
      const acceptedLawyers = getAcceptedLawyers(user.id);
      return acceptedLawyers;
    } 
    else if (user.role === 'lawyer') {
      if (filter === 'clients') {
        allUsers.push(...getUsersByRole('client'));
      } else if (filter === 'lawyers') {
        allUsers.push(...getUsersByRole('lawyer').filter(u => u.id !== user.id));
      } else if (filter === 'clerks') {
        allUsers.push(...getUsersByRole('clerk'));
      } else {
        allUsers.push(...getUsersByRole('client'));
        allUsers.push(...getUsersByRole('lawyer').filter(u => u.id !== user.id));
        allUsers.push(...getUsersByRole('clerk'));
      }
    } 
    else if (user.role === 'clerk') {
      if (filter === 'lawyers') {
        allUsers.push(...getUsersByRole('lawyer'));
      } else if (filter === 'clerks') {
        allUsers.push(...getUsersByRole('clerk').filter(u => u.id !== user.id));
      } else if (filter === 'judges') {
        allUsers.push(...getUsersByRole('judge'));
      } else {
        allUsers.push(...getUsersByRole('lawyer'));
        allUsers.push(...getUsersByRole('clerk').filter(u => u.id !== user.id));
        allUsers.push(...getUsersByRole('judge'));
      }
    } 
    else if (user.role === 'judge') {
      if (filter === 'clerks') {
        allUsers.push(...getUsersByRole('clerk'));
      } else if (filter === 'judges') {
        allUsers.push(...getUsersByRole('judge').filter(u => u.id !== user.id));
      } else {
        allUsers.push(...getUsersByRole('clerk'));
        allUsers.push(...getUsersByRole('judge').filter(u => u.id !== user.id));
      }
    }

    if (searchText) {
      return allUsers.filter(u => u.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    
    return allUsers;
  };

  const getUsersByRole = (role: 'client' | 'lawyer' | 'clerk' | 'judge') => {
    return Object.values(useData().users).filter(u => u.role === role);
  };

  const getMessagesWithUser = (userId: string) => {
    return messages.filter(
      m => (m.senderId === user?.id && m.recipientId === userId) ||
           (m.senderId === userId && m.recipientId === user?.id)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const getFilterTabs = () => {
    if (user.role === 'client') {
      return null;
    }
    
    if (user.role === 'lawyer') {
      return (
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="lawyers">Lawyers</TabsTrigger>
          <TabsTrigger value="clerks">Clerks</TabsTrigger>
        </TabsList>
      );
    }
    
    if (user.role === 'clerk') {
      return (
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="lawyers">Lawyers</TabsTrigger>
          <TabsTrigger value="clerks">Clerks</TabsTrigger>
          <TabsTrigger value="judges">Judges</TabsTrigger>
        </TabsList>
      );
    }
    
    if (user.role === 'judge') {
      return (
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="clerks">Clerks</TabsTrigger>
          <TabsTrigger value="judges">Judges</TabsTrigger>
        </TabsList>
      );
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;
    
    const recipient = getUserById(selectedUser);
    if (!recipient) return;
    
    sendMessage({
      senderId: user.id,
      senderRole: user.role,
      recipientId: selectedUser,
      recipientRole: recipient.role,
      content: messageText,
      caseId: caseId || undefined
    });
    
    setMessageText('');
  };

  const users = getUsers();
  const userMessages = selectedUser ? getMessagesWithUser(selectedUser) : [];
  const selectedUserObj = selectedUser ? getUserById(selectedUser) : null;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with parties involved in your cases</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 h-full">
        <Card className="md:col-span-1 flex flex-col h-full">
          <CardHeader className="space-y-4 pb-2">
            <div className="flex items-center border rounded-md">
              <Input 
                placeholder="Search users..." 
                className="border-0 focus:ring-0" 
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <SearchIcon className="h-5 w-5 me-2 text-muted-foreground" />
            </div>
            
            {user.role !== 'client' && (
              <Tabs defaultValue={filter} onValueChange={setFilter}>
                {getFilterTabs()}
                <div className="h-4"></div>
              </Tabs>
            )}
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto space-y-2 pb-0">
            {users.length > 0 ? (
              users.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className={`p-2 rounded-md cursor-pointer flex items-center space-x-3 ${
                    selectedUser === user.id ? 'bg-primary/10' : 'hover:bg-muted'
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-width-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <UserCircleIcon className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 flex flex-col h-full">
          {selectedUserObj ? (
            <>
              <CardHeader className="border-b pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedUserObj.avatarUrl} alt={selectedUserObj.name} />
                    <AvatarFallback>
                      {selectedUserObj.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedUserObj.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedUserObj.role.charAt(0).toUpperCase() + selectedUserObj.role.slice(1)}
                      {caseItem && ` • Case: ${caseItem.caseNumber || caseItem.id}`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {userMessages.length > 0 ? (
                  userMessages.map(message => {
                    const isCurrentUser = message.senderId === user.id;
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg p-3 max-w-[80%] ${
                          isCurrentUser ? 'bg-primary text-white' : 'bg-muted'
                        }`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'
                          }`}>
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground opacity-20" />
                    <p className="mt-2 text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground">Start the conversation by sending a message below.</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="border-t p-3">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!messageText.trim()}>
                    <Send className="h-5 w-5 mr-1" /> Send
                  </Button>
                </form>
              </CardFooter>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground opacity-20" />
              <p className="mt-2 text-lg font-medium">Select a conversation</p>
              <p className="text-muted-foreground">Choose a user from the left panel to start chatting</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
