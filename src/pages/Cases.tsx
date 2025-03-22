
import { CaseList } from "@/components/cases/CaseList";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FilePlus } from "lucide-react";

const Cases = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Case Management</h1>
          <p className="text-muted-foreground">View and manage all your court cases</p>
        </div>
        
        {user && user.role === "lawyer" && (
          <Button asChild>
            <Link to="/file-case" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              File New Case
            </Link>
          </Button>
        )}
      </div>

      <CaseList />
    </div>
  );
};

export default Cases;
