import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El usuario o correo electrónico es obligatorio' })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  usernameOrEmail!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password!: string;
}
