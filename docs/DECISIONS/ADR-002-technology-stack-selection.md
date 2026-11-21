# ADR-002: Selección del Stack Tecnológico Principal
## Architectural Decision Record

**Estado:** Aprobado internamente por Software Architect / Tech Lead  
**Fecha:** 21 de Noviembre de 2026  
**Contexto:**  
Se evaluaron diferentes combinaciones tecnológicas teniendo en cuenta el entorno del host (Windows con PostgreSQL 18.6 nativo ya instalado), los requisitos de alto rendimiento en el mostrador (SLA < 3 segundos) y el sistema visual nórdico-fintech extraído del ZIP.

**Decisión:**  
Seleccionar el siguiente stack tecnológico canónico:
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query + Material Symbols / Lucide Icons.
- **Backend:** Node.js LTS + NestJS + TypeScript + DTOs con `class-validator` y `class-transformer`.
- **Base de Datos:** PostgreSQL 18.6 nativo con Prisma ORM para migraciones tipadas y consultas de alto rendimiento, manteniendo sincronizados los scripts SQL canónicos (`database/schema.sql`, `database/seed.sql`, `database/init.sql`).
- **Pruebas:** Vitest / Jest para pruebas unitarias de cálculo, Supertest para integración de endpoints y Playwright para flujos E2E de mostrador.

**Justificación:**  
- NestJS provee una arquitectura modular empresarial robusta con inyección de dependencias y soporte nativo para modularidad DDD.
- React + Vite garantiza compilación instantánea y una interfaz de mostrador ultra veloz sin recargas.
- PostgreSQL 18.6 ofrece rendimiento transaccional superior y aislamiento ACID fiable para operaciones comerciales.
