import { useState, useEffect } from 'react';

export default function App() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ status: 'STANDALONE', system: 'TRIANGLE ERP / POS' }));
  }, []);

  return (
    <div className="flex h-screen bg-canvas">
      {/* Sidebar de navegación nórdico-fintech */}
      <aside className="w-64 bg-surface-container-lowest shadow-cloud-ambient flex flex-col justify-between p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center font-extrabold text-xl shadow-cloud-ambient">
              ▲
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface text-lg tracking-tight">TRIANGLE</span>
              <span className="text-xs text-on-surface-variant font-medium">ERP & POS</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <button className="flex items-center gap-3 px-4 py-3 rounded-full bg-primary-container text-on-primary font-bold shadow-md shadow-primary/20 transition-all">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Dashboard</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-low font-semibold transition-all">
              <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
              <span>Punto de Venta</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-low font-semibold transition-all">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span>Inventario</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-low font-semibold transition-all">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              <span>Alertas</span>
            </button>
          </nav>
        </div>

        <div className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Sede Chapinero</span>
            <span className="text-[11px] text-on-surface-variant">Bogotá D.C.</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
        </div>
      </aside>

      {/* Área Principal de Contenido */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex items-center justify-between pb-6 border-b border-surface-container">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Tienda de Barrio S.A.S. • NIT 901.482.109-2</span>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mt-1">Panel de Control General</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-bold shadow-cloud-hover hover:bg-primary transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span>Nueva Venta (F2)</span>
            </button>
          </div>
        </header>

        {/* Tarjetas KPI Superiores */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-cloud-ambient flex flex-col justify-between">
            <span className="text-sm font-medium text-on-surface-variant">Estado del Sistema</span>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-on-surface">{health?.status || 'ONLINE'}</span>
              <p className="text-xs text-on-surface-variant mt-1">{health?.system || 'TRIANGLE ERP / POS'}</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-cloud-ambient flex flex-col justify-between">
            <span className="text-sm font-medium text-on-surface-variant">Arquitectura</span>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-primary">Monolito Modular</span>
              <p className="text-xs text-on-surface-variant mt-1">Clean Architecture & PostgreSQL 18</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-cloud-ambient flex flex-col justify-between">
            <span className="text-sm font-medium text-on-surface-variant">Versión Actual</span>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-on-surface">v0.1.0-alpha.1</span>
              <p className="text-xs text-success font-semibold mt-1">Fase 1: Fundamentos y Configuración</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
