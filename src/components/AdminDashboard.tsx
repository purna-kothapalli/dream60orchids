import { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Trophy,
  DollarSign,
  LogOut,
  Plus,
  Activity,
  UserCheck,
  UserX,
  Shield,
  RefreshCw,
  Search,
  Calendar,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  user_id: string;
  username: string;
  email: string;
  userType: string;
  userCode: string;
}

interface Statistics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    deletedUsers: number;
    adminUsers: number;
  };
  activity: {
    totalAuctions: number;
    totalWins: number;
    totalAmountSpent: number;
    totalAmountWon: number;
  };
  recentUsers: Array<{
    user_id: string;
    username: string;
    email: string;
    mobile: string;
    userCode: string;
    joinedAt: string;
    totalAuctions: number;
    totalWins: number;
  }>;
  topSpenders: Array<{
    user_id: string;
    username: string;
    email: string;
    userCode: string;
    totalAmountSpent: number;
    totalAuctions: number;
  }>;
  topWinners: Array<{
    user_id: string;
    username: string;
    email: string;
    userCode: string;
    totalWins: number;
    totalAmountWon: number;
  }>;
}

interface MasterAuction {
  master_id: string;
  totalAuctionsPerDay: number;
  isActive: boolean;
  createdAt: string;
  dailyAuctionConfig: Array<{
    auctionNumber: number;
    auctionName: string;
    TimeSlot: string;
    prizeValue: number;
    Status: string;
  }>;
}

interface AdminDashboardProps {
  adminUser: AdminUser;
  onLogout: () => void;
}

