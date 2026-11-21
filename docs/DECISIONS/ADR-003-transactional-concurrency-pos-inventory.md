# ADR-003: Control de Concurrencia Transaccional en POS e Inventario
## Architectural Decision Record

**Estado:** Aprobado internamente por Software Architect / Database Engineer  
**Fecha:** 21 de Noviembre de 2026  
**Contexto:**  
En horas pico de atención en la tienda, dos terminales o transacciones en rápida sucesión podrían intentar vender la última unidad de un producto al mismo tiempo, lo que generaría quiebres de inventario o stock negativo si no existe un control de concurrencia riguroso.

**Decisión:**  
Implementar **bloqueo pesimista a nivel de fila (`SELECT ... FOR UPDATE`)** dentro de la transacción de base de datos en PostgreSQL al momento de confirmar el checkout en `PosService`.  
Adicionalmente, se establece una restricción inmutable a nivel de motor:
`ALTER TABLE stocks ADD CONSTRAINT chk_stock_non_negative CHECK (current_stock >= 0);`

**Consecuencias:**  
- Se garantiza el 100% de coherencia física: es matemáticamente imposible que el sistema venda más unidades de las disponibles.
- Si dos peticiones compiten por el mismo ítem, la segunda espera milisegundos a que la primera libere el bloqueo; si el stock se agotó, la segunda transacción falla de inmediato con una excepción tipada `InsufficientStockException (400 Bad Request)` sin comprometer la integridad de la base de datos.
