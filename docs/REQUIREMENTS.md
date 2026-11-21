# ESPECIFICACION DE REQUISITOS DEL SISTEMA — TRIANGLE
## ERP / POS PARA TIENDA DE BARRIO S.A.S.

**Versión:** 1.0.0-draft  
**Fase:** FASE 0 — ANÁLISIS Y PLANIFICACIÓN  
**Estado:** `UNDER_REVIEW`  

---

## 1. INTRODUCCIÓN Y CONVENCIONES

Este documento constituye la fuente única de verdad para los requisitos de software del sistema **TRIANGLE**.  
Cada requisito funcional está vinculado a una o más **Historias de Usuario (US)** con identificador único estandarizado.

### 1.1. Convención de Git para Ramas y Commits vinculados a Historias de Usuario

Siguiendo el principio rector del proyecto y la directriz explícita del usuario (*"commits y pushes basados en las historias de usuario, al igual que las ramas"*), todo el trabajo de desarrollo respetará la siguiente nomenclatura:

- **Estructura de Ramas:**
  - Nuevas funcionalidades: `feat/US-{ID}-{descripcion-corta}`  
    *Ejemplo:* `feat/US-POS-01-omnibox-barcode-checkout`
  - Corrección de errores: `fix/US-{ID}-{descripcion-corta}`  
    *Ejemplo:* `fix/US-INV-02-prevent-negative-stock`
  - Pruebas y calidad: `test/US-{ID}-{descripcion-corta}`  
    *Ejemplo:* `test/US-CASH-02-blind-cash-closing`
  - Documentación técnica: `docs/US-{ID}-{descripcion-corta}`

- **Estructura de Commits (Conventional Commits con referencia a US):**
  - Formato: `<tipo>(<US-ID>): <descripción imperativa>`
  - Ejemplos:
    - `feat(US-POS-01): implement transactional sale checkout with cash and change calculation`
    - `fix(US-INV-01): add CHECK constraint to forbid negative stock balances`
    - `test(US-CASH-02): add unit test matrix for blind cash count and discrepancies`
    - `docs(US-AUTH-01): document RBAC role permission matrix and token policy`

---

## 2. MATRIZ DE HISTORIAS DE USUARIO (USER STORIES)

| ID | Dominio | Título de la Historia de Usuario | Rol Principal | Prioridad |
|---|---|---|---|---|
| **US-AUTH-01** | Autenticación | Inicio de sesión seguro y PIN de desbloqueo rápido para caja | Administrador / Cajero / Almacenista | Crítica |
| **US-AUTH-02** | Seguridad | Control de acceso basado en roles (RBAC) y caducidad de sesión | Administrador | Alta |
| **US-CAT-01** | Catálogo | Creación y administración de catálogo de productos y categorías | Administrador / Almacenista | Alta |
| **US-CAT-02** | Catálogo | Búsqueda y consulta de productos por SKU y código de barras | Todos | Crítica |
| **US-INV-01** | Inventario | Control de existencias e historial auditable de movimientos | Almacenista / Administrador | Crítica |
| **US-INV-02** | Inventario | Gestión de lotes, fechas de vencimiento y ubicación en estante | Almacenista | Alta |
| **US-ALERT-01** | Alertas | Monitoreo y alertas automáticas de stock mínimo y agotamiento | Administrador / Almacenista | Alta |
| **US-ALERT-02** | Alertas | Semáforo de vencimientos y generación de etiquetas de liquidación (-30% / -50%) | Administrador / Almacenista | Alta |
| **US-POS-01** | Venta / POS | Búsqueda instantánea en mostrador, escaneo y armado de carrito | Cajero | Crítica |
| **US-POS-02** | Venta / POS | Liquidación transaccional con múltiples medios de pago y cambio | Cajero | Crítica |
| **US-POS-03** | Venta / POS | Emisión de tirilla térmica POS de 80 mm y comprobante de venta | Cajero | Crítica |
| **US-POS-04** | Venta / POS | Anulaciones y devoluciones compensatorias con autorización | Administrador / Cajero | Alta |
| **US-POS-05** | Venta / POS | Registro de fiados (cuentas por cobrar) para clientes de confianza | Administrador / Cajero | Media |
| **US-CASH-01** | Caja | Apertura de turno de caja y registro de base en efectivo | Cajero | Crítica |
| **US-CASH-02** | Caja | Registro de egresos e ingresos menores de mostrador | Cajero | Alta |
| **US-CASH-03** | Caja | Cierre de turno, arqueo ciego y conciliación de diferencias | Cajero / Administrador | Crítica |
| **US-PURCH-01** | Compras | Directorio de proveedores y distribuidores comerciales | Administrador | Media |
| **US-PURCH-02** | Compras | Registro de factura de compra con ingreso de lotes y costos | Administrador / Almacenista | Alta |
| **US-EMP-01** | Personal | Administración de empleados y asignación de credenciales | Administrador | Alta |
| **US-EMP-02** | Personal | Programación semanal de turnos de mostrador | Administrador | Media |
| **US-FIN-01** | Finanzas | Registro de flujo de caja y pago de servicios públicos de la tienda | Administrador | Media |
| **US-PQRS-01** | PQRS | Radicación de solicitudes y quejas ciudadanas desde caja | Cajero / Administrador | Media |
| **US-REP-01** | Reportes | Dashboard analítico de ventas del día, márgenes y ticket promedio | Administrador | Alta |
| **US-REP-02** | Reportes | Reporte de rotación de inventario, Top Pareto y mermas | Administrador | Alta |
| **US-AUDIT-01** | Auditoría | Registro inmutable de eventos sensibles del sistema | Administrador | Crítica |

