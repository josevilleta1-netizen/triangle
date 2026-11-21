import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockUser = {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@triangle.com',
    username: 'admin',
    password_hash: bcrypt.hashSync('Admin123*', 10),
    pos_pin_hash: bcrypt.hashSync('1234', 10),
    full_name: 'María Vargas',
    role_id: 'ADMINISTRADOR',
    is_active: true,
    roles: {
      id: 'ADMINISTRADOR',
      name: 'Administrador Principal',
      role_permissions: [
        { permissions: { id: 'auth.login' } },
        { permissions: { id: 'dashboard.view' } },
      ],
    },
  };

  const mockPrisma = {
    users: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('mock_jwt_token_xyz'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should successfully authenticate with valid email and password', async () => {
      mockPrisma.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.login({
        usernameOrEmail: 'admin@triangle.com',
        password: 'Admin123*',
      });

      expect(result).toHaveProperty('accessToken', 'mock_jwt_token_xyz');
      expect(result.user).toHaveProperty('username', 'admin');
      expect(result.user).toHaveProperty('role', 'ADMINISTRADOR');
      expect(result.user.permissions).toContain('dashboard.view');
    });

    it('should reject invalid password', async () => {
      mockPrisma.users.findFirst.mockResolvedValue(mockUser);

      await expect(
        service.login({
          usernameOrEmail: 'admin@triangle.com',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject non-existing user', async () => {
      mockPrisma.users.findFirst.mockResolvedValue(null);

      await expect(
        service.login({
          usernameOrEmail: 'nonexistent@triangle.com',
          password: 'Admin123*',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('unlockWithPin', () => {
    it('should unlock terminal with correct PIN', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);

      const result = await service.unlockWithPin(mockUser.id, { pin: '1234' });
      expect(result).toEqual({
        unlocked: true,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          fullName: mockUser.full_name,
          role: mockUser.role_id,
        },
      });
    });

    it('should reject incorrect PIN', async () => {
      mockPrisma.users.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.unlockWithPin(mockUser.id, { pin: '9999' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
