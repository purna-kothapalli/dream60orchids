import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Header } from './components/Header';
import { AuctionGrid } from './components/AuctionGrid';
import { UserDashboard } from './components/UserDashboard';
import { AuctionSchedule } from './components/AuctionSchedule';
import { PrizeShowcase } from './components/PrizeShowcase';
import { Footer } from './components/Footer';
import { TermsAndConditions } from './components/TermsAndConditions';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Support } from './components/Support';
import { Contact } from './components/Contact';
import { Rules } from './components/Rules';
import { Participation } from './components/Participation';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { PaymentSuccess } from './components/PaymentSuccess';
import { Leaderboard } from './components/Leaderboard';
import { AccountSettings } from './components/AccountSettings';
import { AuctionHistory } from './components/AuctionHistory';
import { AuctionDetailsPage } from './components/AuctionDetailsPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { toast } from 'sonner';

const getCurrentAuctionSlot = () => {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 9 || hour >= 19) {
    return null;
  }

  return hour;
};

const getCurrentRoundByTime = () => {
  const now = new Date();
  const minutes = now.getMinutes();

  if (minutes < 15) return 1;
  if (minutes < 30) return 2;
  if (minutes < 45) return 3;
  return 4;
};



const getRoundBoxTimes = (auctionHour: number, roundNumber: number) => {
  const today = new Date();
  const startMinutes = (roundNumber - 1) * 15;
  const endMinutes = roundNumber * 15;

  const opensAt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), auctionHour, startMinutes, 0);
  const closesAt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), auctionHour, endMinutes, 0);

  return { opensAt, closesAt };
};

const generateDemoLeaderboard = (roundNumber: number) => {
    const usernames = [
        "BidKing2024", "AuctionPro", "WinnerX", "Player123", "GameMaster99",
        "LuckyBidder", "ProBidder", "ChampionBid", "BidWarrior", "ElitePlayer",
        "MegaBidder", "TopGun", "AcePlayer", "StarBidder", "VictorySeeker",
        "BidNinja", "AuctionHero", "PrizeFighter", "BidMaster", "WinStreak"
    ];

    const base = 200 + roundNumber * 10;
    const topBidAmount = Math.floor(Math.random() * 300) + base; 
    const secondBidAmount = topBidAmount - Math.floor(Math.random() * 50) - 20;
    const thirdBidAmount = secondBidAmount - Math.floor(Math.random() * 40) - 10;

    const leaderboard: {
        username: string;
        bid: number;
        timestamp: Date;
    }[] = [];

    const usedUsernames = new Set<string>();

    const getUniqueUsername = () => {
        let username;
        let attempts = 0;
        do {
            const baseName = usernames[Math.floor(Math.random() * usernames.length)];
            username = attempts > 0 ? `${baseName}${attempts}` : baseName;
            attempts++;
        } while (usedUsernames.has(username));
        usedUsernames.add(username);
        return username;
    };

    const firstPlaceCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < firstPlaceCount; i++) {
        leaderboard.push({
            username: getUniqueUsername(),
            bid: topBidAmount,
            timestamp: new Date(Date.now() - Math.random() * 900000)
        });
    }

    const secondPlaceCount = 40;
    for (let i = 0; i < secondPlaceCount; i++) {
        leaderboard.push({
            username: getUniqueUsername(),
            bid: secondBidAmount,
            timestamp: new Date(Date.now() - Math.random() * 900000)
        });
    }

    const thirdPlaceCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < thirdPlaceCount; i++) {
        leaderboard.push({
            username: getUniqueUsername(),
            bid: thirdBidAmount,
            timestamp: new Date(Date.now() - Math.random() * 900000)
        });
    }

    leaderboard.sort((a, b) => {
        if (b.bid !== a.bid) return b.bid - a.bid;
        return a.timestamp.getTime() - b.timestamp.getTime();
    });

    return leaderboard.map((entry) => ({
        ...entry,
        round: roundNumber, 
    }));
};
type EntryBox = {
    id: number;
    type: 'entry';
    isOpen: boolean;
    entryFee: number;
    currentBid: number;
    bidder: string | null;
    hasPaid: boolean;
};

