import { AuthService } from './auth.service'
import { Controller, Post, Request, UseGuards } from '@nestjs/common'

import { LocalAuthGuard } from './guards/local-auth.guard'
// import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guards'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sigin')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user)
  }
  // @Post('signup')
  // @UseGuards(LocalAuthGuard)
  // async register(@Request() req) {
  //   return this.authService.register(req.user)
  // }
  // @Post('logout')
  // @UseGuards(LocalAuthGuard)
  // async logout() {
  //   return this.authService.logout
  // }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user)
  }

  // @Get('main')
  // @UseGuards(JwtAuthGuard)
  // getProfile(@Request() req) {
  //   return req.user
  // }
}
