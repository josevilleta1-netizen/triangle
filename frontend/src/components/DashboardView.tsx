import React from 'react';
import { useAuth } from '../context/AuthContext';

export const DashboardView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Resumen Operativo en Tiempo Real
        </span>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mt-1">
          ¡Hola, {user?.fullName || user?.username}!
        </h1>
        <p className="text-xs text-on-surface-variant font-medium mt-0.5">
          Rol activo: <span className="font-bold text-on-surface">{user?.roleName || user?.role}</span>
        </p>
      </div>

      {/* KPI Cards Nórdico-Fintech */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-cloud-ambient flex flex-col justify-between border border-surface-container/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Ventas del Día</span>
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-on-surface tracking-tight">$ 0.00</span>
            <p className="text-[11px] text-on-surface-variant mt-1">0 transacciones registradas</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-cloud-ambient flex flex-col justify-between border border-surface-container/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Estado de Caja</span>
            <span className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xl font-extrabold text-warning">Turno Cerrado</span>
            <p className="text-[11px] text-on-surface-variant mt-1">Requiere apertura de caja</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-cloud-ambient flex flex-col justify-between border border-surface-container/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Alertas Inventario</span>
            <span className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-danger tracking-tight">1</span>
            <p className="text-[11px] text-on-surface-variant mt-1">Lote próximo a vencer (3 días)</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-cloud-ambient flex flex-col justify-between border border-surface-container/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Crédito Fiado Activo</span>
            <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-on-surface tracking-tight">$ 35,000.00</span>
            <p className="text-[11px] text-on-surface-variant mt-1">2 clientes con saldo pendiente</p>
          </div>
        </div>
      </section>

      {/* Accesos Rápidos de Flujo de Trabajo */}
      <section className="bg-surface-container-lowest p-6 rounded-3xl shadow-cloud-ambient border border-surface-container/30">
        <h2 className="text-sm font-bold text-on-surface mb-4">Accesos Rápidos Operativos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('pos')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container flex flex-col gap-2 text-left transition-all group"
          >
            <span className="material-symbols-outlined text-[24px] text-primary group-hover:scale-110 transition-transform">
              point_of_sale
            </span>
            <span className="text-xs font-bold text-on-surface">Punto de Venta (F2)</span>
            <span className="text-[10px] text-on-surface-variant">Atención al cliente y facturación</span>
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container flex flex-col gap-2 text-left transition-all group"
          >
            <span className="material-symbols-outlined text-[24px] text-primary group-hover:scale-110 transition-transform">
              inventory_2
            </span>
            <span className="text-xs font-bold text-on-surface">Catálogo de Productos</span>
            <span className="text-[10px] text-on-surface-variant">Control de stock y vencimientos</span>
          </button>

          <button
            onClick={() => onNavigate('cash')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container flex flex-col gap-2 text-left transition-all group"
          >
            <span className="material-symbols-outlined text-[24px] text-primary group-hover:scale-110 transition-transform">
              payments
            </span>
            <span className="text-xs font-bold text-on-surface">Apertura / Cierre de Caja</span>
            <span className="text-[10px] text-on-surface-variant">Arqueo ciego y turnos</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container flex flex-col gap-2 text-left transition-all group"
          >
            <span className="material-symbols-outlined text-[24px] text-primary group-hover:scale-110 transition-transform">
              monitoring
            </span>
            <span className="text-xs font-bold text-on-surface">Reportes Financieros</span>
            <span className="text-[10px] text-on-surface-variant">Ventas, ganancias y márgenes</span>
          </button>
        </div>
      </section>
    </div>
  );
};
