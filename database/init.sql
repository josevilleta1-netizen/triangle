-- ============================================================================
-- PROYECTO TRIANGLE — ERP / POS PARA TIENDA DE BARRIO S.A.S.
-- SCRIPT ORQUESTADOR DE INICIALIZACIÓN DE BASE DE DATOS
-- ============================================================================
-- Uso:
--   psql -U postgres -h localhost -p 5432 -d triangle_db -f database/init.sql
--
-- Este script ejecuta en orden:
--   1. schema.sql  — DDL (tablas, restricciones, índices)
--   2. seed.sql    — Datos iniciales (roles, permisos, usuarios demo, catálogo)
--
-- Es idempotente: puede re-ejecutarse sin errores gracias a IF NOT EXISTS
-- y ON CONFLICT en las sentencias seed.
-- ============================================================================

\echo '============================================================'
\echo ' TRIANGLE — Inicialización de Base de Datos'
\echo ' Versión del esquema: 1.0.0'
\echo '============================================================'

\echo ''
\echo '>>> [1/2] Ejecutando schema.sql (DDL) ...'
\i schema.sql
\echo '    ✓ Esquema creado exitosamente.'

\echo ''
\echo '>>> [2/2] Ejecutando seed.sql (Datos iniciales) ...'
\i seed.sql
\echo '    ✓ Datos iniciales insertados exitosamente.'

\echo ''
\echo '============================================================'
\echo ' ✓ TRIANGLE — Base de datos inicializada correctamente'
\echo '============================================================'
