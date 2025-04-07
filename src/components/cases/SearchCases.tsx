
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Case } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export const SearchCases = () => {
  const { cases } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Case[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const results = cases.filter(
      (caseItem) =>
        caseItem.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.parties?.some(party => 
          party.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    
    setSearchResults(results);
  };

  const getCaseStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'on_hold':
        return <Badge className="bg-orange-500">On Hold</Badge>;
      case 'dismissed':
        return <Badge className="bg-red-500">Dismissed</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Closed</Badge>;
      case 'pending':
        return <Badge className="bg-purple-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <Search className="h-4 w-4 mr-2" />
          Search Cases
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Search Cases</DialogTitle>
          <DialogDescription>
            Enter a case number, title, or party name to search for cases.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 my-4">
          <Input
            placeholder="Search by case number, title, or party name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        
        {searchResults.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Parties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.caseNumber || "N/A"}</TableCell>
                    <TableCell>{caseItem.title}</TableCell>
                    <TableCell>{getCaseStatusBadge(caseItem.status)}</TableCell>
                    <TableCell>
                      {caseItem.parties ? (
                        <div className="space-y-1">
                          {caseItem.parties.map((party, index) => (
                            <div key={index}>
                              <span className="text-xs font-medium">{party.role}: </span>
                              <span className="text-xs">{party.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : searchTerm !== "" ? (
          <div className="text-center py-4 text-muted-foreground">
            No cases found.
          </div>
        ) : null}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
