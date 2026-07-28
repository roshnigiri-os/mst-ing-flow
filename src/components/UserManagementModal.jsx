import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, Shield, School, Users, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function UserManagementModal({ userToEdit, onClose }) {
  const { addUser, updateUser, currentUser } = useAuth();

  const [name, setName] = useState(userToEdit ? userToEdit.name : '');
  const [email, setEmail] = useState(userToEdit ? userToEdit.email : '');
  const [password, setPassword] = useState(userToEdit ? userToEdit.password || 'password123' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(userToEdit ? userToEdit.role : 'MST Member');
  const [mstRole, setMstRole] = useState(userToEdit ? userToEdit.mstRole || 'MST Specialist' : 'MST Specialist');
  const [collegeName, setCollegeName] = useState(userToEdit ? userToEdit.collegeName || '' : '');
  const [department, setDepartment] = useState(userToEdit ? userToEdit.department || 'Operations' : 'Operations');

  // Verify that active user is System Administrator
  if (!currentUser || currentUser.role !== 'Admin') {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userToEdit) {
      updateUser(userToEdit.id, {
        name,
        email,
        password,
        role,
        mstRole: role === 'MST Member' ? mstRole : null,
        collegeName: role === 'ING Member' ? collegeName : null,
        department
      });
    } else {
      addUser({
        name,
        email,
        password,
        role,
        mstRole: role === 'MST Member' ? mstRole : null,
        collegeName: role === 'ING Member' ? collegeName : null,
        department
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {userToEdit ? 'Edit System Account' : 'Provision New System Account'}
              </h2>
              <p className="text-xs text-slate-400">Admin Account Management & Role Assignment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Robert Vance"
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address / User ID</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="robert.vance@msting.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Password field with View option */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide Password' : 'View Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role selector for System Administrator */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Assign Account Role</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('Admin')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  role === 'Admin'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-400" /> Admin
              </button>

              <button
                type="button"
                onClick={() => setRole('MST Member')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  role === 'MST Member'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-400" /> MST Member
              </button>

              <button
                type="button"
                onClick={() => setRole('ING Member')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  role === 'ING Member'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <School className="w-4 h-4 text-emerald-400" /> ING Member
              </button>
            </div>
          </div>

          {/* Conditional Role Detail */}
          {role === 'MST Member' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">MST Designation / Role</label>
              <input
                type="text"
                value={mstRole}
                onChange={(e) => setMstRole(e.target.value)}
                placeholder="e.g. MST Lead / MST Specialist"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          )}

          {role === 'ING Member' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College / Institution Name</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Horizon Institute of Technology"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Academic Ops / Onboarding"
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
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
              <CheckCircle2 className="w-4 h-4" /> {userToEdit ? 'Save Account Changes' : 'Provision Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
