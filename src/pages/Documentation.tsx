
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  ChevronRight,
  BookOpen,
  User,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Lock,
  HelpCircle
} from "lucide-react";

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const docSections = [
    {
      title: "Getting Started",
      icon: BookOpen,
      items: [
        { title: "Introduction to CourtWise", path: "#introduction" },
        { title: "Creating Your Account", path: "#creating-account" },
        { title: "Platform Overview", path: "#platform-overview" },
        { title: "User Roles & Permissions", path: "#user-roles" }
      ]
    },
    {
      title: "User Profiles",
      icon: User,
      items: [
        { title: "Setting Up Your Profile", path: "#profile-setup" },
        { title: "Updating Personal Information", path: "#update-info" },
        { title: "Profile Privacy Settings", path: "#profile-privacy" },
        { title: "Managing Notifications", path: "#notifications" }
      ]
    },
    {
      title: "Case Management",
      icon: FileText,
      items: [
        { title: "Creating a New Case", path: "#new-case" },
        { title: "Case Details & Information", path: "#case-details" },
        { title: "Document Management", path: "#documents" },
        { title: "Case Status Updates", path: "#case-status" }
      ]
    },
    {
      title: "Communication",
      icon: MessageSquare,
      items: [
        { title: "Messaging System Overview", path: "#messaging-overview" },
        { title: "Sending & Receiving Messages", path: "#sending-messages" },
        { title: "Communication Rules", path: "#communication-rules" },
        { title: "Attachments & Files", path: "#attachments" }
      ]
    },
    {
      title: "Schedule & Calendar",
      icon: Calendar,
      items: [
        { title: "Calendar Overview", path: "#calendar-overview" },
        { title: "Scheduling Hearings", path: "#scheduling" },
        { title: "Reminders & Notifications", path: "#reminders" },
        { title: "Calendar Integrations", path: "#calendar-integrations" }
      ]
    },
    {
      title: "Account Settings",
      icon: Settings,
      items: [
        { title: "Account Preferences", path: "#account-preferences" },
        { title: "Password & Security", path: "#password-security" },
        { title: "Linked Accounts", path: "#linked-accounts" },
        { title: "Notification Settings", path: "#notification-settings" }
      ]
    },
    {
      title: "Security & Privacy",
      icon: Lock,
      items: [
        { title: "Data Protection", path: "#data-protection" },
        { title: "Privacy Controls", path: "#privacy-controls" },
        { title: "Security Best Practices", path: "#security-practices" },
        { title: "Compliance Information", path: "#compliance" }
      ]
    },
    {
      title: "Troubleshooting",
      icon: HelpCircle,
      items: [
        { title: "Common Issues", path: "#common-issues" },
        { title: "Technical Support", path: "#technical-support" },
        { title: "Bug Reporting", path: "#bug-reporting" },
        { title: "System Requirements", path: "#system-requirements" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/help" className="inline-flex items-center text-white hover:text-white/80 mb-6">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Help Center
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
            Comprehensive guides for using every feature of the CourtWise platform.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search documentation..."
                className="pl-10 py-6 bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-white/70" />
              <Button type="submit" className="absolute right-1 top-1 bg-white text-court-blue hover:bg-white/90">
                Search
              </Button>
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Documentation Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Categories */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="font-bold text-lg mb-4 pb-2 border-b">Documentation</h2>
              <nav className="space-y-4">
                {docSections.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                      <section.icon className="h-4 w-4 mr-2" />
                      {section.title}
                    </h3>
                    <ul className="pl-6 space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <a 
                            href={item.path} 
                            className="text-sm text-court-blue hover:underline block py-1"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Introduction to CourtWise</h2>
                <p className="mb-4 text-muted-foreground">
                  CourtWise is a comprehensive court case management platform designed for legal professionals, clients, and court officials. This documentation provides detailed information on how to use the platform effectively.
                </p>
                <p className="mb-6 text-muted-foreground">
                  Throughout this documentation, you'll find step-by-step guides, tips, and best practices for getting the most out of CourtWise. If you can't find what you're looking for, please visit our <Link to="/faq" className="text-court-blue hover:underline">FAQ</Link> or <Link to="/contact" className="text-court-blue hover:underline">contact our support team</Link>.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="font-semibold mb-2">Note for New Users</h3>
                  <p className="text-sm">
                    If you're new to CourtWise, we recommend starting with the "Getting Started" section and then exploring the features relevant to your role.
                  </p>
                </div>
              </section>

              <section id="creating-account" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Creating Your Account</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Registration Process</h3>
                    <p className="mb-4 text-muted-foreground">
                      To create a CourtWise account, visit our sign-up page and follow these steps:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 mb-4">
                      <li>Click on "Get Started" or "Sign Up" on the homepage</li>
                      <li>Select your user role (Client, Lawyer, Clerk, or Judge)</li>
                      <li>Provide your email address and create a secure password</li>
                      <li>Fill in your personal and professional information</li>
                      <li>Verify your email address</li>
                      <li>Complete your profile setup</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Role-Specific Information</h3>
                    <p className="mb-4 text-muted-foreground">
                      Different user roles require different information during registration:
                    </p>
                    <ul className="space-y-4">
                      <li className="bg-green-50 p-3 rounded-md">
                        <strong className="text-green-700">Clients:</strong> Personal information, contact details, and government ID details.
                      </li>
                      <li className="bg-blue-50 p-3 rounded-md">
                        <strong className="text-blue-700">Lawyers:</strong> Bar ID/license number, practice areas, years of experience, and professional credentials.
                      </li>
                      <li className="bg-purple-50 p-3 rounded-md">
                        <strong className="text-purple-700">Court Officials:</strong> Official position, court affiliation, and professional credentials.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Additional dummy content to show page structure */}
              <section id="platform-overview" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
                <p className="mb-4 text-muted-foreground">
                  This section provides a high-level overview of the CourtWise platform and its key features.
                </p>
                <div className="border-l-4 border-court-blue pl-4 italic text-muted-foreground">
                  This section contains detailed explanations of the platform structure, navigation, and core functionality. For a visual tour, please refer to our <Link to="/guides" className="text-court-blue hover:underline">User Guides</Link>.
                </div>
              </section>
              
              {/* Documentation Footer with Navigation */}
              <div className="border-t pt-4 mt-12 flex justify-between">
                <div></div>
                <div className="flex">
                  <Button asChild variant="ghost" className="flex items-center">
                    <a href="#user-roles">
                      Next: User Roles & Permissions
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-court-blue-dark text-white/80 py-6 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2023 CourtWise. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/terms" className="text-sm hover:text-white">Terms</Link>
            <Link to="/privacy" className="text-sm hover:text-white">Privacy</Link>
            <Link to="/contact" className="text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Documentation;
