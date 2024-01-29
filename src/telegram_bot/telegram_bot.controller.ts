import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { TelegramBotService } from './telegram_bot.service'
import { ConfigService } from '@nestjs/config'

@Controller('telegramBot')
export class TelegramBotController {
  private readonly telegramToken: string
  constructor(
    private readonly telegramService: TelegramBotService,
    private readonly configService: ConfigService,
  ) {
    this.telegramToken = this.configService.get<string>('TELEGRAM_TOKEN')
  }

  @Post()
  sendMessage(
    @Body() requestBody: { name: string; phone: string },
  ): Promise<any> {
    const { name, phone } = requestBody
    return this.telegramService.sendMessageToTelegram(name, phone)
  }
  @Get()
  getContacts(@Query('access_token') accessToken: string): any {
    if (accessToken === this.telegramToken) {
      return this.telegramService.getAllContacts()
    } else {
      throw new UnauthorizedException('Invalid access token')
    }
  }
}
