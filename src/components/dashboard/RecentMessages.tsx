
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function RecentMessages() {
  const { user } = useAuth();
  const { messages, getUserById } = useData();

  if (!user) return null;

  const userMessages = messages
    .filter(
      (m) => m.recipientId === user.id || m.senderId === user.id
    )
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Messages</CardTitle>
        <CardDescription>Your latest conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userMessages.length > 0 ? (
            userMessages.map((message) => (
              <MessageCard 
                key={message.id} 
                message={message} 
                currentUserId={user.id}
                getUserById={getUserById} 
              />
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No messages yet
            </p>
          )}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/messages">View All Messages</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface MessageCardProps {
  message: Message;
  currentUserId: string;
  getUserById: (id: string) => any;
}

function MessageCard({ message, currentUserId, getUserById }: MessageCardProps) {
  const isCurrentUserSender = message.senderId === currentUserId;
  const otherUserId = isCurrentUserSender ? message.recipientId : message.senderId;
  const otherUser = getUserById(otherUserId);
  
  if (!otherUser) return null;
  
  return (
    <div className="flex items-start space-x-3 hover:bg-accent rounded-lg p-2 transition-colors">
      <Avatar className="h-8 w-8">
        <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
        <AvatarFallback>
          {otherUser.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium">{otherUser.name}</p>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), "MMM d, h:mm a")}
          </span>
        </div>
        <p className="text-xs line-clamp-2">{message.content}</p>
      </div>
    </div>
  );
}
