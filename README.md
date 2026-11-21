# ▲ TRIANGLE — Sistema ERP / POS para Tienda de Barrio S.A.S.

Sistema integral de gestión empresarial, facturación y punto de venta (POS) de alto rendimiento, diseñado específicamente para optimizar las operaciones comerciales, inventarios, control de caja y cartera de una tienda de barrio en Bogotá, Colombia.

[![Node.js](https://img.shields.io/badge/Node.js-v26.13-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-v11-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.6-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-black.svg)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 1. Arquitectura y Stack Tecnológico

El proyecto está diseñado bajo el patrón de **Monolito Modular con Clean Architecture** y tipado estricto de extremo a extremo:

- **Frontend (SPA):** React 19 + TypeScript + Vite + Tailwind CSS (Estética Nórdico-Fintech inspirada en Paymen, fuente Inter, sombras de nube `shadow-cloud-ambient`).
- **Backend (API REST):** NestJS 11 + TypeScript + Passport JWT + Class-Validator.
- **Persistencia & ORM:** PostgreSQL 18.6 nativo + Prisma ORM 6.4 (transacciones ACID con nivel de aislamiento `Serializable`).
- **Seguridad & RBAC:** Hashing criptográfico de contraseñas con bcrypt, tokens JWT, desbloqueo de terminal por PIN y control de acceso basado en roles (`ADMINISTRADOR`, `CAJERO`, `ALMACENISTA`).

---

## 2. Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes en tu sistema:

1. **Node.js**: v20 o superior (recomendado v22 o v26 LTS) y **npm** v10+.
2. **PostgreSQL**: v16, v17 o v18 en ejecución en el puerto por defecto `5432`.
3. **Git**: para clonar y versionar el repositorio.

---

## 3. Guía Paso a Paso para la Puesta en Marcha

### Paso 1: Clonar el Repositorio

```bash
git clone git@github.com:josevilleta1-netizen/triangle.git
cd triangle
```

### Paso 2: Instalación de Dependencias

El proyecto utiliza npm workspaces en la raíz para orquestar tanto el backend como el frontend:

```bash
# Instalar dependencias globales y de todos los módulos
npm install
```

---

## 4. Migración e Inicialización de la Base de Datos

### 4.1. Crear la Base de Datos en PostgreSQL

Abre tu terminal de PostgreSQL (`psql`) o tu cliente preferido (pgAdmin, DBeaver) y ejecuta:

```sql
CREATE DATABASE triangle_db 
WITH ENCODING 'UTF8' 
TEMPLATE template0;
```

### 4.2. Ejecutar la Inicialización y Sembrado de Datos (DDL + DML)

El directorio `database/` contiene los scripts canónicos idempotentes:
- `schema.sql`: 25 tablas relacionales, 30 llaves foráneas, 23 índices y 41 restricciones `CHECK` (reglas colombianas de IVA 0%, 5%, 19%, stock no negativo, métodos de pago válidos).
- `seed.sql`: Carga inicial de roles, permisos, usuarios demo, categorías y catálogo de productos con lotes y clientes fiados.
- `init.sql`: Orquestador que ejecuta ambos scripts en orden.

**En Windows (PowerShell / CMD):**
```bash
# Desde la raíz del proyecto:
psql -U postgres -h localhost -p 5432 -d triangle_db -f database/init.sql
```

**En Linux / macOS:**
```bash
psql -U postgres -h localhost -p 5432 -d triangle_db -f database/init.sql
```

### 4.3. Sincronizar Prisma ORM en el Backend

Una vez creada y sembrada la base de datos, sincroniza el cliente tipado de Prisma:

```bash
cd backend
npx prisma generate
cd ..
```

---

## 5. Configuración de Variables de Entorno

El backend requiere un archivo `.env` configurado. Puedes crear una copia a partir del ejemplo:

```bash
# Windows
copy .env.example backend\.env

# Linux / macOS
cp .env.example backend/.env
```

Edita `backend/.env` y asegúrate de ajustar las credenciales de tu PostgreSQL:

```env
PORT=3000
NODE_ENV=development

# Ajusta tu usuario y contraseña de PostgreSQL:
DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:5432/triangle_db?schema=public"

# Clave secreta para JWT
JWT_SECRET="triangle_super_secure_jwt_secret_key_change_in_production_2026"
JWT_EXPIRES_IN="8h"

# Datos de la Tienda
BUSINESS_NIT="901.482.109-2"
BUSINESS_NAME="Tienda de Barrio S.A.S."
BUSINESS_BRANCH="Sede Chapinero"
```

---

## 6. Ejecución del Aplicativo en Modo Desarrollo

Para ejecutar el sistema completo, abre dos terminales independientes:

### Terminal 1: Backend (NestJS API REST)
```bash
cd backend
npm run start:dev
```
*El servidor backend quedará disponible en `http://localhost:3000/api/v1`*

### Terminal 2: Frontend (React SPA)
```bash
cd frontend
npm run dev
```
*La aplicación web estará disponible en `http://localhost:5173`*

---

## 7. Cuentas de Acceso Demo para Pruebas

El sistema incluye 3 perfiles precargados listos para iniciar sesión o utilizar con los botones de acceso rápido de la pantalla de bienvenida:

| Rol | Correo / Usuario | Contraseña | PIN Terminal POS | Módulos Autorizados |
|---|---|---|---|---|
| **ADMINISTRADOR** | `admin@triangle.com` | `Admin123*` | `1234` | **Acceso Total**: Dashboard, POS, Inventario, Caja, Compras, Reportes, Personal, Configuración |
| **CAJERO** | `cajero@triangle.com` | `Admin123*` | `1234` | Dashboard, Punto de Venta (POS), Caja y Turnos |
| **ALMACENISTA** | `almacen@triangle.com` | `Admin123*` | `1234` | Dashboard, Inventario y Compras |

---

## 8. Funcionalidades Principales Disponibles

### 🛒 Terminal POS y Motor de Checkout (SLA < 3s)
- **Atajos de Teclado**: Presiona **`F2`** para invocar el cobro instantáneo del carrito y **`Esc`** para cancelar.
- **Lector de Código de Barras**: Entrada de búsqueda reactiva con autofocus compatible con lectores EAN-13 o búsqueda manual por SKU y nombre.
- **Múltiples Métodos de Pago**:
  - 💵 **Efectivo**: Con teclado de monto entregado y cálculo automático de vueltas.
  - 📱 **Nequi / Daviplata**: Pagos electrónicos directos.
  - 💳 **Tarjetas Débito y Crédito**.
  - 📝 **Crédito Fiado**: Venta a crédito ligada al cliente seleccionado con validación de cupo máximo.
- **Comprobante Térmico POS 80mm**: Impresión física directa (`window.print()`) con formato EPSON TM-T20III estándar.

### 📦 Catálogo, Inventario y Alertas de Vencimiento
- **Semáforo Visual de Existencias**: Badges en tiempo real para estado `Normal`, `Bajo Stock` y `Agotado`.
- **Alertas Proactivas de Lotes**: Detección automática de lotes que vencen en 7 días o menos.
- **Ajustes de Inventario Auditables**: Ajustes por conteo físico o mermas/averías con registro inmutable en `stock_movements`.

### 🔒 Bloqueo Rápido de Terminal por PIN
- Presiona **Bloquear** en el menú lateral o el atajo **`F10`** para asegurar la terminal POS ante pausas del cajero.
- Desbloqueo rápido digitando el PIN `1234` en el teclado numérico en pantalla.

---

## 9. Ejecución de Pruebas Automatizadas

```bash
# Ejecutar todas las pruebas unitarias del backend
cd backend
npm test

# Ejecutar el build de producción del frontend
cd ../frontend
npm run build
```

---

## 10. Estructura del Proyecto

```
triangle/
├── backend/                  # API REST en NestJS
│   ├── prisma/               # Esquema relacional Prisma ORM
│   ├── src/
│   │   ├── auth/             # Módulo de Autenticación, JWT, PIN y RBAC
│   │   ├── catalog/          # Módulo de Catálogo, Productos, Lotes e Inventario
│   │   ├── pos/              # Motor de Ventas, Checkout transaccional y Comprobante
│   │   ├── database/         # Servicio y conexión de Prisma
│   │   └── main.ts           # Punto de entrada de la aplicación
│   └── package.json
├── database/                 # Scripts SQL canónicos de PostgreSQL
│   ├── schema.sql            # Definición DDL (25 tablas, índices, CHECKs)
│   ├── seed.sql              # Sembrado DML inicial
│   ├── init.sql              # Script orquestador
│   └── README.md             # Documentación técnica de base de datos
├── frontend/                 # Aplicación SPA en React 19 + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Componentes: Login, POS, Inventario, Shell, Ticket
│   │   ├── context/          # Estado global de autenticación
│   │   ├── services/         # Cliente HTTP hacia la API REST
│   │   └── App.tsx           # Shell principal
│   └── vite.config.ts
├── docs/                     # Especificación de arquitectura, C4 y decisiones ADR
└── README.md                 # Este documento
```

---

## 11. Licencia y Créditos

Desarrollado para **Tienda de Barrio S.A.S.** — Bogotá, Colombia.  
Todos los derechos reservados © 2026.
