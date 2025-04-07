
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Play,
  Users,
  Briefcase,
  Gavel,
  FileText,
  MessageSquare,
  Calendar,
  LayoutGrid,
  VideoIcon
} from "lucide-react";

const UserGuides = () => {
  const [selectedRole, setSelectedRole] = useState("all");
  
  interface Tutorial {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    roles: string[];
    category: string;
  }

  const tutorials: Tutorial[] = [
    {
      id: "getting-started",
      title: "Getting Started with CourtWise",
      description: "Learn the basics of the CourtWise platform and how to navigate the interface.",
      thumbnail: "https://placehold.co/640x360/court-blue/white?text=Getting+Started",
      duration: "5:30",
      roles: ["client", "lawyer", "clerk", "judge"],
      category: "basics"
    },
    {
      id: "profile-setup",
      title: "Setting Up Your Profile",
      description: "Complete your profile with professional information and preferences.",
      thumbnail: "https://placehold.co/640x360/court-blue/white?text=Profile+Setup",
      duration: "4:15",
      roles: ["client", "lawyer", "clerk", "judge"],
      category: "basics"
    },
    {
      id: "finding-lawyer",
      title: "How to Find and Request a Lawyer",
      description: "Search for lawyers based on expertise and send case requests.",
      thumbnail: "https://placehold.co/640x360/083344/white?text=Finding+Lawyer",
      duration: "6:20",
      roles: ["client"],
      category: "client"
    },
    {
      id: "track-case-progress",
      title: "Tracking Your Case Progress",
      description: "Monitor updates, documents, and status changes for your cases.",
      thumbnail: "https://placehold.co/640x360/083344/white?text=Case+Progress",
      duration: "4:45",
      roles: ["client", "lawyer"],
      category: "cases"
    },
    {
      id: "file-case",
      title: "Filing a New Case",
      description: "Create a new case with all required information and documents.",
      thumbnail: "https://placehold.co/640x360/0A5173/white?text=Filing+Case",
      duration: "8:10",
      roles: ["lawyer"],
      category: "cases"
    },
    {
      id: "manage-clients",
      title: "Managing Client Relationships",
      description: "Organize and maintain client relationships effectively.",
      thumbnail: "https://placehold.co/640x360/0A5173/white?text=Client+Management",
      duration: "5:50",
      roles: ["lawyer"],
      category: "lawyer"
    },
    {
      id: "schedule-hearings",
      title: "Scheduling Court Hearings",
      description: "Add, modify, and manage hearing dates and details.",
      thumbnail: "https://placehold.co/640x360/083344/white?text=Scheduling",
      duration: "4:30",
      roles: ["clerk", "judge"],
      category: "schedule"
    },
    {
      id: "process-filings",
      title: "Processing Case Filings",
      description: "Review and process new case filings in the system.",
      thumbnail: "https://placehold.co/640x360/2C3E50/white?text=Processing+Filings",
      duration: "7:15",
      roles: ["clerk"],
      category: "clerk"
    },
    {
      id: "secure-messaging",
      title: "Using the Secure Messaging System",
      description: "Communicate securely with other users on the platform.",
      thumbnail: "https://placehold.co/640x360/083344/white?text=Messaging",
      duration: "5:25",
      roles: ["client", "lawyer", "clerk", "judge"],
      category: "communication"
    },
    {
      id: "document-management",
      title: "Document Management",
      description: "Upload, organize, and share documents for your cases.",
      thumbnail: "https://placehold.co/640x360/083344/white?text=Documents",
      duration: "6:40",
      roles: ["client", "lawyer", "clerk", "judge"],
      category: "documents"
    }
  ];

  const categories = [
    { id: "all", label: "All Guides", icon: LayoutGrid },
    { id: "basics", label: "Getting Started", icon: VideoIcon },
    { id: "cases", label: "Case Management", icon: FileText },
    { id: "communication", label: "Communication", icon: MessageSquare },
    { id: "schedule", label: "Scheduling", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText }
  ];

  const roles = [
    { id: "all", label: "All Roles", icon: LayoutGrid },
    { id: "client", label: "For Clients", icon: Users },
    { id: "lawyer", label: "For Lawyers", icon: Briefcase },
    { id: "clerk", label: "For Clerks", icon: FileText },
    { id: "judge", label: "For Judges", icon: Gavel }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    if (selectedRole === "all") return true;
    return tutorial.roles.includes(selectedRole);
  });

  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/help" className="inline-flex items-center text-white hover:text-white/80 mb-6">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Help Center
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">User Guides</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            Step-by-step tutorials for using all features of the CourtWise platform.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs for filtering by role */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Browse Guides by Role</h2>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <Button 
                key={role.id}
                variant={selectedRole === role.id ? "default" : "outline"}
                className={`flex items-center gap-2 ${selectedRole === role.id ? "bg-court-blue" : ""}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <role.icon className="h-4 w-4" />
                {role.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <Tabs defaultValue="all">
            <div className="border-b mb-6">
              <TabsList className="bg-transparent border-b-0">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-court-blue rounded-none data-[state=active]:text-court-blue data-[state=active]:shadow-none"
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutorials.map(tutorial => (
                  <VideoCard key={tutorial.id} tutorial={tutorial} />
                ))}
              </div>
            </TabsContent>

            {categories.slice(1).map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTutorials
                    .filter(t => t.category === category.id)
                    .map(tutorial => (
                      <VideoCard key={tutorial.id} tutorial={tutorial} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* PDF Guides Section */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">PDF Guides & Cheatsheets</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-blue-50 flex items-center justify-center rounded-md mb-3">
                  <FileText className="h-12 w-12 text-court-blue" />
                </div>
                <h3 className="font-medium text-sm">Quick Start Guide</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">PDF • 2.4 MB</span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Download</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-green-50 flex items-center justify-center rounded-md mb-3">
                  <FileText className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="font-medium text-sm">Client User Manual</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">PDF • 5.1 MB</span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Download</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-amber-50 flex items-center justify-center rounded-md mb-3">
                  <FileText className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="font-medium text-sm">Lawyer's Reference</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">PDF • 3.8 MB</span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Download</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-purple-50 flex items-center justify-center rounded-md mb-3">
                  <FileText className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="font-medium text-sm">Court Officials Guide</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">PDF • 4.2 MB</span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Download</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="bg-court-blue-dark text-white/80 py-6 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2023 CourtWise. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/terms" className="text-sm hover:text-white">Terms</Link>
            <Link to="/privacy" className="text-sm hover:text-white">Privacy</Link>
            <Link to="/cookies" className="text-sm hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface VideoCardProps {
  tutorial: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    roles: string[];
    category: string;
  };
}

const VideoCard = ({ tutorial }: VideoCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all overflow-hidden">
      <Link to={`/guides/${tutorial.id}`}>
        <div className="relative">
          <img 
            src={tutorial.thumbnail} 
            alt={tutorial.title} 
            className="w-full h-[180px] object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {tutorial.duration}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">{tutorial.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{tutorial.description}</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default UserGuides;
