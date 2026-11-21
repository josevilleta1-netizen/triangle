# ANALISIS INICIAL DEL PROYECTO TRIANGLE
## ERP / POS PARA TIENDA DE BARRIO S.A.S. — BOGOTÁ, COLOMBIA

**Fecha de elaboración:** 21 de Noviembre de 2026  
**Fase:** FASE 0 — ANÁLISIS Y PLANIFICACIÓN  
**Estado:** `UNDER_REVIEW`  
**Equipo responsable:** Software Architect & Technical Lead, Database Engineer, Backend Engineer, Frontend Engineer, UI/UX Designer, QA Engineer, Security Engineer, DevOps Engineer  

---

## 1. INVENTARIO DE ARCHIVOS Y RECURSOS ENCONTRADOS

### 1.1. Inspección de la raíz del espacio de trabajo (`C:\Proyectos\triangle`)

1. **`.git/`**: Repositorio Git inicializado en rama `main`, sincronizado con `origin/main`.
2. **`README.md`**: Archivo básico inicial (10 bytes con `# triangle`).
3. **`stitch_triangle_erp_pos_redesign.zip`**: Paquete comprimido de 8.85 MB (8,856,627 bytes) con el sistema de diseño completo, prototipos HTML interactivos y capturas de pantalla de alta fidelidad.

### 1.2. Recursos extraídos de `stitch_triangle_erp_pos_redesign.zip`

El archivo comprimido fue extraído de manera segura y controlada al directorio de trabajo `extracted_resources/stitch_triangle_erp_pos_redesign/` sin alterar los archivos fuente. Contiene 18 carpetas con prototipos funcionales HTML (`code.html`), capturas visuales de referencia (`screen.png`) y la especificación de diseño (`DESIGN.md`):

