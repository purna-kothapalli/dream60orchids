import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Crown, Clock, Zap, Target, TrendingUp, Sparkles, Trophy, CheckCircle2, AlertCircle, Timer, IndianRupee, Users, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface Box {
  id: number;
  type: 'entry' | 'round';
  isOpen: boolean;
  minBid?: number;
  entryFee?: number;
  currentBid: number;
  bidder: string | null;
  opensAt?: Date;
  closesAt?: Date;
  hasPaid?: boolean;
  roundNumber?: number;
  status?: 'upcoming' | 'active' | 'completed';
  leaderboard?: Array<{
    username: string;
    bid: number;
    timestamp: Date;
  }>;
}

interface AuctionBoxProps {
  box: Box;
  onClick: () => void;
  isUserHighestBidder: boolean;
  onShowLeaderboard?: (roundNumber: number, leaderboard: any[], opensAt?: Date, closesAt?: Date) => void;
  userHasPaidEntry?: boolean;
}

export function AuctionBox({ box, onClick, isUserHighestBidder, onShowLeaderboard, userHasPaidEntry }: AuctionBoxProps) {
  const [timeUntilOpen, setTimeUntilOpen] = useState('');

  useEffect(() => {
    if (box.type === 'round' && box.opensAt) {
      const updateTimer = () => {
        const now = new Date();

          if (!box.isOpen && box.opensAt! > now) {
          const distance = box.opensAt!.getTime() - now.getTime();
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeUntilOpen(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else if (box.isOpen && box.closesAt && box.closesAt > now) {
          const distance = box.closesAt.getTime() - now.getTime();
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeUntilOpen(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeUntilOpen('');
        }
      };

      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [box.isOpen, box.opensAt, box.closesAt, box.type]);

  const getBoxTitle = () => {
    if (box.type === 'entry') {
      return `Entry Box ${box.id}`;
    }
    return `Round ${box.id - 2}`;
  };

  const getBoxStatus = () => {
    if (box.type === 'entry') {
      return box.hasPaid ? 'paid' : 'open';
    }
    if (box.status === 'completed') return 'completed';
    if (box.status === 'upcoming') return 'upcoming';
    if (!box.isOpen) return 'locked';
    if (box.currentBid === 0) return 'open';
    return 'bidding';
  };

  const status = getBoxStatus();
  const isClickable = box.isOpen && status !== 'paid' && status !== 'completed' && status !== 'upcoming';

  // Background gradient based on status - All Purple/Violet
  const getBackgroundGradient = () => {
    if (status === 'completed') return 'from-purple-100/80 via-violet-100/60 to-purple-100/80';
    if (status === 'upcoming' || status === 'locked') return 'from-purple-50/70 via-violet-50/50 to-purple-50/70';
    if (status === 'paid') return 'from-purple-100/80 via-fuchsia-100/60 to-purple-100/80';
    if (isUserHighestBidder) return 'from-violet-100/80 via-purple-100/60 to-fuchsia-100/80';
    return 'from-purple-50/80 via-violet-100/60 to-purple-50/80';
  };

  const getBorderColor = () => {
    if (status === 'completed') return 'border-purple-400/50';
    if (status === 'upcoming' || status === 'locked') return 'border-purple-300/40';
    if (status === 'paid') return 'border-fuchsia-400/50';
    if (isUserHighestBidder) return 'border-violet-400/60';
    return 'border-purple-300/50';
  };

  const getShadowColor = () => {
    if (status === 'completed') return 'shadow-purple-500/15';
    if (status === 'upcoming' || status === 'locked') return 'shadow-purple-500/10';
    if (status === 'paid') return 'shadow-fuchsia-500/15';
    if (isUserHighestBidder) return 'shadow-violet-500/20';
    return 'shadow-purple-500/15';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={isClickable ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      className="h-full w-full"
    >
      <Card 
        className={`
          relative overflow-hidden h-full w-full border-2 backdrop-blur-xl shadow-xl transition-all duration-500
          bg-gradient-to-br ${getBackgroundGradient()} ${getBorderColor()} ${getShadowColor()}
          ${isClickable ? 'cursor-pointer hover:shadow-2xl' : 'cursor-default'}
        `}
        onClick={isClickable ? onClick : undefined}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orb 1 - Purple/Violet */}
          <motion.div
            className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full blur-3xl opacity-20"
            style={{
              background: isUserHighestBidder 
                ? 'radial-gradient(circle, #D8B4FE, #A78BFA)' 
                : status === 'completed'
                ? 'radial-gradient(circle, #C4B5FD, #8B5CF6)'
                : status === 'locked' || status === 'upcoming'
                ? 'radial-gradient(circle, #DDD6FE, #A78BFA)'
                : 'radial-gradient(circle, #C4B5FD, #8B5CF6)',
              top: '-15%',
              left: '-5%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 15, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Gradient Orb 2 - Purple/Violet */}
          <motion.div
            className="absolute w-28 h-28 sm:w-40 sm:h-40 rounded-full blur-3xl opacity-15"
            style={{
              background: isUserHighestBidder 
                ? 'radial-gradient(circle, #A78BFA, #7C3AED)' 
                : status === 'completed'
                ? 'radial-gradient(circle, #A78BFA, #7C3AED)'
                : status === 'locked' || status === 'upcoming'
                ? 'radial-gradient(circle, #C4B5FD, #9333EA)'
                : 'radial-gradient(circle, #A78BFA, #7C3AED)',
              bottom: '-15%',
              right: '-5%',
            }}
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Floating Particles - Purple/Violet */}
          {isUserHighestBidder && status === 'bidding' && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${25 + Math.random() * 50}%`,
                    left: `${15 + Math.random() * 70}%`,
                  }}
                  animate={{
                    y: [-8, -20, -8],
                    opacity: [0, 0.7, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.6,
                  }}
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-violet-400" />
                </motion.div>
              ))}
            </>
          )}

          {/* Shimmer Effect */}
          {(status === 'open' || status === 'bidding') && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        <CardContent className="p-3 sm:p-4 md:p-5 relative z-10">
          {/* Header with Title and Status */}
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-purple-900 truncate">
              {getBoxTitle()}
            </h3>
            
            <div className={`
              flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border shrink-0
              ${status === 'completed' 
                ? 'bg-purple-100/80 text-purple-800 border-purple-300/50' 
                : status === 'upcoming' || status === 'locked'
                ? 'bg-purple-50/80 text-purple-700 border-purple-200/50'
                : status === 'paid'
                ? 'bg-fuchsia-100/80 text-fuchsia-800 border-fuchsia-300/50'
                : isUserHighestBidder
                ? 'bg-violet-100/80 text-violet-900 border-violet-300/50'
                : 'bg-purple-100/80 text-purple-800 border-purple-300/50'
              }
            `}>
              {status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
              {status === 'upcoming' && <Lock className="w-3 h-3" />}
              {status === 'locked' && <Lock className="w-3 h-3" />}
              {status === 'open' && <Zap className="w-3 h-3" />}
              {status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
              {status === 'bidding' && !isUserHighestBidder && <TrendingUp className="w-3 h-3" />}
              {isUserHighestBidder && status === 'bidding' && <Crown className="w-3 h-3" />}
              <span className="hidden xs:inline">
                {status === 'completed' 
                  ? 'Completed' 
                  : status === 'upcoming' 
                  ? 'Locked' 
                  : status === 'locked' 
                  ? 'Locked' 
                  : status === 'open' 
                  ? 'Open' 
                  : status === 'paid' 
                  ? 'Paid' 
                  : isUserHighestBidder
                  ? 'Winning'
                  : 'Active'
                }
              </span>
            </div>
          </div>

          {/* Main Icon Area with Spinning Animation */}
          <div className="flex flex-col items-center justify-center mb-3 sm:mb-4 py-2 sm:py-3 md:py-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="relative mb-2 sm:mb-3"
            >
              <div className={`
                w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border-3 sm:border-4 border-white/60
                ${status === 'completed'
                  ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-violet-700'
                  : status === 'upcoming' || status === 'locked'
                  ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600'
                  : status === 'paid'
                  ? 'bg-gradient-to-br from-fuchsia-500 via-fuchsia-600 to-purple-700'
                  : isUserHighestBidder
                  ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700'
                  : 'bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800'
                }
              `}>
                {status === 'upcoming' || status === 'locked' ? (
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                ) : box.type === 'entry' ? (
                  <IndianRupee className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                ) : (
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                )}
              </div>

              {/* Winner Crown Badge - Purple/Violet */}
              {isUserHighestBidder && status !== 'locked' && status !== 'upcoming' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg border-2 sm:border-3 border-white">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </motion.div>
              )}

              {/* Active Status Badge - Purple/Violet */}
              {status === 'open' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2"
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-lg border-2 sm:border-3 border-white">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Current Bid Display */}
            {box.currentBid > 0 && box.type === 'round' && status !== 'locked' && status !== 'upcoming' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mb-2"
              >
                <div className="bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border-2 border-purple-200/60">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900">
                      {box.currentBid.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Timer Display */}
            {timeUntilOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div className="bg-purple-600 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg border-2 border-purple-300/60">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-white">
                    <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="font-mono font-semibold text-xs sm:text-sm">
                      {timeUntilOpen}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Information Section */}
          <div className="space-y-2 sm:space-y-2.5">
            {status === 'completed' ? (
              <>
                {/* Completion Info - Purple/Violet */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-purple-200/60">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-purple-800 text-xs font-semibold mb-1 sm:mb-1.5">
                    <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>Round Completed</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-purple-700">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {box.opensAt?.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      {' - '}
                      {box.closesAt?.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                </div>

                {/* Winner Card - Purple/Violet */}
                {box.leaderboard && box.leaderboard.length > 0 ? (
                  <>
                    <div className="bg-gradient-to-r from-violet-100/90 to-fuchsia-100/90 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-violet-300/60">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs text-violet-700 font-medium">Winner</div>
                            <div className="text-sm font-bold text-violet-900 truncate">{box.leaderboard[0].username}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-violet-900 font-bold shrink-0 text-sm sm:text-base">
                          <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{box.leaderboard[0].bid.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {onShowLeaderboard && userHasPaidEntry && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowLeaderboard(box.roundNumber!, box.leaderboard!, box.opensAt, box.closesAt);
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>View Leaderboard</span>
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-purple-200/60 text-center">
                    <div className="flex items-center justify-center gap-2 text-purple-600 text-xs sm:text-sm">
                      <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>No bids placed</span>
                    </div>
                  </div>
                )}
              </>
            ) : status === 'upcoming' ? (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-purple-200/60 text-center">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-purple-900 font-bold text-xs sm:text-sm">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Pay Entry Fee to Unlock</span>
                  </div>
                </div>
                {box.opensAt && (
                  <div className="bg-purple-50/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-purple-200/60">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-purple-700 mb-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="font-medium">Scheduled Time</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-purple-900 truncate">
                      {box.opensAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      {' - '}
                      {box.closesAt?.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                )}
              </>
            ) : status === 'locked' ? (
              <>
                {box.opensAt && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-purple-200/60">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-purple-700 mb-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="font-medium">Opens at</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-purple-900 truncate">
                      {box.opensAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      {' - '}
                      {box.closesAt?.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                )}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-purple-200/60">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-purple-700 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>{box.type === 'entry' ? 'Entry Fee' : 'Min Bid'}</span>
                    </span>
                    <span className="text-purple-900 font-bold flex items-center gap-0.5 shrink-0 text-sm sm:text-base">
                      <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{(box.type === 'entry' ? box.entryFee : box.minBid)?.toLocaleString('en-IN')}</span>
                    </span>
                  </div>
                </div>
              </>
            ) : status === 'paid' ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-fuchsia-200/60 text-center">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-fuchsia-800 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Entry Fee Paid</span>
                </div>
              </div>
            ) : (
              <>
                {/* Main Price Card */}
                <div className="bg-gradient-to-r from-purple-100/90 to-purple-50/90 backdrop-blur-sm rounded-xl p-2.5 sm:p-3.5 border border-purple-200/60">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-purple-700 font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>{box.type === 'entry' ? 'Entry Fee' : 'Current Bid'}</span>
                    </span>
                    <span className="text-purple-900 font-bold text-base sm:text-lg flex items-center gap-0.5 shrink-0">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{(box.type === 'entry' ? box.entryFee : (box.currentBid > 0 ? box.currentBid : box.minBid))?.toLocaleString('en-IN')}</span>
                    </span>
                  </div>
                </div>

                {/* Highest Bidder Card - Purple/Violet */}
                {box.bidder && (
                  <div className={`backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border ${
                    isUserHighestBidder 
                      ? 'bg-violet-100/90 border-violet-300/60' 
                      : 'bg-white/80 border-purple-200/60'
                  }`}>
                    <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                      <span className="font-medium text-purple-700 flex items-center gap-1 sm:gap-1.5">
                        {isUserHighestBidder && <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600 shrink-0" />}
                        <span>Highest Bidder</span>
                      </span>
                      <span className={`font-bold truncate ${isUserHighestBidder ? 'text-violet-900' : 'text-purple-900'}`}>
                        {box.bidder}
                      </span>
                    </div>
                  </div>
                )}

                {/* Minimum Bid Card */}
                {box.type === 'round' && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-purple-200/60">
                    <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                      <span className="text-purple-700 font-medium flex items-center gap-1 sm:gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span>Minimum Bid</span>
                      </span>
                      <span className="text-purple-900 font-bold flex items-center gap-0.5 shrink-0">
                        <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{box.minBid?.toLocaleString('en-IN')}</span>
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Call to Action Button - Purple/Violet Gradient */}
            {isClickable && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className={`
                  rounded-xl p-2.5 sm:p-3.5 text-center font-bold shadow-lg hover:shadow-xl cursor-pointer transition-all
                  ${isUserHighestBidder 
                    ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white' 
                    : 'bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 text-white'
                  }
                `}>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {status === 'open' && box.type === 'round' && <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    {status === 'open' && box.type === 'entry' && <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    {isUserHighestBidder && <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    {status === 'bidding' && !isUserHighestBidder && <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    <span className="text-xs sm:text-sm">
                      {status === 'open' && box.type === 'entry' && 'Pay Entry Fee'}
                      {status === 'open' && box.type === 'round' && 'Place Your Bid'}
                      {isUserHighestBidder && "You're Winning!"}
                      {status === 'bidding' && !isUserHighestBidder && 'Outbid Now'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
