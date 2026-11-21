import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PosService } from './pos.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('pos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post('checkout')
  @Roles('ADMINISTRADOR', 'CAJERO')
  async checkout(@Body() dto: CheckoutDto, @CurrentUser('id') userId: string) {
    return this.posService.checkout(dto, userId);
  }

  @Get('sales/recent')
  @Roles('ADMINISTRADOR', 'CAJERO')
  async getRecentSales(@Query('limit') limit?: string) {
    return this.posService.getRecentSales(limit ? parseInt(limit, 10) : 10);
  }

  @Get('sales/:id')
  @Roles('ADMINISTRADOR', 'CAJERO')
  async getSaleById(@Param('id') id: string) {
    return this.posService.getSaleById(id);
  }

  @Get('customers')
  @Roles('ADMINISTRADOR', 'CAJERO')
  async getCustomers() {
    return this.posService.getCustomers();
  }
}
