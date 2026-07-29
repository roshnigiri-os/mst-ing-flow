import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { MOCK_EXCEL_DATA_URL } from '../mock/initialData';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import UploadSheetModal from '../components/UploadSheetModal';
import ScheduleDateModal from '../components/ScheduleDateModal';
import EditRequestModal from '../components/EditRequestModal';
import { 
  School, 
  Plus, 
  Calendar, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Download,
  ExternalLink,
  Edit3,
  FileText
} from 'lucide-react';

export default function IngDashboard() {
  const { currentUser, users = [] } = useAuth();
  const { requests = [], activeNotificationRequest, setActiveNotificationRequest } = useApp();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [schedulingRequest, setSchedulingRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  // Handle notification redirection
  useEffect(() => {
    if (activeNotificationRequest) {
      const found = (requests || []).find(r => r.id === activeNotificationRequest);
      if (found && (found.onboardingStatus === 'Completed' || found.orientationStatus === 'Orientation Completed' || found.orientationStatus === 'Orientation Switch')) {
        setSchedulingRequest(found);
      }
      setActiveNotificationRequest(null);
    }
  }, [activeNotificationRequest, requests, setActiveNotificationRequest]);

  // Strict School-Based Data Isolation for ING Members
  const myRequests = (requests || []).filter(r => {
    if (!currentUser) return false;

    const matchesUser = r.submittedBy === currentUser.id;
    const matchesCollege = currentUser.collegeName && r.collegeName && 
      r.collegeName.toLowerCase().trim() === currentUser.collegeName.toLowerCase().trim();

    return matchesUser || matchesCollege;
  });

  const totalUploaded = myRequests.length;
  const onboardingCompletedCount = myRequests.filter(r => r.onboardingStatus === 'Completed' || r.orientationStatus === 'Orientation Completed').length;
  const scheduledCount = myRequests.filter(r => r.preferredDate ? true : false).length;
  const actionRequiredCount = myRequests.filter(r => r.onboardingStatus === 'Issue' || r.onboardingStatus === 'On Hold' || r.orientationStatus === 'Orientation Switch').length;

  const handleDownloadSheet = (accountSheet, reqId) => {
    if (!accountSheet) return;
    if (accountSheet.sheetLink) {
      window.open(accountSheet.sheetLink, '_blank');
      return;
    }
    
    // Use authentic uploaded binary fileDataUrl or fallback to valid binary Excel Data URL
    const targetDataUrl = accountSheet.fileDataUrl || MOCK_EXCEL_DATA_URL;
    const a = document.createElement('a');
    a.href = targetDataUrl;
    a.download = accountSheet.fileName || `${reqId}_account_sheet.xlsx`;
    a.click();
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
              ING Member Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Isolated school onboarding pipeline for {currentUser?.collegeName || 'Partner Institution'}
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
          subtext={`School roster requests for ${currentUser?.collegeName || 'College'}`}
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

      {/* Onboarding Request Pipeline Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Onboarding Request Pipeline ({currentUser?.collegeName || 'My School'})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total {myRequests.length} Sheets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-300 font-bold border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-3.5 text-center align-middle whitespace-nowrap">Request ID</th>
                <th className="py-3 px-3.5 text-center align-middle whitespace-nowrap">Program & Cohort</th>
                <th className="py-3 px-3.5 text-center align-middle whitespace-nowrap">Onboarding Status</th>
                <th className="py-3 px-3.5 text-center align-middle whitespace-nowrap">Uploaded Sheet / Link</th>
                <th className="py-3 px-3.5 text-center align-middle whitespace-nowrap">Account Details Sheet</th>
                <th className="py-3 px-3.5 text-center align-middle whitespace-nowrap">Orientation Date & Time</th>
                <th className="py-3 px-3.5 text-center align-middle whitespace-nowrap">Assigned MST Team</th>
                <th className="py-3 px-3.5 text-center align-middle whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {myRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400 align-middle">
                    No onboarding sheets uploaded for {currentUser?.collegeName || 'this school'} yet. Click "Upload Onboarding Sheet" to get started.
                  </td>
                </tr>
              ) : (
                myRequests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 text-center align-middle font-mono font-bold text-indigo-300 whitespace-nowrap">{r.id}</td>
                    <td className="py-3 px-3.5 text-center align-middle font-medium text-slate-200">{r.program}</td>
                    <td className="py-3 px-3.5 text-center align-middle">
                      <StatusBadge status={r.onboardingStatus || r.status || 'Ongoing'} />
                    </td>

                    {/* Uploaded Sheet / Link rendering */}
                    <td className="py-3 px-3.5 text-center align-middle">
                      <div className="flex justify-center">
                        {r.sheetLink ? (
                          <a
                            href={r.sheetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium inline-flex items-center gap-1.5 truncate max-w-[170px]"
                            title={`Open Cloud Sheet: ${r.sheetLink}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                            <span className="truncate">Open Cloud Sheet</span>
                          </a>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium inline-flex items-center gap-1.5 truncate max-w-[170px]">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{r.fileName || 'roster_sheet.xlsx'}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3.5 text-center align-middle">
                      <div className="flex justify-center">
                        {r.accountSheet ? (
                          <button
                            onClick={() => handleDownloadSheet(r.accountSheet, r.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-medium flex items-center gap-1.5 truncate max-w-[170px]"
                            title={`Download ${r.accountSheet.fileName}`}
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                            <span className="truncate">{r.accountSheet.fileName}</span>
                            <Download className="w-3 h-3 shrink-0 ml-0.5" />
                          </button>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Pending MST</span>
                        )}
                      </div>
                    </td>

                    <td 
                      onClick={() => setSchedulingRequest(r)}
                      className="py-3 px-3.5 text-center align-middle text-slate-300 cursor-pointer hover:bg-indigo-950/30 transition-colors rounded-lg"
                      title="Click to schedule or update orientation date & time"
                    >
                      {r.preferredDate ? (
                        <div>
                          <span className="font-semibold text-indigo-300">{r.preferredDate}</span>
                          <div className="text-[10px] text-slate-400 font-mono">{r.preferredTime}</div>
                        </div>
                      ) : (
                        <span className="text-indigo-400 underline font-semibold text-[11px] flex items-center justify-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Click to Schedule Date
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-center align-middle">
                      <div className="flex justify-center">
                        {r.assignedMstMembers && r.assignedMstMembers.length > 0 ? (
                          <div className="flex items-center gap-1">
                            {r.assignedMstMembers.map(mId => {
                              const found = (users || []).find(u => u.id === mId);
                              return (
                                <img
                                  key={mId}
                                  src={found ? found.avatar : 'https://api.dicebear.com/7.x/avataaars/svg?seed=MST'}
                                  alt={found ? found.name : 'MST'}
                                  title={found ? `${found.name} (${found.mstRole || 'MST'})` : 'MST Handler'}
                                  className="w-6 h-6 rounded-full object-cover border border-indigo-500/50"
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Unassigned</span>
                        )}
                      </div>
                    </td>

                    {/* Editable Request Pipeline Row Actions */}
                    <td className="py-3 px-3.5 text-center align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingRequest(r)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                          title="Edit request program details or sheet"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-400" /> Edit
                        </button>

                        <button
                          onClick={() => setSchedulingRequest(r)}
                          className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                          title="Schedule orientation date"
                        >
                          <Calendar className="w-3.5 h-3.5 text-violet-400" /> Schedule
                        </button>
                      </div>
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

      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
        />
      )}
    </div>
  );
}
