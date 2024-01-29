import { Injectable } from '@nestjs/common'
// import { Repository } from 'typeorm'
// import { CreateTelegramBotDto } from './dto/create-telegram_bot.dto'
// import { TelegramBot } from './entities/telegram_bot.entity'

@Injectable()
export class TelegramBotService {
  private forms: { name: string; phone: string }[] = []

  // constructor(
  //   //* future send to db
  // private readonly TelegramBotRepository: Repository<TelegramBot>,
  // ) {
  // }

  async sendMessageToTelegram(name: string, phone: string): Promise<any> {
    try {
      this.forms.push({ name, phone })

      return 200
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error.response.data)
      throw error
    }
  }
  getAllContacts(): { name: string; phone: string }[] {
    const currentForms = [...this.forms]

    this.forms = []

    return currentForms
  }
}
