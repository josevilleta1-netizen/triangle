# ARQUITECTURA TECNICA DEL SISTEMA — TRIANGLE
## MONOLITO MODULAR, CLEAN ARCHITECTURE Y ALTA CONCURRENCIA

**Versión:** 1.0.0-draft  
**Fase:** FASE 0 — ANÁLISIS Y PLANIFICACIÓN  
**Estado:** `UNDER_REVIEW`  
**Autor:** Software Architect & Technical Lead  

---

## 1. VISION ARQUITECTÓNICA Y PRINCIPIOS DE DISEÑO

El sistema **TRIANGLE** está concebido como un **Monolito Modular** de alto rendimiento, organizado por dominios de negocio claramente delimitados y estructurado bajo los principios de **Clean Architecture** y **Domain-Driven Design (DDD)** pragmático.

### 1.1. Justificación de la Arquitectura Monolito Modular
Para una tienda de barrio o cadena de minimercados, un monolito modular ofrece ventajas determinantes frente a una arquitectura de microservicios:
- **Transacciones ACID atómicas nativas:** Permite que la confirmación de una venta, el descuento de stock, el movimiento de caja y el registro de auditoría ocurran dentro de una **única transacción de base de datos** sin la complejidad ni la eventual inconsistencia de patrones distribuidos como SAGA o two-phase commit.
- **Despliegue y operación simplificados:** Una sola unidad de ejecución que puede correr en la máquina física del mostrador o en un servidor local/en la nube, reduciendo costos de infraestructura y latencia de red entre servicios.
- **Límites modulares estrictos:** Aunque el código corre en un único proceso, cada módulo posee su propio espacio de nombres, entidades, servicios, DTOs y controladores, permitiendo extraer módulos a microservicios independientes en el futuro si el volumen lo justificara.

### 1.2. Principios de Ingeniería Aplicados
- **SOLID:** Especial énfasis en Responsabilidad Única (SRP) e Inversión de Dependencias (DIP) mediante interfaces de repositorio y servicios desacoplados.
- **Separation of Concerns (SoC):** La lógica de negocio y las fórmulas financieras residen exclusivamente en el núcleo de dominio y la capa de aplicación del servidor; el frontend es un cliente rico de presentación e interacción.
- **Defensive Programming & Fail-Fast:** Validación exhaustiva de entradas (DTOs con class-validator) en el límite del sistema antes de alcanzar la capa de dominio.
- **Single Source of Truth:** La base de datos relacional PostgreSQL 18 es la única fuente de verdad transaccional.

---

## 2. DIAGRAMAS C4 DE ARQUITECTURA

### 2.1. C4 Nivel 1: Diagrama de Contexto del Sistema

```mermaid
flowchart TD
    subgraph Usuarios["Usuarios de Tienda de Barrio S.A.S."]
        Admin["Administrador / Dueño\n(Supervisión, Finanzas, Catálogo)"]
        Cajero["Cajero / Vendedor\n(Mostrador, Cobro, Turnos)"]
        Almacen["Almacenista\n(Inventario, Lotes, Compras)"]
    end

    TriangleApp["Sistema TRIANGLE\n(ERP / POS Monolito Modular)\nGestión de inventarios, caja, ventas y mostrador"]

    subgraph Perifericos["Periféricos de Mostrador"]
        Lector["Lector Código de Barras\n(Emulación teclado USB/Bluetooth)"]
        Impresora["Impresora Térmica 80mm\n(Epson TM-T20III o compatible)"]
        Cajon["Cajón Monedero\n(Apertura por pulso RJ11)"]
    end

    subgraph Externos["Servicios Externos (Futura Integración)"]
        DIAN["DIAN / Proveedor Tecnológico\n(Facturación Electrónica DIAN)"]
        Pasarela["Billeteras / Pasarela\n(Nequi, Daviplata, Datáfono)"]
    end

    Admin -->|"Administra tienda y reportes"| TriangleApp
    Cajero -->|"Opera mostrador y caja"| TriangleApp
    Almacen -->|"Recepciona mercancía y lotes"| TriangleApp

    Lector -->|"Envía código EAN-13"| TriangleApp
    TriangleApp -->|"Envía tirilla térmica ESC/POS"| Impresora
    TriangleApp -->|"Dispara pulso de apertura"| Cajon

    TriangleApp -.->|"Emisión electrónica (Fase futura)"| DIAN
    TriangleApp -.->|"Conciliación de pagos"| Pasarela
```

---

### 2.2. C4 Nivel 2: Diagrama de Contenedores

