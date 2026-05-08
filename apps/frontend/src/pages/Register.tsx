import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  WalletCards as LucideWalletCards, 
  Mail as LucideMail, 
  Lock as LucideLock, 
  User as LucideUser, 
  ArrowRight as LucideArrowRight, 
  Loader2 as LucideLoader2 
} from 'lucide-react';

const WalletCards = LucideWalletCards as any;
const Mail = LucideMail as any;
const Lock = LucideLock as any;
const User = LucideUser as any;
const ArrowRight = LucideArrowRight as any;
const Loader2 = LucideLoader2 as any;

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock register
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

      {/* Register Card */}
      <div className="glass-card w-full max-w-md p-8 relative z-10 m-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white glow-purple mb-4">
            <WalletCards className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-2">Get started with SubTrackr today.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-400 block mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-600 w-5 h-5" />
              <input
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all duration-300"
              />
            </div>
          </div>

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
            <label className="text-sm font-medium text-gray-400 block mb-2">Password</label>
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
                Create Account <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
