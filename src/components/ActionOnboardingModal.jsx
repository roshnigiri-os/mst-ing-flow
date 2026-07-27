import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ActionOnboardingModal({ request, onClose }) {
  const { reviewAndAssignOrientation } = useApp();
  const { currentUser } = useAuth();

  const [status, setStatus] = useState('Done');
  const [comment, setComment] = useState('');

  if (!request) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    reviewAndAssignOrientation(request.id, status, request.assignedMstMembers || [currentUser.id], comment, currentUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Approve Onboarding Status</h2>
              <p className="text-xs text-slate-400">Step 3: Action onboarding status for request sheet</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Request ID:</span>
              <span className="font-mono font-bold text-indigo-300">{request.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">College Name:</span>
              <span className="font-semibold text-slate-200">{request.collegeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Program:</span>
              <span className="text-slate-200">{request.program}</span>
            </div>
          </div>

          {/* REQUIREMENT 2: Dropdown options: Done, On Hold, Issue */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Onboarding Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Done">Done (Completed / Approved)</option>
              <option value="On Hold">On Hold</option>
              <option value="Issue">Issue (Requires resubmission / conflict)</option>
            </select>
          </div>

          {(status === 'Issue' || status === 'On Hold') && (
            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">Reason / Note</label>
              <textarea
                rows="2"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Detail reason for hold or issue..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-amber-500/40 text-slate-200 text-xs focus:outline-none resize-none"
              ></textarea>
            </div>
          )}

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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit & Approve Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
