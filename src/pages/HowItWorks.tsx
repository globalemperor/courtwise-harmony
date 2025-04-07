
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Users, Briefcase, Gavel, CheckSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const userFlows = [
    {
      title: "For Clients",
      icon: Users,
      color: "bg-green-100",
      iconColor: "text-green-600",
      steps: [
        "Create an account and provide your personal information",
        "Browse available lawyers based on expertise and ratings",
        "Submit your case details and request representation",
        "Communicate securely with your assigned lawyer",
        "Track case progress and attend scheduled hearings"
      ]
    },
    {
      title: "For Lawyers",
      icon: Briefcase,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      steps: [
        "Register with your professional credentials and expertise",
        "Review and accept client case requests",
        "File new cases and upload relevant documents",
        "Communicate with clients, clerks, and receive updates",
        "Manage your calendar and case workload efficiently"
      ]
    },
    {
      title: "For Court Officials",
      icon: Gavel,
      color: "bg-court-blue-light/20",
      iconColor: "text-court-blue",
      steps: [
        "Access the platform with your official credentials",
        "Process case filings and schedule hearings",
        "Communicate with relevant parties through secure channels",
        "Update case statuses and generate court documents",
        "Maintain court records and oversee case progression"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-6">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">How CourtWise Works</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            A simple guide to using the CourtWise platform for all users.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <Card className="p-6">
            <CardContent className="pt-4">
              <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
              <p className="text-muted-foreground mb-6">
                CourtWise streamlines court case management by connecting clients, lawyers, and court officials in a secure digital environment. Our platform handles the entire lifecycle of court cases, from filing to resolution, with built-in communication tools and document management.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    Client Portal
                  </h3>
                  <p className="text-sm">Find legal representation and stay informed about your case progress.</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                    Lawyer Workspace
                  </h3>
                  <p className="text-sm">Manage client cases, documents, and court communications efficiently.</p>
                </div>
                
                <div className="bg-court-blue-light/10 p-4 rounded-lg border border-court-blue-light/30">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Gavel className="h-5 w-5 text-court-blue mr-2" />
                    Court Administration
                  </h3>
                  <p className="text-sm">Process filings, schedule hearings, and maintain court records.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* User Journeys */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">User Journeys</h2>
          
          <div className="space-y-8">
            {userFlows.map((flow, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className={`h-12 w-12 rounded-full ${flow.color} flex items-center justify-center mr-4`}>
                      <flow.icon className={`h-6 w-6 ${flow.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold">{flow.title}</h3>
                  </div>
                  
                  <ol className="relative border-l border-gray-200 ml-6 space-y-6">
                    {flow.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="mb-6 ml-8">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -left-3 ring-8 ring-white">
                          <span className="flex items-center justify-center w-5 h-5 bg-court-blue text-white rounded-full text-xs">
                            {stepIndex + 1}
                          </span>
                        </span>
                        <p className="text-base font-medium">{step}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Getting Started</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center text-blue-700">
                  <span className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 text-blue-700 text-sm">1</span>
                  Create Your Account
                </h3>
                <p className="text-sm">Sign up with your details as a client, lawyer, or court official. Each role has a tailored experience.</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center text-green-700">
                  <span className="bg-green-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 text-green-700 text-sm">2</span>
                  Set Up Your Profile
                </h3>
                <p className="text-sm">Complete your profile with all necessary details and credentials to make the most of the platform.</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center text-purple-700">
                  <span className="bg-purple-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 text-purple-700 text-sm">3</span>
                  Start Using Features
                </h3>
                <p className="text-sm">Explore the dashboard, connect with other users, and utilize the features specific to your role.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" asChild className="bg-court-blue hover:bg-court-blue-dark">
              <Link to="/login">Get Started Now</Link>
            </Button>
          </div>
        </section>

        {/* FAQ Summary */}
        <section>
          <Card className="bg-blue-50 border border-blue-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <CheckSquare className="h-5 w-5 text-court-blue mr-2" />
                    Is my data secure on CourtWise?
                  </h3>
                  <p className="text-sm ml-7">Yes, CourtWise implements enterprise-grade security protocols and complies with legal data protection standards.</p>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    <CheckSquare className="h-5 w-5 text-court-blue mr-2" />
                    Can I communicate with all users on the platform?
                  </h3>
                  <p className="text-sm ml-7">Communication is role-based to maintain case integrity. Clients can communicate with their lawyers, lawyers with clients and clerks, and judges primarily with clerks.</p>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    <CheckSquare className="h-5 w-5 text-court-blue mr-2" />
                    How do I get more help with using CourtWise?
                  </h3>
                  <p className="text-sm ml-7">Visit our <Link to="/help" className="text-court-blue hover:underline">Help Center</Link> or <Link to="/documentation" className="text-court-blue hover:underline">Documentation</Link> for detailed information and guidance.</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <Link to="/faq" className="text-court-blue hover:underline inline-flex items-center">
                  View all FAQs
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
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

export default HowItWorks;
