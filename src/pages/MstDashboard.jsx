import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { handleSheetDownload } from '../utils/xlsxDownload';
import StatCard from '../components/StatCard';
import AssignMSTModal from '../components/AssignMSTModal';
import AttachDocumentModal from '../components/AttachDocumentModal';
import ActionOnboardingModal from '../components/ActionOnboardingModal';
import RequestDetailsModal from '../components/RequestDetailsModal';
import { 
  Users, 
  Clock, 
  Calendar, 
  CheckCheck, 
  UserCheck,
  Search,
  Paperclip,
  FileSpreadsheet,
  Download,
  Plus,
  FileText,
  ExternalLink,
  Eye
} from 'lucide-react';

export default function MstDashboard() {
  const { currentUser, users } = useAuth();
  const { 
    requests, 
    updateOnboardingStatus, 
    updateOrientationStatus, 
    activeNotificationRequest, 
    setActiveNotificationRequest 
  } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assigningRequest, setAssigningRequest] = useState(null);
  const [attachingRequest, setAttachingRequest] = useState(null);
  const [actioningRequest, setActioningRequest] = useState(null);
  const [viewingDetailsRequest, setViewingDetailsRequest] = useState(null);

  // Handle notification redirection
  useEffect(() => {
    if (activeNotificationRequest) {
      const found = requests.find(r => r.id === activeNotificationRequest);
      if (found) {
        setAssigningRequest(found);
      }
      setActiveNotificationRequest(null);
    }
  }, [activeNotificationRequest, requests, setActiveNotificationRequest]);

  // Metrics
  const totalRequests = requests.length;
  const pendingOnboardingCount = requests.filter(r => r.onboardingStatus === 'Ongoing' || r.onboardingStatus === 'Pending').length;
  const dateSubmittedCount = requests.filter(r => r.preferredDate !== null && r.orientationStatus !== 'Orientation Completed').length;
  const completedCount = requests.filter(r => r.onboardingStatus === 'Completed' || r.orientationStatus === 'Orientation Completed').length;

  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.program.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'pending') return r.onboardingStatus === 'Ongoing' || r.onboardingStatus === 'Pending';
    if (activeTab === 'date-approval') return r.preferredDate !== null && r.orientationStatus !== 'Orientation Completed';
    if (activeTab === 'completed') return r.onboardingStatus === 'Completed' || r.orientationStatus === 'Orientation Completed';

    return true;
  });

  // DOWNLOAD HANDLER – routes through SheetJS utility to prevent Excel format errors
  const handleDownloadSheet = (fileName, reqId, isAccountSheet = false, sheetUrl = null, fileDataUrl = null, collegeName = '', program = '') => {
    handleSheetDownload({
      fileName: fileName || `${reqId}_${isAccountSheet ? 'account' : 'roster'}.xlsx`,
      fileDataUrl,
      sheetLink: sheetUrl,
      collegeName,
      program,
    });
  };

  // INDEPENDENT HANDLER 1: Updates ONLY mid-table onboardingStatus
  const handleOnboardingStatusChange = (request, newStatus) => {
    updateOnboardingStatus(request.id, newStatus, currentUser);
  };

  // INDEPENDENT HANDLER 2: Updates ONLY end-table orientationStatus
  const handleOrientationActionChange = (request, actionChoice) => {
    if (actionChoice === 'Orientation Switch') {
      setAssigningRequest(request);
    } else {
      updateOrientationStatus(request.id, actionChoice, currentUser);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black text-slate-100">MST Operations Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentUser?.mstRole || 'MST Member'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming ING college sheets, attach account details documents, update onboarding status, and schedule orientation sessions
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incoming Sheets Queue"
          value={totalRequests}
          icon={Users}
          color="indigo"
          subtext="Total partner requests"
        />
        <StatCard
          title="Ongoing / Pending"
          value={pendingOnboardingCount}
          icon={Clock}
          color="amber"
          subtext="Sheets in active processing"
        />
        <StatCard
          title="Date Reviews Required"
          value={dateSubmittedCount}
          icon={Calendar}
          color="violet"
          subtext="Orientation date requests"
        />
        <StatCard
          title="Orientation Completed"
          value={completedCount}
          icon={CheckCheck}
          color="emerald"
          subtext="Finished sessions"
        />
      </div>

      {/* Requests Queue Table (Pinned High-Contrast Scrollbar & Viewport Fit Layout) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          {/* Workflow Stage Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Queue ({requests.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Ongoing / Pending ({pendingOnboardingCount})
            </button>

            <button
              onClick={() => setActiveTab('date-approval')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'date-approval'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Date Reviews Required ({dateSubmittedCount})
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Orientation Completed ({completedCount})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search request or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Table Container with Pinned High-Contrast Scrollbar */}
        <div className="custom-scrollbar max-h-[60vh] overflow-x-auto overflow-y-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-slate-900/95 text-slate-300 font-bold border-b border-slate-700/60 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Request ID</th>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">College Name</th>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Program</th>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Onboarding Sheet (ING)</th>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Account Details Sheet</th>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Requested Date</th>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Assigned Handlers</th>
                <th className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Actions & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400 align-middle">
                    No requests match the selected tab filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(r => {
                  const currentOnboardingStatus = r.onboardingStatus || 'Ongoing';
                  const currentOrientationStatus = r.orientationStatus || 'Orientation Pending';

                  const isStatusCompleted = currentOnboardingStatus === 'Completed';
                  const isActionCompleted = currentOrientationStatus === 'Orientation Completed';

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-center align-middle font-mono font-bold text-indigo-300 whitespace-nowrap">{r.id}</td>
                      <td className="py-2.5 px-3 text-center align-middle font-semibold text-slate-200">{r.collegeName}</td>
                      <td className="py-2.5 px-3 text-center align-middle text-slate-200 font-medium">{r.program}</td>

                      {/* Onboarding Sheet (ING) File or Cloud Link */}
                      <td className="py-2.5 px-3 text-center align-middle">
                        <div className="flex justify-center">
                          {r.sheetLink ? (
                            <a
                              href={r.sheetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium inline-flex items-center gap-1 truncate max-w-[140px]"
                              title={`Open Cloud Sheet: ${r.sheetLink}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              <span className="truncate">Open Sheet</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => handleDownloadSheet(r.fileName || 'roster_sheet.xlsx', r.id, false, null, r.fileDataUrl, r.collegeName, r.program)}
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium flex items-center gap-1 truncate max-w-[140px]"
                              title={`Download ${r.fileName || 'roster_sheet.xlsx'}`}
                            >
                              <FileText className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              <span className="truncate">{r.fileName || 'roster_sheet.xlsx'}</span>
                              <Download className="w-3 h-3 shrink-0 ml-0.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Account Details Sheet Column */}
                      <td className="py-2.5 px-3 text-center align-middle">
                        <div className="flex justify-center">
                          {r.accountSheet ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDownloadSheet(r.accountSheet.fileName, r.id, true, r.accountSheet.sheetLink, r.accountSheet.fileDataUrl, r.collegeName, r.program)}
                                className="px-2 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-medium flex items-center gap-1 truncate max-w-[140px]"
                                title={`Download ${r.accountSheet.fileName}`}
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                                <span className="truncate">{r.accountSheet.fileName}</span>
                                <Download className="w-3 h-3 shrink-0 ml-0.5" />
                              </button>
                              <button
                                onClick={() => setAttachingRequest(r)}
                                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                                title="Re-attach document"
                              >
                                <Paperclip className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAttachingRequest(r)}
                              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5 text-indigo-400" /> Attach Sheet
                            </button>
                          )}
                        </div>
                      </td>

                      {/* MID-TABLE STATUS DROPDOWN */}
                      <td className="py-2.5 px-3 text-center align-middle">
                        <div className="flex justify-center">
                          <select
                            value={currentOnboardingStatus}
                            onChange={(e) => handleOnboardingStatusChange(r, e.target.value)}
                            className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-md transition-all ${
                              isStatusCompleted
                                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-extrabold shadow-emerald-600/20'
                                : currentOnboardingStatus === 'Ongoing'
                                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
                                : currentOnboardingStatus === 'On Hold'
                                ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                                : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                            }`}
                          >
                            <option value="Ongoing" className="bg-slate-900 text-slate-200">Ongoing</option>
                            <option value="Completed" className="bg-slate-900 text-emerald-300 font-bold">Completed</option>
                            <option value="On Hold" className="bg-slate-900 text-rose-300">On Hold</option>
                            <option value="Issue" className="bg-slate-900 text-amber-300">Issue</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center align-middle text-slate-300">
                        {r.preferredDate ? (
                          <div>
                            <span className="font-semibold text-indigo-300">{r.preferredDate}</span>
                            <div className="text-[10px] text-slate-400">{r.preferredTime}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">None</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center align-middle">
                        <div className="flex justify-center">
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
                                    className="w-5 h-5 rounded-full object-cover border border-indigo-500/50"
                                  />
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500">Unassigned</span>
                          )}
                        </div>
                      </td>

                      {/* FINAL ACTIONS DROPDOWN + ALL DETAILS BUTTON */}
                      <td className="py-2.5 px-3 text-center align-middle">
                        <div className="flex items-center justify-center gap-1">
                          <select
                            value={currentOrientationStatus}
                            onChange={(e) => handleOrientationActionChange(r, e.target.value)}
                            className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-md transition-all ${
                              isActionCompleted
                                ? 'bg-green-600/30 border-green-500 text-green-200 font-extrabold shadow-green-600/20'
                                : currentOrientationStatus === 'Orientation Scheduled'
                                ? 'bg-violet-950/80 border-violet-500/50 text-violet-200'
                                : currentOrientationStatus === 'Orientation Switch'
                                ? 'bg-orange-950/80 border-orange-500/50 text-orange-200'
                                : 'bg-slate-900 border-slate-700 text-slate-300'
                            }`}
                          >
                            <option value="Orientation Pending" className="bg-slate-900 text-slate-300">Orientation Pending</option>
                            <option value="Orientation Completed" className="bg-slate-900 text-green-300 font-bold">Orientation Completed</option>
                            <option value="Orientation Scheduled" className="bg-slate-900 text-violet-300">Orientation Scheduled</option>
                            <option value="Orientation Switch" className="bg-slate-900 text-orange-300">Orientation Switch</option>
                          </select>

                          <button
                            onClick={() => setAssigningRequest(r)}
                            className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                            title="Assign MST Handlers & Detailed Review"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>

                          {/* ALL DETAILS BUTTON */}
                          <button
                            onClick={() => setViewingDetailsRequest(r)}
                            className="px-2 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center gap-1 transition-all shrink-0"
                            title="View all details of this request"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" /> Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {assigningRequest && (
        <AssignMSTModal
          request={assigningRequest}
          onClose={() => setAssigningRequest(null)}
        />
      )}

      {attachingRequest && (
        <AttachDocumentModal
          request={attachingRequest}
          onClose={() => setAttachingRequest(null)}
        />
      )}

      {actioningRequest && (
        <ActionOnboardingModal
          request={actioningRequest}
          onClose={() => setActioningRequest(null)}
        />
      )}

      {viewingDetailsRequest && (
        <RequestDetailsModal
          request={viewingDetailsRequest}
          onClose={() => setViewingDetailsRequest(null)}
        />
      )}
    </div>
  );
}
