
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-4">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold">Terms of Service</h1>
          <p className="text-white/90 mt-2">Last updated: August 15, 2023</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to CourtWise ("Company", "we", "our", "us")! These Terms of Service ("Terms", "Terms of Service") govern your use of our website and application (collectively, the "Service") operated by CourtWise.
            </p>
            <p className="text-muted-foreground mb-4">
              Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: <Link to="/privacy" className="text-court-blue hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-muted-foreground">
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. Communications</h2>
            <p className="text-muted-foreground mb-4">
              By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing us at support@courtwise.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p className="text-muted-foreground mb-4">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
            </p>
            <p className="text-muted-foreground">
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. Content</h2>
            <p className="text-muted-foreground mb-4">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
            </p>
            <p className="text-muted-foreground mb-4">
              By posting Content to the Service, you grant us the right and license to use, modify, perform, display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
            </p>
            <p className="text-muted-foreground">
              You represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. Legal Use Restrictions</h2>
            <p className="text-muted-foreground mb-4">
              The CourtWise platform is designed to facilitate legitimate legal processes. You agree not to use the Service for any illegal, fraudulent, unauthorized, or improper purposes.
            </p>
            <p className="text-muted-foreground mb-4">
              Specifically, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>Submit false or misleading information to courts or other users</li>
              <li>Impersonate others or misrepresent your credentials or qualifications</li>
              <li>Use the Service to engage in unauthorized practice of law</li>
              <li>Attempt to circumvent proper legal channels or procedures</li>
              <li>Submit documents or information that violates attorney-client privilege without authorization</li>
              <li>Use the platform for purposes other than legitimate court case management</li>
            </ul>
            <p className="text-muted-foreground">
              Any violation of these restrictions may result in immediate termination of your account and potential legal consequences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. Professional Responsibility</h2>
            <p className="text-muted-foreground mb-4">
              For legal professionals using the Service, these Terms do not replace your professional ethical obligations. Legal professionals must adhere to all applicable rules of professional conduct, ethics guidelines, and standards of professional responsibility in their jurisdiction.
            </p>
            <p className="text-muted-foreground">
              CourtWise is a tool to facilitate legal processes but does not substitute for professional judgment. All users must ensure their use of the Service complies with their professional obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="text-muted-foreground">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service, or contact us at support@courtwise.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall CourtWise, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">9. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">10. Changes</h2>
            <p className="text-muted-foreground">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms, please contact us at support@courtwise.com.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="flex items-center">
                <Link to="/privacy">
                  Privacy Policy
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex items-center">
                <Link to="/cookies">
                  Cookie Policy
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

export default TermsOfService;
