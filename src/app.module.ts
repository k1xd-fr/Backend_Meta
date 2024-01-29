// import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TelegramBotModule } from './telegram_bot/telegram_bot.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    TelegramBotModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST'),
    //     port: configService.get('DB_PORT'),
    //     username: configService.get('DB_USERNAME'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME'),
    //     synchronize: true,
    //     entities: [__dirname + '/**/*.entity{.js, .ts}'],
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
