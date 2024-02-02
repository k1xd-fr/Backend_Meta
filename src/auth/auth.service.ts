import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { ConfigService } from '@nestjs/config'
import { AuthDto } from './dto/auth.dto'
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signIn(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email)

    if (!user) throw new BadRequestException('Нету такого пользователя')

    const passwordMatches = await argon2.verify(user.password, data.password)

    if (!passwordMatches) throw new UnauthorizedException('Пароль не верный')

    const tokens = await this.generateTokens(user.id, user.email)

    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const newUser = await this.usersService.create(createUserDto)

    const tokens = await this.generateTokens(newUser.id, newUser.email)

    await this.updateRefreshToken(newUser.id, tokens.refreshToken)

    return tokens
  }
  async logout(userId: number) {
    return this.usersService.update(userId, { refresh_token: null })
  }
  async generateTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '7m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7h',
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  hashData(data: string) {
    return argon2.hash(data)
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken)
    await this.usersService.update(userId, {
      refresh_token: hashedRefreshToken,
    })
  }
  // auth.service.ts

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId)

    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access Denied')

    const refreshTokenMatches = await argon2.verify(
      user.refresh_token,
      refreshToken,
    )

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied')
    const tokens = await this.generateTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }
}
