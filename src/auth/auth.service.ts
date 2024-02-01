import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { iUser } from 'src/types/types'
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findEmail(email)
    const passwordIsMatch = await argon2.verify(user.password, password)

    if (user && passwordIsMatch) {
      return user
    }
    throw new UnauthorizedException('Пароль не верный')
  }
  async login(user: iUser) {
    const { id, email } = user
    return {
      id,
      email,
      accesToken: this.jwtService.sign({ id: user.id, email: user.email }),
      refreshToken: this.jwtService.sign(
        { id: user.id, email: user.email },
        { expiresIn: '7d' },
      ),
    }
  }
  // async register(user: iUser) {}

  async refreshToken(user: iUser) {
    return {
      accesToken: this.jwtService.sign({ id: user.id, email: user.email }),
    }
  }
  async generateTokens(payload) {}
  // async logout(user: iUser) {}
}
