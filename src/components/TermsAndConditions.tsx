
import { ArrowLeft, Scale, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface TermsAndConditionsProps {
  onBack: () => void;
}

export function TermsAndConditions({ onBack }: TermsAndConditionsProps) {
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
            <Scale className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">Terms & Conditions</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Important Notice */}
          <Card className="bg-purple-50 border-purple-200 p-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Important Notice</h3>
                <p className="text-purple-600">
                  By participating in Dream60 auctions, you agree to these terms and conditions. 
                  Please read carefully before placing any bids.
                </p>
              </div>
            </div>
          </Card>

          {/* Terms Sections */}
          <div className="space-y-6">
            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">1.1 Agreement:</strong> By accessing or using Dream60, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                <p><strong className="text-purple-800">1.2 Eligibility:</strong> You must be at least 18 years old and legally capable of entering into binding contracts to use our services.</p>
                <p><strong className="text-purple-800">1.3 Jurisdiction:</strong> These terms are governed by the laws of the United States and the State of Delaware.</p>
                <p><strong className="text-purple-800">1.4 Modifications:</strong> We reserve the right to modify these terms at any time with 30 days notice via email and platform notifications.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">2. Game Rules and Mechanics</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">2.1 Auction Format:</strong> Dream60 operates 6 auctions daily, each lasting exactly 60 minutes with 6 boxes per auction.</p>
                <p><strong className="text-purple-800">2.2 Entry Requirements:</strong> Boxes 1-2 require random entry fees (₹1000-₹3500) paid exactly as displayed. Entry fee unlocks access to all bidding rounds.</p>
                <p><strong className="text-purple-800">2.3 Bidding Rounds:</strong> Boxes 3-6 open every 15 minutes (at 0, 15, 30, and 45-minute marks) with minimum bids of ₹700 and maximum bids of 90% of prize value.</p>
                <p><strong className="text-purple-800">2.4 Bidding Frequency:</strong> Users may place one bid per box per 15-minute interval. No bid stacking or automated bidding allowed.</p>
                <p><strong className="text-purple-800">2.5 Winning Conditions:</strong> Highest valid bid when each box closes wins the associated prize. Multiple winners possible per auction.</p>
                <p><strong className="text-purple-800">2.6 Tie-Breaking:</strong> In case of identical bids, the first bid submitted wins (timestamp priority).</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">3. Account Terms and Security</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">3.1 Account Creation:</strong> Users must provide accurate, complete, and current information. One account per person strictly enforced.</p>
                <p><strong className="text-purple-800">3.2 Identity Verification:</strong> We require government-issued photo ID and address verification for accounts with winnings over $600.</p>
                <p><strong className="text-purple-800">3.3 Account Security:</strong> Users are responsible for maintaining account security. Report suspected unauthorized access immediately.</p>
                <p><strong className="text-purple-800">3.4 Account Suspension:</strong> We reserve the right to suspend accounts for violations, fraud, or suspicious activity.</p>
                <p><strong className="text-purple-800">3.5 Account Termination:</strong> Either party may terminate the account relationship with 30 days notice. Immediate termination for serious violations.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">4. Financial Terms and Payment</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">4.1 Pay-As-You-Go Model:</strong> Dream60 operates on direct payment basis. No pre-funding or subscription fees required.</p>
                <p><strong className="text-purple-800">4.2 Entry Fees:</strong> All entry fees are final and non-refundable once paid, regardless of auction outcome or user participation.</p>
                <p><strong className="text-purple-800">4.3 Bid Payments:</strong> All bids require immediate payment and are final. No bid cancellations or modifications allowed.</p>
                <p><strong className="text-purple-800">4.4 Payment Methods:</strong> We accept major credit cards, debit cards, PayPal, and select digital payment methods. All payments processed securely.</p>
                <p><strong className="text-purple-800">4.5 Failed Payments:</strong> Failed payments result in immediate bid/entry disqualification. No grace period provided.</p>
                <p><strong className="text-purple-800">4.6 Chargebacks:</strong> Unauthorized chargebacks result in immediate account termination and potential legal action.</p>
                <p><strong className="text-purple-800">4.7 Taxes:</strong> Winners are responsible for all applicable taxes on prizes valued over $600.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">5. Prize Terms and Fulfillment</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">5.1 Prize Values:</strong> All prize values are stated in USD and represent fair market value at time of auction.</p>
                <p><strong className="text-purple-800">5.2 Prize Claim Period:</strong> Winners have 30 days to claim prizes. Unclaimed prizes forfeit to Dream60.</p>
                <p><strong className="text-purple-800">5.3 Delivery:</strong> Prizes shipped free worldwide within 14 business days of verification. Tracking information provided.</p>
                <p><strong className="text-purple-800">5.4 Cash Alternatives:</strong> We reserve the right to substitute cash value for physical prizes at our discretion.</p>
                <p><strong className="text-purple-800">5.5 Import Duties:</strong> International winners responsible for customs fees and import duties.</p>
                <p><strong className="text-purple-800">5.6 Prize Condition:</strong> Prizes delivered new in original packaging unless otherwise specified.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">6. Prohibited Activities</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">6.1 Multiple Accounts:</strong> Creating or operating multiple accounts strictly prohibited. Immediate termination of all accounts.</p>
                <p><strong className="text-purple-800">6.2 Automated Systems:</strong> Use of bots, scripts, or automated bidding systems prohibited. Technical measures in place to detect violations.</p>
                <p><strong className="text-purple-800">6.3 Collusion:</strong> Coordinating with other users to manipulate auctions prohibited. Includes bid sharing or strategic coordination.</p>
                <p><strong className="text-purple-800">6.4 System Exploitation:</strong> Attempting to exploit bugs, glitches, or vulnerabilities prohibited. Report issues to support immediately.</p>
                <p><strong className="text-purple-800">6.5 False Information:</strong> Providing false identity, payment, or contact information prohibited.</p>
                <p><strong className="text-purple-800">6.6 Harassment:</strong> Abusive behavior toward other users or staff prohibited. Respectful communication required.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">7. Platform Responsibilities and Service Level</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">7.1 Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance communicated in advance.</p>
                <p><strong className="text-purple-800">7.2 Technical Issues:</strong> In case of system failures during auctions, affected auctions may be paused, restarted, or cancelled with full refunds.</p>
                <p><strong className="text-purple-800">7.3 Fair Play Monitoring:</strong> We actively monitor for violations using automated systems and manual review.</p>
                <p><strong className="text-purple-800">7.4 Dispute Resolution:</strong> All legitimate disputes investigated within 5 business days. Decision final and binding.</p>
                <p><strong className="text-purple-800">7.5 Data Security:</strong> We implement industry-standard security measures but cannot guarantee absolute security.</p>
                <p><strong className="text-purple-800">7.6 Customer Support:</strong> Support available 24/7 via email, live chat, and phone for urgent issues.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">8. Limitation of Liability and Disclaimers</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">8.1 Maximum Liability:</strong> Our total liability for any claims related to an auction is limited to the total amount you paid for that specific auction.</p>
                <p><strong className="text-purple-800">8.2 Indirect Damages:</strong> We are not liable for indirect, incidental, special, consequential, or punitive damages under any circumstances.</p>
                <p><strong className="text-purple-800">8.3 Service Disclaimer:</strong> Services provided "as is" without warranties of any kind, express or implied.</p>
                <p><strong className="text-purple-800">8.4 Force Majeure:</strong> Not liable for delays or failures due to acts of God, government actions, network failures, or other circumstances beyond our reasonable control.</p>
                <p><strong className="text-purple-800">8.5 Third Party Links:</strong> Not responsible for content or practices of linked third-party websites.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">9. Intellectual Property Rights</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">9.1 Platform Ownership:</strong> Dream60 platform, including all software, graphics, and content, is our exclusive property.</p>
                <p><strong className="text-purple-800">9.2 Trademark Usage:</strong> Dream60 name and logos are registered trademarks. Unauthorized use prohibited.</p>
                <p><strong className="text-purple-800">9.3 User Content:</strong> Users retain rights to content they create but grant us license to use for platform operation and marketing.</p>
                <p><strong className="text-purple-800">9.4 Copyright Protection:</strong> All content protected by copyright law. Unauthorized reproduction prohibited.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">10. Privacy and Data Protection</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">10.1 Data Collection:</strong> We collect personal and usage data as detailed in our Privacy Policy.</p>
                <p><strong className="text-purple-800">10.2 Data Usage:</strong> Data used for service operation, fraud prevention, marketing (with consent), and legal compliance.</p>
                <p><strong className="text-purple-800">10.3 Data Sharing:</strong> We do not sell personal data but may share with service providers and as required by law.</p>
                <p><strong className="text-purple-800">10.4 Data Rights:</strong> Users have rights to access, correct, and delete personal data subject to legal and operational requirements.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">11. Dispute Resolution and Legal Terms</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">11.1 Binding Arbitration:</strong> Disputes resolved through binding arbitration in Delaware under American Arbitration Association rules.</p>
                <p><strong className="text-purple-800">11.2 Class Action Waiver:</strong> Users waive right to participate in class action lawsuits against Dream60.</p>
                <p><strong className="text-purple-800">11.3 Governing Law:</strong> Terms governed by Delaware state law and applicable federal law.</p>
                <p><strong className="text-purple-800">11.4 Severability:</strong> If any provision deemed invalid, remaining terms continue in full force.</p>
                <p><strong className="text-purple-800">11.5 Entire Agreement:</strong> These terms constitute the complete agreement between parties.</p>
              </div>
            </Card>

            <Card className="bg-white border-purple-200 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">12. Contact and Compliance</h2>
              <div className="space-y-3 text-purple-600">
                <p><strong className="text-purple-800">12.1 Legal Notices:</strong> All legal notices must be sent to legal@dream60.com with certified delivery.</p>
                <p><strong className="text-purple-800">12.2 Regulatory Compliance:</strong> Dream60 operates under applicable gaming and commerce regulations.</p>
                <p><strong className="text-purple-800">12.3 Age Verification:</strong> We may require additional age verification for compliance with local laws.</p>
                <p><strong className="text-purple-800">12.4 Terms Updates:</strong> Users notified of material changes via email and platform notices with 30-day implementation period.</p>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-purple-200">
            <p className="text-purple-600">
              Last updated: September 23, 2025
            </p>
            <p className="text-purple-600 mt-2">
              For questions about these terms, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}