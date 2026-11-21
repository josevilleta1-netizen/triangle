import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UnlockPinDto {
  @IsNotEmpty({ message: 'El PIN de terminal es obligatorio' })
  @IsString({ message: 'El PIN debe ser una cadena de texto' })
  @Length(4, 6, { message: 'El PIN debe tener entre 4 y 6 dígitos' })
  pin!: string;
}
