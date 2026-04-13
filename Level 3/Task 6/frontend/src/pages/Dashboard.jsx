import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiShield, FiBriefcase, FiKey, FiDatabase, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d2b] via-[#10063a] to-[#050816] relative overflow-hidden flex flex-col items-center">
      
      {/* ── Background Elements ── */}
      <div className="glow-dot w-[600px] h-[600px] bg-violet-600/10 -top-40 -left-40 animate-pulse-slow" />
      <div className="glow-dot w-[500px] h-[500px] bg-indigo-600/10 bottom-0 right-0 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-5xl px-6 py-12 relative z-10 flex-1 flex flex-col">
        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16 animate-slide-up">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30">
                <FiUser className="text-3xl text-white" />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-[#0d0d2b] flex items-center justify-center ${user?.role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'}`} title={user?.role}>
                 <FiShield className="text-white text-xs" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Dashboard</h1>
              <p className="text-slate-400">Welcome back, <span className="text-violet-300 font-medium">{user?.name}</span></p>
            </div>
          </div>
          
          <button onClick={logout} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 rounded-xl transition-all duration-200 font-semibold text-sm active:scale-95 shadow-lg backdrop-blur-md">
            <FiLogOut className="text-violet-400" /> Sign Out
          </button>
        </header>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
           {/* Card 1: Account Info */}
          <div className="glass-card p-6 flex flex-col group hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-colors">
              <FiKey className="text-2xl text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Account Details</h3>
            <div className="space-y-3 flex-1 mt-2">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 text-sm">Email</span>
                <span className="text-slate-300 text-sm font-medium">{user?.email}</span>
              </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 text-sm">Role</span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase ${user?.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Security Status */}
          <div className="glass-card p-6 flex flex-col group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
             <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
              <FiShield className="text-2xl text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">System Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">
              Your data is protected with state-of-the-art encryption and secure access protocols. We ensure your information stays private and safe.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Protection Active
            </div>
          </div>

           {/* Card 3: Nexus Gateway */}
          <div className="glass-card p-6 flex flex-col group hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-500/10 transition-all duration-300 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:bg-fuchsia-500/20 transition-colors">
              <FiDatabase className="text-2xl text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nexus Items</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">
              Your gateway to advanced inventory management. Scale your operations and manage stock across multiple locations effortlessly.
            </p>
            <button 
              onClick={() => navigate('/inventory')}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10 text-sm font-semibold"
            >
              <FiBriefcase className="text-fuchsia-400" /> Access Inventory
            </button>
          </div>

        </div>
          
        {/* ── Footer Quote ── */}
        <div className="mt-auto pt-16 pb-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
           <p className="text-slate-500 italic max-w-lg mx-auto text-sm leading-relaxed border-t border-white/5 pt-8">
            "A seamless experience built on a foundation of trust. We balance high-end design with industry-leading security to keep your business running smoothly."
          </p>
        </div>

      </div>
    </div>
  );
}
