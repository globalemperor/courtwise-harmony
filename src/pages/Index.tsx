
import { Button } from "@/components/ui/button";
import { Gavel, Scale, Users, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-court-blue py-16 md:py-24 px-4">
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
              <Link to="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-court-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Powerful Features for Court Case Management
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 flex hover:shadow-lg transition-shadow hover:scale-[1.02] transition-transform"
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

      {/* User Roles Section */}
      <section className="py-16 px-4">
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
              <div key={role} className="border rounded-lg p-6 text-center hover:shadow-md transition-all hover:scale-105">
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
      <section className="bg-court-blue-dark py-12 px-4 text-white">
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

      {/* Simple Footer */}
      <footer className="bg-court-blue-dark border-t border-white/10 py-6 px-4 text-white/70">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2023 CourtWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
