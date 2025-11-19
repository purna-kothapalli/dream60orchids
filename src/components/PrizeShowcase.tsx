import { Gift, IndianRupee, Users, CreditCard, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

interface PrizeShowcaseProps {
  currentPrize: {
    title: string;
    prize: string;
    prizeValue: number;
    totalParticipants: number;
    userHasPaidEntry?: boolean;
    boxes: Array<{
      id: number;
      type: 'entry' | 'round';
      entryFee?: number;
      hasPaid?: boolean;
    }>;
  };
  onPayEntry?: (boxId: number, entryFee: number) => void;
  isLoggedIn?: boolean;
}

export function PrizeShowcase({ currentPrize, onPayEntry, isLoggedIn }: PrizeShowcaseProps) {
  const entryBoxes = currentPrize.boxes.filter(box => box.type === 'entry');
  const hasAnyPaidEntry = currentPrize.userHasPaidEntry || entryBoxes.some(box => box.hasPaid);
  
  // Calculate total entry fee (Box 1 + Box 2)
  const totalEntryFee = entryBoxes.reduce((sum, box) => sum + (box.entryFee || 0), 0);

  return (
    <div className="relative group/main">
      {/* Outer gradient glow */}
      <div className="absolute -inset-[2px] bg-gradient-to-br from-[#9F7ACB]/30 via-[#B99FD9]/20 to-[#8456BC]/30 rounded-[26px] blur-xl opacity-60 group-hover/main:opacity-80 transition-opacity duration-700"></div>
      
      {/* Main glassmorphism container */}
      <div className="relative">
        {/* Layered glass background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/90 to-purple-100/60 rounded-[24px]"></div>
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/50 rounded-[24px]"></div>
        
        {/* Content container */}
        <div className="relative backdrop-blur-md bg-white/30 rounded-[24px] p-3 sm:p-5 md:p-7 border border-white/60 shadow-2xl">
          
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 items-center">
            {/* Left Content Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              
              {/* Header with Icon */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative group/icon">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8456BC] to-[#B99FD9] rounded-xl blur-lg opacity-50 group-hover/icon:opacity-70 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[#8456BC] to-[#B99FD9] p-1.5 sm:p-2 rounded-xl shadow-lg">
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#3A2257] via-[#53317B] to-[#6B3FA0] bg-clip-text text-transparent">
                  Current Prize
                </h2>
              </div>
              
              {/* Prize Title */}
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#9F7ACB]/20 via-[#B99FD9]/15 to-[#8456BC]/20 rounded-2xl blur-md"></div>
                <div className="relative backdrop-blur-sm bg-white/40 rounded-xl p-2 sm:p-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#53317B] via-[#6B3FA0] to-[#8456BC] bg-clip-text text-transparent leading-tight">
                    {currentPrize.prize}
                  </h3>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Prize Value */}
                <div className="group/stat relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8456BC]/10 to-[#9F7ACB]/10 rounded-xl blur group-hover/stat:blur-md transition-all"></div>
                  <div className="relative backdrop-blur-xl bg-white/70 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 border border-purple-200/40 shadow-sm inline-flex items-center space-x-1.5 sm:space-x-2">
                    <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6B3FA0]" />
                    <span className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-[#53317B] to-[#6B3FA0] bg-clip-text text-transparent">
                      ₹{currentPrize.prizeValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                
                {/* Participants */}
                <div className="group/stat relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9F7ACB]/10 to-[#B99FD9]/10 rounded-xl blur group-hover/stat:blur-md transition-all"></div>
                  <div className="relative backdrop-blur-xl bg-white/70 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 border border-purple-200/40 shadow-sm inline-flex items-center space-x-1.5 sm:space-x-2">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6B3FA0]" />
                    <span className="text-xs sm:text-sm text-[#53317B] font-semibold">
                      {currentPrize.totalParticipants} participants
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2.5 sm:space-y-3">
                {/* Entry Fee Payment Section */}
                {!hasAnyPaidEntry && isLoggedIn && (
                  <div className="relative group/entry">
                    {/* Animated glow effect */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8456BC]/30 via-[#9F7ACB]/30 to-[#B99FD9]/30 rounded-[18px] blur-md opacity-30 group-hover/entry:opacity-50 transition-opacity duration-500"></div>
                    
                    <div className="relative backdrop-blur-2xl bg-white/85 rounded-2xl p-2.5 sm:p-3 md:p-4 border border-purple-200/50 shadow-xl">
                      {/* Header */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <div className="bg-gradient-to-br from-[#8456BC] to-[#B99FD9] p-1 sm:p-1.5 rounded-xl shadow-md">
                          <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-[#3A2257] to-[#6B3FA0] bg-clip-text text-transparent">
                          Pay Entry Fee to Join
                        </span>
                      </div>
                      
                      {/* Entry Fee Breakdown */}
                      <div className="space-y-1.5 sm:space-y-2 mb-2.5 sm:mb-3">
                        {entryBoxes.map((box, _index) => (
                          <div 
                            key={box.id} 
                            className="group/box relative backdrop-blur-lg bg-gradient-to-r from-purple-50/70 to-white/70 rounded-xl p-2 sm:p-2.5 border border-purple-100/40 transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-semibold text-[#53317B]">Box {box.id}:</span>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8456BC]" />
                                <span className="text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-[#6B3FA0] to-[#8456BC] bg-clip-text text-transparent">
                                  {box.entryFee?.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Total */}
                        <div className="relative mt-2 sm:mt-3 group/total">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#8456BC]/15 to-[#B99FD9]/15 rounded-xl blur-sm"></div>
                          <div className="relative backdrop-blur-xl bg-gradient-to-r from-purple-100/85 to-purple-50/85 rounded-xl p-2 sm:p-2.5 md:p-3 border-2 border-[#9F7ACB]/40 shadow-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8456BC] animate-pulse" />
                                <span className="text-xs sm:text-sm md:text-base font-bold text-[#3A2257]">Total Entry Fee:</span>
                              </div>
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B3FA0]" />
                                <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-[#53317B] to-[#8456BC] bg-clip-text text-transparent">
                                  {totalEntryFee.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Single Pay Now Button */}
                      <Button
                        onClick={() => onPayEntry?.(0, totalEntryFee)}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-[#6B3FA0] via-[#8456BC] to-[#9F7ACB] text-white hover:from-[#8456BC] hover:via-[#9F7ACB] hover:to-[#B99FD9] shadow-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 rounded-xl font-bold transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] group/button"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                          <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Pay Now - ₹{totalEntryFee.toLocaleString('en-IN')}</span>
                        </span>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000"></div>
                      </Button>
                      
                      <p className="text-[10px] sm:text-xs text-[#6B3FA0] mt-1.5 sm:mt-2 text-center font-medium">
                        💡 Pay once to unlock all bidding rounds!
                      </p>
                    </div>
                  </div>
                )}

                {/* Entry Paid Success */}
                {hasAnyPaidEntry && (
                  <div className="relative group/success">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-400/30 to-green-500/30 rounded-[18px] blur-md opacity-40"></div>
                    <div className="relative backdrop-blur-2xl bg-gradient-to-br from-emerald-50/90 to-green-50/85 border-2 border-emerald-300/50 rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-xl">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-700">
                        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-1 sm:p-1.5 rounded-xl shadow-md">
                          <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base font-bold">✓ Entry Paid - Bidding Unlocked!</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 ml-6 sm:ml-8 font-medium">
                        Round boxes are now available. Good luck!
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Info Box */}
                <div className="relative group/info">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-purple-50/50 rounded-xl blur-sm"></div>
                  <div className="relative backdrop-blur-xl bg-purple-50/50 rounded-xl p-2 sm:p-2.5 md:p-3 border border-purple-100/40 shadow-sm">
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8456BC] mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs md:text-sm text-[#53317B] font-medium leading-relaxed">
                        Round boxes open every 15 minutes. Highest bidder in the final round wins this amazing prize!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Prize Image Section */}
            <div className="relative order-first md:order-last">
              <div className="relative group/image">
                {/* Outer animated glow */}
                <div className="absolute -inset-[2px] bg-gradient-to-br from-[#8456BC]/40 via-[#9F7ACB]/30 to-[#B99FD9]/40 rounded-[20px] blur-xl opacity-30 group-hover/image:opacity-50 transition-all duration-700 animate-pulse"></div>
                
                {/* Glass card container */}
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-2xl bg-white/75 border border-purple-200/50 p-3 sm:p-4 md:p-6 shadow-2xl">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-purple-200/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Image container */}
                  <div className="relative">
                    <img 
                      src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202310/macbook-pro-024011822-16x9_0.png?VersionId=CKXbmiOLkA_16ma0JbaKUxCWDp1WgA3t" 
                      alt="MacBook Pro M3 Max" 
                      className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-contain transform group-hover/image:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Live badge with pulse animation */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <div className="relative">
                      {/* Pulsing glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6B3FA0] to-[#8456BC] rounded-full blur-lg animate-pulse opacity-60"></div>
                      
                      {/* Badge */}
                      <div className="relative bg-gradient-to-r from-[#6B3FA0] to-[#8456BC] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold inline-flex items-center gap-1 sm:gap-1.5 shadow-xl">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE AUCTION
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom gradient fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-white/90 via-purple-50/30 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
