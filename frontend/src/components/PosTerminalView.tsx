import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { Product } from '../types/catalog';
import { ThermalTicketModal, ThermalReceiptData } from './ThermalTicketModal';

interface CartItem {
  product: Product;
  quantity: number;
  discountRate: number;
}

interface Customer {
  id: string;
  fullName: string;
  documentNumber: string | null;
  creditLimit: number;
  currentDebt: number;
}

export const PosTerminalView: React.FC = () => {
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  // Liquidación Modal
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'EFECTIVO' | 'NEQUI' | 'DAVIPLATA' | 'TARJETA_DEBITO' | 'TARJETA_CREDITO' | 'CREDITO_FIADO'
  >('EFECTIVO');
  const [amountTendered, setAmountTendered] = useState<number>(0);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Ticket Térmico
  const [receiptData, setReceiptData] = useState<ThermalReceiptData | null>(null);

  useEffect(() => {
    if (!token) return;
    const loadInitialData = async () => {
      try {
        const [prods, custs] = await Promise.all([
          apiClient.get<Product[]>('/catalog/products', token),
          apiClient.get<Customer[]>('/pos/customers', token),
        ]);
        setProducts(prods);
        setCustomers(custs);
      } catch (err) {
        console.error(err);
      }
    };
    loadInitialData();
  }, [token]);

  // Atajos de Teclado Globales (F2: Cobrar, Esc: Cancelar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        if (cart.length > 0) {
          openCheckout();
        }
      } else if (e.key === 'Escape') {
        if (isCheckoutModalOpen) {
          setIsCheckoutModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, isCheckoutModalOpen]);

  const addToCart = (product: Product) => {
    if (product.stock.current <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock.current) return prev;
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { product, quantity: 1, discountRate: 0 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock.current;
          return { ...item, quantity: Math.min(qty, max) };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cálculos de Carrito
  const subtotalCart = cart.reduce((acc, item) => {
    const base = (item.product.salePrice * item.quantity) / (1 + item.product.taxRate / 100);
    return acc + base;
  }, 0);

  const totalCart = cart.reduce((acc, item) => {
    return acc + item.product.salePrice * item.quantity;
  }, 0);

  const taxTotalCart = totalCart - subtotalCart;

  const openCheckout = () => {
    setAmountTendered(totalCart);
    setCheckoutError(null);
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || cart.length === 0) return;

    try {
      setIsSubmitting(true);
      setCheckoutError(null);

      const payload = {
        customerId: selectedCustomerId || undefined,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          discountRate: item.discountRate,
        })),
        payments: [
          {
            paymentMethod,
            amount: totalCart,
            amountTendered: paymentMethod === 'EFECTIVO' ? amountTendered : totalCart,
          },
        ],
      };

      const result = await apiClient.post<any>('/pos/checkout', payload, token);

      const customerObj = customers.find((c) => c.id === selectedCustomerId);

      setReceiptData({
        businessName: 'Tienda de Barrio S.A.S.',
        nit: '901.482.109-2',
        branch: 'Sede Chapinero (Caja 01)',
        saleNumber: result.saleNumber,
        createdAt: result.createdAt,
        cashierName: user?.fullName || user?.username || 'Cajero',
        customerName: customerObj?.fullName,
        customerDoc: customerObj?.documentNumber || undefined,
        items: cart.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.salePrice,
          subtotal: item.product.salePrice * item.quantity,
          taxRate: item.product.taxRate,
        })),
        subtotal: result.subtotal,
        taxTotal: result.taxTotal,
        discountTotal: result.discountTotal,
        total: result.total,
        payments: [
          {
            method: paymentMethod,
            amount: totalCart,
            amountTendered,
            changeReturned: result.changeReturned,
          },
        ],
        changeReturned: result.changeReturned,
      });

      // Refrescar inventario y limpiar carrito
      clearCart();
      setIsCheckoutModalOpen(false);
      const updatedProds = await apiClient.get<Product[]>('/catalog/products', token);
      setProducts(updatedProds);
    } catch (err: any) {
      setCheckoutError(err.message || 'Error al completar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search)),
  );

  return (
    <div className="flex h-full gap-6 max-w-7xl mx-auto">
      {/* Columna Izquierda: Catálogo y Búsqueda Rápida */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Barra de Búsqueda Rápida / Código de Barras */}
        <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-cloud-ambient border border-surface-container/30 flex items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              barcode_scanner
            </span>
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Escanear código de barras o escribir nombre/SKU..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
            />
          </div>
          <span className="text-[11px] font-bold text-on-surface-variant px-2.5 py-1 rounded-full bg-surface-container-low">
            {filteredProducts.length} productos
          </span>
        </div>

        {/* Cuadrícula de Productos para Tocar / Clic */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3 pr-1">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock.current <= 0;
            return (
              <button
                key={p.id}
                disabled={isOutOfStock}
                onClick={() => addToCart(p)}
                className={`p-4 rounded-3xl bg-surface-container-lowest border border-surface-container/30 text-left flex flex-col justify-between transition-all hover:border-primary/50 shadow-cloud-ambient group active:scale-[0.98] ${
                  isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{p.category.icon || '🏷️'}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOutOfStock
                          ? 'bg-danger/10 text-danger'
                          : p.stock.status === 'LOW'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                      }`}
                    >
                      {p.stock.current} unds
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">SKU: {p.sku}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-surface-container flex items-baseline justify-between">
                  <span className="text-xs font-black text-on-surface">
                    $ {p.salePrice.toLocaleString('es-CO')}
                  </span>
                  <span className="text-[9px] text-on-surface-variant">IVA {p.taxRate}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Columna Derecha: Carrito de Cobro y Liquidación */}
      <div className="w-96 bg-surface-container-lowest rounded-3xl shadow-cloud-ambient border border-surface-container/30 flex flex-col justify-between overflow-hidden">
        {/* Cabecera Carrito */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">shopping_cart</span>
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Venta Actual ({cart.reduce((a, b) => a + b.quantity, 0)})
            </span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] font-bold text-danger hover:underline"
            >
              Vaciar
            </button>
          )}
        </div>

        {/* Selector de Cliente (Fiado / Consumidor Final) */}
        <div className="p-3 bg-surface-container-low border-b border-surface-container">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
            Cliente / Titular
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-surface-container border border-surface-container text-xs text-on-surface font-semibold focus:outline-none"
          >
            <option value="">Consumidor Final (Ocasional)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} {c.creditLimit > 0 && `(Cupo: $${c.creditLimit.toLocaleString('es-CO')})`}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de Items del Carrito */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-surface-container">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[36px] opacity-40 mb-2">add_shopping_cart</span>
              <p className="text-xs font-bold">Carrito vacío</p>
              <p className="text-[11px] opacity-75 mt-0.5">Escanea o haz clic en un producto</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold text-on-surface truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[10px] text-on-surface-variant">
                    ${item.product.salePrice.toLocaleString('es-CO')} c/u
                  </div>
                </div>

                {/* Control de Cantidad */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-extrabold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[65px]">
                  <div className="text-xs font-black text-on-surface">
                    ${(item.product.salePrice * item.quantity).toLocaleString('es-CO')}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[10px] text-danger hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen de Totales y Botón Cobrar (F2) */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container flex flex-col gap-2">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Subtotal (Base)</span>
            <span>${subtotalCart.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>IVA Estimado</span>
            <span>${taxTotalCart.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-surface-container">
            <span className="text-sm font-black text-on-surface uppercase">Total a Cobrar</span>
            <span className="text-2xl font-black text-primary">
              ${totalCart.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={openCheckout}
            className="w-full mt-2 py-4 rounded-full bg-primary-container text-on-primary font-black text-sm shadow-cloud-hover hover:bg-primary transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span>COBRAR (F2)</span>
          </button>
        </div>
      </div>

      {/* Modal de Liquidación / Pago */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-cloud-ambient p-6 border border-surface-container/30">
            <h2 className="text-lg font-extrabold text-on-surface">Liquidación de Venta</h2>
            <div className="my-3 p-4 rounded-2xl bg-primary/10 text-primary flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase">Total a Pagar</span>
              <span className="text-2xl font-black">${totalCart.toLocaleString('es-CO')}</span>
            </div>

            {checkoutError && (
              <div className="mb-4 p-3 rounded-xl bg-danger/10 text-danger text-xs font-semibold">
                {checkoutError}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'EFECTIVO', label: '💵 Efectivo' },
                      { id: 'NEQUI', label: '📱 Nequi' },
                      { id: 'DAVIPLATA', label: '📱 Daviplata' },
                      { id: 'TARJETA_DEBITO', label: '💳 Débito' },
                      { id: 'TARJETA_CREDITO', label: '💳 Crédito' },
                      { id: 'CREDITO_FIADO', label: '📝 Fiado' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === m.id
                          ? 'bg-primary text-on-primary border-primary shadow-sm'
                          : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'EFECTIVO' && (
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                    Monto Entregado por Cliente
                  </label>
                  <input
                    type="number"
                    min={totalCart}
                    required
                    value={amountTendered}
                    onChange={(e) => setAmountTendered(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container text-base text-on-surface font-extrabold focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <div className="mt-2 flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant">Cambio / Vueltas:</span>
                    <span className="text-base text-success font-black">
                      ${Math.max(0, amountTendered - totalCart).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'CREDITO_FIADO' && !selectedCustomerId && (
                <div className="p-3 rounded-xl bg-warning/10 text-warning text-xs font-bold">
                  ⚠️ Debes seleccionar un cliente registrado para autorizar el fiado.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar (Esc)
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (paymentMethod === 'EFECTIVO' && amountTendered < totalCart) ||
                    (paymentMethod === 'CREDITO_FIADO' && !selectedCustomerId)
                  }
                  className="px-6 py-3 rounded-full bg-primary-container text-on-primary text-xs font-black shadow-cloud-hover hover:bg-primary transition-all disabled:opacity-40"
                >
                  {isSubmitting ? 'Procesando...' : 'Completar Venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Ticket Térmico Tras Completar Venta */}
      {receiptData && (
        <ThermalTicketModal data={receiptData} onClose={() => setReceiptData(null)} />
      )}
    </div>
  );
};
