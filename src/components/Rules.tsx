import { ArrowLeft, Clock, DollarSign, Target, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { AnimatedBackground } from './AnimatedBackground';

interface RulesProps {
  onBack: () => void;
}

export function Rules({ onBack }: RulesProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <motion.header 
        className="bg-white/95 backdrop-blur-md border-b border-purple-200 shadow-sm relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
            <div className="w-px h-6 bg-purple-300"></div>
            <h1 className="text-2xl font-bold text-purple-800">Game Rules</h1>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Introduction */}
          <Card className="bg-white border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-purple-800 flex items-center space-x-2">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <span>Welcome to Dream60</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                Dream60 is an exciting online auction game where you compete against other players in 60-minute auctions. 
                Each auction features 6 boxes with valuable prizes, and smart bidding strategy is key to winning!
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <div className="text-purple-700 font-semibold text-xs sm:text-sm mb-2">Quick Overview</div>
                <div className="text-xs sm:text-sm text-purple-600 space-y-1">
                  <div>• 6 auctions run daily • Each lasts 60 minutes</div>
                  <div>• 2 entry fee boxes + 4 bidding rounds</div>
                  <div>• Prize values: $500 to $5000+</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="bg-white border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-purple-800 flex items-center space-x-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <span>How It Works</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-600 text-white">1</Badge>
                    <h3 className="text-purple-800 font-semibold">Pay Entry Fee</h3>
                  </div>
                  <p className="text-purple-600 text-sm">
                    Choose Box 1 or 2 and pay the exact entry fee (₹1000-₹3500). This unlocks all 4 bidding rounds.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-600 text-white">2</Badge>
                    <h3 className="text-purple-800 font-semibold">Bidding Rounds</h3>
                  </div>
                  <p className="text-purple-600 text-sm">
                    4 rounds open every 15 minutes. Strategic bidding is key - you can only bid once per interval.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <div className="text-purple-700 font-semibold text-xs sm:text-sm mb-2">Round Schedule</div>
                <div className="text-purple-600 text-xs sm:text-sm space-y-1">
                  <div>• Round 1: Opens immediately • Round 2: After 15 min</div>
                  <div>• Round 3: After 30 min • Round 4: After 45 min</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Rules */}
          <Card className="bg-white border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-purple-800 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <span>Key Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <h4 className="text-green-700 font-semibold text-sm mb-2">Entry Boxes (1 & 2)</h4>
                  <div className="text-green-600 text-sm space-y-1">
                    <div>• Random fixed fee ₹1000-₹3500</div>
                    <div>• Must pay exact amount</div>
                    <div>• Unlocks all 4 bidding rounds</div>
                    <div>• Can pay entry fee for both boxes</div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <h4 className="text-purple-700 font-semibold text-sm mb-2">Bidding Rounds (3-6)</h4>
                  <div className="text-purple-600 text-sm space-y-1">
                    <div>• Min bid: ₹700 (fixed)</div>
                    <div>• Max: 90% of prize value</div>
                    <div>• One bid per 15-minute interval</div>
                    <div>• Highest bid wins the box</div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded p-3">
                <div className="text-red-700 font-semibold text-sm mb-2">⚠️ Important Rules</div>
                <div className="text-red-600 text-sm space-y-1">
                  <div>• All payments are final and non-refundable</div>
                  <div>• Must be 18+ years old to participate</div>
                  <div>• One account per person</div>
                  <div>• Winners must claim prizes within 30 days</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Game Mechanics */}
          <Card className="bg-white border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-purple-800 flex items-center space-x-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <span>Detailed Game Mechanics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Entry Phase */}
              <div>
                <h3 className="text-purple-800 font-semibold mb-3">Entry Phase (Boxes 1 & 2)</h3>
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 space-y-2">
                  <p className="text-purple-700 text-sm">
                    <strong>Duration:</strong> Available throughout the entire 60-minute auction
                  </p>
                  <p className="text-purple-700 text-sm">
                    <strong>Payment:</strong> Each box displays a random entry fee between ₹1000-₹3500. You must pay the exact amount shown.
                  </p>
                  <p className="text-purple-700 text-sm">
                    <strong>Strategy:</strong> Paying an entry fee unlocks all 4 bidding rounds. You can pay for both entry boxes if desired.
                  </p>
                  <p className="text-purple-700 text-sm">
                    <strong>Timing:</strong> Round 1 opens immediately after your first entry fee payment.
                  </p>
                </div>
              </div>

              {/* Bidding Phase */}
              <div>
                <h3 className="text-purple-800 font-semibold mb-3">Bidding Phase (Boxes 3-6)</h3>
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 space-y-2">
                  <p className="text-purple-700 text-sm">
                    <strong>Round Schedule:</strong> Rounds open every 15 minutes (0, 15, 30, 45 minutes)
                  </p>
                  <p className="text-purple-700 text-sm">
                    <strong>Bidding Limits:</strong> Minimum ₹700, Maximum 90% of the prize value
                  </p>
                  <p className="text-purple-700 text-sm">
                    <strong>Frequency:</strong> You can place one bid per box every 15 minutes
                  </p>
                  <p className="text-purple-700 text-sm">
                    <strong>Win Condition:</strong> Highest bid when the round closes wins the prize
                  </p>
                </div>
              </div>

              {/* Prize Distribution */}
              <div>
                <h3 className="text-purple-800 font-semibold mb-3">Prize Distribution & Values</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <h4 className="text-yellow-700 font-semibold text-sm mb-2">Entry Boxes</h4>
                    <div className="text-yellow-600 text-sm space-y-1">
                      <div>• Prize Value: $500 - $1,500</div>
                      <div>• Winner: Pays entry fee</div>
                      <div>• Examples: Electronics, Gift Cards</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <h4 className="text-blue-700 font-semibold text-sm mb-2">Bidding Rounds</h4>
                    <div className="text-blue-600 text-sm space-y-1">
                      <div>• Prize Value: $1,000 - $5,000+</div>
                      <div>• Winner: Highest bidder</div>
                      <div>• Examples: Laptops, Gaming Rigs</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prohibited Actions */}
              <div>
                <h3 className="text-purple-800 font-semibold mb-3">Prohibited Actions</h3>
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <div className="text-red-700 text-sm space-y-2">
                    <div>• <strong>Multiple Accounts:</strong> Only one account per person is allowed</div>
                    <div>• <strong>Bid Manipulation:</strong> Attempting to manipulate auctions or collude with other users</div>
                    <div>• <strong>Payment Fraud:</strong> Using fraudulent payment methods or chargebacks</div>
                    <div>• <strong>Bot Usage:</strong> Automated bidding or using bots is strictly prohibited</div>
                    <div>• <strong>Account Sharing:</strong> Sharing login credentials or account access</div>
                  </div>
                </div>
              </div>

              {/* Fair Play */}
              <div>
                <h3 className="text-purple-800 font-semibold mb-3">Fair Play Guarantee</h3>
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <div className="text-green-700 text-sm space-y-2">
                    <div>• <strong>Random Entry Fees:</strong> All entry fees are generated using certified random algorithms</div>
                    <div>• <strong>Transparent Timing:</strong> All auction and round timers are synchronized and visible</div>
                    <div>• <strong>Bid Verification:</strong> All bids are processed in real-time with timestamp verification</div>
                    <div>• <strong>Anti-Fraud Protection:</strong> Advanced systems detect and prevent fraudulent activity</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Tips */}
          <Card className="bg-white border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl text-purple-800 flex items-center space-x-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <span>Winning Strategies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <h4 className="text-purple-700 font-semibold text-sm mb-2">🎯 Entry Strategy</h4>
                  <div className="text-purple-600 text-sm space-y-1">
                    <div>• Compare entry fees and choose the lower option</div>
                    <div>• Pay early to maximize bidding opportunities</div>
                    <div>• Consider paying for both if prizes are valuable</div>
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <h4 className="text-purple-700 font-semibold text-sm mb-2">💡 Bidding Strategy</h4>
                  <div className="text-purple-600 text-sm space-y-1">
                    <div>• Start with conservative bids early</div>
                    <div>• Save aggressive bids for final rounds</div>
                    <div>• Monitor other players' patterns</div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <h4 className="text-yellow-700 font-semibold text-sm mb-2">⏱️ Timing Tips</h4>
                <div className="text-yellow-600 text-sm">
                  Watch the countdown timers carefully. Bid near the end of each round for maximum impact, 
                  but remember you can only bid once per 15-minute interval.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}