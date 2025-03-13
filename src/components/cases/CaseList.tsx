
import { useData } from "@/context/DataContext";
import { Case, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function CaseList() {
  const { user } = useAuth();
  const { cases, getUserById } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) return null;

  let userCases = [];
  
  if (user.role === 'client') {
    userCases = cases.filter(c => c.clientId === user.id);
  } else if (user.role === 'lawyer') {
    userCases = cases.filter(c => c.lawyerId === user.id);
  } else {
    userCases = cases; // Clerks and judges see all cases
  }

  const filteredCases = userCases.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Cases</CardTitle>
              <CardDescription>
                {user.role === 'client' ? "Your" : "All"} court cases
              </CardDescription>
            </div>
            {user.role === 'client' && (
              <Button asChild>
                <Link to="/find-lawyer">Find a Lawyer</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, case number or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.id}
                  caseItem={caseItem}
                  userRole={user.role}
                  getUserById={getUserById}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No cases found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface CaseCardProps {
  caseItem: Case;
  userRole: UserRole;
  getUserById: (id: string) => any;
}

function CaseCard({ caseItem, userRole, getUserById }: CaseCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    active: "bg-green-100 text-green-800 hover:bg-green-200",
    scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    in_progress: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    on_hold: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    dismissed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    closed: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  const statusColor = statusColors[caseItem.status] || statusColors.pending;
  
  const client = getUserById(caseItem.clientId);
  const lawyer = caseItem.lawyerId ? getUserById(caseItem.lawyerId) : null;

  return (
    <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{caseItem.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Case #{caseItem.caseNumber}
              </p>
            </div>
            <Badge className={statusColor}>{caseItem.status.replace("_", " ")}</Badge>
          </div>
          <p className="text-sm mb-3 line-clamp-2">{caseItem.description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Client:</span> {client?.name || "Unknown"}
            </div>
            <div>
              <span className="font-medium">Lawyer:</span> {lawyer?.name || "Unassigned"}
            </div>
            <div>
              <span className="font-medium">Filed:</span> {caseItem.filedDate ? new Date(caseItem.filedDate).toLocaleDateString() : "Not filed"}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {formatDistanceToNow(new Date(caseItem.updatedAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <Button variant="outline" size="sm" className="flex-1 md:w-full" asChild>
            <Link to={`/cases/${caseItem.id}`}>View Details</Link>
          </Button>
          
          {userRole === 'lawyer' && (
            <Button size="sm" className="flex-1 md:w-full" asChild>
              <Link to={`/cases/${caseItem.id}/manage`}>Manage Case</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
