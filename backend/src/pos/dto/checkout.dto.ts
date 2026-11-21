import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsIn,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber({}, { message: 'La cantidad debe ser numérica' })
  @Min(0.001, { message: 'La cantidad debe ser mayor a 0' })
  quantity!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountRate?: number = 0;
}

export class PaymentMethodDto {
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @IsIn(
    [
      'EFECTIVO',
      'TARJETA_DEBITO',
      'TARJETA_CREDITO',
      'NEQUI',
      'DAVIPLATA',
      'TRANSFIYA',
      'CREDITO_FIADO',
    ],
    { message: 'Método de pago no válido' },
  )
  paymentMethod!:
    | 'EFECTIVO'
    | 'TARJETA_DEBITO'
    | 'TARJETA_CREDITO'
    | 'NEQUI'
    | 'DAVIPLATA'
    | 'TRANSFIYA'
    | 'CREDITO_FIADO';

  @IsNotEmpty({ message: 'El monto del pago es obligatorio' })
  @IsNumber()
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountTendered?: number = 0;

  @IsOptional()
  @IsString()
  referenceCode?: string;
}

export class CheckoutDto {
  @IsOptional()
  @IsString()
  cashSessionId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsArray({ message: 'Los items de venta deben ser una lista' })
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items!: SaleItemDto[];

  @IsArray({ message: 'Los métodos de pago deben ser una lista' })
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  payments!: PaymentMethodDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
