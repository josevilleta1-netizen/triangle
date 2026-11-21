# ADR-001: Adopción de Arquitectura Monolito Modular
## Architectural Decision Record

**Estado:** Aprobado internamente por Software Architect / Tech Lead  
**Fecha:** 21 de Noviembre de 2026  
**Contexto:**  
TRIANGLE es un sistema ERP / POS diseñado para centralizar inventarios, ventas de mostrador, control de caja y administración para Tienda de Barrio S.A.S. en Bogotá, Colombia. Se requería decidir entre un monolito tradicional, microservicios distribuidos o un monolito modular con Clean Architecture.

**Decisión:**  
Adoptar una arquitectura de **Monolito Modular** organizado por dominios de negocio (Auth, Catalog, Inventory, POS, Cash, Purchases, Reports, Audit) con separación estricta en capas (Dominio, Aplicación, Infraestructura, Presentación).

**Consecuencias Positivas:**  
1. Permite transacciones ACID nativas a nivel de base de datos relacional para el flujo crítico de venta en mostrador (venta + detalle + pago + descuento de stock + movimiento de caja en una sola transacción).
2. Elimina la sobrecarga operativa, latencia de red y costos de despliegue de múltiples contenedores de microservicios.
3. Conserva límites limpios entre módulos que permiten una eventual extracción a microservicios a futuro si el negocio crece.

**Consecuencias Negativas / Retos:**  
Requiere disciplina de equipo para evitar el acoplamiento directo entre módulos sin pasar por servicios de aplicación o contratos explícitos.
