# CHARTER DEL PROYECTO — TRIANGLE ERP / POS
## SISTEMA INTEGRAL DE GESTIÓN EMPRESARIAL PARA TIENDA DE BARRIO S.A.S.

**Versión:** 1.0.0  
**Fecha:** 21 de Noviembre de 2026  
**Ubicación de Referencia:** Bogotá, Colombia  
**Estado:** `FASE 0 — UNDER_REVIEW`  

---

## 1. CONTEXTO EMPRESARIAL Y PROPÓSITO DEL NEGOCIO

### 1.1. Identificación
- **Nombre del Producto:** TRIANGLE
- **Tipo de Aplicativo:** ERP / POS (Enterprise Resource Planning & Point of Sale)
- **Organización:** Tienda de Barrio S.A.S.
- **Sede de Referencia:** Sede Chapinero, Bogotá D.C., Colombia
- **NIT:** 901.482.109-2

### 1.2. El Desafío del Negocio
Las tiendas de barrio en Colombia constituyen el motor del comercio minorista cotidiano, pero enfrentan problemas críticos que comprometen su rentabilidad y supervivencia:
- **Pérdida por vencimiento de productos:** Falta de trazabilidad en fechas de caducidad de lácteos, embutidos y pasabocas.
- **Descuadres constantes de dinero:** Inexistencia de arqueos formales y mezcla de ingresos por ventas con gastos de bolsillo.
- **Falta de visibilidad del inventario:** Desconocimiento de existencias reales, quiebres de stock en horas pico y ventas a ciegas.
- **Lentitud en el mostrador:** Colas y fricción en la atención al cliente por sistemas toscos o procesos manuales.
- **Descontrol en "el fiado":** Cuentas por cobrar en cuadernos informales con alto índice de cartera incobrable.

**TRIANGLE** nace como una plataforma integral que profesionaliza y digitaliza todas las operaciones de la tienda de barrio, conservando su cercanía humana pero incorporando la agilidad y el rigor de la tecnología fintech contemporánea.

---

## 2. OBJETIVOS DEL PROYECTO

### 2.1. Objetivo General
Construir una aplicación web robusta, modular, segura y altamente intuitiva que centralice los procesos de ventas en mostrador (POS), control de inventarios por lotes y vencimientos, apertura y cierre de caja con arqueo ciego, compras a distribuidores, gestión de colaboradores y reportes analíticos para Tienda de Barrio S.A.S.

### 2.2. Objetivos Específicos
1. **Velocidad de Mostrador:** Garantizar la confirmación de venta y emisión de comprobante térmico en **menos de 3 segundos**.
2. **Cero Sobreventas:** Implementar transacciones ACID en PostgreSQL con bloqueo pesimista a nivel de fila (`SELECT ... FOR UPDATE`).
3. **Control Ciego de Caja:** Impedir que el cajero conozca el saldo teórico esperado durante el arqueo de cierre, asegurando transparencia contable.
4. **Semáforo Preventivo de Vencimientos:** Alertar sobre productos próximos a caducar con 15, 7 y 3 días de anticipación y generar etiquetas térmicas de remate preventivo (-30%, -50%).
5. **Experiencia de Usuario Nórdica-Fintech:** Proporcionar una interfaz limpia basada en Tailwind CSS, Inter font y tarjetas flotantes con sombras de nube (*ambient cloud shadows*).

---

## 3. ALCANCE DEL PRODUCTO

### 3.1. Módulos Incluidos en el Alcance (In Scope)
1. Autenticación, control de sesiones y autorización RBAC (Administrador, Cajero, Almacenista) con PIN de mostrador.
2. Catálogo de productos, categorías colombianas, unidades de medida y estantería.
3. Control de existencias, kárdex auditable y trazabilidad de movimientos.
4. Lotes, fechas de vencimiento, alertas de stock mínimo y semáforo de caducidad.
5. Punto de Venta (POS) con Omnibox (búsqueda y código de barras), atajos `F2`, `F10`, `ESC`, calculadora rápida de cambio y emisión de tirilla térmica de 80 mm.
6. Control de sesiones de caja, arqueo ciego por denominaciones y conciliación de diferencias (sobrante/faltante).
7. Flujo financiero (ingresos, egresos menores, pago de servicios públicos de la tienda).
8. Gestión de proveedores y compras con radicación de facturas y asignación de lotes.
9. Gestión de colaboradores y programación semanal de turnos.
10. Radicación y seguimiento de PQRS desde mostrador.
11. Dashboard analítico con KPIs, Top Pareto de productos y reportes exportables.
12. Bitácora inmutable de auditoría para todas las acciones sensibles.

