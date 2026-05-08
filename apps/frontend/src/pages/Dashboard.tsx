import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CreditCard as LucideCreditCard, 
  Layers as LucideLayers, 
  CalendarClock as LucideCalendarClock, 
  PiggyBank as LucidePiggyBank, 
  ArrowUpRight as LucideArrowUpRight, 
  Plus as LucidePlus, 
  BarChart as LucideBarChart, 
  Sparkles as LucideSparkles, 
  AlertCircle as LucideAlertCircle, 
  TrendingUp as LucideTrendingUp,
  MoreVertical as LucideMoreVertical,
  Loader2 as LucideLoader2
} from 'lucide-react';

const CreditCard = LucideCreditCard as any;
const Layers = LucideLayers as any;
const CalendarClock = LucideCalendarClock as any;
const PiggyBank = LucidePiggyBank as any;
const ArrowUpRight = LucideArrowUpRight as any;
const Plus = LucidePlus as any;
const BarChart = LucideBarChart as any;
const Sparkles = LucideSparkles as any;
const AlertCircle = LucideAlertCircle as any;
const TrendingUp = LucideTrendingUp as any;
const MoreVertical = LucideMoreVertical as any;
const Loader2 = LucideLoader2 as any;
import { 
  AreaChart as RechartsAreaChart, 
  Area as RechartsArea, 
  XAxis as RechartsXAxis, 
  YAxis as RechartsYAxis, 
  CartesianGrid as RechartsCartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer as RechartsResponsiveContainer 
} from 'recharts';

const AreaChart = RechartsAreaChart as any;
const Area = RechartsArea as any;
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const CartesianGrid = RechartsCartesianGrid as any;
const Tooltip = RechartsTooltip as any;
const ResponsiveContainer = RechartsResponsiveContainer as any;
import { getAnalyticsSummary, getUpcomingRenewals } from '../services/analytics';

// Dummy data for chart
const spendingData = [
  { month: 'Jan', amount: 180 },
  { month: 'Feb', amount: 210 },
  { month: 'Mar', amount: 195 },
  { month: 'Apr', amount: 260 },
  { month: 'May', amount: 248 },
  { month: 'Jun', amount: 275 },
];

// Dummy data for upcoming renewals
const dummyRenewals = [
  { id: '1', name: 'Netflix', date: 'Tomorrow', cost: '$15.99', icon: '🎬', status: 'Due Soon', color: 'bg-red-500/10 text-red-500' },
  { id: '2', name: 'Spotify', date: 'May 12', cost: '$9.99', icon: '🎵', status: 'Upcoming', color: 'bg-green-500/10 text-green-500' },
  { id: '3', name: 'Adobe Creative Cloud', date: 'May 15', cost: '$54.99', icon: '🎨', status: 'Upcoming', color: 'bg-blue-500/10 text-blue-500' },
  { id: '4', name: 'Notion', date: 'May 18', cost: '$10.00', icon: '📝', status: 'Upcoming', color: 'bg-gray-500/10 text-gray-400' },
];

// Dummy data for top subscriptions
const topSubscriptions = [
  { id: '1', name: 'Figma', cost: '$15.00', category: 'Design', status: 'Active', icon: '🎨' },
  { id: '2', name: 'Netflix', cost: '$15.99', category: 'Entertainment', status: 'Active', icon: '🎬' },
  { id: '3', name: 'AWS', cost: '$45.00', category: 'Cloud', status: 'Active', icon: '☁️' },
  { id: '4', name: 'Adobe CC', cost: '$54.99', category: 'Design', status: 'Active', icon: '🎨' },
];

