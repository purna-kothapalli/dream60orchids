import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Calendar, TrendingUp, Award, Clock, Target, Sparkles, Crown, IndianRupee, Users, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { AnimatedBackground } from './AnimatedBackground';

interface AuctionHistoryProps {
  user: {
    username: string;
  };
  onBack: () => void;
  onViewDetails: (auction: AuctionHistoryItem) => void;
}

// Box slot interface with detailed information
interface BoxSlot {
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

// Extended auction interface with box details
interface AuctionHistoryItem {
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
  boxes: BoxSlot[];
}

// Demo auction history data with box slots
const generateHistoryData = (): AuctionHistoryItem[] => {
  const prizes = [
    'MacBook Pro M3 Max',
    'iPhone 15 Pro Max',
    'PlayStation 5 Bundle',
    'Samsung 65" OLED TV',
    'iPad Pro 12.9"',
    'Apple Watch Ultra',
    'Nintendo Switch OLED',
    'Xbox Series X',
    'AirPods Max',
    'Canon EOS R6'
  ];

  // const statuses: ('won' | 'lost')[] = ['won', 'lost', 'lost', 'lost', 'won', 'lost'];
  
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i * 2);
    // const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate auction start time (random hour between 9 AM and 7 PM)
    const startHour = 9 + i;
    const auctionStartTime = `${startHour > 12 ? startHour - 12 : startHour}:00 ${startHour >= 12 ? 'PM' : 'AM'}`;
    const auctionEndTime = `${(startHour + 1) > 12 ? (startHour + 1) - 12 : (startHour + 1)}:00 ${(startHour + 1) >= 12 ? 'PM' : 'AM'}`;
    
    // Generate 4 box slots
    const boxes: BoxSlot[] = [];
    
    // Generate participant names
    const participantNames = [
      'Rajesh Kumar', 'Priya Singh', 'Amit Sharma', 'Sneha Patel', 'Vikram Reddy',
      'Neha Gupta', 'Arjun Mehta', 'Divya Iyer', 'Rahul Verma', 'Kavya Nair',
      'Sanjay Kumar', 'Pooja Desai', 'Karan Malhotra', 'Ananya Rao'
    ];

    // IMPORTANT RULE: User must pay entry fee in first slots to participate in bidding slots
    // Determine if user paid entry fee (this unlocks bidding rounds)
    const userPaidEntryFee = Math.random() > 0.2; // 80% paid entry fee

    // Box 1 & 2: Entry Fee boxes (first 2 boxes)
    // These boxes determine if user can participate in bidding rounds
    for (let boxNum = 1; boxNum <= 2; boxNum++) {
      const entryFee = Math.floor(Math.random() * 2500) + 1000; // ₹1000-₹3500
      const boxParticipants = Math.floor(Math.random() * 30) + 15; // 15-45 participants
      const minBid = Math.floor(Math.random() * 1000) + 500;
      const maxBid = Math.floor(Math.random() * 2000) + 2500;
      
      // User can only participate in entry boxes if they paid the entry fee
      const participated = userPaidEntryFee;
      const boxStatus = participated 
        ? (Math.random() > 0.7 ? 'won' : 'lost') as 'won' | 'lost'
        : 'not_participated' as const;
      const myRank = participated ? Math.floor(Math.random() * boxParticipants) + 1 : undefined;
      const winnerName = participantNames[Math.floor(Math.random() * participantNames.length)];
      
      // const openMinute = (boxNum - 1) * 15;
      const closeMinute = boxNum * 15;
      
      boxes.push({
        boxNumber: boxNum,
        type: 'entry',
        status: boxStatus,
        entryFee: participated ? entryFee : undefined,
        winnerName: boxStatus === 'won' ? 'You' : winnerName,
        myRank,
        totalParticipants: boxParticipants,
        minBid,
        maxBid,
        openTime: `${auctionStartTime}`,
        closeTime: `${startHour}:${closeMinute.toString().padStart(2, '0')} ${startHour >= 12 ? 'PM' : 'AM'}`,
        isLocked: false
      });
    }
    
