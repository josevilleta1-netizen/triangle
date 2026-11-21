# ADR-005: Estrategia de Ramas y Commits basada en Historias de Usuario
## Architectural Decision Record

**Estado:** Aprobado internamente por Software Architect / DevOps Engineer  
**Fecha:** 21 de Noviembre de 2026  
**Contexto:**  
El usuario especificó como directriz obligatoria: *"commits y pushes basados en las historias de usuario, al igual que las ramas"*. Se requiere formalizar el estándar de versionamiento y control de ramas para todo el equipo multiagente.

**Decisión:**  
1. **Nomenclatura de Ramas:**
   - Funcionalidades: `feat/US-{ID}-{slug}` (ejemplo: `feat/US-POS-01-omnibox-checkout`).
   - Correcciones: `fix/US-{ID}-{slug}` (ejemplo: `fix/US-INV-02-prevent-negative-stock`).
   - Pruebas: `test/US-{ID}-{slug}`.
   - Documentación: `docs/US-{ID}-{slug}`.
2. **Nomenclatura de Commits:**
   - Estándar Conventional Commits incluyendo el ID de la Historia de Usuario como ámbito (scope):
     - `feat(US-POS-01): implement barcode scan debouncing and fast cart addition`
     - `fix(US-INV-01): forbid negative stock via database CHECK constraint`
     - `test(US-CASH-02): add unit tests for blind cash discrepancy calculation`
3. **Flujo de Integración:**
   - Cada tarea se desarrolla en su rama dedicada.
   - El Orchestrator revisa compilación, pruebas y cobertura antes de fusionar a la rama principal (`main` o `develop`).