export default function Dashboard() {
  const isAuth = !!localStorage.getItem('auth_token');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { data: summary, isLoading: sumLoading, isError: sumError } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: getAnalyticsSummary,
    retry: 1,
    enabled: isAuth,
  });

  const { data: renewals, isLoading: renLoading } = useQuery({
    queryKey: ['upcoming-renewals'],
    queryFn: getUpcomingRenewals,
    retry: 1,
    enabled: isAuth,
  });

  // Fallback values
  const monthlySpend = summary?.monthlySpend ? `$${summary.monthlySpend.toFixed(2)}` : '$248.90';
  const activeSubs = summary?.activeCount ?? 18;
  const upcomingPayments = '$72.40'; // Fallback or calculated if available
  const potentialSavings = '$39.99'; // Fallback

  const renewalsToDisplay = renewals && renewals.length > 0 
    ? renewals.map(r => ({
        id: r.id,
        name: r.name,
        date: new Date(r.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cost: `$${Number(r.amount).toFixed(2)}`,
        icon: r.icon || '📦',
        status: 'Upcoming',
        color: 'bg-indigo-500/10 text-indigo-500'
      }))
    : dummyRenewals;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Dashboard
            </h1>
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Live Overview
            </span>
          </div>
          <p className="text-gray-400 mt-2">Track, analyze, and optimize all your subscriptions in one place.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-gray-400" />
            View Analytics
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* Status Message */}
      {(sumError) && (
        <div className="text-xs text-yellow-500 bg-yellow-500/5 px-4 py-2 rounded-lg border border-yellow-500/10 mb-4">
          Failed to connect to backend. Showing local fallback data.
        </div>
      )}

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Monthly Spend */}
        <div className="glass-card flex flex-col justify-between cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <CreditCard className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-xs font-medium text-green-500 flex items-center bg-green-500/10 px-2 py-1 rounded-full">
              +8.2% <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Monthly Spend</p>
            {sumLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-500 mt-2" />
            ) : (
              <h3 className="text-3xl font-bold mt-1">{monthlySpend}</h3>
            )}
            <p className="text-xs text-gray-500 mt-1">from last month</p>
          </div>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div className="glass-card flex flex-col justify-between cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <Layers className="w-6 h-6 text-cyan-500" />
            </div>
            <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">
              3 renew this week
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Active Subscriptions</p>
            {sumLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-500 mt-2" />
            ) : (
              <h3 className="text-3xl font-bold mt-1">{activeSubs}</h3>
            )}
            <p className="text-xs text-gray-500 mt-1">Total active plans</p>
          </div>
        </div>

        {/* Card 3: Upcoming Payments */}
        <div className="glass-card flex flex-col justify-between cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <CalendarClock className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
              Next 7 days
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Upcoming Payments</p>
            <h3 className="text-3xl font-bold mt-1">{upcomingPayments}</h3>
            <p className="text-xs text-gray-500 mt-1">Due soon</p>
          </div>
        </div>

        {/* Card 4: Potential Savings */}
        <div className="glass-card flex flex-col justify-between cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <PiggyBank className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
              Cancel unused plans
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Potential Savings</p>
            <h3 className="text-3xl font-bold mt-1">{potentialSavings}</h3>
            <p className="text-xs text-gray-500 mt-1">Detected optimization</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Overview (Chart) */}
        <div className="lg:col-span-2 glass-card">
          <div>
            <h2 className="text-xl font-bold">Spending Overview</h2>
            <p className="text-sm text-gray-500 mt-1">Monthly recurring cost trend</p>
          </div>
          <div className="h-80 w-full min-w-0 mt-6">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={spendingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#4b5563" tick={{ fill: '#9ca3af' }} />
                  <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af' }} />
                  < CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#9ca3af' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="glass-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Upcoming Renewals</h2>
              <p className="text-sm text-gray-500 mt-1">Next 30 days</p>
            </div>
            <a href="/subscriptions" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View all</a>
          </div>
          <div className="space-y-4">
            {renLoading ? (
              <div className="flex items-center justify-center py-6 text-cyan-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading renewals...</span>
              </div>
            ) : (
              renewalsToDisplay.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-white transition-colors">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">{item.cost}</span>
                    <span className={`block text-xs px-2 py-0.5 rounded-full mt-1 font-medium text-center ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Subscriptions Section */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Top Subscriptions</h2>
            <p className="text-sm text-gray-500 mt-1">Your highest value plans</p>
          </div>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topSubscriptions.map((sub) => (
            <div key={sub.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                  {sub.icon}
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">
                <h4 className="font-bold group-hover:text-indigo-400 transition-colors">{sub.name}</h4>
                <p className="text-xs text-gray-500">{sub.category}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-baseline">
                <div>
                  <span className="text-lg font-bold text-white">{sub.cost}</span>
                  <span className="text-xs text-gray-500 ml-1">/mo</span>
                </div>
                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-medium">
                  {sub.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card flex items-start space-x-4 bg-gradient-to-br from-indigo-900/20 to-transparent border-indigo-500/10 cursor-pointer">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-500 mt-1">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-white">Spending Increase</h4>
            <p className="text-sm text-gray-400 mt-1">You spent 12% more than last month. Consider reviewing unused services.</p>
          </div>
        </div>

        <div className="glass-card flex items-start space-x-4 bg-gradient-to-br from-yellow-900/20 to-transparent border-yellow-500/10 cursor-pointer">
          <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500 mt-1">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-white">Renewals This Week</h4>
            <p className="text-sm text-gray-400 mt-1">3 subscriptions are renewing this week. Total expected: $78.97.</p>
          </div>
        </div>

        <div className="glass-card flex items-start space-x-4 bg-gradient-to-br from-green-900/20 to-transparent border-green-500/10 cursor-pointer">
          <div className="p-2 bg-green-500/20 rounded-lg text-green-500 mt-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-white">Savings Detected</h4>
            <p className="text-sm text-gray-400 mt-1">Potential saving detected from unused services. You could save up to $39.99.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
