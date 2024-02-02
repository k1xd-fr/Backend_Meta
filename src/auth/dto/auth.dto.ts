import { IsEmail, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  email: string

  @MinLength(6, { message: 'Пароль должен быть больше 6' })
  password: string
}
