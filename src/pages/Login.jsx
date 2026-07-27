import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Shield, Users, School, ArrowRight, Zap, Eye, EyeOff, Lock, Mail, CheckCircle2, UserPlus } from 'lucide-react';

export default function Login() {
  const { users, loginWithCredentials, addUser } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState('ING Member');
  const [regCollege, setRegCollege] = useState('');
  const [regMstRole, setRegMstRole] = useState('MST Specialist');

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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Please fill in all required fields including password.');
      return;
    }

    const newUser = addUser({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      collegeName: regRole === 'ING Member' ? regCollege || 'Partner Institution' : null,
      mstRole: regRole === 'MST Member' ? regMstRole : null,
      department: regRole === 'Admin' ? 'Management' : 'Operations'
    });

    // Auto login
    loginWithCredentials(newUser.email, regPassword);
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
            Please enter your valid user ID / email and password to access your role dashboard.
          </p>
        </div>

        {/* Quick Demo Preset Selection Chips */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="block text-[11px] font-semibold text-slate-400 mb-2 text-center uppercase tracking-wider">
            Quick Select Demo Account Credentials:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => fillDemoAccount(u)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all"
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

        {/* FORM CONTAINER: LOGIN VS REGISTER */}
        {!isRegistering ? (
          /* LOGIN FORM */
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
                {/* REQUIREMENT 7: Show / Hide password toggle */}
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

            <div className="pt-4 text-center border-t border-slate-700/50 text-xs text-slate-400">
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-indigo-400 hover:text-indigo-300 font-bold underline"
              >
                Register New User Account
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="max-w-md mx-auto space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-100 text-center mb-2 flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" /> Create New User Account
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Dr. Maya Lin"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address / ID</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="maya.lin@institution.edu"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Password field with View option */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create account password"
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                {/* REQUIREMENT 7: Show / Hide password toggle during registration */}
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  title={showRegPassword ? 'Hide Password' : 'View Password'}
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="ING Member">ING Member (College / Institution)</option>
                <option value="MST Member">MST Member (Operations / Support)</option>
                <option value="Admin">System Administrator</option>
              </select>
            </div>

            {regRole === 'ING Member' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College / Institution Name</label>
                <input
                  type="text"
                  required
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  placeholder="e.g. Horizon State College"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            )}

            {regRole === 'MST Member' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">MST Designation</label>
                <input
                  type="text"
                  value={regMstRole}
                  onChange={(e) => setRegMstRole(e.target.value)}
                  placeholder="e.g. MST Lead / Specialist"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Create Account & Sign In
            </button>

            <div className="pt-3 text-center border-t border-slate-700/50 text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-indigo-400 hover:text-indigo-300 font-bold underline"
              >
                Return to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
