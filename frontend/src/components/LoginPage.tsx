import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(usernameOrEmail, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: 'admin' | 'cajero' | 'almacen') => {
    if (role === 'admin') {
      setUsernameOrEmail('admin@triangle.com');
      setPassword('Admin123*');
    } else if (role === 'cajero') {
      setUsernameOrEmail('cajero@triangle.com');
      setPassword('Admin123*');
    } else {
      setUsernameOrEmail('almacen@triangle.com');
      setPassword('Admin123*');
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-cloud-ambient p-8 border border-surface-container/30">
        {/* Encabezado con Identidad Visual Nordic-Fintech */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-3xl bg-primary-container text-on-primary flex items-center justify-center font-extrabold text-3xl shadow-cloud-ambient mb-3">
            ▲
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">TRIANGLE</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">Sistema ERP / POS para Tienda de Barrio</p>
          <span className="text-[11px] text-primary font-semibold mt-1 bg-primary/10 px-2.5 py-0.5 rounded-full">
            Sede Chapinero • Bogotá
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Usuario o Correo
            </label>
            <input
              type="text"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="ej. admin@triangle.com"
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-6 rounded-full bg-primary-container text-on-primary font-bold shadow-cloud-hover hover:bg-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Cuentas de Acceso Rápido Demo */}
        <div className="mt-8 pt-6 border-t border-surface-container">
          <p className="text-xs text-center font-bold text-on-surface-variant mb-3">Acceso Rápido de Prueba (Demo)</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="px-2 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-all text-center"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('cajero')}
              className="px-2 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-all text-center"
            >
              🏷️ Cajero
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('almacen')}
              className="px-2 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-all text-center"
            >
              📦 Bodega
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
