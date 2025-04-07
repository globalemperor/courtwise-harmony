
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Gavel, Scale, Users, BookOpen, MessageSquare, Calendar, Briefcase, BarChart4, Shield, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-6">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Features</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            Explore the comprehensive features that make CourtWise the leading court case management platform.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Core Features Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Core Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-court-blue/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-court-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                    <p className="text-muted-foreground mb-4">
                      Tailored interfaces for clients, lawyers, clerks, and judges with appropriate permissions and views.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Personalized dashboards for each user role</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Customized navigation and functionality</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Data visibility controls based on user permissions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-court-blue/10 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-court-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Case Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Create, view, update, and track court cases with comprehensive details and document management.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Case creation and lifecycle tracking</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Document creation, storage, and version control</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Case status updates and notifications</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-court-blue/10 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-court-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Hearing Scheduling</h3>
                    <p className="text-muted-foreground mb-4">
                      Schedule and manage court hearings, with notifications for all involved parties.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Automated scheduling optimization</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Calendar integration and reminders</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Conflict detection and resolution</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-court-blue/10 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-court-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure Communication</h3>
                    <p className="text-muted-foreground mb-4">
                      Built-in messaging system for direct communication between authorized parties.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>End-to-end encrypted messaging</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Role-based communication controls</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Message history and searchability</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Additional Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-court-blue-light/20 flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-court-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Document Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Store, organize, and share legal documents securely within the platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-court-blue-light/20 flex items-center justify-center mb-4">
                    <BarChart4 className="h-8 w-8 text-court-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    View detailed analytics on case progress, outcomes, and performance metrics.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-court-blue-light/20 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-court-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-grade security with full compliance to legal data protection standards.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12 text-center">
          <Card className="bg-court-blue text-white p-8">
            <CardContent className="p-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Experience CourtWise?</h2>
              <p className="mb-6 max-w-2xl mx-auto">
                Join thousands of legal professionals who use CourtWise to streamline their court case workflows.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-court-blue hover:bg-white/90">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/how-it-works">Learn How It Works</Link>
                </Button>
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

export default Features;
