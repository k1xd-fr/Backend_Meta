import { IsEmail, IsOptional, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  @MinLength(6, { message: 'Пароль должен быть больше 6' })
  password: string

  @IsOptional()
  refresh_token: string
}
