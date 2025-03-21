
import { Button } from "@/components/ui/button";
import { Gavel, Scale, Users, BookOpen, ArrowRight, CheckCircle2, Briefcase, BarChart4, Shield } from "lucide-react";
import { Link } from "react-router-dom";

// Mock stats for the platform
const platformStats = {
  clients: "5,240+",
  lawyers: "1,780+",
  judges: "420+",
  clerks: "650+",
  casesResolved: "10,500+",
};

const features = [
  {
    title: "User Role-Based Access",
    description: "Separate interfaces for clients, lawyers, clerks, and judges with appropriate permissions and views.",
    icon: Users,
  },
  {
    title: "Case Management",
    description: "Create, view, update, and track court cases with comprehensive details and document management.",
    icon: BookOpen,
  },
  {
    title: "Hearing Scheduling",
    description: "Schedule and manage court hearings, with notifications for all involved parties.",
    icon: Scale,
  },
  {
    title: "Secure Communication",
    description: "Built-in messaging system for direct communication between clients, lawyers, clerks, and judges.",
    icon: Gavel,
  },
];

// Additional features for the expanded section
const additionalFeatures = [
  {
    title: "Document Management",
    description: "Store, organize, and share legal documents securely within the platform.",
    icon: Briefcase,
  },
  {
    title: "Real-time Analytics",
    description: "View detailed analytics on case progress, outcomes, and performance metrics.",
    icon: BarChart4,
  },
  {
    title: "Secure & Compliant",
    description: "Enterprise-grade security with full compliance to legal data protection standards.",
    icon: Shield,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-court-blue to-court-blue-dark py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fadeIn">
            Streamline Your Court Case Management
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-fadeIn animation-delay-200">
            The comprehensive platform for managing court cases with efficiency, 
            transparency, and collaboration between clients, lawyers, clerks, and judges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn animation-delay-400">
            <Button size="lg" asChild className="bg-white text-court-blue hover:bg-white/90 hover:scale-105 transition-transform">
              <Link to="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10 transition-colors">
              <a href="#features" className="text-court-blue-light">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-court-gray-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 text-center animate-scaleIn">
            <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-3xl md:text-4xl font-bold text-court-blue">{platformStats.clients}</p>
              <p className="text-court-blue-dark font-medium mt-2">Clients</p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-3xl md:text-4xl font-bold text-court-blue">{platformStats.lawyers}</p>
              <p className="text-court-blue-dark font-medium mt-2">Lawyers</p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-3xl md:text-4xl font-bold text-court-blue">{platformStats.judges}</p>
              <p className="text-court-blue-dark font-medium mt-2">Judges</p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <p className="text-3xl md:text-4xl font-bold text-court-blue">{platformStats.clerks}</p>
              <p className="text-court-blue-dark font-medium mt-2">Clerks</p>
            </div>
          </div>
          <div className="text-center mt-8 text-court-blue-dark">
            <p className="text-xl font-medium">Over {platformStats.casesResolved} cases successfully resolved on our platform</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Powerful Features for Court Case Management
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-court-gray rounded-lg shadow-md p-6 flex hover:shadow-lg transition-shadow hover:scale-[1.02] transition-transform"
              >
                <div className="mr-4 bg-court-blue/10 p-3 rounded-lg h-fit">
                  <feature.icon className="h-6 w-6 text-court-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-court-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-court-blue-light flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ul className="inline-grid sm:grid-cols-2 gap-x-12 gap-y-4 text-left mx-auto">
              {[
                "Intuitive user interface",
                "24/7 technical support",
                "Regular feature updates",
                "Custom workflow options",
                "Data export capabilities",
                "Advanced search functionality"
              ].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-court-blue mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Tailored for Every Court Participant
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { role: "Client", path: "/login/client" },
              { role: "Lawyer", path: "/login/lawyer" },
              { role: "Clerk", path: "/login/clerk" },
              { role: "Judge", path: "/login/judge" }
            ].map(({ role, path }) => (
              <div key={role} className="border rounded-lg p-6 text-center hover:shadow-md transition-all hover:shadow-lg hover:border-court-blue">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-court-blue/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-court-blue" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{role}</h3>
                <p className="text-muted-foreground mb-4">
                  Specialized dashboard and tools for {role.toLowerCase()} needs
                </p>
                <Button variant="outline" asChild className="w-full hover:bg-court-blue hover:text-white transition-colors">
                  <Link to={path} className="flex items-center justify-center">
                    <span>Login as {role}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-court-blue-dark to-court-blue py-12 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Court Case Management?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of legal professionals who use CourtWise to streamline their 
            court case workflows and improve collaboration.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-court-blue hover:bg-white/90 hover:scale-105 transition-transform">
              <Link to="/login">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
              <Link to="/login/signup">Create an Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-court-blue-dark text-white/80 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">CourtWise</h3>
              <p className="mb-4">
                Simplifying court case management for legal professionals and clients worldwide.
              </p>
              <div className="flex gap-4">
                {/* Social media icons would go here */}
                <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer"></div>
                <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer"></div>
                <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer"></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p>© 2023 CourtWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
