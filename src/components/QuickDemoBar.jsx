import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, School, Zap } from 'lucide-react';

export default function QuickDemoBar() {
  const { users, currentUser, loginAsUser } = useAuth();

  // REQUIREMENT 1: Remove sign in portal / demo bar once user is signed in!
  if (currentUser) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/20 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg z-40 relative">
      <div className="flex items-center gap-2 font-medium text-indigo-300">
        <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>Quick Demo Account Switcher Portal:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {users.map(u => {
          let roleBadgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';

          if (u.role === 'Admin') {
            roleBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
          } else if (u.role === 'ING Member') {
            roleBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          }

          return (
            <button
              key={u.id}
              onClick={() => loginAsUser(u.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 transition-all hover:scale-105"
            >
              <img 
                src={u.avatar} 
                alt={u.name} 
                className="w-4 h-4 rounded-full object-cover border border-white/30"
              />
              <span className="truncate max-w-[120px]">{u.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${roleBadgeColor}`}>
                {u.role === 'MST Member' ? (u.mstRole || 'MST') : u.role}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
