import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { X, Edit3, CheckCircle2, Link as LinkIcon, Upload, FileSpreadsheet } from 'lucide-react';

export default function EditRequestModal({ request, onClose }) {
  const { updateOnboardingRequest } = useApp();
  const { currentUser } = useAuth();

  const [program, setProgram] = useState(request.program || '');
  const [notes, setNotes] = useState(request.notes || '');
  const [submissionMode, setSubmissionMode] = useState(request.sheetLink ? 'link' : 'file');
  const [fileName, setFileName] = useState(request.fileName || '');
  const [sheetLink, setSheetLink] = useState(request.sheetLink || '');

  if (!request) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateOnboardingRequest(request.id, {
      program,
      notes,
      fileName: submissionMode === 'file' ? (fileName || request.fileName || 'uploaded_roster.csv') : (sheetLink || request.sheetLink || 'Cloud_Roster_Sheet'),
      sheetLink: submissionMode === 'link' ? sheetLink : null,
      submissionType: submissionMode
    }, currentUser);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Edit Onboarding Request</h2>
              <p className="text-xs text-slate-400">Update request details, program name, or sheet</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Request ID</label>
            <input
              type="text"
              disabled
              value={request.id}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 font-mono text-indigo-300 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Program / Cohort Name</label>
            <input
              type="text"
              required
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Submission mode selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Attached Roster Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSubmissionMode('file')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  submissionMode === 'file'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>

              <button
                type="button"
                onClick={() => setSubmissionMode('link')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  submissionMode === 'link'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" /> Cloud Sheet Link
              </button>
            </div>
          </div>

          {submissionMode === 'file' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Update Roster File</label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.pdf,.zip"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />
              {fileName && <p className="text-[11px] text-indigo-300 mt-1">Current file: {fileName}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Update Cloud Sheet URL</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={sheetLink}
                  onChange={(e) => setSheetLink(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Notes</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              <CheckCircle2 className="w-4 h-4" /> Save Request Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
