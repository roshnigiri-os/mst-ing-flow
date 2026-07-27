import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'indigo', subtext }) {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    violet: 'from-violet-500/20 to-fuchsia-500/10 text-violet-400 border-violet-500/30',
    rose: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
    cyan: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30'
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-5 rounded-2xl glass-card border bg-gradient-to-br ${style} transition-all hover:scale-[1.02] shadow-md flex items-center justify-between`}>
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">{value}</div>
        {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900/60 border border-slate-700/50 shadow-inner`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
}
