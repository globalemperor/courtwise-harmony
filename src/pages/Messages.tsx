
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
  const { user } = useAuth();
  const { messages, getUserById } = useData();
  
  if (!user) return null;
  
  // Get messages where the current user is either sender or recipient
  const userMessages = messages.filter(
    m => m.senderId === user.id || m.recipientId === user.id
  ).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Manage communications with clients, lawyers, and court staff</p>
      </div>

      <div className="grid gap-4">
        {userMessages.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No messages found</p>
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
                        <AvatarFallback>{otherParty?.name.charAt(0) || "U"}</AvatarFallback>
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
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Messages;
