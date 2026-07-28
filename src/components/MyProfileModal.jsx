import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, School, Users, CheckCircle2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function MyProfileModal({ onClose }) {
  const { currentUser, updateUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState(currentUser?.password || 'password123');
  const [showPassword, setShowPassword] = useState(false);
  const [collegeName, setCollegeName] = useState(currentUser?.collegeName || '');
  const [successMsg, setSuccessMsg] = useState('');

  if (!currentUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');

    updateUser(currentUser.id, {
      name,
      email,
      password,
      collegeName: currentUser.role === 'ING Member' ? collegeName : currentUser.collegeName
    });

    setSuccessMsg('Profile credentials updated successfully!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    /* ULTRA-HIGH Z-INDEX z-[99999] so My Profile pops up directly at the VERY FRONT of the screen above all navbars and cards */
    <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md glass-card rounded-3xl border border-indigo-500/50 shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[90vh] flex flex-col my-auto relative z-[100000]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-indigo-500 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 leading-tight">My Profile Settings</h2>
              <p className="text-[11px] sm:text-xs text-indigo-300">Update User ID, Username, and Password</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 transition-colors"
            title="Close Profile Window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fade-in shrink-0">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name / Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">User ID / Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                title={showPassword ? 'Hide Password' : 'View Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {currentUser.role === 'ING Member' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">School / College Institution</label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
                />
              </div>
            </div>
          )}

          {/* User Role Info Badge */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
            <span className="text-slate-400 font-medium">Assigned Role:</span>
            <span className="font-bold text-indigo-300 flex items-center gap-1">
              {currentUser.role === 'Admin' && <Shield className="w-3.5 h-3.5 text-purple-400" />}
              {currentUser.role === 'MST Member' && <Users className="w-3.5 h-3.5 text-indigo-400" />}
              {currentUser.role === 'ING Member' && <School className="w-3.5 h-3.5 text-emerald-400" />}
              {currentUser.role}
            </span>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-700/60 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
