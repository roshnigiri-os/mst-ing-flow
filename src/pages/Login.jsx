import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff, Lock, Mail, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { users, loginWithCredentials } = useAuth();

  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrId || !password) {
      setErrorMsg('Please enter your Valid ID / Email and Password.');
      return;
    }

    const result = loginWithCredentials(emailOrId, password);
    if (!result.success) {
      setErrorMsg(result.error);
    }
  };

  const fillDemoAccount = (user) => {
    setEmailOrId(user.email);
    setPassword(user.password || 'password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 sm:p-6 relative z-10">
      <div className="w-full max-w-4xl glass-card rounded-3xl border border-slate-700/70 shadow-2xl p-6 sm:p-10 overflow-hidden relative">
        {/* Glow accents */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Enterprise Access Verification Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Sign in to <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">MST-ING Flow</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Please enter your valid user ID / email and password to access your portal.
          </p>
        </div>

        {/* Quick Demo Preset Selection Chips */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="block text-[11px] font-semibold text-slate-400 mb-2 text-center uppercase tracking-wider">
            Select Demo Account Credentials:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => fillDemoAccount(u)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all hover:scale-105"
              >
                <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full" />
                <span>{u.name}</span>
                <span className="text-[10px] text-indigo-300 font-mono">({u.role})</span>
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM ONLY (Registration removed per user request) */}
        <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">User ID / Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="Enter your user ID or email address"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide Password' : 'View Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Verify Credentials & Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