    // Box 3 & 4: Bidding boxes (last 2 boxes)
    // CRITICAL RULE: Only users who paid entry fee can participate in these bidding rounds
    for (let boxNum = 3; boxNum <= 4; boxNum++) {
      // User can ONLY participate if they paid the entry fee
      const participated = userPaidEntryFee ? (Math.random() > 0.3) : false; // 70% participation rate IF entry was paid
      const myBid = Math.floor(Math.random() * 400) + 100;
      const boxParticipants = Math.floor(Math.random() * 35) + 20; // 20-55 participants
      const minBid = Math.floor(Math.random() * 100) + 50;
      const maxBid = Math.floor(Math.random() * 300) + 400;
      const winningBid = Math.random() > 0.6 ? myBid : myBid + Math.floor(Math.random() * 100) + 20;
      const boxStatus = participated 
        ? (myBid >= winningBid ? 'won' : 'lost') as 'won' | 'lost'
        : 'not_participated' as const;
      const myRank = participated ? Math.floor(Math.random() * boxParticipants) + 1 : undefined;
      const winnerName = participantNames[Math.floor(Math.random() * participantNames.length)];
      
      const openMinute = (boxNum - 1) * 15;
      const closeMinute = boxNum * 15;
      
      boxes.push({
        boxNumber: boxNum,
        type: 'bidding',
        status: boxStatus,
        myBid: participated ? myBid : undefined,
        winningBid: participated ? winningBid : undefined,
        winnerName: boxStatus === 'won' ? 'You' : winnerName,
        myRank,
        totalParticipants: boxParticipants,
        minBid,
        maxBid,
        openTime: `${startHour}:${openMinute.toString().padStart(2, '0')} ${startHour >= 12 ? 'PM' : 'AM'}`,
        closeTime: `${startHour}:${closeMinute.toString().padStart(2, '0')} ${startHour >= 12 ? 'PM' : 'AM'}`,
        isLocked: !userPaidEntryFee // Lock bidding boxes if entry fee wasn't paid
      });
    }
    
    // Calculate overall stats based on boxes
    // const participatedBoxes = boxes.filter(b => b.status !== 'not_participated');
    const wonBoxes = boxes.filter(b => b.status === 'won');
    const totalMyBid = boxes.reduce((sum, box) => {
      if (box.type === 'entry' && box.entryFee) return sum + box.entryFee;
      if (box.type === 'bidding' && box.myBid) return sum + box.myBid;
      return sum;
    }, 0);
    
    const overallStatus = wonBoxes.length >= 2 ? 'won' : 'lost';
    
    return {
      id: i + 1,
      date: date,
      prize: prizes[Math.floor(Math.random() * prizes.length)],
      prizeValue: Math.floor(Math.random() * 3000) + 1000,
      myBid: totalMyBid,
      winningBid: totalMyBid + (overallStatus === 'lost' ? Math.floor(Math.random() * 200) + 50 : 0),
      status: overallStatus,
      totalParticipants: Math.floor(Math.random() * 50) + 20,
      myRank: overallStatus === 'won' ? 1 : Math.floor(Math.random() * 10) + 2,
      auctionStartTime,
      auctionEndTime,
      boxes
    };
  });
};

// Circular Progress Component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }: { percentage: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-purple-200/30"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900">{percentage}%</span>
        <span className="text-[10px] sm:text-xs text-purple-600">Win Rate</span>
      </div>
    </div>
  );
};

