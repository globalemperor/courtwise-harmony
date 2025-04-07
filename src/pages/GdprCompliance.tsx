
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, CheckCircle, Shield } from "lucide-react";

const GdprCompliance = () => {
  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-4">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold">GDPR Compliance</h1>
          <p className="text-white/90 mt-2">Last updated: August 15, 2023</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-court-blue mr-3" />
              <h2 className="text-xl font-bold">Our Commitment to GDPR Compliance</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              At CourtWise, we are committed to ensuring the privacy and protection of your personal data in compliance with the General Data Protection Regulation (GDPR). This page outlines how we adhere to GDPR requirements and your rights under this regulation.
            </p>
            <p className="text-muted-foreground">
              The GDPR is a regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area. It also addresses the export of personal data outside the EU and EEA areas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Data Controller and Data Protection Officer</h2>
            <p className="text-muted-foreground mb-4">
              CourtWise acts as a data controller for the personal information we collect and process. We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this privacy notice.
            </p>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this privacy notice, including any requests to exercise your legal rights, please contact our DPO using the details set out below:
            </p>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="font-medium">Data Protection Officer</p>
              <p className="text-muted-foreground">Email: dpo@courtwise.com</p>
              <p className="text-muted-foreground">Address: 123 Legal Street, Suite 500, New York, NY 10001, USA</p>
            </div>
            <p className="text-muted-foreground">
              You have the right to make a complaint at any time to your local supervisory authority for data protection issues. We would, however, appreciate the chance to deal with your concerns before you approach the authority, so please contact us in the first instance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. GDPR Principles We Follow</h2>
            <p className="text-muted-foreground mb-4">
              We adhere to the principles set out in the GDPR, which require that personal data be:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Processed lawfully, fairly, and transparently</p>
                  <p className="text-sm text-muted-foreground">We ensure transparent information about how we use your data.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Collected for specified, explicit, and legitimate purposes</p>
                  <p className="text-sm text-muted-foreground">We only collect data necessary for the specific purposes we've stated.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Adequate, relevant, and limited to what's necessary</p>
                  <p className="text-sm text-muted-foreground">We practice data minimization, only collecting what we need.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Accurate and kept up to date</p>
                  <p className="text-sm text-muted-foreground">We maintain the accuracy of the personal data we hold.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Kept for no longer than necessary</p>
                  <p className="text-sm text-muted-foreground">We retain data only as long as needed for the stated purposes.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Processed securely</p>
                  <p className="text-sm text-muted-foreground">We implement strong security measures to protect your data.</p>
                </div>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. Your Rights Under GDPR</h2>
            <p className="text-muted-foreground mb-4">
              Under the GDPR, you have the following rights regarding your personal data:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Right to Access</h3>
                <p className="text-sm text-muted-foreground">You can request a copy of the personal data we hold about you.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Right to Rectification</h3>
                <p className="text-sm text-muted-foreground">You can request that we correct any inaccurate or incomplete data.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Right to Erasure</h3>
                <p className="text-sm text-muted-foreground">You can request that we delete your personal data in certain circumstances.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Right to Restrict Processing</h3>
                <p className="text-sm text-muted-foreground">You can request that we limit how we use your data.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Right to Data Portability</h3>
                <p className="text-sm text-muted-foreground">You can request a copy of your data in a machine-readable format.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Right to Object</h3>
                <p className="text-sm text-muted-foreground">You can object to our processing of your data in certain circumstances.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md md:col-span-2">
                <h3 className="font-medium mb-2">Rights Related to Automated Decision Making</h3>
                <p className="text-sm text-muted-foreground">You have rights regarding automated decision-making and profiling.</p>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, please contact our Data Protection Officer using the contact details provided above.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. International Data Transfers</h2>
            <p className="text-muted-foreground mb-4">
              CourtWise may transfer your personal data to countries outside the European Economic Area (EEA). When we do, we ensure a similar degree of protection is afforded to it by implementing at least one of the following safeguards:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>We will only transfer your personal data to countries that have been deemed to provide an adequate level of protection for personal data by the European Commission.</li>
              <li>Where we use certain service providers, we may use specific contracts approved by the European Commission which give personal data the same protection it has in Europe.</li>
              <li>Where we use providers based in the US, we may transfer data to them if they are part of the Privacy Shield which requires them to provide similar protection to personal data shared between Europe and the US.</li>
            </ul>
            <p className="text-muted-foreground">
              Please contact our Data Protection Officer if you want further information on the specific mechanism used by us when transferring your personal data out of the EEA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. Data Security Measures</h2>
            <p className="text-muted-foreground mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
            <p className="text-muted-foreground mb-4">
              Our security measures include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>Encryption of personal data</li>
              <li>Regular security testing and assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Staff training on data protection and security</li>
              <li>Incident response procedures</li>
              <li>Regular backups and disaster recovery planning</li>
            </ul>
            <p className="text-muted-foreground">
              We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about our GDPR compliance or wish to exercise any of your rights, please contact our Data Protection Officer at dpo@courtwise.com.
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
                <Link to="/cookies">
                  Cookie Policy
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

export default GdprCompliance;
