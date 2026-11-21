import React, { useRef } from 'react';

export interface ThermalReceiptData {
  businessName: string;
  nit: string;
  branch: string;
  saleNumber: string;
  createdAt: string;
  cashierName: string;
  customerName?: string;
  customerDoc?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    taxRate: number;
  }>;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  payments: Array<{
    method: string;
    amount: number;
    amountTendered?: number;
    changeReturned?: number;
  }>;
  changeReturned: number;
}

export const ThermalTicketModal: React.FC<{
  data: ThermalReceiptData;
  onClose: () => void;
}> = ({ data, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl shadow-cloud-ambient p-6 border border-surface-container/30 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            <span className="text-xs font-bold text-on-surface uppercase">Comprobante POS (80mm)</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Formato de Ticket Térmico 80mm */}
        <div className="overflow-y-auto py-4 my-2">
          <div
            ref={receiptRef}
            className="bg-white text-black p-4 font-mono text-[11px] leading-tight shadow-inner rounded-xl border border-gray-200"
            style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}
          >
            {/* Cabecera */}
            <div className="text-center pb-2 border-b border-dashed border-gray-400">
              <div className="font-extrabold text-xs tracking-wider">{data.businessName}</div>
              <div>NIT: {data.nit}</div>
              <div>{data.branch}</div>
              <div>Bogotá, Colombia</div>
              <div className="text-[10px] mt-1 text-gray-600">SISTEMA POS NO DIAN</div>
            </div>

            {/* Metadatos */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px]">
              <div>Factura POS: <strong>{data.saleNumber}</strong></div>
              <div>Fecha: {new Date(data.createdAt).toLocaleString('es-CO')}</div>
              <div>Cajero: {data.cashierName}</div>
              {data.customerName && <div>Cliente: {data.customerName}</div>}
              {data.customerDoc && <div>C.C./NIT: {data.customerDoc}</div>}
            </div>

            {/* Items */}
            <div className="py-2 border-b border-dashed border-gray-400">
              <div className="flex justify-between font-bold pb-1 text-[10px]">
                <span>CANT / ARTÍCULO</span>
                <span>TOTAL</span>
              </div>
              {data.items.map((item, idx) => (
                <div key={idx} className="py-0.5">
                  <div className="truncate">{item.name}</div>
                  <div className="flex justify-between text-gray-700 text-[10px]">
                    <span>
                      {item.quantity} x ${item.unitPrice.toLocaleString('es-CO')} (IVA {item.taxRate}%)
                    </span>
                    <span>${item.subtotal.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px]">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>${data.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA:</span>
                <span>${data.taxTotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
              </div>
              {data.discountTotal > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>DESCUENTO:</span>
                  <span>-${data.discountTotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-gray-300 mt-1">
                <span>TOTAL A PAGAR:</span>
                <span>${data.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Pagos */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px]">
              {data.payments.map((p, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>MEDIO: {p.method}</span>
                  <span>${p.amount.toLocaleString('es-CO')}</span>
                </div>
              ))}
              {data.changeReturned > 0 && (
                <div className="flex justify-between font-bold pt-1">
                  <span>CAMBIO / CAMBIO ENTREGADO:</span>
                  <span>${data.changeReturned.toLocaleString('es-CO')}</span>
                </div>
              )}
            </div>

            {/* Pie de Ticket */}
            <div className="text-center pt-3 text-[9px] text-gray-500">
              <div>¡Gracias por apoyar el comercio de tu barrio!</div>
              <div>Conserve este comprobante para cualquier reclamo</div>
              <div className="font-bold mt-1 text-black">TRIANGLE ERP / POS v0.1.0</div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-2 border-t border-surface-container">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-full bg-primary-container text-on-primary text-xs font-bold shadow-cloud-hover hover:bg-primary transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimir Ticket</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
