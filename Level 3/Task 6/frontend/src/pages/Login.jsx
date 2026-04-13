import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://127.0.0.1:5004/api/auth/login', form);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#0d0d2b] via-[#10063a] to-[#050816] items-center justify-center">
        {/* Ambient glows */}
        <div className="glow-dot w-96 h-96 bg-violet-600/25 -top-20 -left-20" />
        <div className="glow-dot w-72 h-72 bg-indigo-600/20 bottom-10 right-10" />

        {/* Floating card preview */}
        <div className="relative z-10 max-w-sm text-center animate-float px-8">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m0 10l8-4m0 0V7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Nexus <span className="text-gradient">Inventory</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A beautiful, all-in-one platform to manage your business inventory with ease.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {['Secure Access', 'Data Protection', 'Team Controls', 'Cloud Sync', 'Fast UI'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">{tag}</span>
            ))}
          </div>
        </div>

        {/* Bottom ornament */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="glow-dot w-64 h-64 bg-violet-700/10 -top-10 right-0" />
        <div className="glow-dot w-48 h-48 bg-indigo-700/10 bottom-10 left-0" />

        <div className="w-full max-w-md relative z-10 animate-slide-up">
          {/* Header */}
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-semibold mb-2 tracking-widest uppercase">Welcome back</p>
            <h1 className="text-4xl font-extrabold text-white mb-2">Sign in to<br/>your account</h1>
            <p className="text-slate-500 text-sm">
              New here?{' '}
              <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Create a free account
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-fade-in">
              <FiAlertCircle className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-field pl-11" required />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" className="input-field pl-11 pr-11" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Sign In</span><FiArrowRight /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
