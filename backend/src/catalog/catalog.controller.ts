import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('catalog')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Categorías
  @Get('categories')
  async getCategories() {
    return this.catalogService.findAllCategories();
  }

  @Post('categories')
  @Roles('ADMINISTRADOR', 'ALMACENISTA')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalogService.createCategory(dto);
  }

  // Productos
  @Get('products')
  async getProducts(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.catalogService.findAllProducts({
      search,
      categoryId,
      lowStock: lowStock === 'true',
    });
  }

  @Get('products/barcode/:barcode')
  async getProductByBarcode(@Param('barcode') barcode: string) {
    return this.catalogService.findProductByBarcode(barcode);
  }

  @Post('products')
  @Roles('ADMINISTRADOR', 'ALMACENISTA')
  async createProduct(@Body() dto: CreateProductDto, @CurrentUser('id') userId: string) {
    return this.catalogService.createProduct(dto, userId);
  }

  // Ajustes de inventario
  @Post('inventory/adjust')
  @Roles('ADMINISTRADOR', 'ALMACENISTA')
  async adjustStock(@Body() dto: StockAdjustmentDto, @CurrentUser('id') userId: string) {
    return this.catalogService.adjustStock(dto, userId);
  }

  // Alertas
  @Get('inventory/alerts')
  async getAlerts() {
    return this.catalogService.getInventoryAlerts();
  }

  // Lotes
  @Post('batches')
  @Roles('ADMINISTRADOR', 'ALMACENISTA')
  async createBatch(@Body() dto: CreateBatchDto) {
    return this.catalogService.createBatch(dto);
  }
}
