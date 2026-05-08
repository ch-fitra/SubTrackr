import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  WalletCards as LucideWalletCards, 
  Mail as LucideMail, 
  Lock as LucideLock, 
  ArrowRight as LucideArrowRight, 
  Loader2 as LucideLoader2 
} from 'lucide-react';

const WalletCards = LucideWalletCards as any;
const Mail = LucideMail as any;
const Lock = LucideLock as any;
const ArrowRight = LucideArrowRight as any;
const Loader2 = LucideLoader2 as any;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login
    setTimeout(() => {
      localStorage.setItem('auth_token', 'demo-token');
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#070A12]">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}></div>

      {/* Login Card */}
      <div className="glass-card w-full max-w-md p-8 relative z-10 m-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white glow-purple mb-4">
            <WalletCards className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage your subscriptions.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-400 block mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-600 w-5 h-5" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-400">Password</label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-600 w-5 h-5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center py-3"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <>
                Sign In <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-400 hover:text-indigo-300 transition font-medium">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