---

## 3. ESPECIFICACIÓN DETALLADA DE HISTORIAS DE USUARIO Y CRITERIOS DE ACEPTACIÓN

### US-AUTH-01: Inicio de Sesión y PIN de Caja
- **Como** empleado de la tienda (Administrador, Cajero o Almacenista)
- **Quiero** autenticarme con mis credenciales seguras y desbloquear la terminal de mostrador mediante un PIN numérico rápido de 4 dígitos
- **Para** iniciar mi jornada laboral de manera ágil y segura sin demoras frente a los clientes.
- **Criterios de Aceptación (Gherkin):**
  - **Escenario 1:** Autenticación exitosa con correo y contraseña.
    - *Dado* un usuario registrado con rol `CAJERO` y contraseña válida.
    - *Cuando* envía sus credenciales al endpoint de login.
    - *Entonces* el sistema retorna un token JWT válido, la información del perfil y sus permisos asignados.
  - **Escenario 2:** Desbloqueo rápido por PIN en POS.
    - *Dado* que la terminal de mostrador fue bloqueada por inactividad.
    - *Cuando* el cajero introduce su PIN de 4 dígitos.
    - *Entonces* la pantalla del POS se reactiva inmediatamente en menos de 500 ms sin requerir ingresar usuario y contraseña completa.
  - **Escenario 3:** Bloqueo tras intentos fallidos.
    - *Dado* un usuario que introduce una credencial o PIN incorrecto 5 veces consecutivas.
    - *Cuando* intenta el sexto ingreso.
    - *Entonces* la cuenta o terminal se bloquea temporalmente por 5 minutos y se genera un registro en `audit_logs`.

---

### US-POS-01: Búsqueda y Armado de Carrito en Mostrador
- **Como** cajero de la tienda de barrio
- **Quiero** buscar productos instantáneamente por nombre o mediante lector de código de barras
- **Para** agregar artículos al carrito en menos de 200 ms por escaneo continuo.
- **Criterios de Aceptación:**
  - **Escenario 1:** Escaneo de código de barras.
    - *Dado* un lector de código de barras configurado en modo emulación de teclado.
    - *Cuando* se escanea el código `7702001001234` correspondiente a "Leche Alquería 1L".
    - *Entonces* el producto se añade automáticamente al carrito con cantidad 1, emitiendo sonido de confirmación visual y recalculando el subtotal al instante.
  - **Escenario 2:** Stock insuficiente para venta.
    - *Dado* un producto con stock disponible de 2 unidades.
    - *Cuando* el cajero intenta incrementar la cantidad a 3.
    - *Entonces* el sistema muestra una advertencia visual inmediata impidiendo exceder las 2 unidades disponibles.

---

### US-POS-02: Liquidación Transaccional y Medios de Pago
- **Como** cajero
- **Quiero** registrar el cobro de la venta seleccionando uno o más medios de pago (Efectivo, Tarjeta, Nequi/Daviplata, Fiado) y calculando automáticamente la devuelta
- **Para** finalizar la transacción con total exactitud monetaria en menos de 3 segundos.
- **Criterios de Aceptación:**
  - **Escenario 1:** Pago en efectivo con cálculo de devuelta.
    - *Dado* un total a pagar de `$ 38.900 COP` y el cliente entrega un billete de `$ 50.000 COP`.
    - *Cuando* se digita `$ 50.000` en el campo de efectivo recibido y se presiona `F10`.
    - *Entonces* el sistema calcula un cambio de `$ 11.100 COP`, registra el pago, descuenta el stock de manera atómica y abre el cajón monedero.
  - **Escenario 2:** Consistencia transaccional ACID.
    - *Dado* un pedido en proceso de confirmación.
    - *Cuando* ocurre un fallo en el registro de uno de los detalles de venta o en el descuento de inventario.
    - *Entonces* la transacción completa se revierte (ROLLBACK), no se descuenta ningún inventario ni se registra venta parcial.

---

