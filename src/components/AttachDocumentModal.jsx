import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { X, Paperclip, CheckCircle2, Link as LinkIcon, Upload } from 'lucide-react';

export default function AttachDocumentModal({ request, onClose }) {
  const { attachAccountSheet } = useApp();
  const { currentUser } = useAuth();

  const [submissionType, setSubmissionType] = useState('file');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [sheetLink, setSheetLink] = useState('');

  if (!request) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

      const reader = new FileReader();
      reader.onload = (event) => {
        setFileDataUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    attachAccountSheet(request.id, {
      fileName: submissionType === 'file' ? (fileName || 'account_details.xlsx') : (sheetLink || 'Google_Sheets_Account_Details'),
      fileSize: submissionType === 'file' ? (fileSize || '32.0 KB') : 'Cloud Link',
      fileDataUrl: submissionType === 'file' ? fileDataUrl : null,
      sheetLink: submissionType === 'link' ? sheetLink : null
    }, currentUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100 max-h-[85vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Attach Account Details Sheet</h2>
              <p className="text-xs text-slate-400">Attach account sheet for {request.collegeName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Request ID:</span>
              <span className="font-mono font-bold text-indigo-300">{request.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">College:</span>
              <span className="font-semibold text-slate-200">{request.collegeName}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Document Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSubmissionType('file')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  submissionType === 'file'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>

              <button
                type="button"
                onClick={() => setSubmissionType('link')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  submissionType === 'link'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" /> Cloud Sheet Link
              </button>
            </div>
          </div>

          {submissionType === 'file' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Account Document (All file types accepted)</label>
              <input
                type="file"
                accept="*"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />
              {fileName && <p className="text-[11px] text-indigo-300 mt-1">Selected: {fileName}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cloud Sheet URL</label>
              <input
                type="url"
                required
                value={sheetLink}
                onChange={(e) => setSheetLink(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          )}

          <div className="pt-3 border-t border-slate-700/60 flex justify-end gap-2 shrink-0">
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
              <CheckCircle2 className="w-4 h-4" /> Save & Attach Sheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
