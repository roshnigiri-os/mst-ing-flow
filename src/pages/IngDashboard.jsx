import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import UploadSheetModal from '../components/UploadSheetModal';
import ScheduleDateModal from '../components/ScheduleDateModal';
import { 
  School, 
  Plus, 
  Calendar, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Download
} from 'lucide-react';

export default function IngDashboard() {
  const { currentUser } = useAuth();
  const { requests, users, activeNotificationRequest, setActiveNotificationRequest } = useApp();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [schedulingRequest, setSchedulingRequest] = useState(null);

  // Handle notification redirection (Requirement #3)
  useEffect(() => {
    if (activeNotificationRequest) {
      const found = requests.find(r => r.id === activeNotificationRequest);
      if (found && (found.status === 'Done' || found.status === 'Onboarding Completed' || found.status === 'Issue' || found.status === 'Timing Switch')) {
        setSchedulingRequest(found);
      }
      setActiveNotificationRequest(null);
    }
  }, [activeNotificationRequest, requests, setActiveNotificationRequest]);

  // Filter requests belonging to this ING College or user
  const myRequests = requests.filter(r => 
    r.submittedBy === currentUser.id || 
    r.collegeName === currentUser.collegeName
  );

  const totalUploaded = myRequests.length;
  const onboardingCompletedCount = myRequests.filter(r => r.status === 'Done' || r.status === 'Onboarding Completed').length;
  const scheduledCount = myRequests.filter(r => r.preferredDate !== null).length;
  const actionRequiredCount = myRequests.filter(r => r.status === 'Issue' || r.status === 'On Hold').length;

  const handleDownloadSheet = (accountSheet, reqId) => {
    const content = `ACCOUNT DETAILS SHEET FOR ${reqId}\nFilename: ${accountSheet.fileName}\nUploaded By: ${accountSheet.uploadedBy}\nDate: ${accountSheet.uploadedAt}\nStatus: Verified`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = accountSheet.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ING Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <School className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-slate-100">{currentUser?.collegeName || 'ING College Portal'}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ING Member
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Submit student onboarding sheets, track MST verification, and reserve orientation dates
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload Onboarding Sheet
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Submitted Requests"
          value={totalUploaded}
          icon={FileSpreadsheet}
          color="emerald"
          subtext="Total roster sheets uploaded"
        />
        <StatCard
          title="Action Required"
          value={actionRequiredCount}
          icon={AlertCircle}
          color="amber"
          subtext="Issues or holds requiring review"
        />
        <StatCard
          title="Verified by MST"
          value={onboardingCompletedCount}
          icon={CheckCircle2}
          color="cyan"
          subtext="Verified onboarding sheets"
        />
        <StatCard
          title="Scheduled / Approved"
          value={scheduledCount}
          icon={Calendar}
          color="violet"
          subtext="Orientation date confirmed"
        />
      </div>

      {/* REQUIREMENT 4: Onboarding Request Pipeline Table (Roster Size & Actions columns removed) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">Onboarding Request Pipeline</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total {myRequests.length} Sheets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Program & Cohort</th>
                <th className="py-3 px-4">Onboarding Status</th>
                <th className="py-3 px-4">Account Details Sheet</th>
                <th className="py-3 px-4">Orientation Date & Time</th>
                <th className="py-3 px-4">Assigned MST Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {myRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    No onboarding sheets uploaded yet. Click "Upload Onboarding Sheet" to get started.
                  </td>
                </tr>
              ) : (
                myRequests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-300">{r.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{r.program}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3 px-4">
                      {r.accountSheet ? (
                        <button
                          onClick={() => handleDownloadSheet(r.accountSheet, r.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-medium flex items-center gap-1.5 truncate max-w-[180px]"
                          title={`Download ${r.accountSheet.fileName}`}
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                          <span className="truncate">{r.accountSheet.fileName}</span>
                          <Download className="w-3 h-3 shrink-0 ml-0.5" />
                        </button>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Pending MST</span>
                      )}
                    </td>
                    <td 
                      onClick={() => setSchedulingRequest(r)}
                      className="py-3 px-4 text-slate-300 cursor-pointer hover:bg-indigo-950/30 transition-colors rounded-lg"
                      title="Click to schedule or update orientation date & time"
                    >
                      {r.preferredDate ? (
                        <div>
                          <span className="font-semibold text-indigo-300">{r.preferredDate}</span>
                          <div className="text-[10px] text-slate-400 font-mono">{r.preferredTime}</div>
                        </div>
                      ) : (
                        <span className="text-indigo-400 underline font-semibold text-[11px] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Click to Schedule Date
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {r.assignedMstMembers && r.assignedMstMembers.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {r.assignedMstMembers.map(mId => {
                            const found = users.find(u => u.id === mId);
                            return (
                              <img
                                key={mId}
                                src={found ? found.avatar : 'https://api.dicebear.com/7.x/avataaars/svg?seed=MST'}
                                alt={found ? found.name : 'MST'}
                                title={found ? `${found.name} (${found.mstRole})` : 'MST Handler'}
                                className="w-6 h-6 rounded-full object-cover border border-indigo-500/50"
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <UploadSheetModal onClose={() => setShowUploadModal(false)} />
      )}

      {schedulingRequest && (
        <ScheduleDateModal
          request={schedulingRequest}
          onClose={() => setSchedulingRequest(null)}
        />
      )}
    </div>
  );
}