type RoundBox = {
    id: number;
    type: 'round';
    roundNumber: number;
    isOpen: boolean;
    minBid: number;
    currentBid: number;
    bidder: string | null;
    opensAt: Date;
    closesAt: Date;
    leaderboard: {
        round: number;
        username: string;
        bid: number;
        timestamp: Date;
    }[];
    status: string;
};

type Box = EntryBox | RoundBox;

type Auction = {
    id: string;
    title: string;
    prize: string;
    prizeValue: number;
    startTime: Date;
    endTime: Date;
    currentRound: number;
    totalParticipants: number;
    userHasPaidEntry: boolean;
    auctionHour: number;
    userBidsPerRound: Record<number, number>;
    boxes: Box[];
};
export default function App() {
  // Initialize currentPage based on URL path
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    
    if (path === '/admin' || path === '/admin/') {
      const adminUserId = localStorage.getItem('admin_user_id');
      return adminUserId ? 'admin-dashboard' : 'admin-login';
    }
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    if (path === '/forgot-password') return 'forgot';
    if (path === '/rules') return 'rules';
    if (path === '/participation') return 'participation';
    if (path === '/terms') return 'terms';
    if (path === '/privacy') return 'privacy';
    if (path === '/support') return 'support';
    if (path === '/contact') return 'contact';
    if (path === '/profile') return 'profile';
    if (path === '/history') return 'history';
    
    // Default to game page
    return 'game';
  });

  const [currentUser, setCurrentUser] = useState<{
  id: string;
  username: string;
  mobile?: string;
  email?: string;
  isDeleted: boolean;
  totalAuctions: number;
  totalWins: number;
  totalAmountSpent: number;
  totalAmountWon: number;
  userType: string;
  userCode: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    bidAlerts: boolean;
    winNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
} | null>(null);

  const [adminUser, setAdminUser] = useState<{
    user_id: string;
    username: string;
    email: string;
    userType: string;
    userCode: string;
  } | null>(null);

