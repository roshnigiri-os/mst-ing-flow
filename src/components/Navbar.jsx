import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';
import MyProfileModal from './MyProfileModal';
import { Layers, LogOut, Shield, School, Users, UserCog } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <nav className="glass-card sticky top-0 z-30 border-b border-slate-700/40 px-3 sm:px-8 py-3 flex items-center justify-between shadow-xl">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                MST-ING Flow
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                v2.5
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block">Onboarding & Orientation Workflow Platform</p>
          </div>
        </div>

        {/* User Session & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <NotificationCenter />

          {/* Active User Card & My Profile Button */}
          {currentUser && (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-700/60">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/80 transition-all text-left group"
                title="Click to view & edit My Profile settings"
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-indigo-500/50 shadow-sm group-hover:border-indigo-400"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                </div>

                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-slate-200 truncate max-w-[120px] group-hover:text-indigo-300 transition-colors">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    {currentUser.role === 'Admin' && <Shield className="w-3 h-3 text-purple-400" />}
                    {currentUser.role === 'MST Member' && <Users className="w-3 h-3 text-indigo-400" />}
                    {currentUser.role === 'ING Member' && <School className="w-3 h-3 text-emerald-400" />}
                    <span>{currentUser.role === 'MST Member' ? (currentUser.mstRole || 'MST Member') : currentUser.role}</span>
                  </div>
                </div>
              </button>

              {/* My Profile Button - EXPLICITLY VISIBLE ON ALL SCREENS */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 border border-indigo-500/50 text-indigo-200 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
                title="Open My Profile Settings"
              >
                <UserCog className="w-4 h-4 text-indigo-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={logout}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all text-xs font-semibold flex items-center gap-1 shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Render My Profile Modal outside nav stacking context */}
      {showProfileModal && (
        <MyProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
}
