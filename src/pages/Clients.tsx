
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserRound, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Clients = () => {
  const { user } = useAuth();
  const { users, cases } = useData();
  
  if (!user || user.role !== 'lawyer') {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Access denied</p>
        </CardContent>
      </Card>
    );
  }

  // Get cases where this lawyer is assigned
  const lawyerCases = cases.filter(c => c.lawyerId === user.id);
  
  // Get unique client IDs from those cases
  const clientIds = [...new Set(lawyerCases.map(c => c.clientId))];
  
  // Get client data for each client ID
  const lawyerClients = users.filter(u => 
    u.role === 'client' && clientIds.includes(u.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Clients</h1>
        <p className="text-muted-foreground">Manage your client relationships</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lawyerClients.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No clients found. Accept case requests to work with clients.</p>
              <div className="flex justify-center mt-4">
                <Button asChild variant="outline">
                  <Link to="/case-requests">View Case Requests</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          lawyerClients.map(client => {
            const clientCases = cases.filter(c => c.clientId === client.id && c.lawyerId === user.id);
            
            return (
              <Card key={client.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={client.avatarUrl} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {clientCases.length} {clientCases.length === 1 ? 'case' : 'cases'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Client</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>ID: {client.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/messages?recipient=${client.id}`}>Contact</Link>
                    </Button>
                    {clientCases.length > 0 && (
                      <Button size="sm" className="flex-1" asChild>
                        <Link to={`/cases/${clientCases[0].id}`}>View Case</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Clients;