export const AdminDashboard = ({ adminUser, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'auctions'>('overview');
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [masterAuctions, setMasterAuctions] = useState<MasterAuction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateAuction, setShowCreateAuction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/statistics?user_id=${adminUser.user_id}`
      );
      const data = await response.json();

      if (data.success) {
        setStatistics(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Failed to fetch statistics');
    }
  };

  const fetchMasterAuctions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/master-auctions?user_id=${adminUser.user_id}`
      );
      const data = await response.json();

      if (data.success) {
        setMasterAuctions(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch master auctions');
      }
    } catch (error) {
      console.error('Error fetching master auctions:', error);
      toast.error('Failed to fetch master auctions');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchStatistics(), fetchMasterAuctions()]);
      setIsLoading(false);
    };
    loadData();
  }, [adminUser.user_id]);

  const handleRefresh = async () => {
    setIsLoading(true);
    if (activeTab === 'overview' || activeTab === 'users') {
      await fetchStatistics();
    }
    if (activeTab === 'auctions') {
      await fetchMasterAuctions();
    }
    setIsLoading(false);
    toast.success('Data refreshed');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user_id');
    localStorage.removeItem('admin_email');
    toast.success('Logged out successfully');
    onLogout();
  };

  if (isLoading && !statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-purple-700 font-semibold">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-purple-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-purple-700" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-purple-600">Dream60 Platform Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {adminUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-purple-900">{adminUser.username}</p>
                  <p className="text-xs text-purple-600">{adminUser.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b border-purple-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'text-purple-700 border-b-2 border-purple-700'
                  : 'text-purple-500 hover:text-purple-700'
              }`}
            >
              <Activity className="w-5 h-5 inline-block mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'users'
                  ? 'text-purple-700 border-b-2 border-purple-700'
                  : 'text-purple-500 hover:text-purple-700'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('auctions')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'auctions'
                  ? 'text-purple-700 border-b-2 border-purple-700'
                  : 'text-purple-500 hover:text-purple-700'
              }`}
            >
              <Trophy className="w-5 h-5 inline-block mr-2" />
              Master Auctions
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && statistics && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-700" />
                  </div>
                  <span className="text-2xl font-bold text-purple-900">
                    {statistics.overview.totalUsers}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-purple-600">Total Users</h3>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-700" />
                  </div>
                  <span className="text-2xl font-bold text-green-900">
                    {statistics.overview.activeUsers}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-green-600">Active Users</h3>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-700" />
                  </div>
                  <span className="text-2xl font-bold text-blue-900">
                    {statistics.activity.totalAuctions}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-blue-600">Total Auctions</h3>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-amber-700" />
                  </div>
                  <span className="text-2xl font-bold text-amber-900">
                    {statistics.activity.totalWins}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-amber-600">Total Wins</h3>
              </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-purple-600">Total Amount Spent</h3>
                    <p className="text-3xl font-bold text-purple-900">
                      ₹{statistics.activity.totalAmountSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-green-600">Total Amount Won</h3>
                    <p className="text-3xl font-bold text-green-900">
                      ₹{statistics.activity.totalAmountWon.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <h2 className="text-xl font-bold text-purple-900 mb-4">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-200">
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">User Code</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Username</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Mobile</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Joined</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Auctions</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.recentUsers.map((user) => (
                      <tr key={user.user_id} className="border-b border-purple-100 hover:bg-purple-50">
                        <td className="py-3 px-4 font-mono text-sm">{user.userCode}</td>
                        <td className="py-3 px-4">{user.username}</td>
                        <td className="py-3 px-4 text-sm">{user.email}</td>
                        <td className="py-3 px-4">{user.mobile}</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{user.totalAuctions}</td>
                        <td className="py-3 px-4">{user.totalWins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                <h2 className="text-xl font-bold text-purple-900 mb-4">Top Spenders</h2>
                <div className="space-y-3">
                  {statistics.topSpenders.slice(0, 5).map((user, index) => (
                    <div
                      key={user.user_id}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-purple-900">{user.username}</p>
                          <p className="text-sm text-purple-600">{user.userCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-900">
                          ₹{user.totalAmountSpent.toLocaleString()}
                        </p>
                        <p className="text-sm text-purple-600">{user.totalAuctions} auctions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                <h2 className="text-xl font-bold text-green-900 mb-4">Top Winners</h2>
                <div className="space-y-3">
                  {statistics.topWinners.slice(0, 5).map((user, index) => (
                    <div
                      key={user.user_id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">{user.username}</p>
                          <p className="text-sm text-green-600">{user.userCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-900">{user.totalWins} wins</p>
                        <p className="text-sm text-green-600">
                          ₹{user.totalAmountWon.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && statistics && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users by username, email, mobile, or user code..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* All Users Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <h2 className="text-xl font-bold text-purple-900 mb-4">All Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-200">
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">User Code</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Username</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Auctions</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Wins</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Spent</th>
                      <th className="text-left py-3 px-4 text-purple-700 font-semibold">Won</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...statistics.recentUsers, ...statistics.topSpenders, ...statistics.topWinners]
                      .filter((user, index, self) => 
                        self.findIndex(u => u.user_id === user.user_id) === index
                      )
                      .filter(user => 
                        !searchTerm || 
                        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.userCode.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <tr key={user.user_id} className="border-b border-purple-100 hover:bg-purple-50">
                          <td className="py-3 px-4 font-mono text-sm">{user.userCode}</td>
                          <td className="py-3 px-4">{user.username}</td>
                          <td className="py-3 px-4 text-sm">{user.email}</td>
                          <td className="py-3 px-4">{user.totalAuctions || 0}</td>
                          <td className="py-3 px-4">{user.totalWins || 0}</td>
                          <td className="py-3 px-4">₹{(user.totalAmountSpent || 0).toLocaleString()}</td>
                          <td className="py-3 px-4">₹{(user.totalAmountWon || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auctions' && (
          <div className="space-y-6">
            {/* Create Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowCreateAuction(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Master Auction
              </button>
            </div>

            {/* Master Auctions List */}
            <div className="grid grid-cols-1 gap-6">
              {masterAuctions.map((auction) => (
                <div
                  key={auction.master_id}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-900">
                        Master Auction {auction.master_id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-purple-600">
                        Created: {new Date(auction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold ${
                        auction.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {auction.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-purple-600">Daily Auctions</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {auction.totalAuctionsPerDay}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-600">Configured</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {auction.dailyAuctionConfig?.length || 0}
                      </p>
                    </div>
                  </div>

                  {auction.dailyAuctionConfig && auction.dailyAuctionConfig.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-purple-900 mb-2">Auction Slots:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {auction.dailyAuctionConfig.slice(0, 6).map((config) => (
                          <div
                            key={config.auctionNumber}
                            className="bg-purple-50 rounded-lg p-3 border border-purple-200"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-purple-600" />
                              <span className="font-semibold text-purple-900">
                                {config.TimeSlot}
                              </span>
                            </div>
                            <p className="text-sm text-purple-700">{config.auctionName}</p>
                            <p className="text-xs text-purple-600">₹{config.prizeValue}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {masterAuctions.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 border-2 border-purple-200 text-center">
                  <Trophy className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-purple-900 mb-2">
                    No Master Auctions Yet
                  </h3>
                  <p className="text-purple-600 mb-4">
                    Create your first master auction to get started
                  </p>
                  <button
                    onClick={() => setShowCreateAuction(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                  >
                    Create Master Auction
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Master Auction Modal */}
      {showCreateAuction && (
        <CreateMasterAuctionModal
          adminUserId={adminUser.user_id}
          onClose={() => setShowCreateAuction(false)}
          onSuccess={() => {
            setShowCreateAuction(false);
            fetchMasterAuctions();
          }}
        />
      )}
    </div>
  );
};

// Create Master Auction Modal Component
interface CreateMasterAuctionModalProps {
  adminUserId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateMasterAuctionModal = ({
  adminUserId,
  onClose,
  onSuccess,
}: CreateMasterAuctionModalProps) => {
  const [formData, setFormData] = useState({
    totalAuctionsPerDay: 10,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate sample daily auction config
      const dailyAuctionConfig = [];
      for (let i = 1; i <= formData.totalAuctionsPerDay; i++) {
        const hour = 8 + i;
        dailyAuctionConfig.push({
          auctionNumber: i,
          TimeSlot: `${hour.toString().padStart(2, '0')}:00`,
          auctionName: `Hourly Auction ${i}`,
          prizeValue: 50000 + i * 5000,
          Status: 'UPCOMING',
          EntryFee: 'RANDOM',
          minEntryFee: 1000,
          maxEntryFee: 3500,
          maxDiscount: 10,
          roundCount: 4,
        });
      }

      const response = await fetch(
        `http://localhost:5000/admin/master-auctions?user_id=${adminUserId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            dailyAuctionConfig,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Failed to create master auction');
        setIsSubmitting(false);
        return;
      }

      toast.success('Master auction created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating master auction:', error);
      toast.error('Failed to create master auction');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Create Master Auction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              Total Auctions Per Day
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={formData.totalAuctionsPerDay}
              onChange={(e) =>
                setFormData({ ...formData, totalAuctionsPerDay: parseInt(e.target.value) })
              }
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-purple-700">
              Set as Active
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