```mermaid
flowchart LR
    subgraph Cliente["Navegador / Terminal de Mostrador"]
        SPA["Frontend SPA\n(React 19 + TypeScript + Vite)\nTailwind CSS, Inter Font, Cache React Query"]
    end

    subgraph Servidor["Servidor de Aplicación (Backend Node.js)"]
        API["API REST Monolito Modular\n(NestJS + TypeScript)\nGuards, Interceptors, DTO Validators"]
        Domain["Capa de Dominio & Servicios de Negocio\n(Reglas de Venta, Cálculo de Impuestos, Arqueos)"]
        ORM["Capa de Persistencia / Repositorios\n(Prisma ORM / PostgreSQL Client)"]
    end

    subgraph Almacenamiento["Base de Datos Relacional"]
        DB[(PostgreSQL 18.6\nTransacciones ACID, Índices B-tree,\nRestricciones CHECK, UUIDs)]
    end

    SPA -->|"Llamadas HTTPS / REST JSON\nTokens JWT & Header Auth"| API
    API --> Domain
    Domain --> ORM
    ORM -->|"Consultas SQL Tipadas\nTransacciones Serializable/Row-Lock"| DB
```

---

### 2.3. C4 Nivel 3: Diagrama de Componentes del Backend

```mermaid
flowchart TD
    subgraph Modulos["Módulos de Negocio en NestJS"]
        AuthMod["AuthModule\n(JWT, Bcrypt, Guards RBAC, PIN)"]
        CatalogMod["CatalogModule\n(Products, Categories, Barcodes)"]
        InventoryMod["InventoryModule\n(Stocks, Batches, Expiration Alerts)"]
        PosMod["PosModule\n(Checkout Engine, Discounts, Cart)"]
        CashMod["CashModule\n(Sessions, Blind Closing, Movements)"]
        PurchasesMod["PurchasesModule\n(Suppliers, Purchase Invoices, Costs)"]
        ReportsMod["ReportsModule\n(Analytics, Top Pareto, Financials)"]
        AuditMod["AuditModule\n(AuditLog Interceptor, System Logs)"]
    end

    subgraph CoreEngine["Motor Transaccional Transversal"]
        TxManager["Database Transaction Manager\n(Unit of Work en PostgreSQL)"]
        TaxEngine["Motor Tributario\n(IVA 0%, 5%, 19% por ítem)"]
    end

    PosMod -->|"Ejecuta venta atómica"| TxManager
    PosMod -->|"Calcula impuestos"| TaxEngine
    TxManager --> InventoryMod
    TxManager --> CashMod
    TxManager --> AuditMod
```

---

## 3. FLUJO TRANSACCIONAL DE CHECKOUT EN PUNTO DE VENTA (SLA < 3s)

Para cumplir estrictamente el requisito no funcional de facturación y cobro en **máximo 3 segundos**, el flujo de confirmación de venta está optimizado al milisegundo mediante una única transacción atómica con bloqueo pesimista de existencias:

```mermaid
sequenceDiagram
    autonumber
    actor Cajero as Cajero (Mostrador)
    participant UI as Terminal POS (React)
    participant API as POS Controller (NestJS)
    participant Svc as Sale Transaction Service
    participant DB as PostgreSQL 18.6
    participant Impresora as Impresora Térmica

    Cajero->>UI: Presiona F10 o botón "Cobrar $ COP"
    UI->>UI: Valida medios de pago e importe recibido en cliente
    UI->>API: POST /api/v1/sales/checkout (SaleCheckoutDto)
    Note over API: Valida esquema DTO, token JWT y sesión de caja activa
    API->>Svc: executeCheckout(dto, userId)
    
    rect rgb(240, 248, 255)
        Note over Svc,DB: INICIO DE TRANSACCIÓN ACID
        Svc->>DB: BEGIN TRANSACTION
        Svc->>DB: SELECT * FROM stocks WHERE product_id IN (...) FOR UPDATE
        Note over Svc,DB: Bloqueo de filas en BD para evitar sobreventas concurrentes
        Svc->>Svc: Valida stock_disponible >= cantidad_solicitada
        alt Stock insuficiente en algún producto
            Svc->>DB: ROLLBACK TRANSACTION
            Svc-->>API: Throw InsufficientStockException
            API-->>UI: 400 Bad Request ("Stock insuficiente para Producto X")
        else Stock suficiente confirmado
            Svc->>DB: INSERT INTO sales (sale_number, total, taxes, cash_session_id, user_id, ...)
            Svc->>DB: INSERT INTO sale_details (sale_id, product_id, quantity, unit_price, tax_rate, ...)
            Svc->>DB: INSERT INTO payments (sale_id, payment_method, amount, received_amount, change_given)
            Svc->>DB: UPDATE stocks SET current_stock = current_stock - qty WHERE product_id = ...
            Svc->>DB: INSERT INTO stock_movements (product_id, movement_type, qty, reference_id, ...)
            opt Pago involucra Efectivo
                Svc->>DB: INSERT INTO cash_movements (cash_session_id, type='VENTA_EFECTIVO', amount, ...)
            end
            Svc->>DB: INSERT INTO audit_logs (action='SALE_COMPLETED', user_id, ...)
            Svc->>DB: COMMIT TRANSACTION
        end
    end

    Svc-->>API: Retorna SaleReceiptDto con ticket compilado
    API-->>UI: 201 Created (SaleReceiptDto) [Tiempo < 600 ms]
    UI->>Impresora: Envía tirilla térmica ESC/POS para impresión inmediata
    UI->>UI: Limpia carrito, emite alerta de éxito y coloca foco en Omnibox [F2]
    Note over Cajero,UI: Mostrador libre para el siguiente cliente en < 1 segundo
```

