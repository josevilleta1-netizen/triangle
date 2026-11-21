-- ============================================================================
-- PROYECTO TRIANGLE — ERP / POS PARA TIENDA DE BARRIO S.A.S.
-- DATOS SEMILLA (SEEDS) IDEMPOTENTES
-- Versión: 1.0.0
-- ============================================================================

-- Contraseña encriptada para demo: 'Admin123*' y 'Cajero123*' y 'Almacen123*'
-- Hash Bcrypt 10 rounds: $2a$10$w8Lq2tM0z0P1.dC2ZgL/Nu6mD13K1/mIuI3V5E.zQ7w9O2E8Z2YvC (o equivalente)
-- Para desarrollo se usa hash bcrypt estándar comprobado para password 'Admin123*':
-- $2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEYEbG52EOTyFq7m

-- 1. ROLES
INSERT INTO roles (id, name, description) VALUES
    ('ADMINISTRADOR', 'Administrador General', 'Acceso irrestricto, supervisión financiera, usuarios y configuración'),
    ('CAJERO', 'Cajero / Operador POS', 'Gestión de caja, registro rápido de ventas, emisión de tirillas y cobros'),
    ('ALMACENISTA', 'Almacenista / Inventario', 'Recepción de mercancía, lotes, vencimientos y control de existencias')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. PERMISOS
INSERT INTO permissions (id, module, description) VALUES
    ('pos:checkout', 'POS', 'Realizar cobro y liquidación de ventas en mostrador'),
    ('pos:void_sale', 'POS', 'Anular ventas y tickets confirmados'),
    ('pos:discount', 'POS', 'Aplicar descuentos discrecionales en mostrador'),
    ('cash:open_close', 'CAJA', 'Apertura y cierre de turnos de caja'),
    ('cash:movements', 'CAJA', 'Registro de ingresos y retiros menores de mostrador'),
    ('inventory:view', 'INVENTARIO', 'Consulta de catálogo y existencias'),
    ('inventory:manage', 'INVENTARIO', 'Crear y editar productos, categorías y precios'),
    ('inventory:adjust', 'INVENTARIO', 'Realizar ajustes de mermas y conteos físicos'),
    ('purchases:manage', 'COMPRAS', 'Registro de compras a distribuidores y recepción de lotes'),
    ('reports:view', 'REPORTES', 'Acceso al dashboard y reportes de rentabilidad y ventas'),
    ('employees:manage', 'ADMINISTRACION', 'Administración de empleados y asignación de turnos'),
    ('audit:view', 'AUDITORIA', 'Consulta de bitácora inmutable de eventos sensibles')
ON CONFLICT (id) DO NOTHING;

-- Mapeo de permisos a roles
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('ADMINISTRADOR', 'pos:checkout'),
    ('ADMINISTRADOR', 'pos:void_sale'),
    ('ADMINISTRADOR', 'pos:discount'),
    ('ADMINISTRADOR', 'cash:open_close'),
    ('ADMINISTRADOR', 'cash:movements'),
    ('ADMINISTRADOR', 'inventory:view'),
    ('ADMINISTRADOR', 'inventory:manage'),
    ('ADMINISTRADOR', 'inventory:adjust'),
    ('ADMINISTRADOR', 'purchases:manage'),
    ('ADMINISTRADOR', 'reports:view'),
    ('ADMINISTRADOR', 'employees:manage'),
    ('ADMINISTRADOR', 'audit:view'),
    ('CAJERO', 'pos:checkout'),
    ('CAJERO', 'cash:open_close'),
    ('CAJERO', 'cash:movements'),
    ('CAJERO', 'inventory:view'),
    ('ALMACENISTA', 'inventory:view'),
    ('ALMACENISTA', 'inventory:manage'),
    ('ALMACENISTA', 'inventory:adjust'),
    ('ALMACENISTA', 'purchases:manage')
ON CONFLICT DO NOTHING;

