import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenStrategy } from './strategies/jwt.strategy'
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy.ts'

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