| Módulo / Pantalla | Archivos Clave | Propósito Funcional Identificado |
|---|---|---|
| `triangle_soft_pos/` | `DESIGN.md` | Sistema de diseño completo (tokens de color, tipografía Inter, escalas, espaciados, bordes redondeados `rounded-2xl/3xl`, sombras de nube "ambient cloud", filosofía nórdica/fintech adaptada a tiendas de Bogotá). |
| `triangle_dashboard_administrador/` | `code.html`, `screen.png` | Dashboard principal para Administrador con KPIs de ventas del día, comparativa vs día anterior, arqueo de caja actual, accesos rápidos (F2 Nueva Venta, Apertura Caja, Ingreso de Compra), gráficos de rendimiento y alertas de turno. |
| `triangle_punto_de_venta_pos/` | `code.html`, `screen.png` | Interfaz POS de mostrador ultra rápida: Omnibox de búsqueda y código de barras con indicador de pulso ("Lector Listo"), pills de categorías con emojis, cuadrícula de catálogo rápido (Leche Alquería, Arroz Diana, etc.), panel lateral derecho de carrito/liquidación con cálculo de subtotal, IVA discriminado, calculadora rápida de cambio y atajos de teclado (`F2`, `F10`, `ESC`). |
| `triangle_modal_liquidaci_n_r_pida_en_pos/` | `code.html`, `screen.png` | Modal modal de cobro y finalización de venta en caja: selección de medio de pago (Efectivo, Tarjeta, Nequi/Daviplata/Billetera), ingreso de monto recibido, cálculo automático de devuelta/cambio y confirmación de impresión de tirilla. |
| `triangle_ticket_t_rmico_de_liquidaci_n/` | `code.html`, `screen.png` | Formato e impresión de tirilla térmica de 80 mm para "Tienda de Barrio S.A.S. - NIT 901.482.109-2 - Sede Chapinero" y generador de stickers/etiquetas adhesivas con código de barras para liquidación preventiva de productos próximos a vencer (-30%, -50%). |
| `triangle_gesti_n_de_inventario/` | `code.html`, `screen.png` | Catálogo de productos, existencias en tiempo real, control de stock mínimo, filtros por categorías, estantería/ubicación física, costo vs precio de venta y estado de disponibilidad. |
| `triangle_alertas_cr_ticas_de_vencimiento_y_stock/` | `code.html`, `screen.png` | Centro de monitoreo de riesgos de inventario: productos agotados, productos bajo el stock mínimo y lotes próximos a vencer clasificados por semáforo de urgencia (< 3 días, < 7 días, < 15 días). Acciones de remate o devolución a proveedor. |
| `triangle_control_de_caja_y_turnos/` | `code.html`, `screen.png` | Gestión de aperturas y turnos de caja, saldo base inicial, registro de ventas en efectivo vs medios electrónicos, arqueo ciego, cálculo de descuadre/diferencia (sobrante/faltante) y acta de cierre. |
| `triangle_gesti_n_financiera_flujo_de_caja/` | `code.html`, `screen.png` | Flujo de caja del negocio: control de ingresos operacionales, egresos menores de caja menor, pagos de nómina/turnos, cuentas por pagar y pago de servicios públicos de la tienda. |
| `triangle_gesti_n_de_compras/` | `code.html`, `screen.png` | Historial de órdenes de compra, recepción de mercancía de distribuidores, estados de entrega y actualización de costos de adquisición. |
| `triangle_registro_de_compra_a_proveedor/` | `code.html`, `screen.png` | Formulario de radicación de factura de compra: proveedor, número de factura del distribuidor, selección de productos, asignación de número de lote, fecha de vencimiento y costo unitario. |
| `triangle_directorio_de_proveedores/` | `code.html`, `screen.png` | Base de datos de proveedores y distribuidores (preventistas de Postobón, Bavaria, Alpina, Alquería, etc.), contactos, días de visita comercial, plazos de pago y condiciones comerciales. |
| `triangle_gesti_n_de_empleados_y_equipo/` | `code.html`, `screen.png` | Nómina y directorio de colaboradores (cajeros, almacenistas, administradores), estado laboral, turnos asignados y datos de contacto de emergencia. |
| `triangle_modal_nuevo_colaborador_rol/` | `code.html`, `screen.png` | Modal de vinculación de nuevo empleado: asignación de rol, credenciales de acceso, PIN rápido de caja y permisos granulares. |
| `triangle_programaci_n_semanal_de_turnos/` | `code.html`, `screen.png` | Calendario visual de turnos semanales para el personal de la tienda (aperturas matutinas, turnos vespertinos, fines de semana). |
| `triangle_gesti_n_de_roles_y_permisos/` | `code.html`, `screen.png` | Matriz RBAC para gestión de privilegios del sistema (Administrador, Cajero, Almacenista), restringiendo visualización de márgenes de ganancia, anulación de tickets y auditoría. |
| `triangle_centro_de_reportes_anal_tica/` | `code.html`, `screen.png` | Centro analítico con métricas de ventas por hora/día/semana/mes, ticket promedio, margen bruto estimado, productos estrella (Pareto ABC) y mermas evitadas. |
| `triangle_configuraci_n_general_del_negocio/` | `code.html`, `screen.png` | Configuración de la empresa: Razón social, NIT, dirección, régimen tributario (IVA general 19%, 5%, excluido 0%), numeración consecutiva de comprobantes, umbrales de alerta y configuración de periféricos (impresora térmica, lector). |

---

## 2. DIAGNÓSTICO DEL ENTORNO DE EJECUCIÓN (HOST LOCAL)

Se realizó un escaneo exhaustivo de las herramientas disponibles en el sistema operativo local (Windows):

- **Git:** Instalado y funcional (`git version 2.56.1.windows.1`). Repositorio inicializado.
- **PostgreSQL:** Instalado en el sistema anfitrión en `C:\Program Files\PostgreSQL\18\bin\psql.exe` (`psql 18.6`). Servicio disponible localmente.
- **XAMPP:** Instalado en `C:\xampp` (PHP 8.2 / Apache / MySQL), pero para TRIANGLE utilizaremos la base de datos PostgreSQL requerida oficialmente.
- **Windows Package Manager (`winget`):** Instalado y funcional (`v1.29.380`).
- **Node.js / npm:** **NO detectado en el PATH del sistema**.
  - *Diagnóstico técnico:* Node.js LTS debe ser instalado en la Fase 1 mediante `winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements` o configurado en el PATH para permitir la ejecución de NestJS y React/Vite.
- **Docker:** No se encuentra en el PATH. Como el host cuenta con PostgreSQL 18.6 nativo, podemos ejecutar el backend directamente conectado a PostgreSQL local o habilitar Docker si el usuario dispone de Docker Desktop.

