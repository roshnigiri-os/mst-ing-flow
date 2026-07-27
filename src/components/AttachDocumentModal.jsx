import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { X, Upload, FileText, CheckCircle2, Paperclip, FileSpreadsheet } from 'lucide-react';

export default function AttachDocumentModal({ request, onClose }) {
  const { attachAccountSheet } = useApp();
  const { currentUser } = useAuth();

  const [fileName, setFileName] = useState(
    request?.accountSheet?.fileName || `${request?.id}_Account_Details.xlsx`
  );
  const [fileSize, setFileSize] = useState(
    request?.accountSheet?.fileSize || '34.8 KB'
  );
  const [docType, setDocType] = useState('Excel Sheet (.xlsx)');

  if (!request) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    attachAccountSheet(request.id, { fileName, fileSize }, currentUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">Attach Account Details Sheet</h2>
              <p className="text-xs text-slate-400">Attach credentials, system access specs, or roster spreadsheets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Request ID:</span>
              <span className="font-mono font-bold text-indigo-300">{request.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">College Name:</span>
              <span className="font-semibold text-slate-200">{request.collegeName}</span>
            </div>
          </div>

          {/* Upload File Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Document / Sheet File</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-5 text-center bg-slate-900/40 transition-all relative cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv,.pdf,.docx,.doc,.zip"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileSpreadsheet className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-200">
                {fileName ? `File: ${fileName} (${fileSize})` : 'Click or Drag document here'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports XLSX, CSV, PDF, DOCX, ZIP up to 25MB</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Document Category</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Excel Sheet (.xlsx)">Excel Sheet (.xlsx / .csv)</option>
              <option value="Credentials PDF (.pdf)">Credentials PDF (.pdf)</option>
              <option value="Access Protocol Doc (.docx)">Access Protocol Doc (.docx)</option>
              <option value="Archive Bundle (.zip)">Archive Bundle (.zip)</option>
            </select>
          </div>

          {/* REQUIREMENT 4: Explicit Submit & Approve Button */}
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit & Attach Sheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
