import  { useEffect } from 'react';
import { ArrowLeft, Trophy, Calendar, Clock, IndianRupee, Target, Award, Crown, Users, TrendingUp, Sparkles, Box, CheckCircle2, XCircle, Lock, Medal, TrendingDown, BarChart3, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { AnimatedBackground } from './AnimatedBackground';

interface BoxSlotDetailed {
  boxNumber: number;
  type: 'entry' | 'bidding';
  status: 'won' | 'lost' | 'not_participated';
  entryFee?: number;
  myBid?: number;
  winningBid?: number;
  winnerName?: string;
  myRank?: number;
  totalParticipants: number;
  minBid: number;
  maxBid: number;
  openTime: string;
  closeTime: string;
  isLocked: boolean;
}

interface AuctionDetailsData {
  id: number;
  date: Date;
  prize: string;
  prizeValue: number;
  myBid: number;
  winningBid: number;
  status: 'won' | 'lost';
  totalParticipants: number;
  myRank: number;
  auctionStartTime: string;
  auctionEndTime: string;
  boxes: BoxSlotDetailed[];
}

interface AuctionDetailsPageProps {
  auction: AuctionDetailsData;
  onBack: () => void;
}

export function AuctionDetailsPage({ auction, onBack }: AuctionDetailsPageProps) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalSpent = auction.boxes.reduce((sum, box) => {
    if (box.status === 'not_participated') return sum;
    if (box.type === 'entry' && box.entryFee) return sum + box.entryFee;
    if (box.type === 'bidding' && box.myBid) return sum + box.myBid;
    return sum;
  }, 0);

  const wonBoxes = auction.boxes.filter(b => b.status === 'won').length;
  const participatedBoxes = auction.boxes.filter(b => b.status !== 'not_participated').length;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Premium Header */}
      <motion.div 
        className="relative z-10 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, #C4B5FD, #8B5CF6)',
              top: '-40%',
              right: '-10%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 text-white shadow-2xl">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all mb-3 sm:mb-4 border border-white/20 text-xs sm:text-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back to History</span>
            </button>
            
            <div className="flex items-start gap-3 sm:gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border-2 sm:border-3 border-white/40 ${
                  auction.status === 'won'
                    ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700'
                    : 'bg-gradient-to-br from-purple-500 to-purple-700'
                }`}
              >
                {auction.status === 'won' ? (
                  <Crown className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                ) : (
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                )}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{auction.prize}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/90 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{auction.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span className="text-white/60">•</span>
                  <Badge className={`border backdrop-blur-sm text-[10px] sm:text-xs ${
                    auction.status === 'won' 
                      ? 'bg-gradient-to-r from-violet-100/90 to-fuchsia-100/90 text-violet-900 border-violet-300/60' 
                      : 'bg-purple-100/80 text-purple-700 border-purple-300/50'
                  }`}>
                    {auction.status === 'won' ? (
                      <><Trophy className="w-3 h-3 mr-1" /> Won</>
                    ) : (
                      <><Target className="w-3 h-3 mr-1" /> Lost</>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 border border-white/30 w-fit">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                  <span className="text-xs sm:text-sm">Prize Value:</span>
                  <div className="flex items-center gap-0.5 font-bold">
                    <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">{auction.prizeValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 relative z-10">
        {/* Important Rule Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="border-2 border-purple-300/60 bg-gradient-to-r from-purple-50/90 via-violet-50/80 to-fuchsia-50/70 backdrop-blur-xl shadow-lg">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-purple-900 text-xs sm:text-sm mb-1">Entry Fee Unlocks Bidding</h3>
                  <p className="text-[10px] sm:text-xs text-purple-700 leading-relaxed">
                    Only participants who paid the entry fee in <span className="font-semibold">Box 1 & 2</span> can place bids in the subsequent bidding rounds (<span className="font-semibold">Box 3 & 4</span>). Entry fee payment is mandatory to unlock all auction features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overall Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="border-2 border-purple-300/60 backdrop-blur-2xl bg-gradient-to-br from-white/90 via-purple-50/60 to-violet-50/70 shadow-2xl overflow-hidden">
            {/* Animated background orb */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{
                  background: 'radial-gradient(circle, #A78BFA, #7C3AED)',
                  top: '-30%',
                  right: '-20%',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl sm:rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-purple-900 text-base sm:text-lg">Overall Statistics</h2>
                  <p className="text-[10px] sm:text-xs text-purple-600">Your performance summary</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                <Card className="border-2 border-purple-200/60 bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-xl shadow-md">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-600 mb-1.5">
                      <TrendingUp className="w-3 h-3 shrink-0" />
                      <span>Total Spent</span>
                    </div>
                    <div className="flex items-center gap-0.5 font-bold text-purple-900">
                      <IndianRupee className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-xs sm:text-sm">{totalSpent.toLocaleString('en-IN')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200/60 bg-gradient-to-br from-white/80 to-violet-50/60 backdrop-blur-xl shadow-md">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-600 mb-1.5">
                      <Users className="w-3 h-3 shrink-0" />
                      <span>Total Users</span>
                    </div>
                    <div className="font-bold text-purple-900 text-xs sm:text-sm">
                      {auction.totalParticipants}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200/60 bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-xl shadow-md">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-600 mb-1.5">
                      <Award className="w-3 h-3 shrink-0" />
                      <span>Your Rank</span>
                    </div>
                    <div className="font-bold text-purple-900 text-xs sm:text-sm">
                      #{auction.myRank}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200/60 bg-gradient-to-br from-white/80 to-violet-50/60 backdrop-blur-xl shadow-md">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-600 mb-1.5">
                      <Box className="w-3 h-3 shrink-0" />
                      <span>Boxes Played</span>
                    </div>
                    <div className="font-bold text-purple-900 text-xs sm:text-sm">
                      {participatedBoxes} / 4
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-violet-200/60 bg-gradient-to-br from-white/80 to-fuchsia-50/60 backdrop-blur-xl shadow-md">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-violet-600 mb-1.5">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>Boxes Won</span>
                    </div>
                    <div className="font-bold text-violet-900 text-xs sm:text-sm">
                      {wonBoxes}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200/60 bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-xl shadow-md">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-600 mb-1.5">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>Duration</span>
                    </div>
                    <div className="font-bold text-purple-900 text-[10px] sm:text-xs">
                      {auction.auctionStartTime} - {auction.auctionEndTime}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Box Slots Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl sm:rounded-xl flex items-center justify-center shadow-lg">
                <Box className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-purple-900 text-base sm:text-lg">Box Slots Breakdown</h2>
                <p className="text-[10px] sm:text-xs text-purple-600">Detailed performance for each slot</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {auction.boxes.map((box, index) => (
              <motion.div
                key={box.boxNumber}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <Card className={`relative overflow-hidden border-2 backdrop-blur-2xl shadow-xl transition-all hover:shadow-2xl ${
                  box.status === 'won' 
                    ? 'border-violet-300/70 bg-gradient-to-br from-violet-50/95 via-fuchsia-50/80 to-purple-50/70'
                    : box.status === 'lost'
                    ? 'border-purple-300/60 bg-gradient-to-br from-white/90 via-purple-50/70 to-violet-50/60'
                    : 'border-gray-300/60 bg-gradient-to-br from-white/90 to-gray-50/70'
                }`}>
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                      className="absolute w-48 h-48 rounded-full blur-3xl opacity-20"
                      style={{
                        background: box.status === 'won' 
                          ? 'radial-gradient(circle, #A78BFA, #C084FC)' 
                          : box.status === 'lost'
                          ? 'radial-gradient(circle, #C4B5FD, #A78BFA)'
                          : 'radial-gradient(circle, #E5E7EB, #D1D5DB)',
                        top: '-20%',
                        right: '-10%',
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 180],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>

                  <CardContent className="p-3 sm:p-5 relative z-10">
                    {/* Box Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/60 shrink-0 ${
                          box.status === 'won'
                            ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700'
                            : box.status === 'lost'
                            ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                            : 'bg-gradient-to-br from-gray-400 to-gray-600'
                        }`}>
                          {box.status === 'won' ? (
                            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          ) : box.status === 'lost' ? (
                            <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          ) : (
                            <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-purple-900 text-sm sm:text-base">Box {box.boxNumber}</h3>
                            <Badge variant="outline" className={`text-[10px] sm:text-xs ${
                              box.type === 'entry' 
                                ? 'bg-purple-100/80 text-purple-700 border-purple-300' 
                                : 'bg-violet-100/80 text-violet-700 border-violet-300'
                            }`}>
                              {box.type === 'entry' ? 'Entry Fee Box' : 'Bidding Box'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-purple-600">
                            <Clock className="w-3 h-3" />
                            <span>{box.openTime} → {box.closeTime}</span>
                          </div>
                        </div>
                      </div>

                      <Badge className={`shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                        box.status === 'won'
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white border-0 shadow-lg'
                          : box.status === 'lost'
                          ? 'bg-purple-100/80 text-purple-700 border-purple-300'
                          : 'bg-gray-100/80 text-gray-700 border-gray-300'
                      }`}>
                        {box.status === 'won' ? (
                          <><Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> Won</>
                        ) : box.status === 'lost' ? (
                          <><TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> Lost</>
                        ) : (
                          <><Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> Not Played</>
                        )}
                      </Badge>
                    </div>

                    {box.status !== 'not_participated' && (
                      <>
                        {/* Bid/Entry Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
                          {box.type === 'entry' && box.entryFee ? (
                            <Card className="border-2 border-purple-200/60 bg-white/70 backdrop-blur-xl shadow-md">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-1 text-[10px] text-purple-600 mb-1">
                                  <IndianRupee className="w-3 h-3" />
                                  <span>Entry Fee Paid</span>
                                </div>
                                <div className="flex items-center gap-0.5 font-bold text-purple-900">
                                  <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  <span className="text-sm sm:text-base">{box.entryFee.toLocaleString('en-IN')}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <>
                              <Card className="border-2 border-purple-200/60 bg-white/70 backdrop-blur-xl shadow-md">
                                <CardContent className="p-3">
                                  <div className="flex items-center gap-1 text-[10px] text-purple-600 mb-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>My Bid</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 font-bold text-purple-900">
                                    <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="text-sm sm:text-base">{box.myBid?.toLocaleString('en-IN')}</span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="border-2 border-violet-200/60 bg-white/70 backdrop-blur-xl shadow-md">
                                <CardContent className="p-3">
                                  <div className="flex items-center gap-1 text-[10px] text-violet-600 mb-1">
                                    <Award className="w-3 h-3" />
                                    <span>Winning Bid</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 font-bold text-violet-900">
                                    <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="text-sm sm:text-base">{box.winningBid?.toLocaleString('en-IN')}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </>
                          )}

                          <Card className="border-2 border-purple-200/60 bg-white/70 backdrop-blur-xl shadow-md">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-1 text-[10px] text-purple-600 mb-1">
                                <Target className="w-3 h-3" />
                                <span>My Rank</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-purple-900 text-sm sm:text-base">#{box.myRank || 'N/A'}</span>
                                {box.myRank === 1 && (
                                  <Medal className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-2 border-purple-200/60 bg-white/70 backdrop-blur-xl shadow-md">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-1 text-[10px] text-purple-600 mb-1">
                                <Users className="w-3 h-3" />
                                <span>Total Players</span>
                              </div>
                              <div className="font-bold text-purple-900 text-sm sm:text-base">
                                {box.totalParticipants}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Bid Range Statistics */}
                        <Card className="border-2 border-purple-200/60 bg-gradient-to-br from-purple-50/80 to-violet-50/60 backdrop-blur-xl shadow-md">
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <h4 className="font-bold text-purple-900 text-xs sm:text-sm">Bid Range Analysis</h4>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/80 rounded-xl p-3 border border-purple-200/50 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center">
                                    <TrendingDown className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <span className="text-[10px] sm:text-xs text-purple-600 font-medium">Minimum Bid</span>
                                </div>
                                <div className="flex items-center gap-0.5 font-bold text-purple-900">
                                  <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  <span className="text-sm sm:text-base">{box.minBid.toLocaleString('en-IN')}</span>
                                </div>
                              </div>

                              <div className="bg-white/80 rounded-xl p-3 border border-purple-200/50 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-md flex items-center justify-center">
                                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <span className="text-[10px] sm:text-xs text-purple-600 font-medium">Maximum Bid</span>
                                </div>
                                <div className="flex items-center gap-0.5 font-bold text-purple-900">
                                  <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  <span className="text-sm sm:text-base">{box.maxBid.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Winner Information */}
                        {box.winnerName && (
                          <Card className="border-2 border-violet-300/70 bg-gradient-to-br from-violet-50/90 to-fuchsia-50/70 backdrop-blur-xl shadow-md mt-3">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  animate={{ 
                                    rotate: [0, -10, 10, -10, 0],
                                  }}
                                  transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                  }}
                                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                                >
                                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </motion.div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Medal className="w-4 h-4 text-yellow-600" />
                                    <span className="text-[10px] sm:text-xs text-violet-700 font-medium">Winner of this slot</span>
                                  </div>
                                  <div className="font-bold text-violet-900 text-sm sm:text-base">{box.winnerName}</div>
                                  {box.status === 'won' && (
                                    <Badge className="mt-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white border-0 text-[10px]">
                                      <Sparkles className="w-3 h-3 mr-1" /> You Won This Box!
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}

                    {box.status === 'not_participated' && (
                      <Card className={`border-2 backdrop-blur-xl ${
                        box.isLocked 
                          ? 'border-red-200/60 bg-red-50/50' 
                          : 'border-gray-200/60 bg-gray-50/50'
                      }`}>
                        <CardContent className="p-4 text-center">
                          <Lock className={`w-8 h-8 mx-auto mb-2 ${
                            box.isLocked ? 'text-red-400' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm font-medium mb-1 ${
                            box.isLocked ? 'text-red-700' : 'text-gray-600'
                          }`}>
                            {box.isLocked 
                              ? '🔒 Locked - Entry Fee Required'
                              : 'You did not participate in this box'
                            }
                          </p>
                          {box.isLocked && (
                            <p className="text-xs text-red-600 mt-2 max-w-sm mx-auto">
                              You must pay the entry fee in the first slots to unlock bidding rounds
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final Result Banner */}
        {auction.status === 'won' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6"
          >
            <Card className="border-2 border-violet-300/70 backdrop-blur-xl bg-gradient-to-br from-violet-100/90 via-fuchsia-100/80 to-purple-100/70 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute w-64 h-64 rounded-full blur-3xl opacity-30"
                  style={{
                    background: 'radial-gradient(circle, #C084FC, #E879F9)',
                    top: '-30%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <CardContent className="p-4 sm:p-6 relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <motion.div
                    animate={{ 
                      rotate: [0, -15, 15, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shrink-0 border-4 border-white/50"
                  >
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-violet-900 text-lg sm:text-xl mb-2">🎉 Congratulations! You Won! 🎉</h3>
                    <p className="text-sm sm:text-base text-violet-700 mb-3">
                      You successfully won this auction and earned the amazing prize!
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-violet-300/50 shadow-md">
                        <span className="text-xs text-violet-700 font-medium">Prize Value</span>
                        <div className="flex items-center gap-0.5 font-bold text-violet-900">
                          <IndianRupee className="w-4 h-4" />
                          <span className="text-lg">{auction.prizeValue.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-purple-300/50 shadow-md">
                        <span className="text-xs text-purple-700 font-medium">You Spent</span>
                        <div className="flex items-center gap-0.5 font-bold text-purple-900">
                          <IndianRupee className="w-4 h-4" />
                          <span className="text-lg">{totalSpent.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-4 py-2 shadow-lg">
                        <span className="text-xs font-medium">Net Gain</span>
                        <div className="flex items-center gap-0.5 font-bold">
                          <span>+</span>
                          <IndianRupee className="w-4 h-4" />
                          <span className="text-lg">{(auction.prizeValue - totalSpent).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
