import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class TelegramBot {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  number: number
}