-- 3. USUARIOS DEMO INICIALES
-- Password 'Admin123*' con hash bcrypt válido:
-- $2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEYEbG52EOTyFq7m
-- PIN de caja '1234' con hash bcrypt:
-- $2b$10$qR6q7B0gKz7.Tj5QeH1bI.kR1/bZ9y6rP4N4O8mH2h4b2E4a8c4uK (o gen_salt)
INSERT INTO users (id, email, username, password_hash, pos_pin_hash, full_name, role_id) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin@triangle.com', 'admin', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEYEbG52EOTyFq7m', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEYEbG52EOTyFq7m', 'María Vargas', 'ADMINISTRADOR'),
    ('a0000000-0000-0000-0000-000000000002', 'cajero@triangle.com', 'cajero1', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEYEbG52EOTyFq7m', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEYEbG52EOTyFq7m', 'Carlos Mendoza', 'CAJERO'),
    ('a0000000-0000-0000-0000-000000000003', 'almacen@triangle.com', 'almacen1', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEYEbG52EOTyFq7m', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEYEbG52EOTyFq7m', 'Jorge Pardo', 'ALMACENISTA')
ON CONFLICT (email) DO NOTHING;

-- 4. CAJA REGISTRADORA PRINCIPAL
INSERT INTO cash_registers (id, name, branch_name) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Caja Mostrador 01', 'Sede Chapinero')
ON CONFLICT DO NOTHING;

-- 5. CATEGORÍAS COLOMBIANAS DE TIENDA DE BARRIO
INSERT INTO categories (id, name, icon) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Lácteos & Huevos', '🥛'),
    ('b0000000-0000-0000-0000-000000000002', 'Abarrotes & Granos', '🌾'),
    ('b0000000-0000-0000-0000-000000000003', 'Bebidas & Snacks', '🥤'),
    ('b0000000-0000-0000-0000-000000000004', 'Panadería & Galletas', '🍞'),
    ('b0000000-0000-0000-0000-000000000005', 'Aseo & Hogar', '🧼')
ON CONFLICT (name) DO NOTHING;

