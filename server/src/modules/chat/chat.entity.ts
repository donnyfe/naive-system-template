import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { MessageEntity } from '@/modules/chat-message/message.entity'
// import { FileEntity } from '@/modules/file/file.entity'

@Entity('chat')
export class ChatEntity {
  @PrimaryColumn()
  chatId: string

  @Column({ type: 'varchar', default: '', length: 255 })
  chatName: string

  @Column({ type: 'varchar', length: 32 })
  public username: string

  @Exclude()
  @Column({ type: 'tinyint', default: 0, comment: '0 normal, 1 deleted' })
  public delFlag: number

  @OneToMany(() => MessageEntity, (message) => message.chat, {
    createForeignKeyConstraints: false,
  })
  public messages: MessageEntity[]

  // @OneToMany(() => FileEntity, (file) => file.chat)
  // public files: FileEntity[]

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  public createTime: Date

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  public updateTime: Date
}