const fetchAndSetUser = async (userId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/auth/me?user_id=${userId}`
    );

    if (!response.ok) {
      console.error("Failed to fetch user data");
      return null;
    }

    const apiUser = await response.json();
    const user = apiUser.user;

    // Set global state
    setCurrentUser({
      id: user.user_id,
      username: user.username ?? "",
      mobile: user.mobile ?? "",
      email: user.email ?? "",
      isDeleted: user.isDeleted ?? false,
      totalAuctions: user.totalAuctions ?? 0,
      totalWins: user.totalWins ?? 0,
      totalAmountSpent: user.totalAmountSpent ?? 0,
      totalAmountWon: user.totalAmountWon ?? 0,
      userType: user.userType ?? "USER",
      userCode: user.userCode ?? "",
      preferences: {
        emailNotifications: user.preferences?.emailNotifications ?? false,
        smsNotifications: user.preferences?.smsNotifications ?? false,
        bidAlerts: user.preferences?.bidAlerts ?? false,
        winNotifications: user.preferences?.winNotifications ?? false
      },
      createdAt: user.createdAt ?? "",
      updatedAt: user.updatedAt ?? ""
    });

    return user;

  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};



  const [showEntrySuccess, setShowEntrySuccess] = useState<{
    entryFee: number;
    boxNumber: number;
  } | null>(null);

  const [showBidSuccess, setShowBidSuccess] = useState<{
    amount: number;
    boxNumber: number;
  } | null>(null);

  const [selectedLeaderboard, setSelectedLeaderboard] = useState<{
    roundNumber: number;
    leaderboard: Array<{
      username: string;
      bid: number;
      timestamp: Date;
    }>;
    opensAt?: Date;
    closesAt?: Date;
  } | null>(null);

  const [selectedAuctionDetails, setSelectedAuctionDetails] = useState<any | null>(null);

  // Generate random entry fees between ₹1000-₹3500
  const generateRandomEntryFee = () => Math.floor(Math.random() * 2501) + 1000;

    const [currentAuction, setCurrentAuction] = useState<Auction>(() => {
        const entryFee1 = generateRandomEntryFee();
    const entryFee2 = generateRandomEntryFee();
    const auctionHour = getCurrentAuctionSlot();
    const today = new Date();
    const now = new Date();

    // If no active auction (before 9 AM or after 7 PM), create a demo one
    const activeHour = auctionHour || 11;
    const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), activeHour, 0, 0);
    const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), activeHour + 1, 0, 0);

    // Initialize round boxes - all locked until entry fee is paid
    const roundBoxes = [1, 2, 3, 4].map(roundNum => {
      const times = getRoundBoxTimes(activeHour, roundNum);
      const isPast = now >= times.closesAt;

      // Rounds remain locked (not open) until entry fee is paid
      // Only past rounds show as 'completed' with demo data
      const status = isPast ? 'completed' : 'upcoming';

      return {
        id: roundNum + 2,
        type: 'round' as const,
        roundNumber: roundNum,
        isOpen: false, // Never open initially - only after entry payment
        minBid: 10,
        currentBid: 0,
        bidder: null,
        opensAt: times.opensAt,
        closesAt: times.closesAt,
        leaderboard: status === 'completed' ? generateDemoLeaderboard(roundNum) : [],
        status
      };
    });

    return {
      id: `auction-${activeHour}`,
      title: 'Premium Gaming Laptop',
      prize: 'MacBook Pro M3 Max',
      prizeValue: 3299,
      startTime: startTime,
      endTime: endTime,
      currentRound: getCurrentRoundByTime(),
      totalParticipants: 47,
      userHasPaidEntry: false,
      auctionHour: activeHour,
      userBidsPerRound: {}, // Track which rounds the user has bid on
      boxes: [
        {
          id: 1,
          type: 'entry',
          isOpen: true,
          entryFee: entryFee1,
          currentBid: 0,
          bidder: null,
          hasPaid: false
        },
        {
          id: 2,
          type: 'entry',
          isOpen: true,
          entryFee: entryFee2,
          currentBid: 0,
          bidder: null,
          hasPaid: false
        },
        ...roundBoxes
      ]
    };
  });


  // Check for existing session on app initialization
  useEffect(() => {
  const checkExistingSession = async () => {
    try {
      // Check for admin session first
      const adminUserId = localStorage.getItem("admin_user_id");
      if (adminUserId && (currentPage === 'admin-login' || currentPage === 'admin-dashboard')) {
        const adminEmail = localStorage.getItem("admin_email");
        setAdminUser({
          user_id: adminUserId,
          username: 'admin_dream60',
          email: adminEmail || 'dream60@gmail.com',
          userType: 'ADMIN',
          userCode: '#ADMIN',
        });
        if (currentPage === 'admin-login') {
          setCurrentPage("admin-dashboard");
        }
        return;
      }

      // Check for regular user session
      const userId = localStorage.getItem("user_id");

      if (!userId) return; // No session

      // Load user using the same method used in login/signup
      const user = await fetchAndSetUser(userId);

      if (!user) {
        console.error("Failed to restore session user.");
        return;
      }

      // Session restored successfully - but don't override the current page
      // User navigated to a specific URL, respect it

    } catch (error) {
      console.error("Session restore error:", error);
      localStorage.removeItem("user_id"); // Clear bad data
    }
  };

  checkExistingSession();
}, []);

useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!currentUser?.id) return;

  // Function to fetch user data again when page changes
  const restoreUser = async () => {
    await fetchAndSetUser(currentUser.id);  // Fetch user data from API
  };

  restoreUser();
  }, [currentPage]);
  // Timer to automatically open boxes based on time schedule
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = getCurrentAuctionSlot();
      const currentRound = getCurrentRoundByTime();

      setCurrentAuction(prev => {
        // Check if we need to switch to a new auction hour
        if (currentHour && currentHour !== prev.auctionHour) {
          // New auction hour started, reset everything
          const entryFee1 = generateRandomEntryFee();
          const entryFee2 = generateRandomEntryFee();
          const today = new Date();
          const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), currentHour, 0, 0);
          const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), currentHour + 1, 0, 0);

          return {
            ...prev,
            id: `auction-${currentHour}`,
            startTime,
            endTime,
            currentRound,
            auctionHour: currentHour,
            userHasPaidEntry: false,
            userBidsPerRound: {},
            boxes: [
              { id: 1, type: 'entry', isOpen: true, entryFee: entryFee1, currentBid: 0, bidder: null, hasPaid: false },
              { id: 2, type: 'entry', isOpen: true, entryFee: entryFee2, currentBid: 0, bidder: null, hasPaid: false },
              { id: 3, type: 'round', roundNumber: 1, isOpen: false, minBid: 10, currentBid: 0, bidder: null, opensAt: getRoundBoxTimes(currentHour, 1).opensAt, closesAt: getRoundBoxTimes(currentHour, 1).closesAt, leaderboard: [], status: 'upcoming' },
              { id: 4, type: 'round', roundNumber: 2, isOpen: false, minBid: 10, currentBid: 0, bidder: null, opensAt: getRoundBoxTimes(currentHour, 2).opensAt, closesAt: getRoundBoxTimes(currentHour, 2).closesAt, leaderboard: [], status: 'upcoming' },
              { id: 5, type: 'round', roundNumber: 3, isOpen: false, minBid: 10, currentBid: 0, bidder: null, opensAt: getRoundBoxTimes(currentHour, 3).opensAt, closesAt: getRoundBoxTimes(currentHour, 3).closesAt, leaderboard: [], status: 'upcoming' },
              { id: 6, type: 'round', roundNumber: 4, isOpen: false, minBid: 10, currentBid: 0, bidder: null, opensAt: getRoundBoxTimes(currentHour, 4).opensAt, closesAt: getRoundBoxTimes(currentHour, 4).closesAt, leaderboard: [], status: 'upcoming' }
            ]
          };
        }

        // Only update round boxes if user has paid entry fee
        if (!prev.userHasPaidEntry) {
          return { ...prev, currentRound };
        }

        // Update round boxes based on time and set status
        const updatedBoxes = prev.boxes.map(box => {
          if (box.type === 'round') {
            const isNowOpen = box.opensAt && box.closesAt && now >= box.opensAt && now < box.closesAt;
            const isPast = box.closesAt && now >= box.closesAt;
            // After entry is paid, future rounds show as 'locked' instead of 'upcoming'
            const status = isPast ? 'completed' : (isNowOpen ? 'active' : 'locked');

            // If round just completed and has no leaderboard, generate demo data
            if (status === 'completed' && box.status !== 'completed' && (!box.leaderboard || box.leaderboard.length === 0)) {
              return {
                ...box,
                isOpen: isNowOpen,
                status,
                leaderboard: generateDemoLeaderboard(box.roundNumber!),
                currentBid: 0,
                bidder: null
              };
            }

            return { ...box, isOpen: isNowOpen, status };
          }
          return box;
        });

        // Check if any boxes were updated
          const hasChanges = updatedBoxes.some((box, index) => {
              const prevBox = prev.boxes[index];
              if (box.isOpen !== prevBox.isOpen) return true;
              return box.type === 'round' && prevBox.type === 'round' && box.status !== prevBox.status;

          });

          return hasChanges || prev.currentRound !== currentRound
          ? { ...prev, boxes: updatedBoxes, currentRound }
          : prev;
      });
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBackToGame = () => {
    setCurrentPage('game');
    setSelectedLeaderboard(null);
    setSelectedAuctionDetails(null);
  };

  const handleShowLeaderboard = (roundNumber: number, leaderboard: any[], opensAt?: Date, closesAt?: Date) => {
    setSelectedLeaderboard({ roundNumber, leaderboard, opensAt, closesAt });
    setCurrentPage('leaderboard');
  };

  const handleLogin = async () => {
  try {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      console.error("No user_id found in localStorage");
      return;
    }

    // Use the reusable method
    const user = await fetchAndSetUser(userId);

    if (!user) {
      console.error("Failed to load user info.");
      return;
    }

    // Navigate on success
    setCurrentPage("game");

  } catch (error) {
    console.error("Error while login:", error);
  }
};


  const handleSignup = async (user: any) => {
  try {
    // 1. Save user_id
    const userId = user.user_id;
    if (!userId) {
      console.error("Signup returned no user_id");
      return;
    }

    localStorage.setItem("user_id", userId);

    // 2. Reuse the same user-loading method as login
    const fullUser = await fetchAndSetUser(userId);

    if (!fullUser) {
      console.error("Failed to load user info after signup.");
      return;
    }

    // 3. Navigate to game screen
    setCurrentPage("game");

  } catch (error) {
    console.error("Error while signup:", error);
  }
};



  const handleLogout = () => {
  try {
    localStorage.removeItem("user_id");
  } catch (error) {
    console.error("Error clearing user session:", error);
  }

  setCurrentUser(null);

  setCurrentPage("login");
};


  const handleShowLogin = () => {
    setCurrentPage('login');
  };

  const handleSwitchToSignup = () => {
    setCurrentPage('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  const handleEntrySuccess = () => {
    if (!showEntrySuccess || !currentUser) return;

    // Show toast notification
    toast.success('Entry Fee Paid!', {
      description: `Successfully paid ₹${showEntrySuccess.entryFee}. You're now in the auction!`,
    });

    // Process the combined entry fee payment for BOTH boxes
    setCurrentAuction(prev => {
      const now = new Date();

      const updatedBoxes = prev.boxes.map(b => {
        if (b.type === 'entry') {
          // Mark BOTH entry boxes as paid
          return { ...b, currentBid: b.entryFee || 0, bidder: currentUser.username, hasPaid: true };
        }
        if (b.type === 'round') {
          // Open boxes based on current time
          const isNowOpen = b.opensAt && b.closesAt && now >= b.opensAt && now < b.closesAt;
          return { ...b, isOpen: isNowOpen };
        }
        return b;
      });

      return {
        ...prev,
        boxes: updatedBoxes,
        userHasPaidEntry: true
      };
    });

    // Close the success modal
    setShowEntrySuccess(null);
  };

  const handleAdminLogin = (admin: any) => {
    setAdminUser(admin);
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_user_id');
    localStorage.removeItem('admin_email');
    setAdminUser(null);
    setCurrentPage('game');
    window.history.pushState({}, '', '/');
  };

  // Admin routes
  if (currentPage === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => {
      setCurrentPage('game');
      window.history.pushState({}, '', '/');
    }} />;
  }

  if (currentPage === 'admin-dashboard' && adminUser) {
    return <AdminDashboard adminUser={adminUser} onLogout={handleAdminLogout} />;
  }

  // Render different pages based on currentPage state
  if (currentPage === 'leaderboard' && selectedLeaderboard) {
    return (
      <Leaderboard
        roundNumber={selectedLeaderboard.roundNumber}
        leaderboard={selectedLeaderboard.leaderboard}
        opensAt={selectedLeaderboard.opensAt}
        closesAt={selectedLeaderboard.closesAt}
        onBack={handleBackToGame}
      />
    );
  }

  if (currentPage === 'profile' && currentUser) {
  return (
    <AccountSettings
      user={currentUser}
      onBack={handleBackToGame}
      onNavigate={handleNavigate}
      onDeleteAccount={() => {
        try {
          localStorage.removeItem("user_id");
        } catch (error) {
          console.error("Error clearing session:", error);
        }

        setCurrentUser(null);
        setCurrentPage("login"); 
      }}
      onLogout={() => {
        try {
          localStorage.removeItem("user_id");
        } catch (error) {
          console.error("Error clearing session:", error);
        }

        setCurrentUser(null);
        setCurrentPage(''); 
        
      }}
    />
  );
}


  if (currentPage === 'history' && currentUser) {
    // Show auction details page if an auction is selected
    if (selectedAuctionDetails) {
      return (
        <AuctionDetailsPage
          auction={selectedAuctionDetails}
          onBack={() => setSelectedAuctionDetails(null)}
        />
      );
    }

    // Show auction history list
    return (
      <AuctionHistory
        user={currentUser}
        onBack={handleBackToGame}
        onViewDetails={(auction) => setSelectedAuctionDetails(auction)}
      />
    );
  }

  if (currentPage === 'login') {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={handleSwitchToSignup}
        onBack={handleBackToGame}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignupForm
        onSignup={handleSignup}
        onSwitchToLogin={handleSwitchToLogin}
        onBack={handleBackToGame}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === 'rules') {
    return <Rules onBack={handleBackToGame} />;
  }
    if (currentPage === 'forgot') {
        return <ForgotPasswordPage onBack={handleSwitchToLogin} />;
    }
  if (currentPage === 'participation') {
    return <Participation onBack={handleBackToGame} />;
  }

  if (currentPage === 'terms') {
    return <TermsAndConditions onBack={handleBackToGame} />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicy onBack={handleBackToGame} />;
  }

  if (currentPage === 'support') {
    return <Support onBack={handleBackToGame} />;
  }

  if (currentPage === 'contact') {
    return <Contact onBack={handleBackToGame} />;
  }

  // Default game page
  return (
    <div className="min-h-screen bg-background">
      <Header
        user={currentUser}
        onNavigate={handleNavigate}
        onLogin={handleShowLogin}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 px-2 sm:px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold 
  bg-gradient-to-r from-[#53317B] via-[#6B3FA0] to-[#8456BC] 
  bg-clip-text text-transparent">
  DREAM60
</h1>

          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4
  bg-gradient-to-r from-[#53317B] via-[#6B3FA0] to-[#8456BC]
  bg-clip-text text-transparent">
  The ultimate 60-minute auction game. Enter, bid, and win amazing prizes in our hourly auctions!
</p>

          {!currentUser && (
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 px-4">
              <button
                onClick={handleShowLogin}
                className="bg-gradient-to-r from-[#53317B] via-[#6B3FA0] to-[#8456BC] text-white font-semibold px-6 sm:px-8 py-3 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg w-full sm:w-auto"
              >
                Join Now & Start Playing
              </button>
              <button
                onClick={handleSwitchToSignup}
                className="border border-purple-600 text-purple-700 font-semibold px-6 sm:px-8 py-3 rounded-xl hover:bg-gradient-to-r from-[#53317B] via-[#6B3FA0] to-[#8456BC] hover:text-white transition-all w-full sm:w-auto"
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Current Auction Time Slot Banner */}
        {getCurrentAuctionSlot() && (
          <div className="bg-gradient-to-r from-[#53317B] via-[#6B3FA0] to-[#8456BC] text-white rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
                <div>
                  <div className="text-sm sm:text-base opacity-90">Current Auction</div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {currentAuction.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {currentAuction.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-xs sm:text-sm opacity-90">Active Round</div>
                <div className="text-lg sm:text-xl font-bold">Round {currentAuction.currentRound}</div>
              </div>
            </div>
          </div>
        )}

        {/* Prize Showcase */}
        <PrizeShowcase
          currentPrize={currentAuction}
          isLoggedIn={!!currentUser}
          onPayEntry={(_boxId, totalEntryFee) => {
            if (!currentUser) return;
            // Show payment success modal with combined total
            setShowEntrySuccess({
              entryFee: totalEntryFee,
              boxNumber: 0 // 0 indicates combined payment for both boxes
            });
          }}
        />

        {currentUser ? (
          <>
            {/* User Dashboard */}
            <UserDashboard user={currentUser} auction={currentAuction} />

            {/* Auction Grid */}
            <AuctionGrid
              auction={currentAuction}
              user={currentUser}
              onShowLeaderboard={handleShowLeaderboard}
              onBid={(boxId, amount) => {
                try {
                  const box = currentAuction.boxes.find(b => b.id === boxId);
                  if (!box || box.type !== 'round') return;

                  const roundNumber = box.roundNumber;

                  // Check if user already bid in this round
                  if (currentAuction.userBidsPerRound[roundNumber!]) {
                    alert('You have already placed a bid in this round. You cannot change your bid once placed.');
                    return;
                  }

                  // Check if bid is higher than previous round's bid
                  if (roundNumber! > 1) {
                    const previousRoundBid = currentAuction.userBidsPerRound[roundNumber! - 1];
                    if (previousRoundBid && amount <= previousRoundBid) {
                      alert(`Your bid must be higher than your previous round's bid of ₹${previousRoundBid}`);
                      return;
                    }
                  }

                  // Show success modal and update
                  setShowBidSuccess({
                    amount: amount,
                    boxNumber: box.id
                  });

                  setCurrentAuction(prev => {
                    const updatedBoxes = prev.boxes.map(b => {
                      if (b.id === boxId) {
                        // Update the current box with the new bid
                        const updatedLeaderboard = [...(b.leaderboard || [])];

                        // Add or update user's bid in leaderboard
                        const existingBidIndex = updatedLeaderboard.findIndex(entry => entry.username === currentUser.username);
                        if (existingBidIndex >= 0) {
                          updatedLeaderboard[existingBidIndex] = {
                            username: currentUser.username,
                            bid: amount,
                            timestamp: new Date()
                          };
                        } else {
                          updatedLeaderboard.push({
                            username: currentUser.username,
                            bid: amount,
                            timestamp: new Date()
                          });
                        }

                        // Sort leaderboard by bid (highest first)
                        updatedLeaderboard.sort((a, b) => b.bid - a.bid);

                        return {
                          ...b,
                          currentBid: amount,
                          bidder: currentUser.username,
                          leaderboard: updatedLeaderboard
                        };
                      } else if (b.type === 'round' && b.roundNumber! > roundNumber!) {
                        // Update minimum bid for subsequent round boxes to be higher than current bid
                        return { ...b, minBid: Math.max(b.minBid, amount + 1) };
                      }
                      return b;
                    });

                    // Track that user has bid in this round
                      type UserBidsPerRound = {
                          [round: number]: number;
                      };

                      const updatedUserBids: UserBidsPerRound = { ...prev.userBidsPerRound };
                      updatedUserBids[roundNumber!] = amount;


                      return {
                      ...prev,
                      boxes: updatedBoxes,
                      userBidsPerRound: updatedUserBids
                    };
                  });
                } catch (error) {
                  console.error('Bid processing error:', error);
                }
              }}
            />
            <AuctionSchedule />
          </>
        ) : (
          <>
          <AuctionSchedule />
          {/* Guest View - Show login prompt instead of auction  */}
          <div className="text-center py-8 sm:py-12 md:py-16 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 mb-4">Ready to Start Winning?</h2>
              <p className="text-lg sm:text-xl text-purple-600 mb-8 px-2">
                Create your free account and start bidding on amazing prizes with direct payment!
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-700 mb-4">Why Join Dream60?</h3>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-700">Pay</div>
                    <div className="text-sm sm:text-base text-purple-600">Per Bid</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-700">6x</div>
                    <div className="text-sm sm:text-base text-purple-600">Daily Auctions</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-700">₹3,50,000+</div>
                    <div className="text-sm sm:text-base text-purple-600">Prize Values</div>
                  </div>
                </div>
              </div>
            </div>
          </div></>
        )}

        {/* Auction Schedule */}
        
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Payment Success Modals */}
      {showEntrySuccess && (
        <PaymentSuccess
          amount={showEntrySuccess.entryFee}
          type="entry"
          boxNumber={showEntrySuccess.boxNumber}
          onBackToHome={() => {
            handleEntrySuccess();
            setCurrentPage('game');
          }}
          onClose={() => setShowEntrySuccess(null)}
        />
      )}

      {showBidSuccess && (
        <PaymentSuccess
          amount={showBidSuccess.amount}
          type="bid"
          boxNumber={showBidSuccess.boxNumber}
          onBackToHome={() => {
            setShowBidSuccess(null);
            setCurrentPage('game');
          }}
          onClose={() => setShowBidSuccess(null)}
        />
      )}
    </div>
  );
}