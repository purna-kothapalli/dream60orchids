import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, IndianRupee, AlertTriangle, Gavel, Zap, Trophy, DollarSign, TrendingUp, Award, Target, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AnimatedBackground } from './AnimatedBackground';
import { toast } from 'sonner';

interface Box {
  id: number;
  type: 'entry' | 'round';
  minBid?: number;
  entryFee?: number;
  currentBid: number;
  bidder: string | null;
  roundNumber?: number;
}

interface BidModalProps {
  box: Box;
  prizeValue: number;
  onBid: (amount: number) => void;
  onClose: () => void;
  userPreviousBid?: number;
  userHasBidInRound?: boolean;
}

export function BidModal({ box, prizeValue, onBid, onClose, userPreviousBid, userHasBidInRound }: BidModalProps) {
  const isEntryBox = box.type === 'entry';
  const entryFeeAmount = box.entryFee || 0;
  const minBidAmount = isEntryBox ? entryFeeAmount : (box.minBid || 10);
  const maxBidAmount = isEntryBox ? entryFeeAmount : Math.floor(prizeValue * 0.9);
  
  const [bidAmount, setBidAmount] = useState(minBidAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const isValidBid = bidAmount >= minBidAmount && bidAmount <= maxBidAmount && 
    (!userPreviousBid || bidAmount > userPreviousBid);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userHasBidInRound) {
      setError('You have already placed a bid in this round.');
      return;
    }
    
    if (userPreviousBid && bidAmount <= userPreviousBid) {
      setError(`Bid must be higher than ₹${userPreviousBid}`);
      return;
    }
    
    if (!isValidBid || isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    const timer = setTimeout(() => {
      try {
        onBid(bidAmount);
        
        // Show toast notification based on box type
        if (isEntryBox) {
          toast.success('Entry Fee Paid Successfully! 🎉', {
            description: `Paid ₹${bidAmount.toLocaleString('en-IN')} to join the auction. Good luck!`,
            duration: 4000,
          });
        } else {
          toast.success('Bid Placed Successfully! 🎯', {
            description: `Your bid of ₹${bidAmount.toLocaleString('en-IN')} has been placed for ${getBoxTitle()}.`,
            duration: 4000,
          });
        }
        
        onClose();
      } catch (error) {
        console.error('Bid submission error:', error);
        toast.error('Bid Failed', {
          description: 'Something went wrong. Please try again.',
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  const getBoxTitle = () => {
    if (box.type === 'entry') {
      return `Entry Box ${box.id}`;
    }
    return `Round ${box.id - 2}`;
  };

  const effectiveMin = Math.max(minBidAmount, (userPreviousBid || 0) + 1);

  // Calculate bid strength
  const getBidStrength = (amount: number) => {
    if (isEntryBox) return { label: 'Entry', color: 'purple', percentage: 100 };
    
    const range = maxBidAmount - effectiveMin;
    const position = amount - effectiveMin;
    const percentage = (position / range) * 100;
    
    if (percentage >= 80) return { label: 'Maximum', color: 'red', percentage };
    if (percentage >= 60) return { label: 'Strong', color: 'orange', percentage };
    if (percentage >= 40) return { label: 'Competitive', color: 'yellow', percentage };
    if (percentage >= 20) return { label: 'Moderate', color: 'blue', percentage };
    return { label: 'Safe', color: 'green', percentage };
  };

  const bidStrength = getBidStrength(bidAmount);

  // Smart bid recommendation
  const getRecommendedBid = () => {
    if (isEntryBox) return entryFeeAmount;
    const currentBid = box.currentBid || 0;
    const buffer = Math.max(50, Math.floor((maxBidAmount - effectiveMin) * 0.15));
    return Math.min(currentBid + buffer, maxBidAmount);
  };

  const recommendedBid = getRecommendedBid();

  // Quick bid options with smart labels
  const quickBidOptions = [
    { label: 'Safe', amount: effectiveMin, icon: Target },
    { label: 'Smart', amount: Math.min(recommendedBid, maxBidAmount), icon: Sparkles },
    { label: 'Bold', amount: Math.min(Math.floor(maxBidAmount * 0.7), maxBidAmount), icon: TrendingUp },
    { label: 'Max', amount: maxBidAmount, icon: Award }
  ].filter(bid => bid.amount <= maxBidAmount && bid.amount >= effectiveMin);

  // Quick increment amounts
  const incrementOptions = [10, 25, 50, 100];

  // Calculate potential profit
  const potentialProfit = !isEntryBox ? prizeValue - bidAmount : 0;
  const bidPercentage = !isEntryBox ? ((bidAmount / prizeValue) * 100).toFixed(1) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex h-[100vh] sm:items-center sm:justify-center sm:p-4">
        {/* Animated Background */}
        <AnimatedBackground />
        
        {/* Backdrop Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          className="relative z-10 w-full max-h-screen overflow-y-auto sm:w-auto sm:min-w-[28rem] sm:max-w-md"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#9333ea #f3e8ff'
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            duration: 0.5,
            ease: [0.6, -0.05, 0.01, 0.99]
          }}
        >
          {/* Card */}
          <div className="bg-white/95 backdrop-blur-2xl border-0 sm:border sm:border-purple-200/50 shadow-2xl shadow-purple-500/10 sm:rounded-3xl overflow-hidden min-h-screen sm:min-h-0 flex flex-col">
            
            {/* Card shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none"
              initial={{ x: '-100%', y: '-100%' }}
              animate={{ x: '100%', y: '100%' }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
              }}
            />

            {/* Header */}
            <div className="relative px-5 py-5 sm:px-6 sm:py-6 border-b border-purple-200/50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Animated Icon */}
                  <motion.div 
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {isEntryBox ? (
                      <DollarSign className="w-6 h-6 text-white" />
                    ) : (
                      <Gavel className="w-6 h-6 text-white" />
                    )}
                  </motion.div>
                  
                  <div>
                    <motion.h2 
                      className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {isEntryBox ? 'Entry Fee' : 'Place Bid'}
                    </motion.h2>
                    <motion.p 
                      className="text-xs sm:text-sm text-purple-600 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {getBoxTitle()}
                    </motion.p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative px-5 py-5 sm:px-6 sm:py-6 space-y-4">
              
              {/* Current Bid/Entry Fee Display */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center space-y-2"
              >
                <div className="text-xs sm:text-sm font-bold text-purple-700 uppercase tracking-wide flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {isEntryBox ? 'Required Fee' : 'Current Leader'}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className={`w-6 h-6 sm:w-7 sm:h-7 ${isEntryBox || box.currentBid > 0 ? 'text-purple-700' : 'text-purple-400'}`} />
                  <span className={`text-3xl sm:text-4xl font-black ${isEntryBox || box.currentBid > 0 ? 'text-purple-900' : 'text-purple-400'}`}>
                    {isEntryBox ? entryFeeAmount.toLocaleString('en-IN') : (box.currentBid > 0 ? box.currentBid.toLocaleString('en-IN') : '---')}
                  </span>
                </div>
                {!isEntryBox && box.bidder && (
                  <div className="flex items-center justify-center gap-2 bg-purple-100/80 backdrop-blur-sm rounded-full py-1.5 px-3 border border-purple-200">
                    <span className="text-xs font-bold text-purple-900">{box.bidder}</span>
                  </div>
                )}
                {!isEntryBox && (
                  <div className="text-xs text-purple-600 font-medium">
                    Total Prize: ₹{prizeValue.toLocaleString('en-IN')}
                  </div>
                )}
              </motion.div>

              {/* Warning Messages */}
              {(userPreviousBid || userHasBidInRound) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className={`${userHasBidInRound ? 'bg-red-50' : 'bg-yellow-50'} border-2 ${userHasBidInRound ? 'border-red-200' : 'border-yellow-200'} rounded-xl p-3`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${userHasBidInRound ? 'text-red-600' : 'text-yellow-600'}`} />
                    <div className="flex-1">
                      {userHasBidInRound ? (
                        <p className="text-xs font-medium text-red-700">You've already bid in this round</p>
                      ) : userPreviousBid ? (
                        <p className="text-xs font-medium text-yellow-700">
                          Previous bid: ₹{userPreviousBid.toLocaleString('en-IN')} - Must bid higher
                        </p>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bid Input - Only for round boxes */}
              {!isEntryBox && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="space-y-3"
                >
                  <div className="text-xs sm:text-sm font-bold text-purple-700 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Your Bid Amount
                  </div>
                  
                  {/* Number Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <IndianRupee className="w-5 h-5 text-purple-600" />
                    </div>
                    <Input
                      type="number"
                      min={effectiveMin}
                      max={maxBidAmount}
                      step="1"
                      value={bidAmount}
                      disabled={userHasBidInRound}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="bg-white/50 border-2 border-purple-300 text-purple-900 text-2xl sm:text-3xl font-black text-center h-14 pl-10 pr-4 rounded-xl focus:border-purple-500 focus:bg-white transition-all disabled:opacity-50"
                      placeholder="0"
                    />
                  </div>

                  {/* Bid Strength Indicator */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-purple-600">Bid Strength:</span>
                      <span className={`${
                        bidStrength.color === 'green' ? 'text-green-600' :
                        bidStrength.color === 'blue' ? 'text-blue-600' :
                        bidStrength.color === 'yellow' ? 'text-yellow-600' :
                        bidStrength.color === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {bidStrength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${
                          bidStrength.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          bidStrength.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          bidStrength.color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          bidStrength.color === 'orange' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bidStrength.percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Bid Info */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-2">
                      <div className="text-[10px] text-green-600 font-bold uppercase">Min</div>
                      <div className="text-xs font-black text-green-700">₹{effectiveMin.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-2">
                      <div className="text-[10px] text-purple-600 font-bold uppercase">Your Bid %</div>
                      <div className="text-xs font-black text-purple-700">{bidPercentage}%</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-2">
                      <div className="text-[10px] text-orange-600 font-bold uppercase">Max</div>
                      <div className="text-xs font-black text-orange-700">₹{maxBidAmount.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {/* Potential Profit */}
                  {potentialProfit > 0 && (
                    <motion.div 
                      className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700">Potential Profit:</span>
                        <span className="text-sm font-black text-emerald-900 flex items-center gap-0.5">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {potentialProfit.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Quick Increment Buttons */}
                  {!userHasBidInRound && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-purple-600 text-center">Quick Adjust</div>
                      <div className="grid grid-cols-4 gap-2">
                        {incrementOptions.map((increment) => (
                          <button
                            key={increment}
                            type="button"
                            onClick={() => setBidAmount(Math.min(maxBidAmount, bidAmount + increment))}
                            disabled={bidAmount >= maxBidAmount}
                            className="bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 border border-purple-300 text-purple-700 transition-all rounded-xl py-2 px-2 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            <span className="text-xs font-black">+₹{increment}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Bid Strategy Options */}
                  {!userHasBidInRound && quickBidOptions.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-purple-600 text-center">Bid Strategy</div>
                      <div className="grid grid-cols-4 gap-2">
                        {quickBidOptions.map((bid) => {
                          const Icon = bid.icon;
                          const isRecommended = bid.amount === recommendedBid;
                          return (
                            <button
                              key={bid.label}
                              type="button"
                              onClick={() => setBidAmount(bid.amount)}
                              className={`${
                                isRecommended 
                                  ? 'bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-400 ring-2 ring-amber-300' 
                                  : 'bg-purple-100/80 border border-purple-300'
                              } hover:bg-purple-200 text-purple-700 transition-all rounded-xl py-2.5 px-2 flex flex-col items-center gap-1 hover:scale-105 relative`}
                            >
                              {isRecommended && (
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                              <Icon className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold">{bid.label}</span>
                              <span className="text-[9px] font-black">₹{bid.amount.toLocaleString('en-IN')}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-center text-purple-600 flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="font-medium">Smart choice recommended</span>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-3"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-red-700">{error}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-t border-purple-200/50 space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={!isValidBid || isSubmitting}
                className={`w-full h-12 sm:h-14 font-bold text-sm sm:text-base transition-all duration-300 rounded-xl shadow-lg ${
                  'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 shadow-purple-500/40'
                } ${!isValidBid ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02]'}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div 
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Processing...</span>
                  </div>
                ) : isEntryBox ? (
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Pay ₹{entryFeeAmount.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Gavel className="w-5 h-5" />
                    <span>Bid ₹{bidAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </Button>
              
              <p className="text-xs text-purple-600 text-center">
                {isEntryBox 
                  ? 'Entry fees are non-refundable'
                  : 'Bids are final and cannot be changed'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}