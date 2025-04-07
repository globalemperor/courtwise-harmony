
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-4">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold">Cookie Policy</h1>
          <p className="text-white/90 mt-2">Last updated: August 15, 2023</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              This Cookie Policy explains how CourtWise ("we", "our", or "us") uses cookies and similar technologies to recognize you when you visit our website and application (collectively, the "Service"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
            <p className="text-muted-foreground">
              In some cases, we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. What are Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
            <p className="text-muted-foreground mb-4">
              Cookies set by the website owner (in this case, CourtWise) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. Why Do We Use Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Service to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Service. Third parties serve cookies through our Service for advertising, analytics, and other purposes.
            </p>
            <p className="text-muted-foreground">
              The specific types of first and third-party cookies served through our Service and the purposes they perform are described below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. Types of Cookies We Use</h2>
            
            <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies are strictly necessary to provide you with services available through our Service and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Service, you cannot refuse them without impacting how our Service functions.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Performance and Functionality Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies are used to enhance the performance and functionality of our Service but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Analytics and Customization Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies collect information that is used either in aggregate form to help us understand how our Service is being used or how effective our marketing campaigns are, or to help us customize our Service for you.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Security Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies are used to enhance the security of our Service and protect user data. They help detect unauthorized access attempts and enforce security policies.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Session State Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies maintain your logged-in status during your session on our Service and help ensure that your experience is consistent and secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. How Can You Control Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner on our website.
            </p>
            <p className="text-muted-foreground mb-4">
              You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Service though your access to some functionality and areas of our Service may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.
            </p>
            <p className="text-muted-foreground">
              In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-court-blue hover:underline">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-court-blue hover:underline">http://www.youronlinechoices.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. Do Not Track</h2>
            <p className="text-muted-foreground mb-4">
              Please note that we do not alter our Service's data collection and use practices when we see a Do Not Track signal from your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              Our Service may use third-party services, such as Google Analytics, to help us understand how our Service is used. These services may collect information sent by your browser as part of a web page request, including your IP address or other identifiers, and may use cookies or other technologies to track your activity.
            </p>
            <p className="text-muted-foreground">
              For more information on how Google Analytics uses data collected through our Service, please visit: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-court-blue hover:underline">https://policies.google.com/technologies/partner-sites</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. Updates to This Cookie Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
            <p className="text-muted-foreground">
              The date at the top of this Cookie Policy indicates when it was last updated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about our use of cookies or other technologies, please contact us at privacy@courtwise.com.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="flex items-center">
                <Link to="/terms">
                  Terms of Service
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex items-center">
                <Link to="/privacy">
                  Privacy Policy
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex items-center">
                <Link to="/gdpr">
                  GDPR Compliance
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
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

export default CookiePolicy;
