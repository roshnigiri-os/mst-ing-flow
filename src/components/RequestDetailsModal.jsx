import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_EXCEL_DATA_URL } from '../mock/initialData';
import StatusBadge from './StatusBadge';
import { 
  X, 
  School, 
  FileText, 
  Calendar, 
  Users, 
  MessageSquareText, 
  Download, 
  ExternalLink, 
  FileSpreadsheet,
  Clock,
  UserCheck,
  Building,
  Mail
} from 'lucide-react';

export default function RequestDetailsModal({ request, onClose }) {
  const { users = [] } = useAuth();

  if (!request) return null;

  const handleDownloadSheet = (fileName, reqId, isAccountSheet = false, sheetUrl = null, fileDataUrl = null) => {
    if (sheetUrl) {
      window.open(sheetUrl, '_blank');
      return;
    }
    const targetDataUrl = fileDataUrl || MOCK_EXCEL_DATA_URL;
    const a = document.createElement('a');
    a.href = targetDataUrl;
    a.download = fileName || `${reqId}_${isAccountSheet ? 'account' : 'roster'}.xlsx`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[90vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-100">{request.collegeName}</h2>
                <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                  {request.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">Complete Onboarding Request & Orientation Details</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pt-4 pr-1">
          {/* Status Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 mb-1">Onboarding Status</span>
              <StatusBadge status={request.onboardingStatus || request.status || 'Ongoing'} />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 mb-1">Orientation Action</span>
              <StatusBadge status={request.orientationStatus || 'Orientation Pending'} />
            </div>
          </div>

          {/* Program & Submitter Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Building className="w-4 h-4 text-indigo-400" /> Program & Cohort Details
              </div>
              <div className="text-sm font-bold text-slate-200">{request.program}</div>
              <div className="text-xs text-slate-400">
                Student Capacity: <span className="font-semibold text-slate-200">{request.studentCount || 45} Students</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Submitted: {new Date(request.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Mail className="w-4 h-4 text-emerald-400" /> Submitter Contact Info
              </div>
              <div className="text-xs font-bold text-slate-200">{request.submitterName || 'ING Representative'}</div>
              <div className="text-xs text-slate-400 font-mono">{request.submitterEmail || 'ing@partner.edu'}</div>
              <div className="text-[11px] text-slate-400">
                Institution: <span className="font-semibold text-emerald-300">{request.collegeName}</span>
              </div>
            </div>
          </div>

          {/* Additional Notes for MST (From ING Member) */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <MessageSquareText className="w-4 h-4 text-amber-400" /> Additional Notes for MST (Provided by ING Member)
            </div>
            <p className="text-xs text-amber-100/90 whitespace-pre-wrap leading-relaxed">
              {request.notes || 'No additional notes provided by ING Member for this request.'}
            </p>
          </div>

          {/* Reschedule Comment / Notes if any */}
          {request.rescheduleComment && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                <Clock className="w-4 h-4 text-rose-400" /> Orientation Switch / Reschedule Comment
              </div>
              <p className="text-xs text-rose-200">{request.rescheduleComment}</p>
            </div>
          )}

          {/* Documents Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" /> Attached Onboarding & Account Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Onboarding Sheet (ING) */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[11px] text-slate-400 font-semibold">Onboarding Sheet (ING)</span>
                  <span className="block text-xs font-bold text-slate-200 truncate">
                    {request.fileName || 'roster_sheet.xlsx'}
                  </span>
                  <span className="block text-[10px] text-slate-500">{request.fileSize || 'Standard Sheet'}</span>
                </div>
                {request.sheetLink ? (
                  <a
                    href={request.sheetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Link
                  </a>
                ) : (
                  <button
                    onClick={() => handleDownloadSheet(request.fileName, request.id, false, null, request.fileDataUrl)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                )}
              </div>

              {/* Account Details Sheet */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[11px] text-slate-400 font-semibold">Account Details Sheet</span>
                  <span className="block text-xs font-bold text-slate-200 truncate">
                    {request.accountSheet ? request.accountSheet.fileName : 'Pending MST Upload'}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {request.accountSheet ? `By ${request.accountSheet.uploadedBy || 'MST'}` : 'Not attached yet'}
                  </span>
                </div>
                {request.accountSheet ? (
                  <button
                    onClick={() => handleDownloadSheet(request.accountSheet.fileName, request.id, true, request.accountSheet.sheetLink, request.accountSheet.fileDataUrl)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Pending</span>
                )}
              </div>
            </div>
          </div>

          {/* Orientation Date & Assigned MST Team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
                <Calendar className="w-4 h-4 text-violet-400" /> Orientation Schedule
              </div>
              {request.preferredDate ? (
                <div>
                  <div className="text-sm font-extrabold text-indigo-300">{request.preferredDate}</div>
                  <div className="text-xs text-slate-400">{request.preferredTime}</div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">No orientation date requested yet</div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <UserCheck className="w-4 h-4 text-indigo-400" /> Assigned MST Handlers
              </div>
              {request.assignedMstMembers && request.assignedMstMembers.length > 0 ? (
                <div className="flex items-center gap-2 pt-1">
                  {request.assignedMstMembers.map(mId => {
                    const found = users.find(u => u.id === mId);
                    return (
                      <div key={mId} className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                        <img
                          src={found ? found.avatar : 'https://api.dicebear.com/7.x/avataaars/svg?seed=MST'}
                          alt={found ? found.name : 'MST'}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-200">{found ? found.name : 'MST Specialist'}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">Unassigned</div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-700/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
