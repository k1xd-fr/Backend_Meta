import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    })
    if (existUser) throw new BadRequestException('Этот email занят!')
    const hashedPassword = await argon2.hash(createUserDto.password)

    const user = await this.usersRepository.save({
      email: createUserDto.email,
      password: hashedPassword,
    })
    return { user }
  }

  async findAll() {
    return await this.usersRepository.find()
  }

  async findOne(id: number) {
    const isExist = await this.usersRepository.findOne({ where: { id } })
    if (!isExist) throw new NotFoundException('Такого пользователя нету')

    return isExist
  }

  async findEmail(email: string) {
    const isExist = await this.usersRepository.findOne({ where: { email } })
    if (!isExist) throw new NotFoundException('Такого пользователя нету')

    return isExist
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    })
    if (!user) throw new NotFoundException('Такого пользователя нету')
    if (updateUserDto.password) {
      const hashedPassword = await argon2.hash(updateUserDto.password)
      updateUserDto.password = hashedPassword
    }

    return await this.usersRepository.update(id, updateUserDto)
  }
  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    })
    if (!user) throw new NotFoundException('Такого пользователя нету')
    return await this.usersRepository.delete(id)
  }
  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user)
  }
}
