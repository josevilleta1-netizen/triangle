import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  roles: Array<'ADMINISTRADOR' | 'CAJERO' | 'ALMACENISTA'>;
}

const NAV_ITEMS: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['ADMINISTRADOR', 'CAJERO', 'ALMACENISTA'] },
  { id: 'pos', label: 'Punto de Venta', icon: 'point_of_sale', shortcut: 'F2', roles: ['ADMINISTRADOR', 'CAJERO'] },
  { id: 'inventory', label: 'Inventario', icon: 'inventory_2', roles: ['ADMINISTRADOR', 'ALMACENISTA'] },
  { id: 'cash', label: 'Caja y Turnos', icon: 'payments', roles: ['ADMINISTRADOR', 'CAJERO'] },
  { id: 'purchases', label: 'Compras', icon: 'shopping_bag', roles: ['ADMINISTRADOR', 'ALMACENISTA'] },
  { id: 'reports', label: 'Reportes', icon: 'monitoring', roles: ['ADMINISTRADOR'] },
  { id: 'employees', label: 'Personal', icon: 'badge', roles: ['ADMINISTRADOR'] },
  { id: 'settings', label: 'Configuración', icon: 'settings', roles: ['ADMINISTRADOR'] },
];

export const Shell: React.FC<{
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}> = ({ currentView, onNavigate, children }) => {
  const { user, logout, lockTerminal } = useAuth();

  const accessibleNavItems = NAV_ITEMS.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  return (
    <div className="flex h-screen bg-canvas">
      {/* Sidebar Nórdico-Fintech */}
      <aside className="w-64 bg-surface-container-lowest shadow-cloud-ambient flex flex-col justify-between p-6 border-r border-surface-container/30">
        <div className="flex flex-col gap-6">
          {/* Logo y Marca */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center font-extrabold text-xl shadow-cloud-ambient">
              ▲
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface text-lg tracking-tight">TRIANGLE</span>
              <span className="text-xs text-on-surface-variant font-medium">ERP & POS</span>
            </div>
          </div>

          {/* Menú de Navegación Contextual por Rol */}
          <nav className="flex flex-col gap-1.5">
            {accessibleNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-full font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-bold shadow-md shadow-primary/20'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-primary/30 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sección de Usuario y Acciones de Seguridad */}
        <div className="flex flex-col gap-3">
          <div className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface leading-tight">{user?.fullName || user?.username}</span>
              <span className="text-[11px] text-primary font-semibold uppercase">{user?.roleName || user?.role}</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" title="Sesión activa"></span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={lockTerminal}
              className="py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition-all"
              title="Bloqueo Rápido por PIN (F10)"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Bloquear</span>
            </button>
            <button
              onClick={logout}
              className="py-2 px-3 rounded-xl bg-danger/10 hover:bg-danger/20 text-xs font-bold text-danger flex items-center justify-center gap-1.5 transition-all"
              title="Cerrar Sesión"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Superior */}
        <header className="h-16 px-8 bg-surface-container-lowest/60 backdrop-blur-md border-b border-surface-container/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Tienda de Barrio S.A.S. • NIT 901.482.109-2
            </span>
            <span className="text-xs text-on-surface-variant">•</span>
            <span className="text-xs font-bold text-on-surface">Sede Chapinero (Caja 01)</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs font-medium text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-success">wifi</span>
              <span>Conectado</span>
            </div>
            <button
              onClick={() => onNavigate('pos')}
              className="px-4 py-2 rounded-full bg-primary-container text-on-primary text-xs font-bold shadow-cloud-hover hover:bg-primary transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Cobro Rápido (F2)</span>
            </button>
          </div>
        </header>

        {/* Contenido Dinámico */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};