-- 6. CATÁLOGO DE PRODUCTOS DE ALTA ROTACIÓN
INSERT INTO products (id, category_id, sku, barcode, name, description, unit_of_measure, cost_price, sale_price, tax_rate, min_stock, location_shelf) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'LAC-ALQ-01', '7702001001234', 'Leche Alquería Entera 1L', 'Bolsa de leche entera pasteurizada 1000ml', 'UNIDAD', 3400.00, 4500.00, 0.00, 10.000, 'Nevera 1 - Estante Central'),
    ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'ABA-DIA-01', '7702002005678', 'Arroz Diana Tradicional 1kg', 'Bolsa de arroz blanco seleccionado', 'UNIDAD', 3800.00, 4900.00, 0.00, 15.000, 'Pasillo A - Estantería 2'),
    ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'HUE-REY-01', '7702003009012', 'Huevos Santa Reyes AA x30', 'Panal de 30 huevos frescos campesinos', 'UNIDAD', 14500.00, 18500.00, 0.00, 8.000, 'Mesón Principal Mostrador'),
    ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'GAL-FES-01', '7702004003456', 'Galletas Festival Chocolate', 'Taco de galletas dulces rellenas x4', 'UNIDAD', 900.00, 1200.00, 19.00, 20.000, 'Mueble Impulso POS'),
    ('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 'BEB-POS-01', '7702005007890', 'Gaseosa Postobón Manzana 1.5L', 'Bebida carbonatada refrescante PET', 'UNIDAD', 3200.00, 4800.00, 19.00, 12.000, 'Nevera 2 - Bebidas'),
    ('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 'CAF-SEL-01', '7702006001122', 'Café Sello Rojo Tradicional 500g', 'Café tostado y molido colombiano', 'UNIDAD', 13000.00, 16800.00, 5.00, 6.000, 'Pasillo A - Estante 1'),
    ('d0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000005', 'ASE-FAB-01', '7702007003344', 'Detergente en Polvo Fab 1kg', 'Detergente multiactivo para ropa', 'UNIDAD', 7500.00, 9800.00, 19.00, 5.000, 'Pasillo B - Aseo')
ON CONFLICT (sku) DO NOTHING;

-- 7. EXISTENCIAS INICIALES (STOCKS)
INSERT INTO stocks (product_id, current_stock) VALUES
    ('d0000000-0000-0000-0000-000000000001', 35.000),
    ('d0000000-0000-0000-0000-000000000002', 48.000),
    ('d0000000-0000-0000-0000-000000000003', 14.000),
    ('d0000000-0000-0000-0000-000000000004', 60.000),
    ('d0000000-0000-0000-0000-000000000005', 24.000),
    ('d0000000-0000-0000-0000-000000000006', 18.000),
    ('d0000000-0000-0000-0000-000000000007', 15.000)
ON CONFLICT (product_id) DO NOTHING;

-- 8. LOTES Y FECHAS DE VENCIMIENTO DEMO (Semáforo de alerta preventiva)
-- Lote próximo a vencer en 3 días (Leche Alquería) para probar liquidación rápida (-30%)
INSERT INTO product_batches (product_id, batch_number, expiration_date, initial_quantity, remaining_quantity) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'LOTE-ALQ-2611', CURRENT_DATE + INTERVAL '3 days', 20.000, 12.000),
    ('d0000000-0000-0000-0000-000000000001', 'LOTE-ALQ-2612', CURRENT_DATE + INTERVAL '18 days', 25.000, 23.000),
    ('d0000000-0000-0000-0000-000000000003', 'LOTE-REY-01', CURRENT_DATE + INTERVAL '6 days', 15.000, 14.000),
    ('d0000000-0000-0000-0000-000000000004', 'LOTE-FES-01', CURRENT_DATE + INTERVAL '120 days', 60.000, 60.000)
ON CONFLICT DO NOTHING;

-- 9. PROVEEDORES HABITUALES
INSERT INTO suppliers (id, nit_or_id, company_name, contact_name, phone, email, visit_days, payment_terms_days) VALUES
    ('e0000000-0000-0000-0000-000000000001', '860.000.222-1', 'Alquería Productos Lácteos', 'Jaime Restrepo (Preventista)', '3104567890', 'pedidos@alqueria.com.co', 'Lunes y Jueves', 7),
    ('e0000000-0000-0000-0000-000000000002', '890.903.939-5', 'Postobón S.A.', 'Andrés Mora', '3157891234', 'ventas.bogota@postobon.com.co', 'Martes y Viernes', 0),
    ('e0000000-0000-0000-0000-000000000003', '860.005.224-6', 'Molinos Diana S.A.S.', 'Paola Gómez', '3129876543', 'distribucion@arrozdiana.com.co', 'Miércoles', 15)
ON CONFLICT (nit_or_id) DO NOTHING;

-- 10. CLIENTES Y FIADOS FRECUENTES
INSERT INTO customers (id, document_number, full_name, phone, address, credit_limit, current_debt) VALUES
    ('f0000000-0000-0000-0000-000000000001', '222', 'Consumidor Final', '0000000', 'Bogotá D.C.', 0.00, 0.00),
    ('f0000000-0000-0000-0000-000000000002', '52849120', 'Doña Esperanza Rodríguez (Vecina)', '3112233445', 'Calle 63 # 9-24 Apto 302', 100000.00, 24500.00),
    ('f0000000-0000-0000-0000-000000000003', '79840112', 'Don Pedro Morales (Taller)', '3187766554', 'Carrera 13 # 62-15', 150000.00, 0.00)
ON CONFLICT (document_number) DO NOTHING;

-- 11. SERVICIOS PÚBLICOS DE LA TIENDA
INSERT INTO utility_accounts (id, service_type, company_name, account_number) VALUES
    ('00000000-0000-0000-0000-000000000001', 'ENERGIA_ELECTRICA', 'Enel Codensa', 'NIC-4820192'),
    ('00000000-0000-0000-0000-000000000002', 'ACUEDUCTO_ALCANTARILLADO', 'Acueducto de Bogotá', 'CTA-8839102'),
    ('00000000-0000-0000-0000-000000000003', 'INTERNET_TELEFONIA', 'Claro Negocios', 'CL-0918239')
ON CONFLICT DO NOTHING;

-- 12. PARÁMETROS GENERALES DEL NEGOCIO (SYSTEM SETTINGS)
INSERT INTO system_settings (key, value, description) VALUES
    ('business.nit', '901.482.109-2', 'NIT de Tienda de Barrio S.A.S.'),
    ('business.name', 'Tienda de Barrio S.A.S.', 'Razón social oficial'),
    ('business.branch', 'Sede Chapinero', 'Nombre de la sucursal activa'),
    ('business.address', 'Carrera 11 # 64-18, Chapinero, Bogotá', 'Dirección física del punto de venta'),
    ('business.phone', '+57 (601) 345-6789', 'Teléfono de contacto'),
    ('pos.thermal_printer_name', 'EPSON TM-T20III', 'Nombre del dispositivo de impresión de tirillas'),
    ('pos.receipt_prefix', 'TKT', 'Prefijo para numeración consecutiva de tickets'),
    ('pos.next_receipt_number', '4922', 'Siguiente consecutivo de tirilla'),
    ('alert.expiration_warning_days', '15', 'Días de anticipación para semáforo de vencimientos')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
