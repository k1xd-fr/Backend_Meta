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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, refresh_token } = createUserDto

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    })
    if (existingUser) {
      throw new BadRequestException('Этот email занят!')
    }

    const hashedPassword = await argon2.hash(password)

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      refresh_token,
    })

    const savedUser = await this.usersRepository.save(newUser)

    return savedUser
  }

  async findAll() {
    return await this.usersRepository.find()
  }

  async findById(id: number) {
    const isExist = await this.usersRepository.findOne({ where: { id } })
    if (!isExist) throw new NotFoundException('Такого пользователя нету')

    return isExist
  }

  async findByEmail(email: string) {
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
}
