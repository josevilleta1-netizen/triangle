import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UnlockPinDto } from './dto/unlock-pin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto;

    const user = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email: usernameOrEmail.toLowerCase() },
          { username: usernameOrEmail.toLowerCase() },
        ],
      },
      include: {
        roles: {
          include: {
            role_permissions: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.is_active) {
      throw new ForbiddenException('La cuenta de usuario está desactivada');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const permissions = user.roles.role_permissions.map((rp) => rp.permissions.id);

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role_id,
      fullName: user.full_name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        role: user.role_id,
        roleName: user.roles.name,
        permissions,
        hasPinConfigured: Boolean(user.pos_pin_hash),
      },
    };
  }

  async unlockWithPin(userId: string, unlockPinDto: UnlockPinDto) {
    const { pin } = unlockPinDto;

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.is_active) {
      throw new ForbiddenException('La cuenta de usuario está desactivada');
    }

    if (!user.pos_pin_hash) {
      throw new ForbiddenException('El usuario no tiene un PIN de terminal configurado');
    }

    const isPinValid = await bcrypt.compare(pin, user.pos_pin_hash);
    if (!isPinValid) {
      throw new UnauthorizedException('PIN incorrecto');
    }

    return {
      unlocked: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role_id,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role_permissions: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const permissions = user.roles.role_permissions.map((rp) => rp.permissions.id);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
      role: user.role_id,
      roleName: user.roles.name,
      permissions,
      hasPinConfigured: Boolean(user.pos_pin_hash),
    };
  }
}
