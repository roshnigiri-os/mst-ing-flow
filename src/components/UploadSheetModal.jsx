import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { X, Upload, FileSpreadsheet, CheckCircle2, Link as LinkIcon, FileText } from 'lucide-react';

export default function UploadSheetModal({ onClose }) {
  const { createOnboardingRequest } = useApp();
  const { currentUser } = useAuth();

  const [submissionMode, setSubmissionMode] = useState('file'); // 'file' or 'link'
  const [program, setProgram] = useState('Computer Science Fall 2026 Batch');
  const [notes, setNotes] = useState('');
  
  // File mode
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  // Link mode
  const [sheetLink, setSheetLink] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createOnboardingRequest({
      program,
      studentCount: 45,
      notes,
      fileName: submissionMode === 'file' ? (fileName || 'uploaded_roster.csv') : (sheetLink || 'Google_Sheets_Cloud_Roster'),
      fileSize: submissionMode === 'file' ? (fileSize || '18.5 KB') : 'Cloud Link',
      sheetLink: submissionMode === 'link' ? sheetLink : null
    }, currentUser);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Upload Onboarding Request Sheet</h2>
              <p className="text-xs text-slate-400">Step 1: Submit college student roster via file upload or Cloud Sheet link</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
          {/* Program & College Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">College / Institution</label>
              <input
                type="text"
                disabled
                value={currentUser?.collegeName || 'Apex Tech College'}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Program / Cohort Name</label>
              <input
                type="text"
                required
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="e.g. B.Tech Computer Science 2026 Batch"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Submission Mode Selector (Upload File vs Add Sheet Link) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Roster Submission Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSubmissionMode('file')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  submissionMode === 'file'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Upload className="w-4 h-4" /> Upload File (.csv, .xlsx)
              </button>

              <button
                type="button"
                onClick={() => setSubmissionMode('link')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  submissionMode === 'link'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <LinkIcon className="w-4 h-4" /> Add Cloud Sheet Link
              </button>
            </div>
          </div>

          {/* Option A: File Upload Container */}
          {submissionMode === 'file' ? (
            <div className="space-y-2 animate-fade-in">
              <label className="block text-xs font-medium text-slate-300">Upload Student CSV/Excel Roster File</label>
              <label className="block border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/40 rounded-2xl p-6 text-center transition-all cursor-pointer shadow-sm group">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.pdf,.zip"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center mx-auto mb-3 transition-all shadow-md">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <p className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {fileName ? `Selected File: ${fileName} (${fileSize})` : 'Click here to select & upload student roster sheet'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Click anywhere in this box to browse CSV or XLSX files (Max 10MB)</p>
                <span className="inline-block mt-3 px-3 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-md group-hover:bg-indigo-500 transition-colors">
                  Browse Files
                </span>
              </label>
            </div>
          ) : (
            /* Option B: Add Sheet Link */
            <div className="space-y-2 animate-fade-in">
              <label className="block text-xs font-medium text-slate-300">Add Cloud Sheet Link (Google Sheets / OneDrive)</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={sheetLink}
                  onChange={(e) => setSheetLink(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <p className="text-[11px] text-slate-400">Paste your Google Sheets, Excel Online, or shared cloud drive URL for MST verification.</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Additional Notes for MST</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Special lab access requirements or student list notes..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-700/60 flex items-center justify-end gap-2">
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
              <CheckCircle2 className="w-4 h-4" /> Submit Sheet to MST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
