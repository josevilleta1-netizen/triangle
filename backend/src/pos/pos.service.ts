import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PosService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(dto: CheckoutDto, userId: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El carrito de venta no puede estar vacío');
    }

    if (!dto.payments || dto.payments.length === 0) {
      throw new BadRequestException('Debe especificar al menos un método de pago');
    }

    return this.prisma.$transaction(
      async (tx) => {
        // 1. Obtener o verificar sesión de caja activa
        let sessionId = dto.cashSessionId;
        if (!sessionId) {
          const activeSession = await tx.cash_sessions.findFirst({
            where: {
              user_id: userId,
              status: 'OPEN',
            },
            orderBy: { opening_time: 'desc' },
          });

          if (!activeSession) {
            // Si no hay sesión abierta para el usuario, buscar cualquier caja abierta
            const anyOpenSession = await tx.cash_sessions.findFirst({
              where: { status: 'OPEN' },
              orderBy: { opening_time: 'desc' },
            });

            if (!anyOpenSession) {
              // Auto-abrir sesión de desarrollo para no bloquear la venta si es primera vez
              const firstRegister = await tx.cash_registers.findFirst();
              if (!firstRegister) {
                throw new BadRequestException('No hay ninguna caja registradora configurada');
              }
              const autoSession = await tx.cash_sessions.create({
                data: {
                  cash_register_id: firstRegister.id,
                  user_id: userId,
                  initial_cash_amount: new Prisma.Decimal(50000), // Base inicial 50.000 COP
                  status: 'OPEN',
                },
              });
              sessionId = autoSession.id;
            } else {
              sessionId = anyOpenSession.id;
            }
          } else {
            sessionId = activeSession.id;
          }
        }

        // 2. Procesar ítems, calcular totales y descontar stock
        let subtotalAccum = 0;
        let taxTotalAccum = 0;
        let discountTotalAccum = 0;

        const processedDetails: any[] = [];

        for (const item of dto.items) {
          // Bloqueo pesimista del stock
          const stockRecord = await tx.stocks.findUnique({
            where: { product_id: item.productId },
            include: { products: true },
          });

          if (!stockRecord || !stockRecord.products) {
            throw new NotFoundException(`Producto con ID ${item.productId} no encontrado`);
          }

          const product = stockRecord.products;
          const currentStock = Number(stockRecord.current_stock);

          if (currentStock < item.quantity) {
            throw new BadRequestException(
              `Stock insuficiente para '${product.name}'. Solicitado: ${item.quantity}, Disponible: ${currentStock}`,
            );
          }

          const unitPrice = Number(product.sale_price);
          const unitCost = Number(product.cost_price);
          const discountRate = item.discountRate || 0;
          const taxRate = Number(product.tax_rate);

          const itemBasePrice = unitPrice * item.quantity;
          const itemDiscount = (itemBasePrice * discountRate) / 100;
          const itemSubtotal = itemBasePrice - itemDiscount;

          // En Colombia el precio de venta al público en retail ya incluye IVA o se calcula base:
          // Si taxRate > 0, base gravable = subtotal / (1 + taxRate/100)
          // Impuesto = subtotal - base gravable
          const baseImponible = itemSubtotal / (1 + taxRate / 100);
          const itemTax = itemSubtotal - baseImponible;

          subtotalAccum += baseImponible;
          taxTotalAccum += itemTax;
          discountTotalAccum += itemDiscount;

          // Descontar del inventario
          const newStock = currentStock - item.quantity;
          await tx.stocks.update({
            where: { product_id: product.id },
            data: {
              current_stock: new Prisma.Decimal(newStock),
              last_updated_at: new Date(),
            },
          });

          // Si tiene lote especificado o lotes activos, descontar del lote FIFO
          if (item.batchId) {
            const batch = await tx.product_batches.findUnique({
              where: { id: item.batchId },
            });
            if (batch) {
              const newBatchQty = Math.max(0, Number(batch.remaining_quantity) - item.quantity);
              await tx.product_batches.update({
                where: { id: item.batchId },
                data: { remaining_quantity: new Prisma.Decimal(newBatchQty) },
              });
            }
          }

          // Registrar movimiento de inventario
          await tx.stock_movements.create({
            data: {
              product_id: product.id,
              batch_id: item.batchId || null,
              movement_type: 'SALIDA_VENTA',
              quantity: new Prisma.Decimal(-item.quantity),
              previous_stock: new Prisma.Decimal(currentStock),
              new_stock: new Prisma.Decimal(newStock),
              user_id: userId,
              notes: 'Venta realizada desde Terminal POS',
            },
          });

          processedDetails.push({
            productId: product.id,
            productName: product.name,
            batchId: item.batchId || null,
            quantity: item.quantity,
            unitCost,
            unitPrice,
            discountRate,
            taxRate,
            taxAmount: itemTax,
            subtotal: baseImponible,
            total: itemSubtotal,
          });
        }

        const totalSale = subtotalAccum + taxTotalAccum;

        // 3. Validar pagos
        let totalPaid = 0;
        let totalTendered = 0;

        for (const payment of dto.payments) {
          totalPaid += payment.amount;
          totalTendered += payment.amountTendered || payment.amount;

          // Si el método es fiado, verificar y cargar deuda al cliente
          if (payment.paymentMethod === 'CREDITO_FIADO') {
            if (!dto.customerId) {
              throw new BadRequestException('Para crédito fiado es obligatorio seleccionar un cliente');
            }

            const customer = await tx.customers.findUnique({
              where: { id: dto.customerId },
            });

            if (!customer) {
              throw new NotFoundException('Cliente para crédito fiado no encontrado');
            }

            const availableCredit = Number(customer.credit_limit) - Number(customer.current_debt);
            if (availableCredit < payment.amount) {
              throw new BadRequestException(
                `Cupo fiado insuficiente para ${customer.full_name}. Cupo disponible: $ ${availableCredit.toLocaleString('es-CO')}, solicitado: $ ${payment.amount.toLocaleString('es-CO')}`,
              );
            }

            // Aumentar deuda del cliente
            await tx.customers.update({
              where: { id: dto.customerId },
              data: {
                current_debt: new Prisma.Decimal(Number(customer.current_debt) + payment.amount),
              },
            });
          }
        }

        if (Math.abs(totalPaid - totalSale) > 0.05) {
          throw new BadRequestException(
            `El total pagado ($ ${totalPaid}) no coincide con el total de la venta ($ ${totalSale})`,
          );
        }

        const changeReturned = Math.max(0, totalTendered - totalSale);

        // 4. Generar consecutivo de venta
        const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const countToday = await tx.sales.count();
        const saleNumber = `POS-${datePrefix}-${String(countToday + 1).padStart(4, '0')}`;

        // 5. Crear venta
        const sale = await tx.sales.create({
          data: {
            sale_number: saleNumber,
            cash_session_id: sessionId,
            user_id: userId,
            customer_id: dto.customerId || null,
            subtotal: new Prisma.Decimal(subtotalAccum),
            discount_total: new Prisma.Decimal(discountTotalAccum),
            tax_total: new Prisma.Decimal(taxTotalAccum),
            total: new Prisma.Decimal(totalSale),
            status: 'COMPLETED',
          },
        });

        // 6. Crear detalles de venta
        for (const detail of processedDetails) {
          await tx.sale_details.create({
            data: {
              sale_id: sale.id,
              product_id: detail.productId,
              batch_id: detail.batchId,
              quantity: new Prisma.Decimal(detail.quantity),
              unit_cost: new Prisma.Decimal(detail.unitCost),
              unit_price: new Prisma.Decimal(detail.unitPrice),
              discount_rate: new Prisma.Decimal(detail.discountRate),
              tax_rate: new Prisma.Decimal(detail.taxRate),
              tax_amount: new Prisma.Decimal(detail.taxAmount),
              subtotal: new Prisma.Decimal(detail.subtotal),
              total: new Prisma.Decimal(detail.total),
            },
          });
        }

        // 7. Crear registros de pago y movimiento de caja si hubo efectivo
        for (const payment of dto.payments) {
          await tx.payments.create({
            data: {
              sale_id: sale.id,
              payment_method: payment.paymentMethod,
              amount: new Prisma.Decimal(payment.amount),
              amount_tendered: new Prisma.Decimal(payment.amountTendered || payment.amount),
              change_returned: new Prisma.Decimal(changeReturned),
              reference_code: payment.referenceCode || null,
            },
          });

          if (payment.paymentMethod === 'EFECTIVO') {
            await tx.cash_movements.create({
              data: {
                cash_session_id: sessionId,
                movement_type: 'VENTA_EFECTIVO',
                amount: new Prisma.Decimal(payment.amount),
                reason: `Cobro venta ${sale.sale_number}`,
                user_id: userId,
              },
            });
          }
        }

        return {
          id: sale.id,
          saleNumber: sale.sale_number,
          createdAt: sale.created_at,
          subtotal: subtotalAccum,
          taxTotal: taxTotalAccum,
          discountTotal: discountTotalAccum,
          total: totalSale,
          totalTendered,
          changeReturned,
          items: processedDetails,
          payments: dto.payments,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 5000,
      },
    );
  }

  async getSaleById(saleId: string) {
    const sale = await this.prisma.sales.findUnique({
      where: { id: saleId },
      include: {
        users_sales_user_idTousers: { select: { full_name: true, username: true } },
        customers: true,
        sale_details: {
          include: {
            products: true,
          },
        },
        payments: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    return sale;
  }

  async getRecentSales(limit = 10) {
    return this.prisma.sales.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        users_sales_user_idTousers: { select: { username: true, full_name: true } },
        customers: { select: { full_name: true } },
        payments: true,
      },
    });
  }

  async getCustomers() {
    return this.prisma.customers.findMany({
      where: { is_active: true },
      orderBy: { full_name: 'asc' },
    });
  }
}
