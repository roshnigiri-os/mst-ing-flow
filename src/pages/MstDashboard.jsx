import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import AssignMSTModal from '../components/AssignMSTModal';
import AttachDocumentModal from '../components/AttachDocumentModal';
import ActionOnboardingModal from '../components/ActionOnboardingModal';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  CheckCheck, 
  UserCheck,
  Search,
  Paperclip,
  FileSpreadsheet,
  Download,
  Plus,
  FileText
} from 'lucide-react';

export default function MstDashboard() {
  const { currentUser, users } = useAuth();
  const { requests, activeNotificationRequest, setActiveNotificationRequest } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assigningRequest, setAssigningRequest] = useState(null);
  const [attachingRequest, setAttachingRequest] = useState(null);
  const [actioningRequest, setActioningRequest] = useState(null);

  // Handle notification redirection
  useEffect(() => {
    if (activeNotificationRequest) {
      const found = requests.find(r => r.id === activeNotificationRequest);
      if (found) {
        if (found.status === 'Done' || found.status === 'Approved' || found.status === 'Issue' || found.status === 'Timing Switch' || found.status === 'On Hold') {
          setAssigningRequest(found);
        } else if (found.status === 'Pending') {
          setActioningRequest(found);
        }
      }
      setActiveNotificationRequest(null);
    }
  }, [activeNotificationRequest, requests, setActiveNotificationRequest]);

  // Metrics
  const totalRequests = requests.length;
  const pendingOnboardingCount = requests.filter(r => r.status === 'Pending').length;
  const dateSubmittedCount = requests.filter(r => r.preferredDate !== null && r.status !== 'Done').length;
  const completedCount = requests.filter(r => r.status === 'Done' || r.status === 'Completed').length;

  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.program.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'pending') return r.status === 'Pending';
    if (activeTab === 'date-approval') return r.preferredDate !== null && r.status !== 'Done';
    if (activeTab === 'completed') return r.status === 'Done' || r.status === 'Completed';

    return true;
  });

  const handleDownloadSheet = (fileName, reqId, isAccountSheet = false) => {
    const title = isAccountSheet ? `ACCOUNT DETAILS SHEET` : `STUDENT ROSTER SHEET`;
    const content = `${title} FOR ${reqId}\nFilename: ${fileName}\nStatus: Verified\nDate: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
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
            Review incoming ING college sheets, attach account details documents, mark onboarding completion, and schedule orientation sessions
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
          title="Pending Onboarding"
          value={pendingOnboardingCount}
          icon={Clock}
          color="amber"
          subtext="Sheets awaiting verification"
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

      {/* Requests Queue */}
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
              Pending ({pendingOnboardingCount})
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

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">College Name</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Onboarding Status</th>
                {/* REQUIREMENT 2: Column to show Onboarding sheet added by ING member */}
                <th className="py-3 px-4">Onboarding Sheet (ING)</th>
                <th className="py-3 px-4">Account Details Sheet</th>
                <th className="py-3 px-4">Requested Orientation Date</th>
                <th className="py-3 px-4">Assigned Handlers</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400">
                    No requests match the selected tab filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(r => {
                  const isCompleted = r.status === 'Done' || r.status === 'Completed';

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-300">{r.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{r.collegeName}</td>
                      <td className="py-3 px-4 text-slate-200 font-medium">{r.program}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={r.status} />
                      </td>

                      {/* REQUIREMENT 2: Onboarding Sheet added by ING Member */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDownloadSheet(r.fileName || 'roster_sheet.csv', r.id, false)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium flex items-center gap-1.5 truncate max-w-[160px]"
                          title={`Download ${r.fileName || 'roster_sheet.csv'} (${r.fileSize || '18KB'})`}
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          <span className="truncate">{r.fileName || 'roster_sheet.csv'}</span>
                          <Download className="w-3 h-3 shrink-0 ml-0.5" />
                        </button>
                      </td>

                      {/* Account Details Sheet Column */}
                      <td className="py-3 px-4">
                        {r.accountSheet ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDownloadSheet(r.accountSheet.fileName, r.id, true)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-medium flex items-center gap-1.5 truncate max-w-[160px]"
                              title={`Download ${r.accountSheet.fileName} (${r.accountSheet.fileSize})`}
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                              <span className="truncate">{r.accountSheet.fileName}</span>
                              <Download className="w-3 h-3 shrink-0 ml-0.5" />
                            </button>
                            <button
                              onClick={() => setAttachingRequest(r)}
                              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                              title="Re-attach / Update document"
                            >
                              <Paperclip className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAttachingRequest(r)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5 text-indigo-400" /> Attach Sheet
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {r.preferredDate ? (
                          <div>
                            <span className="font-semibold text-indigo-300">{r.preferredDate}</span>
                            <div className="text-[10px] text-slate-400">{r.preferredTime}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">None requested</span>
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

                      <td className="py-3 px-4 text-right">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                            <CheckCheck className="w-3.5 h-3.5" /> Orientation Completed
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {r.status === 'Pending' && (
                              <button
                                onClick={() => setActioningRequest(r)}
                                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-md shadow-cyan-600/30"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Action Onboarding
                              </button>
                            )}

                            {r.status !== 'Pending' && (
                              <button
                                onClick={() => setAssigningRequest(r)}
                                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-md shadow-indigo-600/30"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Review / Assign MST
                              </button>
                            )}
                          </div>
                        )}
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
    </div>
  );
}
