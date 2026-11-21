-- ============================================================================
-- PROYECTO TRIANGLE — ERP / POS PARA TIENDA DE BARRIO S.A.S.
-- ESQUEMA RELACIONAL CANÓNICO DDL — POSTGRESQL 18
-- Versión: 1.0.0
-- ============================================================================

-- Habilitar extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. DOMINIO DE IDENTIDAD Y SEGURIDAD (RBAC)
-- ============================================================================

CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(60) PRIMARY KEY,
    module VARCHAR(40) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(30) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(60) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    pos_pin_hash VARCHAR(255) NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id VARCHAR(30) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. DOMINIO DE CATÁLOGO E INVENTARIO
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) UNIQUE NOT NULL,
    icon VARCHAR(40) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(50) UNIQUE NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    unit_of_measure VARCHAR(20) NOT NULL DEFAULT 'UNIDAD',
    cost_price NUMERIC(14,2) NOT NULL CHECK (cost_price >= 0),
    sale_price NUMERIC(14,2) NOT NULL CHECK (sale_price >= 0),
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (tax_rate IN (0.00, 5.00, 19.00)),
    min_stock NUMERIC(12,3) NOT NULL DEFAULT 5.000 CHECK (min_stock >= 0),
    location_shelf VARCHAR(50) NULL,
    image_url TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    current_stock NUMERIC(12,3) NOT NULL DEFAULT 0.000 CHECK (current_stock >= 0),
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    batch_number VARCHAR(50) NOT NULL,
    expiration_date DATE NOT NULL,
    initial_quantity NUMERIC(12,3) NOT NULL CHECK (initial_quantity > 0),
    remaining_quantity NUMERIC(12,3) NOT NULL CHECK (remaining_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    batch_id UUID NULL REFERENCES product_batches(id) ON DELETE SET NULL,
    movement_type VARCHAR(35) NOT NULL CHECK (movement_type IN (
        'ENTRADA_COMPRA', 'SALIDA_VENTA', 'AJUSTE_MERMA_VENCIMIENTO', 
        'AJUSTE_CONTEO', 'DEVOLUCION_VENTA', 'DEVOLUCION_COMPRA'
    )),
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity != 0),
    previous_stock NUMERIC(12,3) NOT NULL,
    new_stock NUMERIC(12,3) NOT NULL,
    reference_id VARCHAR(100) NULL,
    notes TEXT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. DOMINIO DE CAJA Y TURNOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS cash_registers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    branch_name VARCHAR(80) NOT NULL DEFAULT 'Sede Chapinero',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cash_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cash_register_id UUID NOT NULL REFERENCES cash_registers(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    opening_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closing_time TIMESTAMPTZ NULL,
    initial_cash_amount NUMERIC(14,2) NOT NULL CHECK (initial_cash_amount >= 0),
    final_cash_expected NUMERIC(14,2) NULL,
    final_cash_counted NUMERIC(14,2) NULL,
    discrepancy_amount NUMERIC(14,2) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'AUDITED')),
    notes TEXT NULL
);

