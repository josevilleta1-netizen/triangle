import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { Product, Category, InventoryAlerts } from '../types/catalog';

export const InventoryView: React.FC = () => {
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlerts | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showOnlyAlerts, setShowOnlyAlerts] = useState<boolean>(false);

  // Modal de ajuste
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'AJUSTE_CONTEO' | 'AJUSTE_MERMA_VENCIMIENTO'>('AJUSTE_CONTEO');
  const [adjustNotes, setAdjustNotes] = useState<string>('');
  const [adjustSubmitting, setAdjustSubmitting] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const canManage = user?.role === 'ADMINISTRADOR' || user?.role === 'ALMACENISTA';

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [prodsData, catsData, alertsData] = await Promise.all([
        apiClient.get<Product[]>('/catalog/products', token),
        apiClient.get<Category[]>('/catalog/categories', token),
        apiClient.get<InventoryAlerts>('/catalog/inventory/alerts', token),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setAlerts(alertsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct || !token) return;
    try {
      setAdjustSubmitting(true);
      setAdjustError(null);
      await apiClient.post(
        '/catalog/inventory/adjust',
        {
          productId: adjustModalProduct.id,
          quantity: Number(adjustQty),
          movementType: adjustType,
          notes: adjustNotes,
        },
        token,
      );
      setAdjustModalProduct(null);
      setAdjustQty(0);
      setAdjustNotes('');
      await loadData();
    } catch (err: any) {
      setAdjustError(err.message || 'Error al aplicar ajuste');
    } finally {
      setAdjustSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));

    const matchesCategory = selectedCategory ? p.category.id === selectedCategory : true;
    const matchesAlerts = showOnlyAlerts ? p.stock.status === 'LOW' || p.stock.status === 'OUT_OF_STOCK' : true;

    return matchesSearch && matchesCategory && matchesAlerts;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Encabezado y Métricas Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Control de Catálogo y Stock
          </span>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Inventario de Productos
          </h1>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Sede Chapinero • Gestión de lotes, semáforo de existencias y costos
          </p>
        </div>

        {/* Tarjetas de Alerta de Existencias y Vencimiento */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnlyAlerts(!showOnlyAlerts)}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all border ${
              showOnlyAlerts
                ? 'bg-danger text-white border-danger shadow-md shadow-danger/20'
                : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            <span>Alertas ({alerts?.expiringCount || 0} vencimientos, {alerts?.lowStockCount || 0} stock bajo)</span>
          </button>
        </div>
      </div>

      {/* Alerta Destacada de Lotes Críticos */}
      {alerts && alerts.expiringCount > 0 && (
        <div className="p-4 rounded-3xl bg-warning/10 border border-warning/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-warning text-[24px] mt-0.5">warning</span>
            <div>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Lotes con Vencimiento Crítico (≤ 7 días)
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {alerts.expiringBatches.map((b) => (
                  <span key={b.id} className="inline-block mr-3">
                    <strong>{b.productName}</strong> (Lote: {b.batchNumber}) — Vence en{' '}
                    <span className="text-danger font-bold">{b.daysRemaining} días</span> ({b.remainingQuantity} unds)
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Filtros, Búsqueda y Categorías */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-surface-container-lowest p-4 rounded-3xl shadow-cloud-ambient border border-surface-container/30">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, SKU o código de barras (EAN-13)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === ''
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Todas ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span>{cat.icon || '🏷️'}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Productos con Estilo Nórdico-Fintech */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-cloud-ambient border border-surface-container/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-on-surface-variant">
            Cargando catálogo en tiempo real...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">
            No se encontraron productos coincidentes con los filtros seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Producto</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Precio Costo</th>
                  <th className="py-3.5 px-4">Precio Venta</th>
                  <th className="py-3.5 px-4">IVA</th>
                  <th className="py-3.5 px-4 text-center">Stock Actual</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  {canManage && <th className="py-3.5 px-6 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredProducts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-on-surface text-sm">{p.name}</span>
                          <span className="text-[11px] text-on-surface-variant">
                            SKU: {p.sku} {p.barcode && `• Barcode: ${p.barcode}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-on-surface">
                        <span className="mr-1">{p.category.icon}</span>
                        {p.category.name}
                      </td>
                      <td className="py-4 px-4 font-medium text-on-surface-variant">
                        $ {p.costPrice.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-on-surface">
                        $ {p.salePrice.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-bold text-on-surface-variant">
                          {p.taxRate}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-sm text-on-surface">
                        {p.stock.current} <span className="text-[10px] font-normal text-on-surface-variant">{p.unitOfMeasure}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {p.stock.status === 'NORMAL' && (
                          <span className="px-2.5 py-1 rounded-full bg-success/10 text-success font-bold text-[11px] inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                            Normal
                          </span>
                        )}
                        {p.stock.status === 'LOW' && (
                          <span className="px-2.5 py-1 rounded-full bg-warning/10 text-warning font-bold text-[11px] inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                            Bajo Stock
                          </span>
                        )}
                        {p.stock.status === 'OUT_OF_STOCK' && (
                          <span className="px-2.5 py-1 rounded-full bg-danger/10 text-danger font-bold text-[11px] inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
                            Agotado
                          </span>
                        )}
                      </td>
                      {canManage && (
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => {
                              setAdjustModalProduct(p);
                              setAdjustQty(0);
                              setAdjustError(null);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface transition-all inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">tune</span>
                            <span>Ajustar</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Ajuste de Stock */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-cloud-ambient p-6 border border-surface-container/30">
            <h2 className="text-lg font-extrabold text-on-surface">Ajuste Manual de Inventario</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Producto: <strong className="text-on-surface">{adjustModalProduct.name}</strong>
            </p>
            <p className="text-[11px] text-primary font-bold mt-1">
              Stock actual registrado: {adjustModalProduct.stock.current} {adjustModalProduct.unitOfMeasure}
            </p>

            {adjustError && (
              <div className="mt-4 p-3 rounded-xl bg-danger/10 text-danger text-xs font-semibold">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Tipo de Ajuste
                </label>
                <select
                  value={adjustType}
                  onChange={(e: any) => setAdjustType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="AJUSTE_CONTEO">Ajuste por Conteo Físico (+/-)</option>
                  <option value="AJUSTE_MERMA_VENCIMIENTO">Merma / Producto Vencido / Avería (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Cantidad a Ajustar (Valor positivo suma, negativo resta)
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseFloat(e.target.value) || 0)}
                  placeholder="ej. -2 o 5"
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                />
                <span className="text-[10px] text-on-surface-variant mt-1 block">
                  Nuevo stock proyectado:{' '}
                  <strong>{adjustModalProduct.stock.current + Number(adjustQty)}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Motivo / Observación
                </label>
                <textarea
                  rows={2}
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="ej. Merma por empaque roto en góndola..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={adjustSubmitting || adjustQty === 0}
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary text-xs font-bold shadow-cloud-hover hover:bg-primary transition-all disabled:opacity-40"
                >
                  {adjustSubmitting ? 'Guardando...' : 'Confirmar Ajuste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
