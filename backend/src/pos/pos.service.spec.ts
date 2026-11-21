import { Test, TestingModule } from '@nestjs/testing';
import { PosService } from './pos.service';
import { PrismaService } from '../database/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('PosService', () => {
  let service: PosService;
  let prisma: PrismaService;

  const mockPrisma = {
    cash_sessions: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    cash_registers: {
      findFirst: jest.fn(),
    },
    stocks: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    stock_movements: {
      create: jest.fn(),
    },
    sales: {
      count: jest.fn().mockResolvedValue(5),
      create: jest.fn(),
    },
    sale_details: {
      create: jest.fn(),
    },
    payments: {
      create: jest.fn(),
    },
    cash_movements: {
      create: jest.fn(),
    },
    customers: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PosService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PosService>(PosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject checkout when items are empty', async () => {
    await expect(
      service.checkout(
        {
          items: [],
          payments: [{ paymentMethod: 'EFECTIVO', amount: 5000 }],
        },
        'user1',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject checkout if requested quantity exceeds stock', async () => {
    mockPrisma.cash_sessions.findFirst.mockResolvedValue({ id: 'session1' });
    mockPrisma.stocks.findUnique.mockResolvedValue({
      product_id: 'p1',
      current_stock: new Prisma.Decimal(2),
      products: {
        id: 'p1',
        name: 'Arroz Diana',
        sale_price: new Prisma.Decimal(4000),
        cost_price: new Prisma.Decimal(3000),
        tax_rate: new Prisma.Decimal(0),
      },
    });

    await expect(
      service.checkout(
        {
          items: [{ productId: 'p1', quantity: 5 }],
          payments: [{ paymentMethod: 'EFECTIVO', amount: 20000 }],
        },
        'user1',
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
