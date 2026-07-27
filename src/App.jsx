import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import QuickDemoBar from './components/QuickDemoBar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import IngDashboard from './pages/IngDashboard';
import MstDashboard from './pages/MstDashboard';
import './styles/index.css';

function MainLayout() {
  const { currentUser } = useAuth();

  const renderDashboard = () => {
    if (!currentUser) {
      return <Login />;
    }

    switch (currentUser.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'ING Member':
        return <IngDashboard />;
      case 'MST Member':
        return <MstDashboard />;
      default:
        return <Login />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Glowing Ambient Orbs */}
      <div className="bg-glow-container">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
        <div className="bg-orb-3" />
      </div>

      {/* Quick Demo Switcher Bar */}
      <QuickDemoBar />

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {renderDashboard()}
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-slate-700/40 py-4 text-center text-xs text-slate-400 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-200">MST-ING Flow Platform</span> © 2026. Enterprise Onboarding System.
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="hover:text-indigo-300 transition-colors cursor-pointer">Documentation</span>
            <span>•</span>
            <span className="hover:text-indigo-300 transition-colors cursor-pointer">System Status: Operational</span>
            <span>•</span>
            <span className="hover:text-indigo-300 transition-colors cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
