import { IsNotEmpty, IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateBatchDto {
  @IsNotEmpty({ message: 'El producto es obligatorio' })
  @IsString()
  productId!: string;

  @IsNotEmpty({ message: 'El número de lote es obligatorio' })
  @IsString()
  batchNumber!: string;

  @IsNotEmpty({ message: 'La fecha de vencimiento es obligatoria' })
  @IsDateString({}, { message: 'La fecha de vencimiento debe tener formato ISO válido (YYYY-MM-DD)' })
  expirationDate!: string;

  @IsNotEmpty({ message: 'La cantidad inicial es obligatoria' })
  @IsNumber({}, { message: 'La cantidad inicial debe ser numérica' })
  @Min(0.001, { message: 'La cantidad debe ser mayor a 0' })
  initialQuantity!: number;
}
