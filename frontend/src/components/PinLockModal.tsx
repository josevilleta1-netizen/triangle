import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const PinLockModal: React.FC = () => {
  const { user, unlockWithPin, logout } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleUnlock = async () => {
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 dígitos');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await unlockWithPin(pin);
    } catch (err: any) {
      setError(err.message || 'PIN incorrecto');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl shadow-cloud-ambient p-8 flex flex-col items-center border border-surface-container/30">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[28px]">lock</span>
        </div>
        <h2 className="text-xl font-extrabold text-on-surface">Terminal Bloqueada</h2>
        <p className="text-xs text-on-surface-variant text-center mt-1">
          Operador: <span className="font-bold text-on-surface">{user?.fullName || user?.username}</span>
        </p>
        <p className="text-[11px] text-on-surface-variant mb-6">Ingresa tu PIN de 4 dígitos para continuar</p>

        {error && (
          <div className="w-full mb-4 p-2.5 rounded-xl bg-danger/10 text-danger text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Indicadores de PIN */}
        <div className="flex gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                pin.length > idx ? 'bg-primary scale-110' : 'bg-surface-container'
              }`}
            />
          ))}
        </div>

        {/* Teclado numérico táctil / POS */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleNumberClick(digit)}
              className="h-14 rounded-2xl bg-surface-container-low hover:bg-surface-container text-xl font-bold text-on-surface transition-all active:scale-95 flex items-center justify-center shadow-sm"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface-variant transition-all active:scale-95 flex items-center justify-center"
          >
            C
          </button>
          <button
            type="button"
            onClick={() => handleNumberClick('0')}
            className="h-14 rounded-2xl bg-surface-container-low hover:bg-surface-container text-xl font-bold text-on-surface transition-all active:scale-95 flex items-center justify-center shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-all active:scale-95 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">backspace</span>
          </button>
        </div>

        <button
          type="button"
          disabled={loading || pin.length < 4}
          onClick={handleUnlock}
          className="w-full py-3.5 rounded-full bg-primary-container text-on-primary font-bold shadow-cloud-hover hover:bg-primary transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">lock_open</span>
              <span>Desbloquear Terminal</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={logout}
          className="mt-3 text-xs text-on-surface-variant hover:text-danger font-semibold transition-all"
        >
          Cerrar Sesión Completa
        </button>
      </div>
    </div>
  );
};
