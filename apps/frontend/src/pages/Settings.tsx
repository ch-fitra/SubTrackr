import { 
  Globe as LucideGlobe, 
  Trash2 as LucideTrash2, 
  CreditCard as LucideCreditCard, 
  Download as LucideDownload, 
  Moon as LucideMoon,
  LayoutDashboard as LucideLayoutDashboard,
  Clock as LucideClock
} from 'lucide-react';

const Globe = LucideGlobe as any;
const Trash2 = LucideTrash2 as any;
const CreditCard = LucideCreditCard as any;
const Download = LucideDownload as any;
const Moon = LucideMoon as any;
const LayoutDashboard = LucideLayoutDashboard as any;
const Clock = LucideClock as any;

const preferences = [
  { id: 1, label: 'Currency', description: 'Default currency for display', value: 'USD ($)', icon: Globe },
  { id: 2, label: 'Billing Reminder', description: 'When to notify before renewal', value: '3 days before', icon: Clock },
  { id: 3, label: 'Theme', description: 'Visual appearance of the app', value: 'Dark', icon: Moon },
  { id: 4, label: 'Default View', description: 'Home screen after login', value: 'Dashboard', icon: LayoutDashboard },
];

const notifications = [
  { id: 1, label: 'Renewal Reminders', description: 'Get notified before a subscription renews', active: true },
  { id: 2, label: 'Monthly Spending Report', description: 'Receive a summary of your monthly expenses', active: true },
  { id: 3, label: 'Savings Recommendations', description: 'Get alerts when we find potential savings', active: false },
  { id: 4, label: 'Payment Failure Alerts', description: 'Immediate notification on failed payments', active: true },
];

export default function Settings() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Customize your subscription workspace and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="glass-card flex flex-col items-center text-center cursor-pointer">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center text-3xl font-bold text-white glow-purple mb-4 group-hover:scale-105 transition-transform duration-300">
              AM
            </div>
            <h2 className="text-xl font-bold">Alex Morgan</h2>
            <p className="text-sm text-gray-500 mt-1">alex@subtrackr.app</p>
            
            <button className="mt-6 w-full btn-secondary">
              Edit Profile
            </button>
          </div>

          {/* Account Actions */}
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 text-left group">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium group-hover:text-white transition-colors">Export Data</span>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 text-left group">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium group-hover:text-white transition-colors">Manage Billing</span>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all duration-300 text-left group">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-500/70 group-hover:text-red-500 transition-colors" />
                  <span className="text-sm font-medium text-red-500/70 group-hover:text-red-500 transition-colors">Delete Account</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Notifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preferences Section */}
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-6">Workspace Preferences</h2>
            <div className="space-y-4">
              {preferences.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 gap-4 group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.label}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-between w-full md:w-auto">
                      {item.value}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notification Section */}
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {notifications.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <div>
                    <h4 className="font-medium text-white group-hover:text-indigo-400 transition-colors">{item.label}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                      item.active ? 'bg-gradient-to-r from-purple-600 to-cyan-500' : 'bg-gray-700'
                    }`}>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                        item.active ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
