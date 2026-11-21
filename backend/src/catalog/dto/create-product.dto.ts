import { IsNotEmpty, IsString, IsNumber, IsOptional, IsIn, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsString({ message: 'El ID de categoría debe ser una cadena válida' })
  categoryId!: string;

  @IsNotEmpty({ message: 'El SKU es obligatorio' })
  @IsString({ message: 'El SKU debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El SKU no puede exceder 50 caracteres' })
  sku!: string;

  @IsOptional()
  @IsString({ message: 'El código de barras debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El código de barras no puede exceder 50 caracteres' })
  barcode?: string;

  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  unitOfMeasure?: string = 'UNIDAD';

  @IsNotEmpty({ message: 'El precio de costo es obligatorio' })
  @IsNumber({}, { message: 'El precio de costo debe ser numérico' })
  @Min(0, { message: 'El precio de costo no puede ser negativo' })
  costPrice!: number;

  @IsNotEmpty({ message: 'El precio de venta es obligatorio' })
  @IsNumber({}, { message: 'El precio de venta debe ser numérico' })
  @Min(0, { message: 'El precio de venta no puede ser negativo' })
  salePrice!: number;

  @IsNotEmpty({ message: 'La tarifa de IVA es obligatoria' })
  @IsIn([0, 5, 19], { message: 'La tarifa de IVA debe ser 0, 5 o 19%' })
  taxRate!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number = 5;

  @IsOptional()
  @IsString()
  locationShelf?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  initialStock?: number = 0;
}
