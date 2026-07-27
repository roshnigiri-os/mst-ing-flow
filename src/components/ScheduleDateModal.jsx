import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ScheduleDateModal({ request, onClose }) {
  const { submitOrientationDate } = useApp();
  const { currentUser } = useAuth();

  const [date, setDate] = useState('2026-08-10');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('01:30 PM');
  const [customRange, setCustomRange] = useState('10:00 AM - 01:30 PM');
  const [notes, setNotes] = useState('');

  if (!request) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTimeSlot = customRange || `${startTime} - ${endTime}`;
    submitOrientationDate(request.id, date, finalTimeSlot, notes, currentUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Schedule Orientation Session</h2>
              <p className="text-xs text-slate-400">Step 4: Select preferred date & custom time range</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reschedule Comment Alert if Issue was reported */}
        {request.rescheduleComment && (
          <div className="my-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">MST Issue / Note:</span>
              <p className="mt-0.5 text-amber-200">{request.rescheduleComment}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Orientation Date</label>
            <input
              type="date"
              required
              min="2026-07-28"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* REQUIREMENT 3: Custom Time Range Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Preferred Custom Time Range
            </label>
            <input
              type="text"
              required
              value={customRange}
              onChange={(e) => setCustomRange(e.target.value)}
              placeholder="e.g. 10:00 AM - 01:30 PM or 02:00 PM - 05:00 PM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">Specify any custom start and end time range for your orientation session.</p>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Logistics / Notes</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Auditorium room configuration or Zoom access link..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            ></textarea>
          </div>

          {/* Actions */}
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
              <CheckCircle2 className="w-4 h-4" /> Submit & Approve Orientation Date
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
