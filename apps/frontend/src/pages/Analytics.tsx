import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { 
  TrendingUp as LucideTrendingUp, 
  TrendingDown as LucideTrendingDown, 
  AlertCircle as LucideAlertCircle, 
  Sparkles as LucideSparkles, 
  BrainCircuit as LucideBrainCircuit,
  Calendar as LucideCalendar,
  DollarSign as LucideDollarSign,
  BarChart2 as LucideBarChart2,
  Loader2 as LucideLoader2
} from 'lucide-react';

const TrendingUp = LucideTrendingUp as any;
const TrendingDown = LucideTrendingDown as any;
const AlertCircle = LucideAlertCircle as any;
const Sparkles = LucideSparkles as any;
const BrainCircuit = LucideBrainCircuit as any;
const Calendar = LucideCalendar as any;
const DollarSign = LucideDollarSign as any;
const BarChart2 = LucideBarChart2 as any;
const Loader2 = LucideLoader2 as any;
import { getAnalyticsSummary, getCategoryData, getTimelineData } from '../services/analytics';

// Dummy data as fallback
const dummySpendingData = [
  { month: 'Jan', amount: 180 },
  { month: 'Feb', amount: 210 },
  { month: 'Mar', amount: 195 },
  { month: 'Apr', amount: 260 },
  { month: 'May', amount: 248 },
  { month: 'Jun', amount: 275 },
];

const dummyCategoryData = [
  { name: 'Design', percentage: 31, color: 'from-purple-600 to-pink-500' },
  { name: 'Entertainment', percentage: 28, color: 'from-red-600 to-orange-500' },
  { name: 'Productivity', percentage: 22, color: 'from-green-600 to-teal-500' },
  { name: 'Developer', percentage: 12, color: 'from-blue-600 to-cyan-500' },
  { name: 'Cloud', percentage: 7, color: 'from-yellow-600 to-amber-500' },
];

const categoryColors = [
  'from-purple-600 to-pink-500',
  'from-red-600 to-orange-500',
  'from-green-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-yellow-600 to-amber-500',
];

export default function Analytics() {
  const isAuth = !!localStorage.getItem('auth_token');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { data: summary, isLoading: sumLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: getAnalyticsSummary,
    retry: 1,
    enabled: isAuth,
  });

  const { data: categoryData, isLoading: catLoading } = useQuery({
    queryKey: ['analytics-category'],
    queryFn: getCategoryData,
    retry: 1,
    enabled: isAuth,
  });

  const { data: timelineData, isLoading: timeLoading } = useQuery({
    queryKey: ['analytics-timeline'],
    queryFn: getTimelineData,
    retry: 1,
    enabled: isAuth,
  });

  // Fallback values
  const monthlySpend = summary?.monthlySpend ? `$${summary.monthlySpend.toFixed(2)}` : '$236.50';
  const annualProjection = summary?.yearlySpend ? `$${summary.yearlySpend.toFixed(2)}` : '$2,986.80';

  const chartData = timelineData && timelineData.length > 0 
    ? timelineData.map(d => ({ month: d.month, amount: Number(d.amount) }))
    : dummySpendingData;

  // Process category data for display
  const totalCategoryAmount = categoryData?.reduce((acc, cat) => acc + Number(cat.amount), 0) || 1;
  const categoriesToDisplay = categoryData && categoryData.length > 0
    ? categoryData.map((cat, index) => ({
        name: cat.category,
        percentage: Math.round((Number(cat.amount) / totalCategoryAmount) * 100),
        color: categoryColors[index % categoryColors.length]
      }))
    : dummyCategoryData;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Analytics
            </h1>
            <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Spending Intelligence
            </span>
          </div>
          <p className="text-gray-400 mt-2">Understand spending patterns, renewal behavior, and optimization opportunities.</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          <button className="px-4 py-2 text-sm rounded-lg font-medium bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg">
            6 Months
          </button>
          <button className="px-4 py-2 text-sm rounded-lg font-medium text-gray-400 hover:text-white transition-colors">
            12 Months
          </button>
          <button className="px-4 py-2 text-sm rounded-lg font-medium text-gray-400 hover:text-white transition-colors">
            This Year
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex flex-col justify-between cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Average Monthly Spend</p>
            {sumLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-500 mt-2" />
            ) : (
              <h3 className="text-3xl font-bold mt-1">{monthlySpend}</h3>
            )}
          </div>
        </div>

        <div className="glass-card flex flex-col justify-between cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <BarChart2 className="w-6 h-6 text-cyan-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Highest Category</p>
            <h3 className="text-2xl font-bold mt-1">Design Tools</h3>
          </div>
        </div>

        <div className="glass-card flex flex-col justify-between cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Annual Projection</p>
            {sumLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-500 mt-2" />
            ) : (
              <h3 className="text-3xl font-bold mt-1">{annualProjection}</h3>
            )}
          </div>
        </div>

        <div className="glass-card flex flex-col justify-between cursor-pointer">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Sparkles className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">Savings Opportunity</p>
            <h3 className="text-3xl font-bold mt-1 text-green-500">$420<span className="text-sm text-gray-500">/year</span></h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spending Trend */}
        <div className="lg:col-span-2 glass-card">
          <div>
            <h2 className="text-xl font-bold">Monthly Spending Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Detailed view of your recurring costs</p>
          </div>
          <div className="h-80 w-full min-w-0 mt-6">
            {timeLoading ? (
              <div className="flex items-center justify-center h-full text-cyan-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading timeline...</span>
              </div>
            ) : (
              isMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#4b5563" tick={{ fill: '#9ca3af' }} />
                    <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af' }} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      labelStyle={{ color: '#9ca3af' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card">
          <div>
            <h2 className="text-xl font-bold">Category Breakdown</h2>
            <p className="text-sm text-gray-500 mt-1">Distribution of expenses</p>
          </div>
          
          <div className="mt-6 space-y-5">
            {catLoading ? (
              <div className="flex items-center justify-center py-6 text-cyan-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading categories...</span>
              </div>
            ) : (
              categoriesToDisplay.map((item) => (
                <div key={item.name} className="group cursor-pointer">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{item.name}</span>
                    <span className="text-white font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500 group-hover:opacity-80`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Renewals + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Renewal Distribution */}
        <div className="glass-card">
          <h2 className="text-xl font-bold mb-6">Renewal Distribution</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">This Week</span>
              </div>
              <span className="text-xl font-bold text-white">3</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">Next 14 Days</span>
              </div>
              <span className="text-xl font-bold text-white">6</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">This Month</span>
              </div>
              <span className="text-xl font-bold text-white">12</span>
            </div>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center space-x-2 mb-6">
            <BrainCircuit className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold">AI-Ready Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white/5 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between cursor-pointer group">
              <div>
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">Design tools are your largest spending category.</p>
              </div>
              <span className="text-xs text-purple-400 mt-4 block font-medium">Action recommended</span>
            </div>

            <div className="p-5 bg-white/5 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between cursor-pointer group">
              <div>
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">You can save around $35/month by reviewing unused services.</p>
              </div>
              <span className="text-xs text-green-400 mt-4 block font-medium">Optimization found</span>
            </div>

            <div className="p-5 bg-white/5 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between cursor-pointer group">
              <div>
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">Renewal concentration is high in the middle of the month.</p>
              </div>
              <span className="text-xs text-yellow-400 mt-4 block font-medium">Cash flow alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
