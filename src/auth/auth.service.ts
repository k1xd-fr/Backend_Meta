import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
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
  async login({ email, password }: iUser) {
    const user = await this.validateUser(email, password)

    const { id, email: userEmail } = user

    const { accessToken, refreshToken } = this.generateTokens({
      id,
      email: userEmail,
    })
    await this.saveRefreshToken(id, refreshToken)

    return {
      id,
      email: userEmail,
      accessToken,
      refreshToken,
    }
  }
  // async register(user: iUser) {}

  async refreshToken(id: number) {
    const user = await this.usersService.findOne(id)

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден')
    }
    const { accessToken, refreshToken } = this.generateTokens({
      id: user.id,
      email: user.email,
    })

    await this.saveRefreshToken(id, refreshToken)

    return {
      accessToken,
      refreshToken,
    }
  }
  private generateTokens(payload: { id: number; email: string }) {
    const { id, email } = payload
    const accessToken = this.jwtService.sign({ id, email }, { expiresIn: '7m' })
    const refreshToken = this.jwtService.sign(
      { id, email },
      { expiresIn: '7d' },
    )

    return {
      accessToken,
      refreshToken,
    }
  }
  private async saveRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.usersService.findOne(id)

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    user.refresh_token = refreshToken

    await this.usersService.save(user)
  }
  // async logout(user: iUser) {}
}