---

## 3. REQUISITOS IDENTIFICADOS

### 3.1. Requisitos Funcionales (RF)

1. **RF-01 Autenticación y Seguridad RBAC:**
   - Inicio de sesión con correo/usuario y contraseña segura (hash bcrypt / argon2).
   - Soporte para PIN numérico de 4 dígitos para desbloqueo rápido de mostrador en POS.
   - Roles nativos: `ADMINISTRADOR`, `CAJERO`, `ALMACENISTA`.
   - Control de sesiones activas y cierre automático por inactividad.
   - Restricción de acceso estricta en backend para endpoints protegidos.

2. **RF-02 Gestión de Catálogo y Productos:**
   - Registro, edición y baja lógica (`is_active = false`) de productos.
   - Manejo de códigos SKU internos y códigos de barra estándar (EAN-13, UPC).
   - Categorización jerárquica (Lácteos, Abarrotes, Bebidas & Snacks, Panadería, Frutas & Verduras, Aseo & Hogar).
   - Unidad de medida (Unidad, Kilogramo, Libra, Litro, Paquete).
   - Manejo de costo promedio ponderado de compra y precio de venta al público.
   - Ubicación física en la tienda (Estante, Pasillo, Nevera, Bodega).

3. **RF-03 Inventario, Lotes y Trazabilidad:**
   - Control de existencias globales por producto.
   - Gestión de lotes específicos (`batch_number`) con fecha de vencimiento obligatoria para perecederos.
   - Registro auditable de movimientos de stock: `ENTRADA_COMPRA`, `SALIDA_VENTA`, `AJUSTE_MERMA_VENCIMIENTO`, `AJUSTE_DIFERENCIA_CONTEO`, `DEVOLUCION_CLIENTE`, `DEVOLUCION_PROVEEDOR`.
   - Prohibición estricta de existencias negativas en operaciones regulares de mostrador.

4. **RF-04 Sistema de Alertas Inteligentes:**
   - Alerta visual y listado de productos con existencias por debajo del stock mínimo configurado.
   - Alerta de agotamiento total de stock.
   - Semáforo de productos próximos a vencer:
     - Urgencia Alta: Vencimiento en $\le 3$ días.
     - Urgencia Media: Vencimiento en $\le 7$ días.
     - Urgencia Baja: Vencimiento en $\le 15$ días.
   - Generación de tickets/stickers térmicos de descuento preventivo (-30%, -50%) para acelerar rotación antes de merma.

5. **RF-05 Punto de Venta (POS) de Alto Rendimiento:**
   - Omnibox de búsqueda instantánea por nombre o escaneo continuo de código de barras.
   - Atajos de teclado para operaciones sin ratón (`F2` Búsqueda/Nuevo, `F10` Cobrar, `ESC` Limpiar carrito, `+` / `-` Cantidades).
   - Consulta instantánea de disponibilidad y advertencia en tiempo real si la cantidad requerida supera el stock disponible.
   - Aplicación de descuentos porcentuales o de valor fijo autorizados por rol.
   - Desglose y cálculo de impuestos (IVA 19%, 5%, 0% / Exento).
   - Registro multiformato de pagos: Efectivo, Tarjeta Débito/Crédito, Billetera digital (Nequi, Daviplata, Transfiya) y "Cuentas por Cobrar" (Fiado de clientes de confianza con límite).
   - Calculadora rápida de cambio/devuelta en pantalla.
   - Generación e impresión de tirilla térmica de comprobante de venta de 80 mm.
   - Gestión controlada de devoluciones y anulaciones con generación de movimientos de ajuste compensatorios.

6. **RF-06 Control de Caja y Turnos:**
   - Registro de apertura de sesión de caja con base inicial en efectivo.
   - Trazabilidad continua de ingresos por ventas según medio de pago.
   - Registro de movimientos manuales de caja: `INGRESO_MANUAL` (reposición de base), `EGRESO_MANUAL` (retiro seguro, compras menores de emergencia, pago de turno/transporte).
   - Proceso de arqueo ciego al cierre de turno (el cajero ingresa conteo físico de billetes y monedas sin ver el valor esperado).
   - Conciliación automática contra el saldo teórico del sistema, calculando faltante o sobrante.
   - Emisión de acta de cierre de caja con firma digital del responsable.

