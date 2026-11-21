# CHANGELOG — TRIANGLE ERP / POS

Todas las modificaciones notables a este proyecto serán documentadas en este archivo según los lineamientos de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y [Semantic Versioning 2.0.0](https://semver.org/lang/es/).

Las modificaciones están indexadas por Historias de Usuario (`US-XXX`).

---

## [0.1.0-alpha.1] - 2026-11-21

### Añadido (FASE 0 — ANÁLISIS Y PLANIFICACIÓN)
- **docs:** Diagnóstico exhaustivo inicial de archivos y entorno técnico en `docs/ANALISIS_INICIAL.md`.
- **docs:** Catálogo unificado de requisitos y matriz de Historias de Usuario en `docs/REQUIREMENTS.md`.
- **docs:** Arquitectura Monolito Modular, C4 y flujo transaccional ACID (< 3s) en `docs/ARCHITECTURE.md`.
- **docs:** Especificación del modelo relacional en PostgreSQL 18 con 24 tablas en `docs/DATABASE.md`.
- **docs:** Protocolo de colaboración multiagente y gobernanza en `AGENTS.md`.
- **docs:** Sistema de diseño visual nórdico-fintech en `DESIGN.md`.
- **docs:** Plan maestro de ingeniería fase por fase en `PLANNING.md`.
- **docs:** Charter del proyecto y alcance del negocio en `PROJECT.md`.
- **docs(ADR):** Registros de decisiones arquitectónicas `docs/DECISIONS/ADR-001` a `ADR-005`.
- **docs:** Informe formal de cierre de fase en `docs/PHASES/PHASE_00_REPORT.md`.

### Añadido (FASE 1 — FUNDAMENTOS Y CONFIGURACIÓN)
- **infra:** Configuración base del monorepo, variables de entorno (`.env.example`), `.gitignore`, `VERSION` y `CHANGELOG.md`.
