
import { Clock, Calendar, Trophy, Sparkles, IndianRupee, Star, Zap, Lock, Unlock, Radio, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AuctionSchedule() {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Indian products with real images and Indian prices
  const prizes = [
    { 
      name: 'iPhone 15 Pro Max 256GB', 
      value: 134900,
      image: 'https://images.unsplash.com/photo-1727093493878-874890b4f9fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpUGhvbmUlMjBzbWFydHBob25lJTIwbW9kZXJufGVufDF8fHx8MTc2Mjc5OTQ1MHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'Samsung Galaxy S24 Ultra', 
      value: 124999,
      image: 'https://images.unsplash.com/photo-1627609834360-74948f361335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW1zdW5nJTIwR2FsYXh5JTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NjI3OTk0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'OnePlus 12 5G', 
      value: 64999,
      image: 'https://images.unsplash.com/photo-1628582091924-296b8ec1fffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxPbmVQbHVzJTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NjI3MDUxNDV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'Apple Watch Ultra 2', 
      value: 89900,
      image: 'https://images.unsplash.com/photo-1687078426457-89ce2b562eaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBcHBsZSUyMFdhdGNoJTIwbHV4dXJ5fGVufDF8fHx8MTc2Mjc5OTQ1MXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'Sony WH-1000XM5 Headphones', 
      value: 29990,
      image: 'https://images.unsplash.com/photo-1761005654347-f5907893edb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTb255JTIwaGVhZHBob25lcyUyMHByZW1pdW18ZW58MXx8fHwxNzYyNzk5NDUxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'iPad Pro 12.9" M2', 
      value: 109900,
      image: 'https://images.unsplash.com/photo-1702479744193-5c5056cf0436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpUGFkJTIwdGFibGV0JTIwZGV2aWNlfGVufDF8fHx8MTc2MjcxMzIzN3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'Apple AirPods Pro 2', 
      value: 24900,
      image: 'https://images.unsplash.com/photo-1574920164507-e651b363da83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBaXJQb2RzJTIwZWFyYnVkcyUyMHdpcmVsZXNzfGVufDF8fHx8MTc2Mjc5OTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'Samsung Galaxy Watch 6', 
      value: 31999,
      image: 'https://images.unsplash.com/photo-1719075596884-2020f827a8dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW1zdW5nJTIwc21hcnR3YXRjaCUyMG1vZGVybnxlbnwxfHx8fDE3NjI3OTk0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'JBL Boombox 3 Speaker', 
      value: 34999,
      image: 'https://images.unsplash.com/photo-1687363251749-9e9c7cffc171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKQkwlMjBzcGVha2VyJTIwYmx1ZXRvb3RofGVufDF8fHx8MTc2Mjc5OTQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      name: 'Sony WF-1000XM5 Earbuds', 
      value: 19990,
      image: 'https://images.unsplash.com/photo-1762553159827-7a5d2167b55d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBwcmVtaXVtfGVufDF8fHx8MTc2Mjc5OTQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];
  
  const scheduleData = Array.from({ length: 10 }, (_, i) => {
    const auctionHour = 9 + i;
    const hour12 = auctionHour > 12 ? auctionHour - 12 : auctionHour;
    const period = auctionHour >= 12 ? 'PM' : 'AM';
    const timeStr = `${hour12}:00 ${period}`;
    
    let status = 'upcoming';
    let winner = null;
    
    if (auctionHour < currentHour) {
      status = 'completed';
      winner = `Winner${Math.floor(Math.random() * 999)}`;
    } else if (auctionHour === currentHour) {
      status = 'active';
    }
    
    return {
      time: timeStr,
      hour: auctionHour,
      status,
      prize: prizes[i],
      winner
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0';
      case 'active': return 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white border-0 shadow-lg shadow-purple-500/50';
      case 'upcoming': return 'bg-gradient-to-r from-purple-300 to-purple-400 text-white border-0';
      default: return 'bg-purple-400 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'active': return 'Live Now';
      case 'upcoming': return 'Upcoming';
      default: return 'Unknown';
    }
  };


    return (
    <div className="relative">
      <Card className="relative border-2 border-purple-300/60 backdrop-blur-2xl bg-gradient-to-br from-white/90 via-purple-50/60 to-violet-50/70 shadow-2xl overflow-hidden">
        {/* Contained animated background orbs - won't affect other components */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, #A78BFA, #7C3AED)',
              top: '-10%',
              left: '-10%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, #C084FC, #E879F9)',
              bottom: '-10%',
              right: '-10%',
            }}
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-purple-50/30 to-violet-50/40 backdrop-blur-xl pointer-events-none" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Calendar className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-purple-900">
                <span>Today's Auction Schedule</span>
                <Sparkles className="w-5 h-5 text-violet-600" />
              </CardTitle>
              <p className="text-purple-600 text-xs sm:text-sm mt-1">
                10 premium auctions daily • 9 AM - 7 PM • 6 boxes per auction
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="space-y-3">
            {scheduleData.map((auction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <div 
                  className={`
                    relative overflow-hidden rounded-xl border-2 transition-all duration-300
                    ${auction.status === 'active' 
                      ? 'border-violet-300/70 bg-gradient-to-r from-violet-100/90 via-fuchsia-100/80 to-purple-100/70 shadow-xl shadow-purple-400/30 backdrop-blur-xl' 
                      : auction.status === 'completed'
                      ? 'border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-violet-50/70 backdrop-blur-lg hover:shadow-lg'
                      : 'border-purple-200/60 bg-gradient-to-r from-white/80 to-purple-50/70 backdrop-blur-lg hover:shadow-lg hover:border-purple-300/70'
                    }
                  `}
                >
                  {/* Glassmorphism effect */}
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm pointer-events-none" />
                  
                  {/* Active auction pulse animation */}
                  {auction.status === 'active' && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <div className="relative z-10 p-3 sm:p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      {/* Left side - Time and Status */}
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-purple-500 to-purple-700`}>
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg font-bold text-purple-900">{auction.time}</span>
                            <Badge className={`${getStatusColor(auction.status)} text-xs flex items-center gap-2 rounded-xl`} >
                              {auction.status === 'active' && (
                                <motion.div
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  <Radio className="w-3 h-4" />
                                </motion.div>
                              )}
                              {auction.status === 'upcoming' && <PlayCircle className="w-4 h-4" />}
                              {getStatusText(auction.status)}
                            </Badge>
                          </div>
                          <div className="text-xs text-purple-600 mt-0.5">
                            Auction #{index + 1} of 10
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side - Prize with Image - UNIFORM SIZE */}
                      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-purple-200/50 w-full lg:w-80">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-300/60 shadow-md shrink-0">
                          <ImageWithFallback 
                            src={auction.prize.image}
                            alt={auction.prize.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-xs text-purple-600 mb-1">
                            <Trophy className="w-3 h-3" />
                            <span>Prize</span>
                          </div>
                          <div className="font-bold text-purple-900 text-sm mb-1 line-clamp-2 h-10 leading-5">
                            {auction.prize.name}
                          </div>
                          <div className="flex items-center gap-0.5 text-violet-700 font-semibold text-sm">
                            <IndianRupee className="w-3.5 h-3.5" />
                            <span>{auction.prize.value.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Winner info for completed auctions */}
                    {auction.winner && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2 bg-purple-50/80 backdrop-blur-sm rounded-xl p-2 border border-purple-200/60"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-purple-700">Winner</div>
                          <div className="text-sm font-bold text-purple-900">{auction.winner}</div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Active auction CTA */}
                    {auction.status === 'active' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 backdrop-blur-sm rounded-xl p-2.5 border-2 border-violet-300/60"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Zap className="w-5 h-5 text-violet-600" />
                        </motion.div>
                        <div>
                          <div className="text-sm font-bold text-violet-900">Entry opens 5 minutes early!</div>
                          <div className="text-xs text-violet-700">Pay one entry fee to unlock all 6 boxes (split into Box 1 & 2)</div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Box Schedule Info - 6 BOXES TOTAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 relative overflow-hidden rounded-xl border-2 border-purple-300/60 backdrop-blur-xl bg-gradient-to-br from-purple-50/90 via-violet-50/80 to-fuchsia-50/70 shadow-lg"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm pointer-events-none" />
            
            <div className="relative z-10 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-md">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-purple-900 text-sm sm:text-base">6 Box System (per auction)</h4>
              </div>
              
              {/* Entry Fee Boxes */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-purple-700" />
                  <span className="text-xs sm:text-sm font-bold text-purple-800">Entry Fee Boxes (Opens 5 mins before auction)</span>
                </div>
                <div className="bg-purple-50/80 backdrop-blur-sm rounded-xl p-3 border border-purple-300/60 mb-3">
                  <p className="text-xs text-purple-700 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                    <span><span className="font-semibold">One Payment:</span> Pay single entry fee (₹1,000-₹3,500) split across Box 1 & 2. Opens at <span className="font-bold">:55</span> (5 mins early)</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { box: 'Box 1', time: ':55-:15', desc: 'Half of entry fee' },
                    { box: 'Box 2', time: ':55-:15', desc: 'Half of entry fee' }
                  ].map((round, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="bg-gradient-to-br from-purple-100/90 to-purple-200/80 backdrop-blur-sm rounded-xl p-3 border-2 border-purple-300/60 shadow-md"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-purple-800 rounded-[25%] flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                        <div className="font-bold text-purple-900 text-sm">{round.box}</div>
                      </div>
                      <div className="text-xs text-purple-700 mb-1">
                        <span className="font-semibold">{round.time}</span>
                      </div>
                      <div className="text-[10px] text-purple-600">{round.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bidding Boxes */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="w-4 h-4 text-violet-700" />
                  <span className="text-xs sm:text-sm font-bold text-violet-800">Bidding Boxes (After Entry Payment)</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { box: 'Box 3', time: ':00-:15', unlock: 'Opens at :00' },
                    { box: 'Box 4', time: ':15-:30', unlock: 'Opens at :15' },
                    { box: 'Box 5', time: ':30-:45', unlock: 'Opens at :30' },
                    { box: 'Box 6', time: ':45-:00', unlock: 'Opens at :45' }
                  ].map((round, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="bg-gradient-to-br from-violet-100/90 to-fuchsia-100/80 backdrop-blur-sm rounded-xl p-3 border-2 border-violet-300/60 shadow-md"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-[25%] flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div className="font-bold text-violet-900 text-sm">{round.box}</div>
                      </div>
                      <div className="text-xs text-violet-700 mb-1">
                        <span className="font-semibold">{round.time}</span>
                      </div>
                      <div className="text-[10px] text-violet-600">{round.unlock}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 bg-violet-50/80 backdrop-blur-sm rounded-xl p-3 border border-violet-200/60">
                  <Star className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-violet-700">
                    <span className="font-semibold">How it works:</span> Pay ONE entry fee at :55 (5 mins before auction). This unlocks Box 1 & 2 (your entry is split between them). Then Box 3, 4, 5, 6 open every 15 minutes for bidding.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-purple-50/80 backdrop-blur-sm rounded-xl p-3 border border-purple-200/60">
                  <Clock className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-purple-700">
                    <span className="font-semibold">Example Timeline:</span> If auction starts at 2:00 PM → Entry opens at 1:55 PM → Box 3 at 2:00 PM → Box 4 at 2:15 PM → Box 5 at 2:30 PM → Box 6 at 2:45 PM → Results at 3:00 PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}