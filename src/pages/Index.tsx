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
              <Link to="/login/client">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10 transition-colors">
              <a href="#learn-more" className="text-court-blue-light">Learn More</a>
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

      {/* Learn More Section */}
      <section id="learn-more" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            How to Use CourtWise
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mt-8">
            <div className="space-y-6">
              <div className="bg-court-gray p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="bg-court-blue text-white h-7 w-7 rounded-full flex items-center justify-center mr-3">1</span>
                  Create Your Account
                </h3>
                <p className="text-muted-foreground">
                  Sign up as a client, lawyer, clerk, or judge. Each role has specific features tailored to your needs.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Select your role during signup</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Provide required credentials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Complete your profile</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-court-gray p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="bg-court-blue text-white h-7 w-7 rounded-full flex items-center justify-center mr-3">2</span>
                  Case Management
                </h3>
                <p className="text-muted-foreground">
                  Create, track, and manage court cases with comprehensive details and document handling.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Clients can request legal representation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Lawyers can file and manage cases</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Track case progress in real-time</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-court-gray p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="bg-court-blue text-white h-7 w-7 rounded-full flex items-center justify-center mr-3">3</span>
                  Communication
                </h3>
                <p className="text-muted-foreground">
                  Secure messaging between clients, lawyers, clerks, and judges for efficient case coordination.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Direct messaging with case participants</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Role-specific communication channels</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Secure document sharing</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-court-gray p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="bg-court-blue text-white h-7 w-7 rounded-full flex items-center justify-center mr-3">4</span>
                  Hearing Management
                </h3>
                <p className="text-muted-foreground">
                  Schedule, track, and attend court hearings with all necessary information at your fingertips.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>View upcoming hearings on your dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Judges can schedule and reschedule hearings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Receive notifications for schedule changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild className="bg-court-blue hover:bg-court-blue-dark">
              <Link to="/login/client">Get Started Now</Link>
            </Button>
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
                <a href="#" className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#learn-more" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/login/client" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/guides" className="hover:text-white transition-colors">User Guides</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/gdpr" className="hover:text-white transition-colors">GDPR Compliance</Link></li>
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
