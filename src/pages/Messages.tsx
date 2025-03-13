
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { UserRole } from "@/types";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const { user } = useAuth();
  const { messages, getUserById, users, sendMessage, getUsersByRole } = useData();
  const [newMessageContent, setNewMessageContent] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const { toast } = useToast();
  
  if (!user) return null;
  
  // Get messages where the current user is either sender or recipient
  const userMessages = messages.filter(
    m => m.senderId === user.id || m.recipientId === user.id
  ).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Get potential recipients based on user role
  const getPotentialRecipients = () => {
    let recipientRoles: UserRole[] = [];
    
    switch (user.role) {
      case 'client':
        recipientRoles = ['lawyer', 'clerk'];
        break;
      case 'lawyer':
        recipientRoles = ['client', 'judge', 'clerk'];
        break;
      case 'clerk':
        recipientRoles = ['client', 'lawyer', 'judge'];
        break;
      case 'judge':
        recipientRoles = ['lawyer', 'clerk'];
        break;
    }
    
    return recipientRoles.flatMap(role => getUsersByRole(role))
      .filter(u => u.id !== user.id);
  };

  const handleSendMessage = async () => {
    if (!newMessageContent.trim() || !selectedRecipientId) {
      toast({
        title: "Error",
        description: "Please enter a message and select a recipient",
        variant: "destructive"
      });
      return;
    }
    
    const recipient = getUserById(selectedRecipientId);
    if (!recipient) return;
    
    try {
      await sendMessage({
        senderId: user.id,
        senderRole: user.role,
        recipientId: selectedRecipientId,
        recipientRole: recipient.role,
        caseId: selectedCaseId || undefined,
        content: newMessageContent,
      });
      
      toast({
        title: "Message sent",
        description: `Your message to ${recipient.name} has been sent`,
      });
      
      setNewMessageContent("");
      setSelectedRecipientId("");
      setSelectedCaseId("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Manage communications with clients, lawyers, and court staff</p>
      </div>

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" /> New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send New Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient</label>
                <Select onValueChange={setSelectedRecipientId} value={selectedRecipientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPotentialRecipients().map(recipient => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        {recipient.name} ({recipient.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Related Case (Optional)</label>
                <Select onValueChange={setSelectedCaseId} value={selectedCaseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific case</SelectItem>
                    {/* Add case options here if needed */}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Input
                  className="h-20"
                  value={newMessageContent}
                  onChange={e => setNewMessageContent(e.target.value)}
                  placeholder="Type your message here..."
                  multiple
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {userMessages.length === 0 ? (
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center py-10">
              <p className="text-center text-muted-foreground mb-4">No messages found</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="mr-2 h-4 w-4" /> Start a New Conversation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send New Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recipient</label>
                      <Select onValueChange={setSelectedRecipientId} value={selectedRecipientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          {getPotentialRecipients().map(recipient => (
                            <SelectItem key={recipient.id} value={recipient.id}>
                              {recipient.name} ({recipient.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Input
                        className="h-20"
                        value={newMessageContent}
                        onChange={e => setNewMessageContent(e.target.value)}
                        placeholder="Type your message here..."
                        multiple
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSendMessage}>Send Message</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          userMessages.map(message => {
            const otherPartyId = message.senderId === user.id ? message.recipientId : message.senderId;
            const otherParty = getUserById(otherPartyId);
            const isIncoming = message.recipientId === user.id;

            return (
              <Card key={message.id} className={isIncoming ? "border-l-4 border-l-blue-500" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={otherParty?.avatarUrl} />
                        <AvatarFallback>{otherParty?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{otherParty?.name || "Unknown User"}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={isIncoming ? "outline" : "default"}>
                        {isIncoming ? "Received" : "Sent"}
                      </Badge>
                      {!message.read && isIncoming && (
                        <Badge className="ml-2" variant="destructive">New</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{message.content}</p>
                  {message.caseId && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Related to case #{message.caseId}
                    </div>
                  )}
                  {isIncoming && (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedRecipientId(otherPartyId);
                          setNewMessageContent(`Reply to: "${message.content.substring(0, 30)}${message.content.length > 30 ? '...' : ''}"\n\n`);
                          
                          document.getElementById('reply-dialog-trigger')?.click();
                        }}
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      
      {/* Hidden trigger for reply dialog */}
      <Dialog>
        <DialogTrigger id="reply-dialog-trigger" className="hidden"></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Input
                className="h-20"
                value={newMessageContent}
                onChange={e => setNewMessageContent(e.target.value)}
                multiple
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSendMessage}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
