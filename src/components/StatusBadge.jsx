import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Calendar, 
  CheckCheck, 
  PauseCircle, 
  AlertTriangle 
} from 'lucide-react';

export default function StatusBadge({ status }) {
  const getBadgeConfig = (statusKey) => {
    switch (statusKey) {
      case 'Done':
      case 'Completed':
      case 'Approved':
      case 'Onboarding Completed':
        return {
          label: 'Done',
          className: 'badge-completed bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          icon: CheckCircle2
        };
      case 'On Hold':
        return {
          label: 'On Hold',
          className: 'badge-on-hold bg-rose-500/20 text-rose-300 border border-rose-500/40',
          icon: PauseCircle
        };
      case 'Issue':
      case 'Timing Switch':
        return {
          label: 'Issue',
          className: 'badge-timing-switch bg-amber-500/20 text-amber-300 border border-amber-500/40',
          icon: AlertTriangle
        };
      case 'Pending':
      default:
        return {
          label: 'Pending',
          className: 'badge-pending bg-slate-800 text-slate-300 border border-slate-700',
          icon: Clock
        };
    }
  };

  const config = getBadgeConfig(status);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm ${config.className}`}>
      <IconComponent className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
