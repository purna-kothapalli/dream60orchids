import { ArrowLeft, Clock, DollarSign, Target, Trophy, Sparkles, Shield, Zap, CheckCircle2, XCircle, AlertTriangle, Gift, TrendingUp, Users, Crown, Lock, Unlock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { AnimatedBackground } from './AnimatedBackground';
import { useState } from 'react';

interface RulesProps {
  onBack: () => void;
}

export function Rules({ onBack }: RulesProps) {
  const [activeSection, setActiveSection] = useState<string | null>('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'how-it-works', label: 'How It Works', icon: Target },
    { id: 'rules', label: 'Key Rules', icon: Shield },
    { id: 'mechanics', label: 'Game Mechanics', icon: Zap },
    { id: 'strategies', label: 'Strategies', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Floating orbs for visual interest */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Header */}
      <motion.header 
        className="bg-gradient-to-r from-[#53317B] via-[#6B3FA0] to-[#8456BC] backdrop-blur-md border-b-4 border-purple-300/50 shadow-2xl relative z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20 backdrop-blur-sm border border-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Game
              </Button>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Game Rules & Guide</h1>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Learn & Win
            </Badge>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Navigation */}
          <motion.div 
            className="mb-8 sticky top-4 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200/60 shadow-xl p-2">
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`
                        relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold
                        transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30' 
                          : 'text-purple-700 hover:bg-purple-50'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{section.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Content Sections */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Hero Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 p-8 shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Welcome to Dream60</h2>
                        <p className="text-white/90 text-sm">The Ultimate 60-Minute Auction Experience</p>
                      </div>
                    </div>
                    
                    <p className="text-white/95 text-lg leading-relaxed mb-6">
                      Dream60 is an exciting online auction game where you compete against other players in thrilling 60-minute auctions. 
                      Each auction features 6 boxes with valuable prizes, and smart bidding strategy is key to winning big!
                    </p>
                    
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { icon: Clock, label: '6 Daily Auctions', desc: '60 minutes each' },
                        { icon: Gift, label: '6 Prize Boxes', desc: 'Per auction' },
                        { icon: DollarSign, label: '₹500-₹5000+', desc: 'Prize values' },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * idx }}
                          className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                        >
                          <item.icon className="w-6 h-6 text-white mb-2" />
                          <div className="text-white font-bold text-sm">{item.label}</div>
                          <div className="text-white/80 text-xs">{item.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Users, value: '2 Entry Boxes', color: 'from-purple-500 to-purple-600', detail: 'Pay to unlock' },
                    { icon: Zap, value: '4 Bid Rounds', color: 'from-violet-500 to-violet-600', detail: 'Every 15 min' },
                    { icon: Crown, value: 'Highest Bidder', color: 'from-fuchsia-500 to-fuchsia-600', detail: 'Wins the prize' },
                    { icon: Trophy, value: 'Win Big', color: 'from-purple-600 to-violet-600', detail: 'Premium rewards' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="relative overflow-hidden bg-white rounded-2xl p-5 border-2 border-purple-200/60 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`} />
                      <div className="relative z-10">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-purple-900 font-bold text-lg">{stat.value}</div>
                        <div className="text-purple-600 text-sm">{stat.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* How It Works Section */}
            {activeSection === 'how-it-works' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-purple-900 mb-2">How Dream60 Works</h2>
                  <p className="text-purple-600">Master these simple steps to start winning</p>
                </div>

                {/* Step-by-step */}
                <div className="space-y-6">
                  {[
                    {
                      step: '01',
                      title: 'Pay Entry Fee',
                      icon: Lock,
                      color: 'from-purple-500 to-purple-600',
                      description: 'Choose Box 1 or Box 2 and pay the exact entry fee (₹1000-₹3500). This payment unlocks all 4 bidding rounds for you.',
                      details: ['Entry fee is random per box', 'Available throughout auction', 'Can pay for both boxes', 'Round 1 opens immediately']
                    },
                    {
                      step: '02',
                      title: 'Strategic Bidding',
                      icon: Zap,
                      color: 'from-violet-500 to-violet-600',
                      description: 'Place strategic bids in 4 rounds that open every 15 minutes. Each box opens sequentially throughout the hour.',
                      details: ['Min bid: ₹700', 'Max bid: 90% of prize', 'One bid per 15-min interval', 'Watch other players']
                    },
                    {
                      step: '03',
                      title: 'Win Prizes',
                      icon: Crown,
                      color: 'from-fuchsia-500 to-fuchsia-600',
                      description: 'The highest bidder when each round closes wins that box\'s prize. Multiple wins are possible across different rounds!',
                      details: ['Highest bid wins', 'Real-time updates', 'Instant notifications', 'Claim within 30 days']
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="relative"
                    >
                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Step number & icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl relative`}>
                            <item.icon className="w-10 h-10 text-white" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-700 font-bold text-sm shadow-lg">
                              {item.step}
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 bg-white rounded-2xl p-6 border-2 border-purple-200/60 shadow-lg">
                          <h3 className="text-2xl font-bold text-purple-900 mb-3">{item.title}</h3>
                          <p className="text-purple-700 mb-4 leading-relaxed">{item.description}</p>
                          
                          <div className="grid sm:grid-cols-2 gap-3">
                            {item.details.map((detail, detailIdx) => (
                              <div key={detailIdx} className="flex items-start gap-2 bg-purple-50 rounded-xl p-3">
                                <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <span className="text-purple-700 text-sm">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Connecting line */}
                      {idx < 2 && (
                        <div className="hidden lg:block absolute left-10 top-20 w-0.5 h-12 bg-gradient-to-b from-purple-300 to-transparent" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Round Schedule Timeline
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { round: 'Round 1', time: '0:00', status: 'Opens immediately' },
                      { round: 'Round 2', time: '15:00', status: 'After 15 minutes' },
                      { round: 'Round 3', time: '30:00', status: 'After 30 minutes' },
                      { round: 'Round 4', time: '45:00', status: 'After 45 minutes' },
                    ].map((round, idx) => (
                      <div key={idx} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-white/90 text-xs mb-1">{round.round}</div>
                        <div className="text-white font-bold text-2xl mb-1">{round.time}</div>
                        <div className="text-white/80 text-xs">{round.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Key Rules Section */}
            {activeSection === 'rules' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-purple-900 mb-2">Essential Rules</h2>
                  <p className="text-purple-600">Know these rules to play fair and win big</p>
                </div>

                {/* Entry Boxes vs Bidding Boxes */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Entry Boxes */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border-2 border-emerald-300/60 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-emerald-900 font-bold text-xl">Entry Boxes (1 & 2)</h3>
                        <p className="text-emerald-700 text-sm">Gateway to the auction</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        'Random entry fee: ₹1,000 - ₹3,500',
                        'Must pay exact amount shown',
                        'Unlocks all 4 bidding rounds',
                        'Can pay for both boxes',
                        'Available entire auction',
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-emerald-800 text-sm font-medium">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Bidding Boxes */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-6 border-2 border-purple-300/60 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Unlock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-purple-900 font-bold text-xl">Bidding Rounds (3-6)</h3>
                        <p className="text-purple-700 text-sm">Compete for prizes</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        'Minimum bid: ₹700 (fixed)',
                        'Maximum: 90% of prize value',
                        'One bid per 15-minute interval',
                        'Highest bid wins the box',
                        'Opens every 15 minutes',
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3">
                          <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span className="text-purple-800 text-sm font-medium">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Important Rules */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 border-2 border-red-300/60 shadow-xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-red-900 font-bold text-xl">Important Rules</h3>
                      <p className="text-red-700 text-sm">Read carefully before playing</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      'All payments are final and non-refundable',
                      'Must be 18+ years old to participate',
                      'One account per person only',
                      'Winners must claim prizes within 30 days',
                      'No bot usage or automation allowed',
                      'Account sharing is strictly prohibited',
                    ].map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-red-800 text-sm font-medium">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Game Mechanics Section */}
            {activeSection === 'mechanics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-purple-900 mb-2">Detailed Game Mechanics</h2>
                  <p className="text-purple-600">Deep dive into how everything works</p>
                </div>

                {/* Entry Phase */}
                <div className="bg-white rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-purple-900 font-bold text-xl">Entry Phase (Boxes 1 & 2)</h3>
                      <p className="text-purple-600 text-sm">Your gateway to the auction</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-2xl p-4 border-l-4 border-purple-500">
                      <div className="font-semibold text-purple-900 mb-1">Duration</div>
                      <p className="text-purple-700 text-sm">Available throughout the entire 60-minute auction period</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-4 border-l-4 border-purple-500">
                      <div className="font-semibold text-purple-900 mb-1">Payment</div>
                      <p className="text-purple-700 text-sm">Each box displays a random entry fee between ₹1000-₹3500. You must pay the exact amount shown.</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-4 border-l-4 border-purple-500">
                      <div className="font-semibold text-purple-900 mb-1">Strategy</div>
                      <p className="text-purple-700 text-sm">Paying an entry fee unlocks all 4 bidding rounds. You can pay for both entry boxes if desired.</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-4 border-l-4 border-purple-500">
                      <div className="font-semibold text-purple-900 mb-1">Timing</div>
                      <p className="text-purple-700 text-sm">Round 1 opens immediately after your first entry fee payment.</p>
                    </div>
                  </div>
                </div>

                {/* Bidding Phase */}
                <div className="bg-white rounded-3xl p-6 border-2 border-violet-200/60 shadow-xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-violet-900 font-bold text-xl">Bidding Phase (Boxes 3-6)</h3>
                      <p className="text-violet-600 text-sm">Where the competition happens</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-violet-50 rounded-2xl p-4">
                      <div className="font-semibold text-violet-900 mb-2">Round Schedule</div>
                      <p className="text-violet-700 text-sm">Rounds open every 15 minutes at 0, 15, 30, and 45 minute marks</p>
                    </div>
                    <div className="bg-violet-50 rounded-2xl p-4">
                      <div className="font-semibold text-violet-900 mb-2">Bidding Limits</div>
                      <p className="text-violet-700 text-sm">Minimum ₹700, Maximum 90% of the prize value</p>
                    </div>
                    <div className="bg-violet-50 rounded-2xl p-4">
                      <div className="font-semibold text-violet-900 mb-2">Frequency</div>
                      <p className="text-violet-700 text-sm">You can place one bid per box every 15 minutes</p>
                    </div>
                    <div className="bg-violet-50 rounded-2xl p-4">
                      <div className="font-semibold text-violet-900 mb-2">Win Condition</div>
                      <p className="text-violet-700 text-sm">Highest bid when the round closes wins the prize</p>
                    </div>
                  </div>
                </div>

                {/* Prize Distribution */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-6 border-2 border-yellow-300/60 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-yellow-900 font-bold">Entry Box Prizes</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-yellow-800 text-sm">• Prize Value: ₹500 - ₹1,500</div>
                      <div className="text-yellow-800 text-sm">• Winner pays entry fee</div>
                      <div className="text-yellow-800 text-sm">• Electronics, Gift Cards, etc.</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border-2 border-blue-300/60 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-blue-900 font-bold">Bidding Round Prizes</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-blue-800 text-sm">• Prize Value: ₹1,000 - ₹5,000+</div>
                      <div className="text-blue-800 text-sm">• Winner is highest bidder</div>
                      <div className="text-blue-800 text-sm">• Laptops, Gaming Rigs, etc.</div>
                    </div>
                  </div>
                </div>

                {/* Fair Play */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-300/60 shadow-xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-green-900 font-bold text-xl">Fair Play Guarantee</h3>
                      <p className="text-green-700 text-sm">We ensure a fair gaming experience</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { title: 'Random Entry Fees', desc: 'Generated using certified random algorithms' },
                      { title: 'Transparent Timing', desc: 'All timers are synchronized and visible' },
                      { title: 'Bid Verification', desc: 'Real-time processing with timestamp verification' },
                      { title: 'Anti-Fraud Protection', desc: 'Advanced systems detect fraudulent activity' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-green-900 text-sm">{item.title}</div>
                            <div className="text-green-700 text-xs mt-1">{item.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Strategies Section */}
            {activeSection === 'strategies' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-purple-900 mb-2">Winning Strategies</h2>
                  <p className="text-purple-600">Pro tips to maximize your winning chances</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Entry Strategy */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 shadow-2xl"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl">Entry Strategy</h3>
                        <p className="text-white/90 text-sm">Start smart, win smart</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        'Compare entry fees and choose the lower option',
                        'Pay early to maximize bidding opportunities',
                        'Consider paying for both if prizes are valuable',
                        'Entry box prizes have lower competition',
                      ].map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <Sparkles className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                          <span className="text-white text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Bidding Strategy */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-6 shadow-2xl"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl">Bidding Strategy</h3>
                        <p className="text-white/90 text-sm">Master the art of bidding</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        'Start with conservative bids in early rounds',
                        'Save aggressive bids for final rounds',
                        'Monitor other players\' bidding patterns',
                        'Don\'t reveal your max bid too early',
                      ].map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <Zap className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                          <span className="text-white text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Timing Tips */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-6 border-2 border-yellow-300/60 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-yellow-900 font-bold text-xl">Perfect Timing</h3>
                      <p className="text-yellow-700 text-sm">When to make your move</p>
                    </div>
                  </div>
                  
                  <p className="text-yellow-800 leading-relaxed mb-4">
                    Watch the countdown timers carefully. Bid near the end of each round for maximum impact, 
                    but remember you can only bid once per 15-minute interval. Last-minute bids can catch competitors off guard!
                  </p>
                  
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                      <div className="text-yellow-900 font-bold text-lg">5 min</div>
                      <div className="text-yellow-700 text-xs">Watch & Wait</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                      <div className="text-yellow-900 font-bold text-lg">2 min</div>
                      <div className="text-yellow-700 text-xs">Decide Strategy</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                      <div className="text-yellow-900 font-bold text-lg">Last 30s</div>
                      <div className="text-yellow-700 text-xs">Strike Fast</div>
                    </div>
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-white rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl">
                  <h3 className="text-purple-900 font-bold text-xl mb-4 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-purple-600" />
                    Pro Tips from Winners
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { tip: 'Focus on one or two boxes per auction', impact: 'Increases win rate' },
                      { tip: 'Calculate ROI before bidding', impact: 'Better profit margins' },
                      { tip: 'Join auctions with fewer participants', impact: 'Less competition' },
                      { tip: 'Study prize values and bid accordingly', impact: 'Smarter decisions' },
                      { tip: 'Don\'t chase losses - play strategically', impact: 'Long-term success' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-purple-50 rounded-xl p-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{idx + 1}</span>
                          </div>
                          <span className="text-purple-800 text-sm font-medium">{item.tip}</span>
                        </div>
                        <Badge className="bg-purple-200 text-purple-900 border-0 ml-3">
                          {item.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}