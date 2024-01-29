import { IsInt, IsString, MaxLength } from 'class-validator'

export class CreateTelegramBotDto {
  @IsString()
  @MaxLength(255)
  name: string

  @IsInt()
  @MaxLength(20)
  phone: number
}
