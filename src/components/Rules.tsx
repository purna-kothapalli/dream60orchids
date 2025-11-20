import { ArrowLeft, Clock, DollarSign, Target, Trophy } from 'lucide-react';
import { Button } from './ui/button';
// Keeping original component imports for compatibility
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
// Assuming AnimatedBackground is a stylized background element
import { AnimatedBackground } from './AnimatedBackground';

interface RulesProps {
  onBack: () => void;
}

export function Rules({ onBack }: RulesProps) {
  return (
    // 1. New Background: Deep purple gradient for a more "premium" and "dream-like" feel
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden text-white">
      {/* AnimatedBackground can now be a subtle overlay or texture */}
      <AnimatedBackground />

      {/* Header - Frosted Glass Effect */}
      <motion.header 
        // Darker, frosted background
        className="bg-purple-900/70 backdrop-blur-lg border-b border-purple-600 shadow-xl relative z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button - Clearer and more prominent */}
            <Button
              onClick={onBack}
              variant="ghost"
              size="lg" // Larger button
              className="text-purple-300 hover:text-white hover:bg-purple-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              <span className="font-semibold text-lg">Back to Game</span>
            </Button>
            
            <h1 className="text-3xl font-extrabold text-purple-300 tracking-wider">
                🌌 Dream60 Rules
            </h1>
            <div className="w-[150px]"></div> {/* Spacer */}
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 relative z-10">
        <motion.div 
          className="max-w-5xl mx-auto space-y-8" // Increased max width and spacing
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Card Style Overhaul: Glassmorphism/Frosted Card */}
          {/* Introduction */}
          <Card className="bg-white/10 backdrop-blur-md border border-purple-500/50 shadow-2xl rounded-xl p-0">
            <CardHeader className="p-6 border-b border-purple-500/30">
              <CardTitle className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center space-x-3">
                <Trophy className="w-7 h-7 text-yellow-400" /> {/* Highlighted icon */}
                <span>Welcome to Dream60: The Auction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-purple-200 space-y-4">
              <p className="text-sm sm:text-base">
                Dream60 is an exciting online auction game where you compete against other players in 60-minute auctions. 
                Each auction features 6 prize boxes, and smart bidding strategy is key to winning!
              </p>
              {/* Highlighted info box */}
              <div className="bg-purple-700/50 border border-purple-500 rounded-lg p-4">
                <div className="text-purple-200 font-extrabold text-sm sm:text-base mb-2 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Quick Overview</span>
                </div>
                <div className="text-sm text-purple-300 grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2"><Badge variant="outline" className="text-purple-300 border-purple-500 bg-transparent">DAILY</Badge> 6 auctions run daily</div>
                  <div className="flex items-center space-x-2"><Badge variant="outline" className="text-purple-300 border-purple-500 bg-transparent">TIMING</Badge> Each lasts exactly 60 minutes</div>
                  <div className="flex items-center space-x-2"><Badge variant="outline" className="text-purple-300 border-purple-500 bg-transparent">PHASES</Badge> 2 entry boxes + 4 bidding rounds</div>
                  <div className="flex items-center space-x-2"><Badge variant="outline" className="text-purple-300 border-purple-500 bg-transparent">PRIZES</Badge> $500 to $5000+ in value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works - Focus on Flow & Clarity */}
          <Card className="bg-white/10 backdrop-blur-md border border-purple-500/50 shadow-2xl rounded-xl p-0">
            <CardHeader className="p-6 border-b border-purple-500/30">
              <CardTitle className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center space-x-3">
                <Target className="w-7 h-7 text-red-400" />
                <span>The 60-Minute Flow</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Step 1 */}
                <div className="space-y-3 p-4 border border-purple-600 rounded-lg bg-purple-800/40">
                  <div className="flex items-center space-x-3">
                    {/* Unique Step Badge */}
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-black text-xl shadow-lg">1</span>
                    <h3 className="text-purple-200 font-extrabold text-lg">Entry Fee (Boxes 1 & 2)</h3>
                  </div>
                  <p className="text-purple-300 text-sm">
                    Choose Box 1 or 2 and pay the exact entry fee (₹1000-₹3500). This payment is the **gateway** that unlocks your ability to bid in all subsequent rounds.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="space-y-3 p-4 border border-purple-600 rounded-lg bg-purple-800/40">
                  <div className="flex items-center space-x-3">
                    {/* Unique Step Badge */}
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-black text-xl shadow-lg">2</span>
                    <h3 className="text-purple-200 font-extrabold text-lg">Bidding Rounds (Boxes 3-6)</h3>
                  </div>
                  <p className="text-purple-300 text-sm">
                    **4 strategic rounds** open every 15 minutes. Precision and timing are crucial—you can only place a **single bid** per box within each 15-minute interval.
                  </p>
                </div>
              </div>

              {/* Time Flow Diagram/Table */}
              <div className="bg-purple-700/50 border border-purple-600 rounded-lg p-4">
                <div className="text-purple-200 font-extrabold text-sm sm:text-base mb-2 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>60-Minute Round Schedule</span>
                </div>
                <div className="grid grid-cols-4 text-center text-sm font-medium">
                    <div className="text-purple-400">0 min</div>
                    <div className="text-purple-400">15 min</div>
                    <div className="text-purple-400">30 min</div>
                    <div className="text-purple-400">45 min</div>
                </div>
                <div className="grid grid-cols-4 text-center text-xs text-white pt-1">
                    <div className="border-r border-purple-500">Round 1 Opens</div>
                    <div className="border-r border-purple-500">Round 2 Opens</div>
                    <div className="border-r border-purple-500">Round 3 Opens</div>
                    <div>Round 4 Opens / Final Interval</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Rules - Color-Coded Segregation */}
          <Card className="bg-white/10 backdrop-blur-md border border-purple-500/50 shadow-2xl rounded-xl p-0">
            <CardHeader className="p-6 border-b border-purple-500/30">
              <CardTitle className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center space-x-3">
                <DollarSign className="w-7 h-7 text-green-400" />
                <span>The Financials & Limits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Entry Boxes - Green Highlight */}
                <div className="p-4 rounded-lg bg-green-900/40 border border-green-600 space-y-2">
                  <h4 className="text-green-300 font-extrabold text-lg mb-2 flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                    Entry Boxes (1 & 2)
                  </h4>
                  <ul className="text-green-200 text-sm list-disc list-inside space-y-1">
                    <li>Random fixed fee $\text{₹}1000-\text{₹}3500$</li>
                    <li>**Must** pay exact amount shown</li>
                    <li>Payment unlocks all 4 bidding rounds</li>
                    <li>You can enter both Box 1 & 2</li>
                  </ul>
                </div>

                {/* Bidding Rounds - Purple Highlight */}
                <div className="p-4 rounded-lg bg-purple-900/40 border border-purple-600 space-y-2">
                  <h4 className="text-purple-300 font-extrabold text-lg mb-2 flex items-center space-x-2">
                    <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                    Bidding Rounds (3-6)
                  </h4>
                  <ul className="text-purple-200 text-sm list-disc list-inside space-y-1">
                    <li>Min bid: $\text{₹}700$ (fixed)</li>
                    <li>Max bid: $90\%$ of prize value</li>
                    <li>**One** bid allowed per 15-minute interval</li>
                    <li>Highest final bid wins the prize</li>
                  </ul>
                </div>

                {/* Important Rules - Red Highlight */}
                <div className="p-4 rounded-lg bg-red-900/40 border border-red-600 space-y-2">
                  <h4 className="text-red-300 font-extrabold text-lg mb-2 flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
                    ⚠️ Non-Negotiable
                  </h4>
                  <ul className="text-red-200 text-sm list-disc list-inside space-y-1">
                    <li>All payments are **final** and non-refundable</li>
                    <li>Participants must be $18+$ years old</li>
                    <li>Strictly **One** account per person</li>
                    <li>Prizes must be claimed within 30 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Mechanics & Prohibited Actions */}
          <Card className="bg-white/10 backdrop-blur-md border border-purple-500/50 shadow-2xl rounded-xl p-0">
            <CardHeader className="p-6 border-b border-purple-500/30">
              <CardTitle className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center space-x-3">
                <Clock className="w-7 h-7 text-blue-400" />
                <span>The Full Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Prize Distribution - Enhanced Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-yellow-900/40 border border-yellow-600 rounded-lg p-4">
                  <h4 className="text-yellow-300 font-semibold text-base mb-2 flex items-center space-x-2">
                    <Badge className="bg-yellow-400 text-yellow-900">BOX 1 & 2</Badge>
                    <span>Entry Prizes</span>
                  </h4>
                  <div className="text-yellow-200 text-sm space-y-1">
                    <div>• Value Range: $\text{\$}500 - \text{\$}1,500$</div>
                    <div>• Winner Pays: Entry fee only</div>
                    <div>• Examples: Gift Cards, Minor Electronics</div>
                  </div>
                </div>
                <div className="bg-blue-900/40 border border-blue-600 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold text-base mb-2 flex items-center space-x-2">
                    <Badge className="bg-blue-400 text-blue-900">BOX 3-6</Badge>
                    <span>Bidding Prizes</span>
                  </h4>
                  <div className="text-blue-200 text-sm space-y-1">
                    <div>• Value Range: $\text{\$}1,000 - \text{\$}5,000+$</div>
                    <div>• Winner Pays: Highest bid amount</div>
                    <div>• Examples: Laptops, High-End Gaming Rigs</div>
                  </div>
                </div>
              </div>
              
              {/* Prohibited Actions - Warning Box */}
              <div className="bg-red-900/40 border-l-4 border-red-500 rounded-r-lg p-4 shadow-lg">
                <h3 className="text-red-300 font-extrabold mb-3 flex items-center space-x-2">
                    <i className="fas fa-ban text-xl"></i> 
                    <span>❌ Prohibited Actions (Zero Tolerance)</span>
                </h3>
                <div className="text-red-200 text-sm space-y-2">
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2">•</span> 
                    <strong>Multiple Accounts:</strong> Only one per person is allowed.
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2">•</span> 
                    <strong>Bid Manipulation:</strong> Collusion or attempts to tamper with the auction.
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2">•</span> 
                    <strong>Payment Fraud/Bots:</strong> Use of fraudulent methods or automated bidding software.
                  </div>
                </div>
              </div>

              {/* Fair Play - Assurance Box */}
              <div className="bg-green-900/40 border-l-4 border-green-500 rounded-r-lg p-4 shadow-lg">
                <h3 className="text-green-300 font-extrabold mb-3 flex items-center space-x-2">
                    <i className="fas fa-shield-alt text-xl"></i>
                    <span>✅ Fair Play Guarantee</span>
                </h3>
                <div className="text-green-200 text-sm space-y-2">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span> 
                    <strong>Randomness:</strong> Entry fees generated by certified random algorithms.
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span> 
                    <strong>Transparency:</strong> Timers are synchronized and fully visible to all players.
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span> 
                    <strong>Verification:</strong> All bids are processed with real-time, tamper-proof timestamps.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Tips - Clean, Actionable List */}
          <Card className="bg-white/10 backdrop-blur-md border border-purple-500/50 shadow-2xl rounded-xl p-0">
            <CardHeader className="p-6 border-b border-purple-500/30">
              <CardTitle className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center space-x-3">
                <Target className="w-7 h-7 text-yellow-400" />
                <span>Winning Strategies: Your Edge</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-800/60 border border-purple-500 rounded-lg p-4">
                  <h4 className="text-purple-300 font-extrabold text-lg mb-3 flex items-center space-x-2">
                    <i className="fas fa-lock-open text-base"></i>
                    <span>Entry Phase Tactics</span>
                  </h4>
                  <ul className="text-purple-200 text-sm space-y-2 list-disc list-inside">
                    <li>Prioritize the box with the **lowest entry fee**.</li>
                    <li>Pay **early** to ensure access to all four bidding intervals.</li>
                    <li>Only enter both boxes if the potential prizes justify the double fee.</li>
                  </ul>
                </div>
                <div className="bg-purple-800/60 border border-purple-500 rounded-lg p-4">
                  <h4 className="text-purple-300 font-extrabold text-lg mb-3 flex items-center space-x-2">
                    <i className="fas fa-gavel text-base"></i>
                    <span>Bidding Phase Tactics</span>
                  </h4>
                  <ul className="text-purple-200 text-sm space-y-2 list-disc list-inside">
                    <li>Start with the **minimum bid** ($\text{₹}700$) in early rounds (1-2).</li>
                    <li>Save your highest bids for the **final interval** (Round 4).</li>
                    <li>Observe other players' bidding patterns to predict their final move.</li>
                  </ul>
                </div>
              </div>
              <div className="text-center bg-yellow-900/40 border border-yellow-600 rounded-lg p-4">
                <h4 className="text-yellow-300 font-extrabold text-lg mb-2">⏱️ Precision Timing</h4>
                <p className="text-yellow-200 text-sm">
                  The key is precision. Use your **single bid** per interval wisely, often placing it just before the 15-minute timer resets to maximize psychological impact and win.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}