export function AuctionHistory({  onBack, onViewDetails }: AuctionHistoryProps) {
  const [activeTab, setActiveTab] = useState('all');
  // Generate history data once and keep it static
  const [history] = useState(() => generateHistoryData());
  
  const wonAuctions = history.filter(h => h.status === 'won');
  const lostAuctions = history.filter(h => h.status === 'lost');
  
  const totalSpent = history.reduce((sum, h) => sum + h.myBid, 0);
  const totalWon = wonAuctions.reduce((sum, h) => sum + h.prizeValue, 0);
  const winRate = history.length > 0 ? Math.round((wonAuctions.length / history.length) * 100) : 0;
  const netGain = totalWon - totalSpent;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderAuctionCard = (auction: AuctionHistoryItem, index: number, tabPrefix: string) => {
    // Check if user didn't pay entry fee (critical for understanding auction participation)
    const didNotPayEntry = auction.boxes.slice(0, 2).some(box => box.status === 'not_participated');
    
    return (
    <motion.div
      key={`${tabPrefix}-${auction.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onViewDetails(auction)}
      className="cursor-pointer"
    >
      <Card className="relative overflow-hidden border-2 border-purple-200/60 backdrop-blur-xl bg-white/70 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:border-purple-300/80">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div
            className="absolute w-32 h-32 rounded-full blur-3xl"
            style={{
              background: auction.status === 'won' 
                ? 'radial-gradient(circle, #A78BFA, #7C3AED)' 
                : 'radial-gradient(circle, #DDD6FE, #C4B5FD)',
              top: '-20%',
              right: '-10%',
            }}
          />
        </div>

        <CardContent className="p-2.5 sm:p-6 relative z-10">
          <div className="flex flex-col gap-2 sm:gap-4">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <div
                    className={`w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-xl flex items-center justify-center shadow-md sm:shadow-lg border border-white/60 sm:border-2 ${
                      auction.status === 'won'
                        ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700'
                        : 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600'
                    }`}
                  >
                    {auction.status === 'won' ? (
                      <Crown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Target className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-purple-900 text-xs sm:text-base md:text-lg truncate">{auction.prize}</h3>
                    <div className="flex items-center gap-1 text-[9px] sm:text-xs text-purple-600 sm:hidden">
                      <Calendar className="w-2.5 h-2.5 shrink-0" />
                      <span>{auction.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden sm:flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-purple-600">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {auction.date.toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <span className="text-purple-400">•</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {auction.date.toLocaleTimeString('en-IN', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <Badge className={`
                shrink-0 border backdrop-blur-sm font-semibold text-[9px] sm:text-xs px-1 sm:px-2 py-0.5
                ${auction.status === 'won' 
                  ? 'bg-gradient-to-r from-violet-100/90 to-fuchsia-100/90 text-violet-900 border-violet-300/60' 
                  : 'bg-purple-50/80 text-purple-700 border-purple-200/50'
                }
              `}>
                <div className="flex items-center gap-0.5">
                  {auction.status === 'won' ? (
                    <>
                      <Trophy className="w-2 h-2 sm:w-3 sm:h-3" />
                      <span>Won</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3" />
                      <span>Lost</span>
                    </>
                  )}
                </div>
              </Badge>
            </div>

            {/* Stats Grid - Very compact on mobile */}
            <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3">
              <div className="bg-gradient-to-br from-purple-50/80 to-violet-50/60 backdrop-blur-xl rounded-md sm:rounded-xl p-1.5 sm:p-3 border border-purple-200/50 shadow-sm">
                <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs text-purple-600 mb-0.5">
                  <Trophy className="w-2 h-2 sm:w-3 sm:h-3 shrink-0" />
                  <span className="truncate">Prize</span>
                </div>
                <div className="flex items-center gap-0.5 font-bold text-purple-900">
                  <IndianRupee className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  <span className="text-[10px] sm:text-sm md:text-base truncate">{auction.prizeValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className={`backdrop-blur-xl rounded-md sm:rounded-xl p-1.5 sm:p-3 border shadow-sm ${
                auction.status === 'won'
                  ? 'bg-gradient-to-br from-violet-50/80 to-fuchsia-50/60 border-violet-200/50'
                  : 'bg-gradient-to-br from-purple-50/80 to-purple-100/60 border-purple-200/50'
              }`}>
                <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs text-purple-600 mb-0.5">
                  <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 shrink-0" />
                  <span className="truncate">My Bid</span>
                </div>
                <div className="flex items-center gap-0.5 font-bold text-purple-900">
                  <IndianRupee className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  <span className="text-[10px] sm:text-sm md:text-base truncate">{auction.myBid.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50/80 to-violet-50/60 backdrop-blur-xl rounded-md sm:rounded-xl p-1.5 sm:p-3 border border-purple-200/50 shadow-sm">
                <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs text-purple-600 mb-0.5">
                  <Award className="w-2 h-2 sm:w-3 sm:h-3 shrink-0" />
                  <span className="truncate">Winning</span>
                </div>
                <div className="flex items-center gap-0.5 font-bold text-purple-900">
                  <IndianRupee className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  <span className="text-[10px] sm:text-sm md:text-base truncate">{auction.winningBid.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50/80 to-violet-50/60 backdrop-blur-xl rounded-md sm:rounded-xl p-1.5 sm:p-3 border border-purple-200/50 shadow-sm">
                <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs text-purple-600 mb-0.5">
                  <Target className="w-2 h-2 sm:w-3 sm:h-3 shrink-0" />
                  <span className="truncate">Rank</span>
                </div>
                <div className="font-bold text-purple-900 text-[10px] sm:text-sm md:text-base">#{auction.myRank}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-purple-100">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm text-purple-600">
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden sm:inline">{auction.totalParticipants} participants</span>
                <span className="sm:hidden">{auction.totalParticipants} users</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                {didNotPayEntry && (
                  <Badge className="bg-red-100/80 text-red-700 border-red-300 text-[8px] sm:text-[10px] px-1.5 py-0.5">
                    <span className="hidden sm:inline">No Entry Fee</span>
                    <span className="sm:hidden">No Entry</span>
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-[9px] sm:text-xs text-purple-700 font-medium bg-purple-100/60 px-2 py-0.5 sm:py-1 rounded-full border border-purple-200/50">
                  <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                  <span>View Details</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Compact Header */}
      <motion.div 
        className="relative z-10 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-20"
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
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6">
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-2 text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-xl transition-all mb-2 sm:mb-3 border border-white/20 text-xs sm:text-sm"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-xl flex items-center justify-center shadow-2xl border border-white/30 sm:border-2"
              >
                <Trophy className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-base sm:text-2xl md:text-3xl font-bold">Auction History</h1>
                <p className="text-white/80 text-[10px] sm:text-sm mt-0.5">Your bidding journey</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 md:py-8 relative z-10">
        {/* Important Rule Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 sm:mb-4 md:mb-6"
        >
          <Card className="border-2 border-purple-300/60 bg-gradient-to-r from-purple-50/90 via-violet-50/80 to-fuchsia-50/70 backdrop-blur-xl shadow-lg">
            <CardContent className="p-2.5 sm:p-3 md:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shrink-0">
                  <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-purple-900 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">How Dream60 Auctions Work</h3>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-purple-700 leading-relaxed">
                    Each auction has <span className="font-semibold">4 box slots</span>. Entry fee payment in <span className="font-semibold">Boxes 1 & 2</span> unlocks bidding access in <span className="font-semibold">Boxes 3 & 4</span>. Click any auction to view detailed results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mobile: Premium Stats Card - Desktop: Full Stats */}
        <motion.div 
          className="mb-3 sm:mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Mobile: Beautiful Premium Stats Card */}
          <Card className="sm:hidden relative overflow-hidden border-2 border-purple-300/60 backdrop-blur-2xl bg-gradient-to-br from-white/90 via-purple-50/60 to-violet-50/70 shadow-2xl">
            {/* Animated Background Orb */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{
                  background: 'radial-gradient(circle, #A78BFA, #7C3AED)',
                  top: '-20%',
                  right: '-20%',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            <CardContent className="p-4 relative z-10">
              {/* Circular Win Rate - Centered */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.3,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  <CircularProgress percentage={winRate} size={100} strokeWidth={8} />
                </motion.div>
              </div>

              {/* Financial Stats - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                {/* Total Invested */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="relative overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-purple-100/80 via-purple-50/60 to-white/40 backdrop-blur-xl rounded-2xl p-3 border-2 border-purple-200/60 shadow-lg">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                        <TrendingDown className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-[10px] text-purple-700 font-semibold">Invested</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <IndianRupee className="w-4 h-4 text-purple-900 font-bold" />
                      <span className="text-lg font-bold text-purple-900 truncate">{totalSpent.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Total Won */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="relative overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-violet-100/80 via-fuchsia-50/60 to-white/40 backdrop-blur-xl rounded-2xl p-3 border-2 border-violet-200/60 shadow-lg">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-[10px] text-violet-700 font-semibold">Won</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <IndianRupee className="w-4 h-4 text-violet-900 font-bold" />
                      <span className="text-lg font-bold text-violet-900 truncate">{totalWon.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Desktop: Full Premium Layout */}
          <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Win Rate - Large Featured Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:row-span-2"
            >
              <Card className="relative overflow-hidden border-2 border-purple-300/60 backdrop-blur-2xl bg-gradient-to-br from-white/80 via-purple-50/50 to-violet-50/60 shadow-2xl h-full">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
                    style={{
                      background: 'radial-gradient(circle, #A78BFA, #7C3AED)',
                      top: '-30%',
                      right: '-30%',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>

                <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center h-full relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="mb-6"
                  >
                    <CircularProgress percentage={winRate} size={140} strokeWidth={10} />
                  </motion.div>
                  
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-purple-900">Success Rate</h3>
                    </div>
                    <p className="text-sm text-purple-600">Your winning percentage</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full mt-6 pt-6 border-t border-purple-200/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-900">{wonAuctions.length}</div>
                      <div className="text-xs text-purple-600 mt-1">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">{lostAuctions.length}</div>
                      <div className="text-xs text-purple-600 mt-1">Losses</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Side Stats Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Auctions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <Card className="relative overflow-hidden border-2 border-purple-200/60 backdrop-blur-2xl bg-gradient-to-br from-white/80 to-purple-50/60 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/10" />
                  <CardContent className="p-6 relative z-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.3,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    >
                      <Calendar className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="text-sm text-purple-700 mb-2 font-medium">Total Auctions</div>
                    <div className="text-4xl font-bold text-purple-900">{history.length}</div>
                    <div className="text-xs text-purple-600 mt-2">Participated in</div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Total Spent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="relative overflow-hidden border-2 border-purple-200/60 backdrop-blur-2xl bg-gradient-to-br from-white/80 to-purple-50/60 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/10" />
                  <CardContent className="p-6 relative z-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.35,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    >
                      <TrendingDown className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="text-sm text-purple-700 mb-2 font-medium">Total Spent</div>
                    <div className="flex items-center gap-1 text-3xl font-bold text-purple-900">
                      <IndianRupee className="w-6 h-6" />
                      <span>{totalSpent.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-xs text-purple-600 mt-2">All bids combined</div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Total Won */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <Card className="relative overflow-hidden border-2 border-purple-200/60 backdrop-blur-2xl bg-gradient-to-br from-white/80 via-violet-50/50 to-fuchsia-50/60 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/10" />
                  <CardContent className="p-6 relative z-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.4,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    >
                      <TrendingUp className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="text-sm text-violet-700 mb-2 font-medium">Total Won</div>
                    <div className="flex items-center gap-1 text-3xl font-bold text-violet-900">
                      <IndianRupee className="w-6 h-6" />
                      <span>{totalWon.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-xs text-violet-600 mt-2">Prize value earned</div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Net Gain/Loss */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className={`relative overflow-hidden border-2 backdrop-blur-2xl shadow-xl ${
                  netGain >= 0 
                    ? 'border-violet-200/60 bg-gradient-to-br from-white/80 via-violet-50/50 to-fuchsia-50/60'
                    : 'border-purple-200/60 bg-gradient-to-br from-white/80 to-purple-50/60'
                }`}>
                  <div className={`absolute inset-0 ${
                    netGain >= 0
                      ? 'bg-gradient-to-br from-violet-500/5 to-fuchsia-500/10'
                      : 'bg-gradient-to-br from-purple-500/5 to-violet-500/10'
                  }`} />
                  <CardContent className="p-6 relative z-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.45,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
                        netGain >= 0
                          ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600'
                          : 'bg-gradient-to-br from-purple-500 to-purple-700'
                      }`}
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className={`text-sm mb-2 font-medium ${
                      netGain >= 0 ? 'text-violet-700' : 'text-purple-700'
                    }`}>
                      Net {netGain >= 0 ? 'Gain' : 'Loss'}
                    </div>
                    <div className={`flex items-center gap-1 text-3xl font-bold ${
                      netGain >= 0 ? 'text-violet-900' : 'text-purple-900'
                    }`}>
                      {netGain >= 0 ? '+' : ''}
                      <IndianRupee className="w-6 h-6" />
                      <span>{Math.abs(netGain).toLocaleString('en-IN')}</span>
                    </div>
                    <div className={`text-xs mt-2 ${
                      netGain >= 0 ? 'text-violet-600' : 'text-purple-600'
                    }`}>
                      {netGain >= 0 ? 'Profit earned' : 'Investment made'}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* History List/Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-2 border-purple-200/60 backdrop-blur-2xl bg-white/80 shadow-2xl">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-10"
                style={{
                  background: 'radial-gradient(circle, #A78BFA, #7C3AED)',
                  bottom: '-40%',
                  left: '-10%',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, -15, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Desktop: Full Header with Icon */}
            <CardHeader className="hidden sm:block relative bg-gradient-to-r from-purple-50/90 via-violet-50/80 to-purple-50/90 border-b-2 border-purple-200/50 backdrop-blur-xl p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.3,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl sm:rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-base sm:text-xl md:text-2xl font-bold text-purple-900">Your Activity</h2>
                  <p className="text-[10px] sm:text-xs md:text-sm text-purple-600 mt-0.5">Detailed bid history</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-2 sm:p-4 md:p-6 relative z-10">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
                  <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full grid-cols-3 mb-3 sm:mb-6 bg-purple-100/60 backdrop-blur-xl p-0.5 sm:p-1 rounded-xl sm:rounded-xl border border-purple-200/50 shadow-inner">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-md sm:rounded-xl text-[9px] sm:text-sm md:text-base font-semibold py-1.5 sm:py-2 whitespace-nowrap px-3 sm:px-4"
                    >
                      <Trophy className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5" />
                      All ({history.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="won"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-md sm:rounded-xl text-[9px] sm:text-sm md:text-base font-semibold py-1.5 sm:py-2 whitespace-nowrap px-3 sm:px-4"
                    >
                      <Crown className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5" />
                      Won ({wonAuctions.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="lost"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-md sm:rounded-xl text-[9px] sm:text-sm md:text-base font-semibold py-1.5 sm:py-2 whitespace-nowrap px-3 sm:px-4"
                    >
                      <TrendingDown className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5" />
                      Lost ({lostAuctions.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="space-y-2 sm:space-y-3 md:space-y-4 mt-0">
                  {history.length > 0 ? (
                    history.map((auction, index) => renderAuctionCard(auction, index, 'all'))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6 sm:py-12"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-xl"
                      >
                        <Trophy className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                      </motion.div>
                      <p className="text-sm sm:text-base font-semibold text-purple-800">No auction history yet</p>
                      <p className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-purple-600">Start bidding to see your history here!</p>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="won" className="space-y-2 sm:space-y-3 md:space-y-4 mt-0">
                  {wonAuctions.length > 0 ? (
                    wonAuctions.map((auction, index) => renderAuctionCard(auction, index, 'won'))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6 sm:py-12"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-xl"
                      >
                        <Crown className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                      </motion.div>
                      <p className="text-sm sm:text-base font-semibold text-purple-800">No wins yet</p>
                      <p className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-purple-600">Keep bidding to win amazing prizes!</p>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="lost" className="space-y-2 sm:space-y-3 md:space-y-4 mt-0">
                  {lostAuctions.length > 0 ? (
                    lostAuctions.map((auction, index) => renderAuctionCard(auction, index, 'lost'))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6 sm:py-12"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-xl"
                      >
                        <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                      </motion.div>
                      <p className="text-sm sm:text-base font-semibold text-purple-800">Perfect record!</p>
                      <p className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-purple-600">You haven't lost any auctions yet!</p>
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
