import React, { useState } from 'react';
import { X, Search, Download, UserCheck, GraduationCap, Mail, Phone } from 'lucide-react';

export default function StudentRosterModal({ request, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!request) return null;

  const students = request.students || [];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.major && s.major.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDownloadCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Email', 'Major/Department', 'Phone'];
    const csvRows = [headers.join(',')];

    students.forEach(s => {
      csvRows.push([
        `"${s.id}"`,
        `"${s.name}"`,
        `"${s.email}"`,
        `"${s.major || 'N/A'}"`,
        `"${s.phone || 'N/A'}"`
      ].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${request.id}_${request.collegeName.replace(/\s+/g, '_')}_roster.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-100">Student Roster Preview</h2>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/30">
                {request.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              College: <span className="font-semibold text-slate-200">{request.collegeName}</span> | Program: <span className="text-indigo-300">{request.program}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
            >
              <Download className="w-4 h-4" /> Download CSV
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="my-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students by name, ID, major or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700/70 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Roster Table */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-700/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 sticky top-0 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Major</th>
                <th className="py-3 px-4">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    No students match your query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-indigo-300">{s.id}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-100 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                        {s.name.charAt(0)}
                      </div>
                      {s.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {s.email}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {s.major || 'General'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {s.phone || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="pt-4 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredStudents.length} of {students.length} Total Registered Students</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
