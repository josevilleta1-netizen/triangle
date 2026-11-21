import { IsNotEmpty, IsNumber, IsIn, IsString, IsOptional } from 'class-validator';

export class StockAdjustmentDto {
  @IsNotEmpty({ message: 'El producto es obligatorio' })
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsNotEmpty({ message: 'La cantidad del ajuste es obligatoria' })
  @IsNumber({}, { message: 'La cantidad debe ser numérica' })
  quantity!: number;

  @IsNotEmpty({ message: 'El tipo de movimiento es obligatorio' })
  @IsIn(['AJUSTE_CONTEO', 'AJUSTE_MERMA_VENCIMIENTO'], {
    message: 'El tipo de ajuste debe ser AJUSTE_CONTEO o AJUSTE_MERMA_VENCIMIENTO',
  })
  movementType!: 'AJUSTE_CONTEO' | 'AJUSTE_MERMA_VENCIMIENTO';

  @IsOptional()
  @IsString()
  notes?: string;
}
