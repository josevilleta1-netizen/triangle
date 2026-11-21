# ADR-004: Tratamiento de Facturación Electrónica DIAN vs. Tirilla Térmica POS
## Architectural Decision Record

**Estado:** Aprobado internamente por Software Architect / Tech Lead  
**Fecha:** 21 de Noviembre de 2026  
**Contexto:**  
En Colombia, la emisión de Factura Electrónica de Venta regulada por la DIAN (Resolución 000165 y Anexo Técnico 1.9) exige conexión web service SOAP, generación de XML UBL 2.1, cálculo de CUFE, código QR y firma digital con certificado electrónico comercial emitido por entidad de certificación cerrada (ONAC). Sin embargo, una tienda de barrio opera con comprobantes internos de mostrador y tirillas de caja registradora tipo POS para ventas de bajo monto.

**Decisión:**  
1. No equiparar falsamente una tirilla térmica local con una Factura Electrónica DIAN válida.
2. Implementar un comprobante de venta POS interno estándar y completo (con NIT 901.482.109-2, consecutivo de control, IVA discriminado 0%, 5%, 19% e información de la tienda).
3. Diseñar la capa de facturación mediante un patrón adaptador (`IInvoiceProvider`), permitiendo conectar un Proveedor Tecnológico Autorizado (PTA) oficial en fases posteriores mediante configuración en `system_settings` sin reescribir la lógica del POS.
