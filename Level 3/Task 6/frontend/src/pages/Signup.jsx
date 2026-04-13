import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiArrowRight, FiAlertCircle, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

const ROLES = [
  { value: 'user',  label: 'User',  desc: 'Browse & manage your own items' },
  { value: 'admin', label: 'Admin', desc: 'Full access to all items & users' },
];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const pwdStrength = () => {
    const p = form.password;
    if (p.length === 0) return { width: '0%', color: '', label: '' };
    if (p.length < 6)  return { width: '33%', color: 'bg-red-500',   label: 'Weak' };
    if (p.length < 10) return { width: '66%', color: 'bg-amber-500', label: 'Good' };
    return              { width: '100%', color: 'bg-emerald-500', label: 'Strong' };
  };

  const strength = pwdStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('http://127.0.0.1:5004/api/auth/register', form);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#0d0d2b] via-[#10063a] to-[#050816] items-center justify-center">
        <div className="glow-dot w-96 h-96 bg-violet-600/25 -top-20 -left-20" />
        <div className="glow-dot w-72 h-72 bg-indigo-600/20 bottom-10 right-10" />

        <div className="relative z-10 max-w-sm px-8 animate-float">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 text-center leading-tight">
            Join <span className="text-gradient">Nexus</span> Today
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed text-center mb-8">
            Set up your account in seconds. Choose your role and start managing inventory immediately.
          </p>
          <div className="space-y-3">
            {['Secure personal protection', 'Seamless login experience', 'Control access for your team', 'Reliable data storage'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center shrink-0">
                  <FiCheck className="text-violet-400 text-xs" />
                </div>
                <span className="text-slate-400 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative">
        <div className="glow-dot w-64 h-64 bg-violet-700/10 -top-10 right-0" />
        <div className="glow-dot w-48 h-48 bg-indigo-700/10 bottom-10 left-0" />

        <div className="w-full max-w-md relative z-10 animate-slide-up py-8">
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-semibold mb-2 tracking-widest uppercase">Get started free</p>
            <h1 className="text-4xl font-extrabold text-white mb-2">Create your<br/>account</h1>
            <p className="text-slate-500 text-sm">
              Already a member?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-fade-in">
              <FiAlertCircle className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="John Doe" className="input-field pl-11" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-field pl-11" required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input-field pl-11 pr-11" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-slate-500">Strength: <span className="text-slate-300 font-medium">{strength.label}</span></p>
                </div>
              )}
            </div>

            {/* Role Picker */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-3">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(role => (
                  <button type="button" key={role.value}
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${form.role === role.value
                      ? 'border-violet-500/70 bg-violet-500/10 text-white'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{role.label}</span>
                      {form.role === role.value && <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center"><FiCheck className="text-white text-xs" /></div>}
                    </div>
                    <p className="text-xs opacity-70">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Create Account</span><FiArrowRight /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
