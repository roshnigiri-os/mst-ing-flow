import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCheck, Trash2, X, Info, CheckCircle2, AlertTriangle, AlertCircle, FileText, ArrowRight } from 'lucide-react';

export default function NotificationCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications, setActiveNotificationRequest } = useApp();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  if (!currentUser) return null;

  // Filter notifications relevant to current user
  const userNotifications = notifications.filter(n => {
    if (currentUser.role === 'Admin') return true; // Admin sees all
    if (n.targetUserId === currentUser.id) return true;
    if (n.targetRole === currentUser.role) return true;
    if (n.targetRole === 'All') return true;
    return false;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const displayedNotifs = userNotifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-400 shrink-0" />;
    }
  };

  // REQUIREMENT 3: Redirect each notification click directly to its specific action process!
  const handleNotifClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.requestId) {
      setActiveNotificationRequest(notif.requestId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/60 text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown / Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-card border border-slate-700/70 shadow-2xl p-4 z-50 animate-pop-in text-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-sm">Notifications</h3>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                {userNotifications.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => markAllNotificationsRead(currentUser)}
                className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 my-3 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({userNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'unread'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {displayedNotifs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No notifications to display
              </div>
            ) : (
              displayedNotifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotifClick(n)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 group ${
                    n.read
                      ? 'bg-slate-900/40 border-slate-800/50 opacity-75'
                      : 'bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-400/60 shadow-sm'
                  }`}
                >
                  {getNotifIcon(n.type)}
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">{n.title}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-300 leading-relaxed">{n.message}</p>
                    {n.requestId && (
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/50 text-[10px] text-indigo-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {n.requestId}
                        </span>
                        <span className="flex items-center gap-1 text-indigo-300 group-hover:translate-x-1 transition-transform">
                          Take Action <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {userNotifications.length > 0 && (
            <div className="pt-3 mt-3 border-t border-slate-700/50 flex justify-end">
              <button
                onClick={clearAllNotifications}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
