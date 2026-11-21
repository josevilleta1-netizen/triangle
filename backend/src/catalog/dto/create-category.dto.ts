import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(80, { message: 'El nombre no puede exceder 80 caracteres' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'El icono debe ser una cadena de texto' })
  @MaxLength(40, { message: 'El icono no puede exceder 40 caracteres' })
  icon?: string;
}
