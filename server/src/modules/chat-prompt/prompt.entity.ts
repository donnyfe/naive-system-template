import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'

@Entity('chat_prompt')
export class PromptEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  public promptId: string

  @Column({ type: 'varchar', default: '', length: 32 })
  public title: string

  @Column({ type: 'varchar', default: '', length: 1024 })
  public content: string

  @Column({ type: 'varchar', default: '', length: 32 })
  public username: string

  @Column({ type: 'tinyint', default: 0, comment: '0 normal, 1 deleted' })
  @IsNotEmpty()
  public delFlag: number

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  public createTime: Date

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  public updateTime: Date
}