7. **RF-07 Compras y Recepción de Mercancía:**
   - Directorio de proveedores y distribuidores comerciales (datos de contacto, NIT, días de entrega).
   - Registro de compras ingresando número de factura del proveedor, costos unitarios e impuestos.
   - Ingreso directo de lotes y fechas de expiración en la recepción de mercancía.
   - Actualización transaccional inmediata del stock disponible y recálculo del costo promedio.

8. **RF-08 Administración, Empleados y Turnos:**
   - Directorio de empleados con roles y turnos asignados.
   - Programación de turnos semanales de trabajo para el mostrador.
   - Módulo de PQRS (Peticiones, Quejas, Reclamos y Sugerencias) radicables desde caja con trazabilidad de estado (`RECIBIDA`, `EN_GESTION`, `RESUELTA`).
   - Control de servicios públicos de la sede comercial (Luz, Agua, Gas, Internet) con fecha de vencimiento de recibos y registro de pago.

9. **RF-09 Reportes y Analítica Comercial:**
   - Dashboard analítico con ventas por período (Hoy, Semana, Mes, Año).
   - Reporte de productos más vendidos (Top Pareto) y productos de baja rotación ("huesos").
   - Reporte de flujo de caja financiero (Ingresos vs Egresos).
   - Reporte de mermas y pérdidas por vencimiento.
   - Reporte histórico de cierres de caja y discrepancias acumuladas.
   - Capacidad de exportación de reportes a formatos tabulares y listados de impresión.

10. **RF-10 Auditoría y Trazabilidad Global:**
    - Bitácora inmutable de eventos sensibles (`audit_logs`): anulaciones de tickets, modificaciones de precios de venta, ajustes manuales de stock, retiros extraordinarios de caja y cambios en configuración del negocio.
    - Registro de ID de usuario, IP, marca de tiempo y estado previo vs estado nuevo.

---

### 3.2. Requisitos No Funcionales (RNF)

1. **RNF-01 Rendimiento Transaccional (SLA < 3s):**
   - El proceso de confirmación de venta en el POS, liquidación de la transacción, descuento de stock, registro en caja y generación de la tirilla térmica debe completarse en **menos de 3 segundos** bajo condiciones normales de mostrador.
2. **RNF-02 Integridad y Concurrencia ACID:**
   - La liquidación de ventas y movimientos de inventario deben ejecutarse dentro de transacciones aisladas de PostgreSQL (`SERIALIZABLE` o `READ COMMITTED` con bloqueo pesimista `SELECT ... FOR UPDATE` sobre la fila del stock) para impedir sobreventas (overselling) ante terminales simultáneas o ráfagas rápidas de escaneo.
3. **RNF-03 Seguridad y Protección de Datos:**
   - Hashing criptográfico unidireccional de contraseñas mediante `bcrypt` (factor de costo $\ge 10$) o `Argon2id`.
   - Control de acceso RBAC verificado obligatoriamente en middleware y controladores del backend.
   - Tokens de sesión JWT de corta duración con rotación segura o sesiones httpOnly.
   - Sanitización contra XSS, inyección SQL (mediante consultas parametrizadas con ORM / driver) y protección de cabeceras vía Helmet.
   - Se prohíbe explícitamente almacenar números completos de tarjetas de crédito/débito o códigos de seguridad (CVV).
4. **RNF-04 Precisión Financiera:**
   - Todas las columnas de montos monetarios, costos, precios, descuentos, impuestos y totales deben usar tipos `NUMERIC(14,2)` o `NUMERIC(16,4)` en PostgreSQL. Está terminantemente prohibido el uso de `FLOAT` o `REAL` para valores monetarios.
5. **RNF-05 Usabilidad y Productividad (Diseño Nórdico-Fintech):**
   - Interfaz visual basada en el sistema de diseño extraído (`rounded-2xl`, sombras ambientales, paleta azul eléctrico/lavanda), optimizada para pantallas táctiles de mostrador (1024x768 en adelante) y atajos de teclado sin dependencia del ratón.
6. **RNF-06 Mantenibilidad y Arquitectura Limpia:**
   - Monolito modular con separación estricta en capas (Dominio, Aplicación, Infraestructura, Presentación) siguiendo principios SOLID y Domain-Driven Design pragmático.
