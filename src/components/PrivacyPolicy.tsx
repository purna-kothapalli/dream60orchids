
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="border-purple-400 text-purple-600 hover:bg-purple-600 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">Privacy Policy</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Privacy Promise */}
          <Card className="bg-green-50 border-green-200 p-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <Lock className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Our Privacy Promise</h3>
                <p className="text-purple-600">
                  Dream60 is committed to protecting your privacy and personal information. 
                  We collect only what's necessary to provide our auction services and never sell your data.
                </p>
              </div>
            </div>
          </Card>

          {/* Privacy Sections */}
          <div className="space-y-6">
            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center">
                <Database className="w-6 h-6 text-purple-600 mr-2" />
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-purple-600">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Full name and date of birth (for age verification)</li>
                    <li>Email address and phone number</li>
                    <li>Username and profile preferences</li>
                    <li>Government-issued ID for identity verification</li>
                    <li>Mailing address for prize delivery</li>
                    <li>Tax identification numbers (for winnings over $600)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Financial Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Payment method details (encrypted and tokenized)</li>
                    <li>Billing addresses and payment history</li>
                    <li>Transaction records and timestamps</li>
                    <li>Entry fees and bid amounts</li>
                    <li>Prize winnings and tax reporting data</li>
                    <li>Chargeback and dispute records</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Gaming and Usage Data</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Auction participation history and patterns</li>
                    <li>Bidding strategies and timing preferences</li>
                    <li>Win/loss records and statistics</li>
                    <li>Account creation and login timestamps</li>
                    <li>Device fingerprints for fraud prevention</li>
                    <li>Session duration and platform interactions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>IP addresses and geolocation data</li>
                    <li>Browser type, version, and settings</li>
                    <li>Operating system and device information</li>
                    <li>Referral sources and marketing campaign data</li>
                    <li>Website navigation and click patterns</li>
                    <li>Error logs and performance metrics</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4 text-purple-600">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Core Service Operations</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Processing auction entries and bid payments</li>
                    <li>Verifying user identity and preventing fraud</li>
                    <li>Managing account access and security</li>
                    <li>Delivering prizes and processing winnings</li>
                    <li>Providing customer support and dispute resolution</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Communication and Notifications</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Sending auction results and winner notifications</li>
                    <li>Account security alerts and login notifications</li>
                    <li>Platform updates and maintenance notices</li>
                    <li>Marketing communications (with consent)</li>
                    <li>Legal notices and policy updates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Platform Improvement and Analytics</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Analyzing user behavior to improve services</li>
                    <li>Developing new features and auction formats</li>
                    <li>Optimizing platform performance and user experience</li>
                    <li>Conducting market research and trend analysis</li>
                    <li>Testing new algorithms and security measures</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Legal and Regulatory Compliance</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Tax reporting for winnings and payments</li>
                    <li>Anti-money laundering (AML) monitoring</li>
                    <li>Know Your Customer (KYC) verification</li>
                    <li>Responding to legal requests and subpoenas</li>
                    <li>Maintaining records as required by law</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">3. Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-purple-600">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Service Providers and Partners</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Payment processors for transaction handling</li>
                    <li>Identity verification services for KYC compliance</li>
                    <li>Cloud hosting providers for data storage</li>
                    <li>Email and communication service providers</li>
                    <li>Analytics platforms for usage insights</li>
                    <li>Prize fulfillment and shipping partners</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Legal and Regulatory Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Tax authorities for reporting winnings</li>
                    <li>Law enforcement in response to valid legal requests</li>
                    <li>Regulatory bodies for compliance audits</li>
                    <li>Courts pursuant to legal proceedings</li>
                    <li>Government agencies as required by law</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Business Operations</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Potential buyers in case of business sale or merger</li>
                    <li>Professional advisors (lawyers, auditors, consultants)</li>
                    <li>Fraud prevention networks and databases</li>
                    <li>Public leaderboards and winner announcements</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">User Consent and Control</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Marketing partners (only with explicit consent)</li>
                    <li>Social media platforms for sharing (user-initiated)</li>
                    <li>Third-party integrations (user-authorized)</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">4. Data Security and Protection</h2>
              <div className="space-y-4 text-purple-600">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Technical Safeguards</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>AES-256 encryption for data at rest</li>
                    <li>TLS 1.3 encryption for data in transit</li>
                    <li>End-to-end encryption for sensitive communications</li>
                    <li>Secure tokenization of payment information</li>
                    <li>Regular security patches and updates</li>
                    <li>Multi-factor authentication options</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Access Controls and Monitoring</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Role-based access control (RBAC) systems</li>
                    <li>Privileged access management (PAM)</li>
                    <li>24/7 security monitoring and alerting</li>
                    <li>Automated threat detection and response</li>
                    <li>Regular access reviews and audits</li>
                    <li>Employee background checks and training</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Infrastructure Security</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>SOC 2 Type II certified data centers</li>
                    <li>Redundant systems and disaster recovery</li>
                    <li>Network segmentation and firewalls</li>
                    <li>DDoS protection and traffic filtering</li>
                    <li>Regular penetration testing and vulnerability assessments</li>
                    <li>Secure development lifecycle (SDLC) practices</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Incident Response</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>24-hour breach notification procedures</li>
                    <li>Forensic investigation capabilities</li>
                    <li>Customer notification protocols</li>
                    <li>Regulatory reporting procedures</li>
                    <li>Business continuity and recovery plans</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">5. Your Privacy Rights and Controls</h2>
              <div className="space-y-4 text-purple-600">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Access and Portability</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Request a complete copy of your personal data</li>
                    <li>Download your data in machine-readable formats</li>
                    <li>View your transaction and activity history</li>
                    <li>Access your privacy settings and preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Correction and Updates</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Update your profile and contact information</li>
                    <li>Correct inaccurate personal data</li>
                    <li>Modify communication preferences</li>
                    <li>Change payment methods and billing information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Deletion and Restriction</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Request complete account deletion</li>
                    <li>Restrict processing of certain data types</li>
                    <li>Opt out of marketing communications</li>
                    <li>Withdraw consent for optional data processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Communication Controls</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Unsubscribe from marketing emails</li>
                    <li>Adjust notification preferences</li>
                    <li>Control social media sharing</li>
                    <li>Manage cookie preferences</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">6. Cookies and Tracking Technologies</h2>
              <div className="space-y-4 text-purple-600">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Essential Cookies</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Authentication and session management</li>
                    <li>Security tokens and fraud prevention</li>
                    <li>Load balancing and performance optimization</li>
                    <li>User preference storage</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Analytics and Performance</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Google Analytics for usage statistics</li>
                    <li>Performance monitoring and optimization</li>
                    <li>Error tracking and bug reporting</li>
                    <li>A/B testing and feature evaluation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Marketing and Advertising</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Conversion tracking for marketing campaigns</li>
                    <li>Retargeting and personalized advertising</li>
                    <li>Social media integration pixels</li>
                    <li>Email marketing engagement tracking</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Cookie Management</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Browser settings for cookie control</li>
                    <li>Opt-out tools for advertising cookies</li>
                    <li>Platform cookie preference center</li>
                    <li>Regular cookie audit and cleanup</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">7. Data Retention and Deletion</h2>
              <div className="space-y-4 text-purple-600">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Active Account Data</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Personal and account information: Retained while account is active</li>
                    <li>Transaction history: Retained for 7 years for tax and legal compliance</li>
                    <li>Communication logs: Retained for 3 years for dispute resolution</li>
                    <li>Security logs: Retained for 2 years for fraud prevention</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Closed Account Data</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Basic account info: Deleted after 90 days of closure</li>
                    <li>Financial records: Retained for 7 years for tax compliance</li>
                    <li>Fraud prevention data: Retained for 5 years</li>
                    <li>Legal dispute data: Retained until resolution + 2 years</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Data Minimization</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Regular review and deletion of unnecessary data</li>
                    <li>Anonymization of old analytical data</li>
                    <li>Automated deletion schedules for temporary data</li>
                    <li>Secure destruction of physical and digital records</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">8. International Data Transfers</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">8.1 Global Operations:</strong> Dream60 operates globally and may transfer data internationally to provide services.</p>
                <p><strong className="text-purple-800">8.2 Adequacy Decisions:</strong> We transfer data to countries with adequate privacy protection as determined by regulators.</p>
                <p><strong className="text-purple-800">8.3 Safeguarding Mechanisms:</strong> For other transfers, we use Standard Contractual Clauses and other approved mechanisms.</p>
                <p><strong className="text-purple-800">8.4 Data Localization:</strong> Some data may be stored in your region to comply with local data residency requirements.</p>
                <p><strong className="text-purple-800">8.5 Transfer Documentation:</strong> We maintain records of all international data transfers and their legal basis.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">9. Children's Privacy</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">9.1 Age Requirements:</strong> Dream60 is strictly for users 18 years and older. We do not knowingly collect data from minors.</p>
                <p><strong className="text-purple-800">9.2 Age Verification:</strong> We implement age verification measures including ID checks and third-party verification services.</p>
                <p><strong className="text-purple-800">9.3 Parental Controls:</strong> Parents who discover their minor child has created an account should contact us immediately for deletion.</p>
                <p><strong className="text-purple-800">9.4 COPPA Compliance:</strong> We comply with the Children's Online Privacy Protection Act and similar international laws.</p>
                <p><strong className="text-purple-800">9.5 Educational Outreach:</strong> We support digital literacy and responsible online behavior for young adults.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">10. Changes to This Privacy Policy</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">10.1 Policy Updates:</strong> We may update this policy to reflect changes in our practices, technology, or legal requirements.</p>
                <p><strong className="text-purple-800">10.2 Notification Methods:</strong> Material changes will be communicated via email, platform notifications, and website announcements.</p>
                <p><strong className="text-purple-800">10.3 Notice Period:</strong> We provide at least 30 days notice for significant changes affecting user rights.</p>
                <p><strong className="text-purple-800">10.4 Continued Use:</strong> Continued use of Dream60 after changes take effect constitutes acceptance of the updated policy.</p>
                <p><strong className="text-purple-800">10.5 Version Control:</strong> We maintain historical versions of this policy for reference and compliance purposes.</p>
              </div>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="bg-purple-50 border-purple-200 p-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <Eye className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Questions About Privacy?</h3>
                <p className="text-purple-600 mb-3">
                  If you have any questions about this privacy policy or how we handle your data, 
                  please don't hesitate to contact us.
                </p>
                <p className="text-purple-800">Email: privacy@dream60.com</p>
                <p className="text-purple-800">Subject Line: Privacy Policy Inquiry</p>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-purple-200">
            <p className="text-purple-600">
              Last updated: September 23, 2025
            </p>
            <p className="text-purple-600 mt-2">
              We may update this privacy policy from time to time. We'll notify you of any significant changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}