import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // CATEGORÍAS
  // ==========================================
  async findAllCategories() {
    return this.prisma.categories.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.categories.findFirst({
      where: { name: { equals: dto.name, mode: 'insensitive' } },
    });
    if (existing) {
      throw new ConflictException(`La categoría '${dto.name}' ya existe`);
    }

    return this.prisma.categories.create({
      data: {
        name: dto.name,
        icon: dto.icon || 'category',
      },
    });
  }

  // ==========================================
  // PRODUCTOS E INVENTARIO
  // ==========================================
  async findAllProducts(query?: { search?: string; categoryId?: string; lowStock?: boolean }) {
    const where: Prisma.productsWhereInput = { is_active: true };

    if (query?.categoryId) {
      where.category_id = query.categoryId;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { barcode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const products = await this.prisma.products.findMany({
      where,
      include: {
        categories: true,
        stocks: true,
        product_batches: {
          where: { is_active: true, remaining_quantity: { gt: 0 } },
          orderBy: { expiration_date: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const mapped = products.map((p) => {
      const currentStock = Number(p.stocks?.current_stock || 0);
      const minStock = Number(p.min_stock);

      let stockStatus: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK' = 'NORMAL';
      if (currentStock <= 0) {
        stockStatus = 'OUT_OF_STOCK';
      } else if (currentStock <= minStock) {
        stockStatus = 'LOW';
      }

      return {
        id: p.id,
        sku: p.sku,
        barcode: p.barcode,
        name: p.name,
        description: p.description,
        unitOfMeasure: p.unit_of_measure,
        costPrice: Number(p.cost_price),
        salePrice: Number(p.sale_price),
        taxRate: Number(p.tax_rate),
        minStock: minStock,
        locationShelf: p.location_shelf,
        imageUrl: p.image_url,
        category: {
          id: p.categories.id,
          name: p.categories.name,
          icon: p.categories.icon,
        },
        stock: {
          current: currentStock,
          status: stockStatus,
          lastUpdated: p.stocks?.last_updated_at,
        },
        batches: p.product_batches.map((b) => ({
          id: b.id,
          batchNumber: b.batch_number,
          expirationDate: b.expiration_date,
          remainingQuantity: Number(b.remaining_quantity),
        })),
      };
    });

    if (query?.lowStock) {
      return mapped.filter((p) => p.stock.status === 'LOW' || p.stock.status === 'OUT_OF_STOCK');
    }

    return mapped;
  }

  async findProductByBarcode(barcode: string) {
    const product = await this.prisma.products.findFirst({
      where: {
        barcode,
        is_active: true,
      },
      include: {
        categories: true,
        stocks: true,
        product_batches: {
          where: { is_active: true, remaining_quantity: { gt: 0 } },
          orderBy: { expiration_date: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con código de barras '${barcode}' no encontrado`);
    }

    return {
      id: product.id,
      sku: product.sku,
      barcode: product.barcode,
      name: product.name,
      unitOfMeasure: product.unit_of_measure,
      costPrice: Number(product.cost_price),
      salePrice: Number(product.sale_price),
      taxRate: Number(product.tax_rate),
      minStock: Number(product.min_stock),
      category: product.categories.name,
      currentStock: Number(product.stocks?.current_stock || 0),
      batches: product.product_batches,
    };
  }

  async createProduct(dto: CreateProductDto, userId: string) {
    const existingSku = await this.prisma.products.findUnique({
      where: { sku: dto.sku },
    });
    if (existingSku) {
      throw new ConflictException(`El SKU '${dto.sku}' ya está registrado`);
    }

    if (dto.barcode) {
      const existingBarcode = await this.prisma.products.findFirst({
        where: { barcode: dto.barcode },
      });
      if (existingBarcode) {
        throw new ConflictException(`El código de barras '${dto.barcode}' ya está registrado`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.products.create({
        data: {
          category_id: dto.categoryId,
          sku: dto.sku,
          barcode: dto.barcode || null,
          name: dto.name,
          description: dto.description || null,
          unit_of_measure: dto.unitOfMeasure || 'UNIDAD',
          cost_price: new Prisma.Decimal(dto.costPrice),
          sale_price: new Prisma.Decimal(dto.salePrice),
          tax_rate: new Prisma.Decimal(dto.taxRate),
          min_stock: new Prisma.Decimal(dto.minStock || 5),
          location_shelf: dto.locationShelf || null,
        },
      });

      const initialStockVal = dto.initialStock || 0;
      await tx.stocks.create({
        data: {
          product_id: product.id,
          current_stock: new Prisma.Decimal(initialStockVal),
        },
      });

      if (initialStockVal > 0) {
        await tx.stock_movements.create({
          data: {
            product_id: product.id,
            movement_type: 'AJUSTE_CONTEO',
            quantity: new Prisma.Decimal(initialStockVal),
            previous_stock: new Prisma.Decimal(0),
            new_stock: new Prisma.Decimal(initialStockVal),
            notes: 'Inventario inicial de creación de producto',
            user_id: userId,
          },
        });
      }

      return product;
    });
  }

  // ==========================================
  // AJUSTES DE INVENTARIO
  // ==========================================
  async adjustStock(dto: StockAdjustmentDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.products.findUnique({
        where: { id: dto.productId },
        include: { stocks: true },
      });

      if (!product || !product.stocks) {
        throw new NotFoundException('Producto o registro de stock no encontrado');
      }

      const prevStock = Number(product.stocks.current_stock);
      const newStock = prevStock + dto.quantity;

      if (newStock < 0) {
        throw new BadRequestException(
          `Operación inválida: el stock resultante (${newStock}) no puede ser menor a 0. Stock actual: ${prevStock}`,
        );
      }

      await tx.stocks.update({
        where: { product_id: product.id },
        data: {
          current_stock: new Prisma.Decimal(newStock),
          last_updated_at: new Date(),
        },
      });

      if (dto.batchId) {
        const batch = await tx.product_batches.findUnique({
          where: { id: dto.batchId },
        });
        if (batch) {
          const newBatchQty = Number(batch.remaining_quantity) + dto.quantity;
          if (newBatchQty < 0) {
            throw new BadRequestException('El lote no cuenta con cantidad suficiente para deducir');
          }
          await tx.product_batches.update({
            where: { id: dto.batchId },
            data: { remaining_quantity: new Prisma.Decimal(newBatchQty) },
          });
        }
      }

      const movement = await tx.stock_movements.create({
        data: {
          product_id: product.id,
          batch_id: dto.batchId || null,
          movement_type: dto.movementType,
          quantity: new Prisma.Decimal(dto.quantity),
          previous_stock: new Prisma.Decimal(prevStock),
          new_stock: new Prisma.Decimal(newStock),
          notes: dto.notes || 'Ajuste manual de inventario',
          user_id: userId,
        },
      });

      return {
        productId: product.id,
        previousStock: prevStock,
        adjustment: dto.quantity,
        newStock,
        movementId: movement.id,
      };
    });
  }

  // ==========================================
  // ALERTAS DE VENCIMIENTO Y STOCK
  // ==========================================
  async getInventoryAlerts() {
    const today = new Date();
    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);

    const expiringBatches = await this.prisma.product_batches.findMany({
      where: {
        is_active: true,
        remaining_quantity: { gt: 0 },
        expiration_date: { lte: in7Days },
      },
      include: {
        products: {
          include: { categories: true },
        },
      },
      orderBy: { expiration_date: 'asc' },
    });

    const products = await this.findAllProducts();
    const lowStockProducts = products.filter(
      (p) => p.stock.status === 'LOW' || p.stock.status === 'OUT_OF_STOCK',
    );

    return {
      expiringCount: expiringBatches.length,
      lowStockCount: lowStockProducts.length,
      expiringBatches: expiringBatches.map((b) => {
        const exp = new Date(b.expiration_date);
        const diffTime = exp.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          id: b.id,
          productName: b.products.name,
          categoryName: b.products.categories.name,
          batchNumber: b.batch_number,
          expirationDate: b.expiration_date,
          remainingQuantity: Number(b.remaining_quantity),
          daysRemaining: diffDays,
          isExpired: diffDays < 0,
        };
      }),
      lowStockProducts,
    };
  }

  async createBatch(dto: CreateBatchDto) {
    const product = await this.prisma.products.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.prisma.product_batches.create({
      data: {
        product_id: dto.productId,
        batch_number: dto.batchNumber,
        expiration_date: new Date(dto.expirationDate),
        initial_quantity: new Prisma.Decimal(dto.initialQuantity),
        remaining_quantity: new Prisma.Decimal(dto.initialQuantity),
      },
    });
  }
}
