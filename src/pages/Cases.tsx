
import { CaseList } from "@/components/cases/CaseList";

const Cases = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Case Management</h1>
        <p className="text-muted-foreground">View and manage all your court cases</p>
      </div>

      <CaseList />
    </div>
  );
};

export default Cases;