7. **RNF-07 Cobertura y Calidad de Pruebas:**
   - Mínimo 80% de cobertura de código general.
   - 90% o superior en lógica de negocio crítica (cálculo de impuestos, arqueos, descuentos de existencias, control de cambio).
   - 100% de cobertura en escenarios de prueba unitaria de la matriz financiera y de inventario.

---

## 4. INCONSISTENCIAS Y AMBIGÜEDADES DETECTADAS

Durante el análisis minucioso de los prototipos visuales y la documentación del proyecto, se identificaron las siguientes discrepancias que requieren normalización:

1. **Comprobante Interno vs. Facturación Electrónica DIAN:**
   - *Hallazgo:* En los prototipos se hace referencia a "IVA Discriminado (DIAN)" y tirilla térmica.
   - *Resolución Técnica:* Como establece la directriz del proyecto, un ticket de máquina registradora o software de mostrador local no constituye automáticamente una Factura Electrónica de Venta válida ante la DIAN (Anexo Técnico 1.9 DIAN, CUFE, código QR tributario y firma digital con certificado).
   - *Decisión:* TRIANGLE implementará el comprobante de venta POS interno estándar para tiendas de barrio (con NIT, numeración consecutiva, resolución interna e IVA discriminado) y dejará la capa de servicios desacoplada mediante un patrón adaptador (`IInvoiceProvider`) listo para conectarse a un Proveedor Tecnológico Autorizado (PTA) cuando el negocio decida emitir factura electrónica formal.

2. **Esquema de Tarifas de IVA en Colombia:**
   - *Hallazgo:* El prototipo POS muestra un campo genérico de IVA.
   - *Resolución Técnica:* En Colombia existen tres tratamientos tributarios en productos de la canasta familiar:
     - Bienes Excluidos (Tarifa 0%, no causan IVA: leche pura, huevos, frutas frescas, pan tradicional).
     - Bienes Gravados con tarifa reducida (5%: pastas alimenticias, café tostado, embutidos seleccionados).
     - Bienes Gravados con tarifa general (19%: licores, aseo del hogar, golosinas, confitería).
   - *Decisión:* Cada producto en el catálogo tendrá su porcentaje de IVA configurable (`0%`, `5%`, `19%`), calculándose el impuesto de manera granular por ítem.

3. **Manejo de "Fiados" (Cuentas por Cobrar en Tienda de Barrio):**
   - *Hallazgo:* El documento de diseño menciona "fiados pendientes", pero la especificación inicial solo mencionaba Efectivo, Tarjeta y Billeteras.
   - *Resolución Técnica:* En la tienda de barrio colombiana, el crédito informal o "fiado" a vecinos es una realidad operativa cotidiana de alta frecuencia.
   - *Decisión:* Se incluye la modalidad de pago `CREDITO_FIADO`, vinculada a un cliente registrado con cupo máximo de endeudamiento y registro de abonos parciales.

---

## 5. RECURSOS GRÁFICOS Y SISTEMA VISUAL DISPONIBLE

Se verificaron todos los componentes gráficos del archivo extraído:
- **Logo TRIANGLE:** Disponible en formato vectorial / imagen optimizada con isotipo geométrico moderno.
- **Tipografía:** Familia tipográfica **Inter** (Google Fonts) con soporte para jerarquía visual: `headline-xl` (36px, 800), `headline-lg` (28px, 700), `currency-display` (32px, 800), `body-md` (14px, 400), `label-lg` (14px, 600).
- **Iconografía:** Material Symbols Outlined estándar.
- **Tokens de Color:**
  - `primary`: `#004ac6` / `primary-container`: `#2563eb` (azul eléctrico vibrante).
  - `on-primary`: `#ffffff`
  - `background` / `canvas`: `#f0f3fa` / `#f7f9ff`
  - `surface-container-lowest`: `#ffffff` puro
  - `secondary`: `#565e74` / `#0f172a` (azul marino tinta profundo)
  - `success`: `#10b981` (verde esmeralda con fondos pastel `#d1fae5`)
  - `error`: `#ba1a1a` / `#ef4444` (carmesí suave con fondo `#fee2e2`)
  - `warning` / `fiado`: `#f59e0b` (ámbar cálido `#fffbeb`)
