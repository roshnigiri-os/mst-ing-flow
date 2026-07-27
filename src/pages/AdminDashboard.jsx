import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import UserManagementModal from '../components/UserManagementModal';
import StudentRosterModal from '../components/StudentRosterModal';
import { 
  Users, 
  FileSpreadsheet, 
  ShieldCheck, 
  Activity, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Search, 
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const { users, deleteUser } = useAuth();
  const { requests, auditLogs, deleteRequest } = useApp();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'requests' | 'logs'
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [previewRequest, setPreviewRequest] = useState(null);

  // System statistics
  const totalUsers = users.length;
  const totalRequests = requests.length;
  const completedOrientations = requests.filter(r => r.status === 'Completed' || r.status === 'Approved').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.collegeName && u.collegeName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRequests = requests.filter(r =>
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-black text-slate-100">Administrator Control Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            System-wide CRUD management, multi-role access control, and onboarding audit trails
          </p>
        </div>

        <button
          onClick={handleCreateUser}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add System Account
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total System Accounts"
          value={totalUsers}
          icon={Users}
          color="purple"
          subtext="Admin, MST & ING Members"
        />
        <StatCard
          title="Total Onboarding Sheets"
          value={totalRequests}
          icon={FileSpreadsheet}
          color="indigo"
          subtext="Submitted across all colleges"
        />
        <StatCard
          title="Completed Orientations"
          value={completedOrientations}
          icon={CheckCircle2}
          color="emerald"
          subtext="Approved or finished sessions"
        />
        <StatCard
          title="Pending MST Action"
          value={pendingRequests}
          icon={Clock}
          color="amber"
          subtext="Awaiting initial verification"
        />
      </div>

      {/* Tabs & Search */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Account Management ({users.length})
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'requests'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Requests ({requests.length})
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'logs'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              System Audit Logs ({auditLogs.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* TAB 1: User Management Table */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role / Designation</th>
                  <th className="py-3 px-4">Organization / Department</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                      <span className="font-bold text-slate-100">{u.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        u.role === 'Admin' 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : u.role === 'ING Member'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {u.role === 'MST Member' ? (u.mstRole || 'MST Member') : u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {u.collegeName ? (
                        <span className="font-semibold text-emerald-300">{u.collegeName}</span>
                      ) : (
                        <span className="text-slate-400">{u.department || 'Operations'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{u.email}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                          title="Edit User"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete user ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: All Onboarding Requests Table */}
        {activeTab === 'requests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">College Name</th>
                  <th className="py-3 px-4">Program & Students</th>
                  <th className="py-3 px-4">Submitted By</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRequests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-300">{r.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{r.collegeName}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-medium">{r.program}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">{r.studentCount} Students Roster</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{r.submitterName}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewRequest(r)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Roster
                        </button>
                        <button
                          onClick={() => deleteRequest(r.id, { name: 'Admin', role: 'Admin' })}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: System Audit Trail */}
        {activeTab === 'logs' && (
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{log.user}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-slate-800 text-purple-300">
                        {log.role}
                      </span>
                      <span className="font-mono text-indigo-400 text-[11px]">{log.action}</span>
                    </div>
                    <p className="text-slate-400 mt-0.5">{log.details}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserManagementModal
          userToEdit={editingUser}
          onClose={() => setShowUserModal(false)}
        />
      )}

      {previewRequest && (
        <StudentRosterModal
          request={previewRequest}
          onClose={() => setPreviewRequest(null)}
        />
      )}
    </div>
  );
}
