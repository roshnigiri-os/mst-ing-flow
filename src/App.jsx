import React, { Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import QuickDemoBar from './components/QuickDemoBar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import IngDashboard from './pages/IngDashboard';
import MstDashboard from './pages/MstDashboard';
import './styles/index.css';

// React Error Boundary to catch UI errors and prevent blank screens
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MST-ING Flow Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 glass-card rounded-2xl border border-rose-500/40 text-center text-slate-100 space-y-4">
          <h2 className="text-xl font-bold text-rose-400">Something went wrong</h2>
          <p className="text-xs text-slate-300 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            {this.state.error?.toString()}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
          >
            Reset App Storage & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        <ErrorBoundary>
          {renderDashboard()}
        </ErrorBoundary>
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