### 3.2. Fuera del Alcance Inmediato (Out of Scope / Fases Futuras)
- Transmisión directa a la DIAN mediante firma digital PKCS#12 (se deja la arquitectura desacoplada mediante un adaptador `IInvoiceProvider` listo para integración comercial con Proveedor Tecnológico Autorizado).
- Integración directa por hardware de datáfonos de franquicias bancarias (se registra el voucher o código de aprobación como medio de pago electrónico).

---

## 4. RESUMEN DEL STACK TECNOLÓGICO Y ESTRUCTURA DEL PROYECTO

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, Material Symbols Outlined, Inter Font.
- **Backend:** Node.js LTS, NestJS, TypeScript, class-validator, DTOs, Architecture por capas.
- **Base de Datos:** PostgreSQL 18.6 nativo, Prisma ORM + scripts SQL canónicos (`schema.sql`, `seed.sql`, `init.sql`).
- **Control de Calidad:** Vitest / Jest, Supertest, Playwright (E2E), ESLint, Prettier.
- **Versionamiento:** Semantic Versioning 2.0.0 + Conventional Commits vinculados a Historias de Usuario (`feat(US-POS-01): ...`).

### 4.1. Estructura Canónica de Directorios

```text
triangle/
├── AGENTS.md                  # Protocolo de colaboración multiagente
├── DESIGN.md                  # Sistema visual nórdico-fintech
├── PLANNING.md                # Plan maestro fase por fase
├── PROJECT.md                 # Charter y alcance del proyecto
├── README.md                  # Manual de instalación e inicio
├── CHANGELOG.md               # Historial de cambios SemVer
├── VERSION                    # Versión actual del proyecto (SemVer)
├── .env.example               # Plantilla de variables de entorno
├── .gitignore                 # Exclusiones de control de versiones
│
├── frontend/                  # Aplicación SPA React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # Componentes UI (Cards, Inputs, Pills, ThermalTicket)
│   │   ├── modules/           # Módulos (pos, inventory, cash, reports, auth)
│   │   ├── hooks/             # Custom hooks (useKeyboardShortcuts, useBarcodeScanner)
│   │   ├── services/          # Clientes API REST tipados
│   │   └── types/             # Interfaces TypeScript compartidas
│   └── public/
│
├── backend/                   # API REST Monolito Modular en NestJS
│   ├── src/
│   │   ├── common/            # Decoradores, Guards RBAC, Filtros de Excepción
│   │   ├── modules/           # auth, catalog, inventory, pos, cash, purchases, reports, audit
│   │   ├── database/          # Prisma Service y repositorios
│   │   └── main.ts            # Punto de entrada de la aplicación
│   └── test/                  # Pruebas unitarias y de integración (Supertest)
│
├── database/                  # Fuente de verdad relacional en PostgreSQL
│   ├── schema.sql             # Estructura DDL completa
│   ├── seed.sql               # Datos iniciales e idempotentes
│   ├── init.sql               # Orquestación de inicialización desde cero
│   ├── migrations/            # Migraciones versionadas de Prisma
│   └── README.md              # Documentación de gestión de base de datos
│
├── docs/                      # Suite de documentación de ingeniería
│   ├── ANALISIS_INICIAL.md    # Inventario y diagnóstico de recursos
│   ├── REQUIREMENTS.md        # Especificación de requisitos y User Stories
│   ├── ARCHITECTURE.md        # Diagramas C4, Clean Architecture y concurrencia
│   ├── DATABASE.md            # Modelo relacional, ERD e índices
│   ├── DECISIONS/             # Architectural Decision Records (ADRs)
│   └── PHASES/                # Informes formales de cada fase
│
└── extracted_resources/       # Recursos extraídos para análisis técnico
```

---

## 5. ESTADO ACTUAL DEL PROYECTO

El proyecto se encuentra formalmente en la **FASE 0 — ANÁLISIS Y PLANIFICACIÓN** en estado `UNDER_REVIEW`.  
Todo el análisis de los recursos del ZIP, el diagnóstico del entorno local de Windows, la extracción de requisitos, el modelado arquitectónico y el diseño de la base de datos han sido completados con total rigor.

**Siguiente paso:** Presentar el informe formal al usuario y solicitar su aprobación explícita antes de iniciar la Fase 1.
