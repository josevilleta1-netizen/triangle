import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { PinLockModal } from './components/PinLockModal';
import { Shell } from './components/Shell';
import { DashboardView } from './components/DashboardView';

function AppContent() {
  const { isAuthenticated, isLoading, isTerminalLocked } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center font-extrabold text-2xl animate-pulse">
            ▲
          </div>
          <span className="text-xs font-bold text-on-surface-variant">Cargando TRIANGLE...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      {isTerminalLocked && <PinLockModal />}
      <Shell currentView={currentView} onNavigate={setCurrentView}>
        {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
        {currentView !== 'dashboard' && (
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-cloud-ambient border border-surface-container/30">
            <h2 className="text-xl font-extrabold text-on-surface capitalize">Módulo: {currentView}</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Este módulo se conectará en las fases posteriores (Fase 4: Inventario, Fase 5: POS, Fase 6: Caja).
            </p>
          </div>
        )}
      </Shell>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
