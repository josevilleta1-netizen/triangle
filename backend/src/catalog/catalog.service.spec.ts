import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../database/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('CatalogService', () => {
  let service: CatalogService;
  let prisma: PrismaService;

  const mockPrisma = {
    categories: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    products: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    stocks: {
      create: jest.fn(),
      update: jest.fn(),
    },
    product_batches: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    stock_movements: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllProducts', () => {
    it('should calculate LOW stock correctly when stock is below minStock', async () => {
      mockPrisma.products.findMany.mockResolvedValue([
        {
          id: 'p1',
          sku: 'SKU1',
          barcode: '7701234',
          name: 'Arroz Diana 1kg',
          cost_price: new Prisma.Decimal(3200),
          sale_price: new Prisma.Decimal(4000),
          tax_rate: new Prisma.Decimal(0),
          min_stock: new Prisma.Decimal(10),
          categories: { id: 'c1', name: 'Granos', icon: '🌾' },
          stocks: { current_stock: new Prisma.Decimal(3), last_updated_at: new Date() },
          product_batches: [],
        },
      ]);

      const result = await service.findAllProducts();
      expect(result).toHaveLength(1);
      expect(result[0].stock.status).toBe('LOW');
      expect(result[0].stock.current).toBe(3);
    });

    it('should calculate OUT_OF_STOCK when stock is 0', async () => {
      mockPrisma.products.findMany.mockResolvedValue([
        {
          id: 'p2',
          sku: 'SKU2',
          barcode: '7701235',
          name: 'Leche Alquería',
          cost_price: new Prisma.Decimal(3500),
          sale_price: new Prisma.Decimal(4500),
          tax_rate: new Prisma.Decimal(0),
          min_stock: new Prisma.Decimal(5),
          categories: { id: 'c2', name: 'Lácteos', icon: '🥛' },
          stocks: { current_stock: new Prisma.Decimal(0), last_updated_at: new Date() },
          product_batches: [],
        },
      ]);

      const result = await service.findAllProducts();
      expect(result[0].stock.status).toBe('OUT_OF_STOCK');
    });
  });

  describe('adjustStock', () => {
    it('should reject adjustment if result is negative', async () => {
      mockPrisma.products.findUnique.mockResolvedValue({
        id: 'p1',
        stocks: { current_stock: new Prisma.Decimal(2) },
      });

      await expect(
        service.adjustStock(
          {
            productId: 'p1',
            quantity: -5,
            movementType: 'AJUSTE_MERMA_VENCIMIENTO',
          },
          'user1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should adjust stock correctly and record movement', async () => {
      mockPrisma.products.findUnique.mockResolvedValue({
        id: 'p1',
        stocks: { current_stock: new Prisma.Decimal(10) },
      });
      mockPrisma.stock_movements.create.mockResolvedValue({ id: 'mov1' });

      const res = await service.adjustStock(
        {
          productId: 'p1',
          quantity: -2,
          movementType: 'AJUSTE_MERMA_VENCIMIENTO',
          notes: 'Deterioro de empaque',
        },
        'user1',
      );

      expect(res.newStock).toBe(8);
      expect(res.previousStock).toBe(10);
      expect(mockPrisma.stocks.update).toHaveBeenCalled();
    });
  });
});