CREATE TABLE IF NOT EXISTS cash_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cash_session_id UUID NOT NULL REFERENCES cash_sessions(id) ON DELETE RESTRICT,
    movement_type VARCHAR(30) NOT NULL CHECK (movement_type IN (
        'VENTA_EFECTIVO', 'INGRESO_MANUAL', 'EGRESO_MANUAL', 'PAGO_SERVICIO', 'RETIRO_SEGURIDAD'
    )),
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. DOMINIO DE CLIENTES, VENTAS Y COMPROBANTES POS
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_number VARCHAR(30) UNIQUE NULL,
    full_name VARCHAR(150) NOT NULL DEFAULT 'Cliente Ocasional',
    phone VARCHAR(30) NULL,
    address VARCHAR(150) NULL,
    credit_limit NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (credit_limit >= 0),
    current_debt NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (current_debt >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_number VARCHAR(40) UNIQUE NOT NULL,
    cash_session_id UUID NOT NULL REFERENCES cash_sessions(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    customer_id UUID NULL REFERENCES customers(id) ON DELETE SET NULL,
    subtotal NUMERIC(14,2) NOT NULL CHECK (subtotal >= 0),
    discount_total NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (discount_total >= 0),
    tax_total NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (tax_total >= 0),
    total NUMERIC(14,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'VOIDED', 'REFUNDED')),
    voided_reason TEXT NULL,
    voided_by_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sale_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    batch_id UUID NULL REFERENCES product_batches(id) ON DELETE SET NULL,
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(14,2) NOT NULL CHECK (unit_cost >= 0),
    unit_price NUMERIC(14,2) NOT NULL CHECK (unit_price >= 0),
    discount_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (discount_rate >= 0),
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(14,2) NOT NULL CHECK (subtotal >= 0),
    total NUMERIC(14,2) NOT NULL CHECK (total >= 0)
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN (
        'EFECTIVO', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'NEQUI', 'DAVIPLATA', 'TRANSFIYA', 'CREDITO_FIADO'
    )),
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    amount_tendered NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (amount_tendered >= 0),
    change_returned NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (change_returned >= 0),
    reference_code VARCHAR(100) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. DOMINIO DE COMPRAS Y PROVEEDORES
-- ============================================================================

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nit_or_id VARCHAR(30) UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100) NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(120) NULL,
    visit_days VARCHAR(50) NULL,
    payment_terms_days INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    supplier_invoice_number VARCHAR(50) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_cost NUMERIC(14,2) NOT NULL CHECK (total_cost >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'RECEIVED' CHECK (status IN ('PENDING', 'RECEIVED', 'CANCELLED')),
    notes TEXT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    batch_number VARCHAR(50) NULL,
    expiration_date DATE NULL,
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(14,2) NOT NULL CHECK (unit_cost >= 0),
    total_cost NUMERIC(14,2) NOT NULL CHECK (total_cost >= 0)
);

-- ============================================================================
-- 6. DOMINIO DE ADMINISTRACIÓN, EMPLEADOS, PQRS Y SERVICIOS PÚBLICOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_number VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    position VARCHAR(60) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    hire_date DATE NOT NULL,
    emergency_contact VARCHAR(150) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code VARCHAR(30) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_contact VARCHAR(100) NOT NULL,
    request_type VARCHAR(30) NOT NULL CHECK (request_type IN ('PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA')),
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RECIBIDA' CHECK (status IN ('RECIBIDA', 'EN_GESTION', 'RESUELTA', 'CERRADA')),
    resolution_notes TEXT NULL,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS utility_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(40) NOT NULL CHECK (service_type IN (
        'ENERGIA_ELECTRICA', 'ACUEDUCTO_ALCANTARILLADO', 'GAS_NATURAL', 'INTERNET_TELEFONIA'
    )),
    company_name VARCHAR(80) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS utility_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utility_account_id UUID NOT NULL REFERENCES utility_accounts(id) ON DELETE RESTRICT,
    cash_session_id UUID NULL REFERENCES cash_sessions(id) ON DELETE SET NULL,
    bill_period VARCHAR(30) NOT NULL,
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    receipt_voucher_number VARCHAR(80) NULL,
    paid_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);

-- ============================================================================
-- 7. DOMINIO DE AUDITORÍA Y CONFIGURACIÓN DEL SISTEMA
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(60) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NULL,
    old_values JSONB NULL,
    new_values JSONB NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(60) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. ÍNDICES DE ALTO RENDIMIENTO (SLA < 3s)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products (barcode) WHERE barcode IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_active_name ON products (is_active, name);
CREATE INDEX IF NOT EXISTS idx_stocks_product ON stocks (product_id);
CREATE INDEX IF NOT EXISTS idx_batches_product_exp ON product_batches (product_id, expiration_date);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_session ON sales (cash_session_id);
CREATE INDEX IF NOT EXISTS idx_sale_details_sale ON sale_details (sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_sale ON payments (sale_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_prod ON stock_movements (product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);
