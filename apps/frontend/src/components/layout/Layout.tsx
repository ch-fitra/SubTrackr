import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard as LucideLayoutDashboard, 
  CreditCard as LucideCreditCard, 
  BarChart3 as LucideBarChart3, 
  Settings as LucideSettings, 
  LogOut as LucideLogOut, 
  WalletCards as LucideWalletCards 
} from 'lucide-react';

const LayoutDashboard = LucideLayoutDashboard as any;
const CreditCard = LucideCreditCard as any;
const BarChart3 = LucideBarChart3 as any;
const Settings = LucideSettings as any;
const LogOut = LucideLogOut as any;
const WalletCards = LucideWalletCards as any;

const LinkAny = Link as any;
const OutletAny = Outlet as any;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen text-gray-100 overflow-hidden relative">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[160px] w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Sidebar */}
      <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between z-10">
        <div>
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center glow-purple">
              <WalletCards className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                SubTrackr
              </h1>
              <p className="text-xs text-gray-500">Subscription Manager</p>
            </div>
          </div>
          
          <nav className="mt-6 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <LinkAny
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white glow-purple'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </LinkAny>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#070A12]/30 relative z-10">
        <div className="p-8">
          <OutletAny />
        </div>
      </div>
    </div>
  );
}
