import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { X, UserCheck, CheckCircle2, Calendar, MessageSquare, CheckCheck, RefreshCw } from 'lucide-react';

export default function AssignMSTModal({ request, onClose }) {
  const { reviewAndAssignOrientation } = useApp();
  const { users, currentUser } = useAuth();

  const mstUsers = users.filter(u => u.role === 'MST Member');

  // Options: Orientation Completed, Orientation Scheduled, Orientation Switch
  const [status, setStatus] = useState(
    request.status === 'Orientation Completed' ? 'Orientation Completed' :
    request.status === 'Orientation Switch' ? 'Orientation Switch' : 'Orientation Scheduled'
  );
  const [selectedMstIds, setSelectedMstIds] = useState(request.assignedMstMembers || [currentUser.id]);
  const [comment, setComment] = useState(request.rescheduleComment || '');

  if (!request) return null;

  const toggleMstMember = (id) => {
    if (selectedMstIds.includes(id)) {
      setSelectedMstIds(selectedMstIds.filter(item => item !== id));
    } else {
      setSelectedMstIds([...selectedMstIds, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    reviewAndAssignOrientation(request.id, status, selectedMstIds, comment, currentUser);

    if (status === 'Orientation Completed') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Review & Assign MST Handlers</h2>
              <p className="text-xs text-slate-400">Orientation Action & Team Assignment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Request summary */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">College:</span>
              <span className="font-semibold text-slate-200">{request.collegeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Program:</span>
              <span className="text-slate-200">{request.program}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800">
              <span className="text-slate-400">Requested Date & Time:</span>
              <span className="font-semibold text-indigo-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {request.preferredDate || 'Not specified'} ({request.preferredTime || 'N/A'})
              </span>
            </div>
          </div>

          {/* Orientation Action Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Orientation Action</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Orientation Scheduled">1. Orientation Scheduled</option>
              <option value="Orientation Completed">2. Orientation Completed</option>
              <option value="Orientation Switch">3. Orientation Switch</option>
            </select>
          </div>

          {status === 'Orientation Switch' && (
            <div className="animate-fade-in">
              <label className="block text-xs font-semibold text-orange-300 mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Orientation Reschedule Note / Reason
              </label>
              <textarea
                rows="2"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Specify reason for timing switch..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-orange-500/40 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
              ></textarea>
            </div>
          )}

          {/* Assign MST Team Members */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Assign MST Team Members</label>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {mstUsers.map(mst => {
                const isSelected = selectedMstIds.includes(mst.id);
                return (
                  <div
                    key={mst.id}
                    onClick={() => toggleMstMember(mst.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/60 text-slate-100 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={mst.avatar} alt={mst.name} className="w-7 h-7 rounded-full object-cover border border-white/20" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{mst.name}</div>
                        <div className="text-[10px] text-slate-400">{mst.mstRole} ({mst.department})</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-indigo-600"
                    />
                  </div>
                );
              })}
            </div>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit & Approve Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
