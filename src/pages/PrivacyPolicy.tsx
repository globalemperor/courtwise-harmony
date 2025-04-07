
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-4">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-white/90 mt-2">Last updated: August 15, 2023</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              CourtWise ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and application (collectively, the "Service").
            </p>
            <p className="text-muted-foreground">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service. We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold mb-2">Personal Data</h3>
            <p className="text-muted-foreground mb-4">
              We may collect personally identifiable information, such as your:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Government-issued ID numbers (for identity verification)</li>
              <li>Professional credentials (for lawyers, clerks, and judges)</li>
              <li>Case-related information you provide</li>
              <li>Payment information (when applicable)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Usage Data</h3>
            <p className="text-muted-foreground mb-4">
              We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Usage Data").
            </p>
            <p className="text-muted-foreground">
              This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. Use of Data</h2>
            <p className="text-muted-foreground mb-4">
              CourtWise uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To fulfill any other purpose for which you provide it</li>
              <li>To process and manage court cases and related legal matters</li>
              <li>To facilitate communication between authorized parties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. Legal Basis for Processing</h2>
            <p className="text-muted-foreground mb-4">
              We may process your personal data because:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>We need to perform a contract with you</li>
              <li>You have given us permission to do so</li>
              <li>The processing is in our legitimate interests and it's not overridden by your rights</li>
              <li>It is necessary to comply with legal obligations</li>
              <li>It is necessary to protect your vital interests or those of another person</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. Retention of Data</h2>
            <p className="text-muted-foreground mb-4">
              CourtWise will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p className="text-muted-foreground">
              We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. Transfer of Data</h2>
            <p className="text-muted-foreground mb-4">
              Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
            </p>
            <p className="text-muted-foreground mb-4">
              If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to the United States and process it there.
            </p>
            <p className="text-muted-foreground">
              Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer. CourtWise will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. Disclosure of Data</h2>
            <p className="text-muted-foreground mb-4">
              We may disclose your Personal Data in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li><strong>Legal Requirements:</strong> To comply with a legal obligation or court order</li>
              <li><strong>Business Transaction:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition</li>
              <li><strong>With Your Consent:</strong> With your explicit consent for other purposes</li>
              <li><strong>To Authorized Users:</strong> To other authorized users of the platform as necessary for case management (e.g., between client and lawyer, lawyer and clerk)</li>
              <li><strong>Service Providers:</strong> To third parties that perform services for us or on our behalf</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. Security of Data</h2>
            <p className="text-muted-foreground mb-4">
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
            <p className="text-muted-foreground">
              We implement a variety of security measures to maintain the safety of your personal information, including encryption, access controls, regular security assessments, and secure data centers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">9. Your Data Protection Rights</h2>
            <p className="text-muted-foreground mb-4">
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights. CourtWise aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
            </p>
            <p className="text-muted-foreground mb-4">
              If you wish to be informed about what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
            </p>
            <p className="text-muted-foreground mb-4">
              In certain circumstances, you have the following data protection rights:
            </p>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
              <li>The right to access, update or delete the information we have on you</li>
              <li>The right of rectification</li>
              <li>The right to object</li>
              <li>The right of restriction</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">10. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
            </p>
            <p className="text-muted-foreground mb-4">
              Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
            </p>
            <p className="text-muted-foreground mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
            <p className="text-muted-foreground">
              For more information about the cookies we use, please see our <Link to="/cookies" className="text-court-blue hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy, please contact us at privacy@courtwise.com.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="flex items-center">
                <Link to="/terms">
                  Terms of Service
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

export default PrivacyPolicy;