- **Estilo de Contenedores:**
  - Tarjetas flotantes con radios pronunciados `rounded-2xl` (24px) y `rounded-3xl` (28px).
  - Botones y campos en formato píldora (`rounded-full`) o `rounded-xl`.
  - Sombras de difusión amplia (*ambient cloud shadows*): `box-shadow: 0 10px 30px -5px rgba(15,23,42,0.04), 0 4px 12px -2px rgba(15,23,42,0.02)`.
  - Ausencia intencional de bordes negros duros divisores.

---

## 6. MATRIZ DE RIESGOS TÉCNICOS Y ESTRATEGIAS DE MITIGACIÓN

| ID | Riesgo Identificado | Impacto | Probabilidad | Estrategia de Mitigación |
|---|---|---|---|---|
| **R-01** | Sobreventa de stock ante múltiples ventas concurrentes en horas pico | Alto | Media | Bloqueo transaccional pesimista `SELECT ... FOR UPDATE` en PostgreSQL dentro de la transacción de venta y restricción CHECK (`current_stock >= 0`). |
| **R-02** | Latencia superior a 3 segundos en el POS por procesamiento pesado | Crítico | Media | Índices B-tree en `barcode` y `sku`, transacciones de base de datos compactas y generación asíncrona de formatos de impresión no bloqueantes. |
| **R-03** | Cuadre de caja incorrecto por registros no trazables | Alto | Alta | Arqueo ciego obligatorio donde el cajero reporta conteo físico sin conocer el saldo esperado. Toda entrada o salida manual requiere justificación obligatoria. |
| **R-04** | Discrepancia entre comprobante POS y exigencias tributarias DIAN | Medio | Media | Definir con claridad en comprobantes que son tirillas de control interno POS, parametrizando las tasas de IVA de acuerdo con la legislación colombiana. |
| **R-05** | Pérdida de datos por fallas de hardware en la máquina local | Alto | Baja | Scripts automatizados de respaldo (`pg_dump`) programados en directorio seguro con retención versionada. |

---

## 7. RECOMENDACIONES TÉCNICAS DEL EQUIPO

1. **Stack Tecnológico:**
   - **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons / Material Symbols + TanStack Query para estado de servidor y caché veloz.
   - **Backend:** Node.js LTS + NestJS + TypeScript + DTOs con `class-validator` + Fastify o Express con alta concurrencia.
   - **Base de Datos:** PostgreSQL 18.6 nativo (instalado en el sistema local) utilizando Prisma ORM para migraciones tipadas y consultas de alto rendimiento, complementado con scripts SQL canónicos (`database/schema.sql`, `database/seed.sql`, `database/init.sql`).
   - **Pruebas:** Vitest / Jest para pruebas unitarias de cálculo financiero y servicios; Supertest para pruebas de integración de API; Playwright para flujos E2E de mostrador.
2. **Gestión de Versiones y Git:**
   - Utilizar Semantic Versioning 2.0.0 (`VERSION`, `CHANGELOG.md`).
   - Ramas y commits trazables directamente a las Historias de Usuario:
     - Ramas: `feat/US-POS-01-sale-checkout`, `fix/US-INV-02-prevent-negative-stock`.
     - Commits: `feat(US-POS-01): implement transactional checkout and cash movement`.
3. **Desarrollo por Fases con Aprobación Explícita:**
   - Ninguna fase de desarrollo se iniciará sin la presentación de entregables y la autorización explícita del usuario.

---

## 8. DECISIONES PENDIENTES DE APROBACIÓN DEL USUARIO

1. **Aprobación del Stack de Desarrollo:** Confirmación de Node.js + NestJS + React + Tailwind + PostgreSQL 18.6 nativo con Prisma ORM.
2. **Aprobación del Sistema de Diseño UI/UX:** Adopción formal de la especificación nórdica-fintech documentada en `extracted_resources/stitch_triangle_erp_pos_redesign/triangle_soft_pos/DESIGN.md`.
3. **Alcance de Facturación:** Ratificación de comprobante POS interno con IVA discriminado, dejando desacoplado el adaptador para facturación electrónica DIAN a futuro.
4. **Manejo del Fiado (Crédito Local):** Aprobación de la inclusión de la entidad y flujo de crédito vecinal con cupo máximo en caja.
