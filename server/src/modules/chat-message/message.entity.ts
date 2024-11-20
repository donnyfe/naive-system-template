import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ChatEntity } from '../chat/chat.entity'

@Index('chat_message_chat_id_foreign', ['chatId'], {})
@Entity('chat_message')
export class MessageEntity {
  @PrimaryColumn({ type: 'varchar', default: '', length: 36 })
  messageId: string

  @Column({ type: 'varchar', default: '', length: 36 })
  previousId: string

  @Column({ type: 'varchar', default: '', length: 36 })
  chatId: string

  @Column({ type: 'text', nullable: true })
  messageText: string

  @Column({ type: 'tinyint', default: 0, comment: '1 completed, 0 not completed' })
  completed: number

  @Column({ type: 'tinyint', default: 0, comment: '0 normal, 1 deleted' })
  delFlag: number

  @Column('varchar', {})
  sender: string

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  public createTime: Date

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'chatId', referencedColumnName: 'chatId' }])
  chat: ChatEntity
}
