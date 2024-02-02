import { AuthService } from './auth.service'
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'

import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AccessTokenGuard } from './guards/jwt-auth.guard'
import { RefreshTokenGuard } from './guards/refresh-jwt-auth.guards'
import { AuthDto } from './dto/auth.dto'
interface ExtendedRequest extends Request {
  user?: any
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sigin')
  async sigin(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto)
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto)
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: ExtendedRequest) {
    const userId = req.user.sub
    await this.authService.logout(userId)

    return { message: 'Logout successful' }
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@Req() req) {
    const userId = req.user.sub
    const refreshToken = req.headers['authorization']?.replace('Bearer ', '')

    return this.authService.refreshTokens(userId, refreshToken)
  }
}