---

## 4. ESTRUCTURA EN CAPAS (CLEAN ARCHITECTURE)

Cada módulo de backend se divide estrictamente en cuatro capas concéntricas:

1. **Capa de Dominio (Domain Layer):**
   - Entidades puras y objetos de valor (Value Objects).
   - Reglas y restricciones intrínsecas del negocio (ej. validación de que un precio de venta no puede ser menor a cero, cálculo de margen de ganancia).
   - Sin dependencias de frameworks ni de bases de datos.

2. **Capa de Aplicación (Application Layer):**
   - Casos de uso (Use Cases) y servicios de aplicación.
   - Definición de interfaces de puertos (Interfaces de Repositorios, Servicios de Notificación, Proveedores de Facturación).
   - DTOs de entrada y salida con validaciones tipadas.

3. **Capa de Infraestructura (Infrastructure Layer):**
   - Implementaciones concretas de repositorios con Prisma ORM / PostgreSQL.
   - Adaptadores de periféricos (driver de impresión térmica ESC/POS, lectores).
   - Configuración de base de datos, migraciones y seeds.

4. **Capa de Presentación (Presentation Layer):**
   - Controladores REST (`@Controller`) con decoradores NestJS.
   - Filtros globales de excepción, transformadores e interceptores de auditoría.
   - Documentación automática Swagger / OpenAPI.

---

## 5. CONTROL DE ACCESO BASADO EN ROLES (RBAC)

La matriz de seguridad se implementa en el backend mediante un Guard transversal `@UseGuards(JwtAuthGuard, RolesGuard)`:

| Módulo / Operación | Administrador | Cajero | Almacenista |
|---|:---:|:---:|:---:|
| **POS: Armar Carrito y Vender** | ✅ Permitido | ✅ Permitido | ❌ Denegado |
| **POS: Anular Venta Confirmada** | ✅ Permitido | ⚠️ Requiere clave Admin | ❌ Denegado |
| **Caja: Apertura y Cierre de Turno** | ✅ Permitido | ✅ Solo su propia sesión | ❌ Denegado |
| **Caja: Consulta de Arqueo Teórico en Curso** | ✅ Permitido | ❌ Arqueo Ciego (Oculto) | ❌ Denegado |
| **Inventario: Consulta de Existencias** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Inventario: Crear / Editar Productos** | ✅ Permitido | ❌ Denegado | ✅ Permitido |
| **Inventario: Ajuste de Mermas / Lotes** | ✅ Permitido | ❌ Denegado | ✅ Permitido |
| **Compras: Registrar Factura de Proveedor** | ✅ Permitido | ❌ Denegado | ✅ Permitido |
| **Personal: Empleados y Turnos** | ✅ Permitido | ❌ Denegado | ❌ Denegado |
| **Finanzas: Flujo de Caja y Servicios** | ✅ Permitido | ❌ Denegado | ❌ Denegado |
| **Reportes: Métricas y Márgenes de Ganancia**| ✅ Permitido | ❌ Denegado | ❌ Denegado |
| **Auditoría: Consulta de Bitácora del Sistema** | ✅ Permitido | ❌ Denegado | ❌ Denegado |

---

## 6. ESTRATEGIA DE MANEJO DE ERRORES Y CONTRATO DE API

Todas las respuestas de error siguen una envoltura JSON unificada (`GlobalExceptionFilter`), evitando fugas de información interna y facilitando la depuración:

```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "INSUFFICIENT_STOCK",
  "message": "Existencias insuficientes para 'Arroz Diana 1kg'. Disponibles: 2, Solicitadas: 5.",
  "timestamp": "2026-11-21T21:40:00.000Z",
  "path": "/api/v1/sales/checkout",
  "details": {
    "productId": "prod_diana_01",
    "available": 2,
    "requested": 5
  }
}
```
