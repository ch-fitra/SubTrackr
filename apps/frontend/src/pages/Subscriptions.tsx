import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search as LucideSearch, 
  Plus as LucidePlus, 
  MoreHorizontal as LucideMoreHorizontal, 
  CreditCard as LucideCreditCard, 
  ExternalLink as LucideExternalLink, 
  Download as LucideDownload,
  Inbox as LucideInbox,
  ArrowUpDown as LucideArrowUpDown,
  Layers as LucideLayers,
  CalendarClock as LucideCalendarClock,
  Loader2 as LucideLoader2
} from 'lucide-react';

const Search = LucideSearch as any;
const Plus = LucidePlus as any;
const MoreHorizontal = LucideMoreHorizontal as any;
const CreditCard = LucideCreditCard as any;
const ExternalLink = LucideExternalLink as any;
const Download = LucideDownload as any;
const Inbox = LucideInbox as any;
const ArrowUpDown = LucideArrowUpDown as any;
const Layers = LucideLayers as any;
const CalendarClock = LucideCalendarClock as any;
const Loader2 = LucideLoader2 as any;
import { getSubscriptions } from '../services/subscriptions';

// Dummy data as fallback
const dummySubscriptions = [
  { id: '1', name: 'Netflix', amount: 15.99, billingCycle: 'MONTHLY', nextBillingDate: '2026-05-09', status: 'ACTIVE', category: 'Entertainment', icon: '🎬' },
  { id: '2', name: 'Spotify', amount: 9.99, billingCycle: 'MONTHLY', nextBillingDate: '2026-05-12', status: 'ACTIVE', category: 'Entertainment', icon: '🎵' },
  { id: '3', name: 'Adobe Creative Cloud', amount: 54.99, billingCycle: 'MONTHLY', nextBillingDate: '2026-05-15', status: 'ACTIVE', category: 'Design', icon: '🎨' },
  { id: '4', name: 'Notion', amount: 10.00, billingCycle: 'MONTHLY', nextBillingDate: '2026-05-18', status: 'ACTIVE', category: 'Productivity', icon: '📝' },
  { id: '5', name: 'GitHub Pro', amount: 4.00, billingCycle: 'MONTHLY', nextBillingDate: '2026-05-20', status: 'ACTIVE', category: 'Developer', icon: '💻' },
  { id: '6', name: 'Google Drive', amount: 1.99, billingCycle: 'MONTHLY', nextBillingDate: '2026-05-22', status: 'ACTIVE', category: 'Cloud', icon: '☁️' },
];

const categories = ['All', 'Entertainment', 'Productivity', 'Design', 'Developer', 'Cloud'];

export default function Subscriptions() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const isAuth = !!localStorage.getItem('auth_token');

  const { data: backendData, isLoading, isError } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
    retry: 1, // Don't retry too many times if backend is down
    enabled: isAuth,
  });

  // Use backend data if available, otherwise fallback to dummy
  const subscriptionsToDisplay = backendData && backendData.length > 0 ? backendData : dummySubscriptions;

  const filteredSubs = subscriptionsToDisplay.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate summary from actual or dummy data
  const totalCost = subscriptionsToDisplay.reduce((acc, sub) => acc + Number(sub.amount), 0);
  const totalServices = subscriptionsToDisplay.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Subscriptions
          </h1>
          <p className="text-gray-400 mt-2">Manage every recurring payment from a single command center.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center">
            <Download className="w-5 h-5 mr-2 text-gray-400" />
            Import CSV
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* Summary Cards Kecil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card flex items-center space-x-4 cursor-pointer">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Layers className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Services</p>
            <h3 className="text-2xl font-bold">{totalServices}</h3>
          </div>
        </div>

        <div className="glass-card flex items-center space-x-4 cursor-pointer">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <CreditCard className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Cost</p>
            <h3 className="text-2xl font-bold">${totalCost.toFixed(2)}</h3>
          </div>
        </div>

        <div className="glass-card flex items-center space-x-4 cursor-pointer">
          <div className="p-3 bg-yellow-500/10 rounded-xl">
            <CalendarClock className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Due This Week</p>
            <h3 className="text-2xl font-bold">3</h3>
          </div>
        </div>
      </div>

      {/* Search dan Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all duration-300"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button className="btn-secondary flex items-center justify-center">
            <ArrowUpDown className="w-5 h-5 mr-2 text-gray-400" />
            Sort
          </button>
        </div>
      </div>

      {/* Status Message (Loading/Error) */}
      {isLoading && (
        <div className="flex items-center justify-center py-6 text-cyan-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading from backend...</span>
        </div>
      )}
      
      {isError && (
        <div className="text-xs text-yellow-500 bg-yellow-500/5 px-4 py-2 rounded-lg border border-yellow-500/10 mb-4">
          Failed to connect to backend. Showing local fallback data.
        </div>
      )}

      {/* Subscription Grid */}
      {filteredSubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubs.map((sub) => (
            <div key={sub.id} className="glass-card flex flex-col justify-between group cursor-pointer">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {sub.icon || '📦'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      sub.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {sub.status}
                    </span>
                    <button className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{sub.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-gray-400">{sub.category || 'Other'}</span>
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold text-white">${Number(sub.amount).toFixed(2)}</span>
                    <span className="text-sm text-gray-500 ml-1">/{sub.billingCycle === 'MONTHLY' ? 'mo' : 'yr'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Next renewal</p>
                  <p className="text-sm font-medium text-gray-300">
                    {new Date(sub.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-white/5 hover:bg-white/10 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
                    Details
                  </button>
                  <button className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-500 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 mb-6">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No subscriptions found</h3>
          <p className="text-gray-500 max-w-sm mb-6">
            We couldn't find any subscriptions matching your current search or filter criteria.
          </p>
          <button className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Subscription
          </button>
        </div>
      )}
    </div>
  );
}
