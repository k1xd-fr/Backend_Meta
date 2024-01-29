import { Module } from '@nestjs/common'
import { TelegramBotService } from './telegram_bot.service'
import { TelegramBotController } from './telegram_bot.controller'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [TelegramBotController],
  providers: [TelegramBotService],
})
export class TelegramBotModule {}