### US-POS-03: Emisión de Tirilla Térmica POS de 80 mm
- **Como** cajero y cliente
- **Quiero** generar e imprimir el comprobante térmico de venta con los datos de Tienda de Barrio S.A.S.
- **Para** entregar un soporte físico claro al comprador con el detalle de su compra y los impuestos correspondientes.
- **Criterios de Aceptación:**
  - La tirilla debe contener: Razón Social (Tienda de Barrio S.A.S.), NIT (901.482.109-2), Sede (Chapinero), Número consecutivo de venta (ej: `TKT-0004921`), Fecha y hora, Cajero responsable, Lista de ítems con cantidad, precio unitario y subtotal, IVA discriminado (0%, 5%, 19%), Total general en Pesos Colombianos (COP), Medio de pago utilizado, Monto recibido y Devuelta entregada.
  - El tiempo de generación del documento de impresión debe ser inferior a 800 ms.

---

### US-INV-01: Control de Existencias e Historial de Movimientos
- **Como** almacenista o administrador
- **Quiero** consultar las existencias en tiempo real y revisar la trazabilidad de cada movimiento de inventario
- **Para** garantizar que no existan pérdidas inexplicables ni descuadres entre el stock físico y el sistema.
- **Criterios de Aceptación:**
  - Toda salida por venta genera un registro en `stock_movements` con tipo `SALIDA_VENTA` y referencia al `sale_id`.
  - Toda entrada por compra genera un registro con tipo `ENTRADA_COMPRA` y referencia al `purchase_id`.
  - No se permite bajo ninguna circunstancia que el stock caiga por debajo de cero en operaciones de mostrador.

---

### US-ALERT-02: Semáforo de Vencimientos y Liquidación Preventiva
- **Como** administrador de la tienda
- **Quiero** identificar con antelación los productos que vencerán en los próximos 15, 7 o 3 días y generar etiquetas de descuento promocional (-30%, -50%)
- **Para** venderlos rápidamente en mostrador antes de que se conviertan en merma y pérdida financiera.
- **Criterios de Aceptación:**
  - El sistema clasifica los lotes en tres niveles de alerta:
    - Rojo: Vence en $\le 3$ días.
    - Naranja: Vence entre 4 y 7 días.
    - Amarillo: Vence entre 8 y 15 días.
  - Se permite imprimir tirillas de stickers autoadhesivos con código de barras promocional y precio rebajado para pegarlos en el empaque del producto.

---

### US-CASH-03: Cierre de Turno y Arqueo Ciego
- **Como** cajero
- **Quiero** realizar el cierre de mi turno contando físicamente el dinero en caja sin ver el saldo teórico esperado por el sistema
- **Para** asegurar un arqueo transparente y evitar manipulaciones en el reporte de ingresos.
- **Criterios de Aceptación:**
  - El cajero ingresa el conteo de billetes y monedas por denominación (ej: 20 de $50.000, 15 de $20.000, etc.).
  - Una vez confirmado el conteo físico, el sistema compara el valor ingresado contra el saldo calculado por el sistema (Base inicial + Ventas en efectivo + Ingresos manuales - Egresos manuales).
  - El sistema calcula la diferencia:
    - Si es cero: Cierre exacto.
    - Si es negativa: Faltante de caja.
    - Si es positiva: Sobrante de caja.
  - Se emite el acta de cierre inmutable y no se pueden registrar más ventas con esa sesión de caja cerrada.

---

## 4. REQUISITOS NO FUNCIONALES DETALLADOS

### RNF-01: Rendimiento y Tiempo de Respuesta (SLA < 3s)
- La transacción completa de venta (desde que el cajero presiona confirmar hasta la confirmación de guardado y emisión de comprobante) debe tomar **menos de 3 segundos**.
- Las búsquedas en catálogo por código de barras o texto deben responder en **menos de 250 ms**.
- El dashboard de inicio con KPIs debe cargar en **menos de 1.5 segundos**.

### RNF-02: Integridad Transaccional y Prevención de Concurrencia
- Se implementará aislamiento de transacciones de base de datos en PostgreSQL.
- Se aplicará bloqueo pesimista en nivel de fila (`SELECT ... FOR UPDATE`) sobre la tabla de inventario para asegurar que dos terminales no vendan la misma última unidad al mismo tiempo.

### RNF-03: Seguridad y Confidencialidad
- Algoritmo de hashing de contraseñas: `bcrypt` con costo 10 o `Argon2id`.
- Tokens JWT con caducidad máxima de 8 horas para turnos de mostrador.
- Prohibición estricta de almacenar números de tarjetas de crédito o códigos CVV.
- Registro estricto de auditoría de todas las operaciones sensibles (anulación de ventas, creación de usuarios, apertura/cierre de caja, ajustes de stock).

### RNF-04: Robustez y Tolerancia a Fallos
- Manejo centralizado de excepciones en el backend (`HttpExceptionFilter` en NestJS) devolviendo respuestas uniformes en formato JSON con código de error, mensaje comprensible y marca de tiempo.
- Idempotencia en endpoints de pagos para evitar cobros dobles si el cajero presiona el botón múltiples veces en rápida sucesión.
