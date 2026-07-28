import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ScheduleDateModal({ request, onClose }) {
  const { submitOrientationDate } = useApp();
  const { currentUser } = useAuth();

  // FEATURE 2: Set minimum date dynamically to today's date onwards
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(request.preferredDate || todayStr);
  const [time, setTime] = useState(request.preferredTime || '10:00 AM - 12:00 PM');
  const [notes, setNotes] = useState('');

  if (!request) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitOrientationDate(request.id, date, time, notes, currentUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Schedule Orientation Session</h2>
              <p className="text-xs text-slate-400">Step 4: Reserve preferred date & time slot for MST Orientation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Request details */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Request ID:</span>
              <span className="font-mono font-bold text-indigo-300">{request.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Program:</span>
              <span className="font-semibold text-slate-200">{request.program}</span>
            </div>
          </div>

          {/* Date Picker (Restricted from today's date onwards) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Preferred Date (Available Today Onwards)
            </label>
            <input
              type="date"
              required
              min={todayStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <p className="text-[11px] text-indigo-300 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-indigo-400" /> Dates prior to today ({todayStr}) are disabled.
            </p>
          </div>

          {/* Time Slot input (Custom time range input) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Time Slot (Custom Range)</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 01:00 PM or 02:30 PM - 04:30 PM"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Specify any custom timing range (e.g. Morning 09:30 AM - 11:30 AM)</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduling Notes for MST Team</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Preferred lab venue or special tech equipment required..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-700/60 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" /> Save & Submit Date Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
