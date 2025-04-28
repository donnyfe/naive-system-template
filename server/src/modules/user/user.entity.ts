import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { UserRoleEntity } from '@/modules/role/user-role.entity'

@Entity('sys_user', { comment: '用户表' })
export class UserEntity {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  public id: number

  @Column({ type: 'varchar', length: 30, nullable: true, unique: true, comment: '用户名' })
  public username: string

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column({ type: 'varchar', length: 200, nullable: false, comment: '用户登录密码' })
  public password: string

  @Column({ type: 'varchar', nullable: true, length: 30, comment: '用户昵称' })
  public nickName: string

  @Column({ type: 'varchar', nullable: true, comment: '头像地址' })
  public avatar: string

  // 0男 1女 2未知
  @Column({ type: 'char', nullable: true, length: 1, comment: '性别' })
  public sex: string

  @Column({ type: 'varchar', nullable: true, length: 11, comment: '手机号码' })
  public phone: string

  @Column({ type: 'varchar', nullable: false, length: 50, comment: '邮箱' })
  public email: string

  @Column({ type: 'varchar', nullable: true, length: 50, comment: '备注' })
  public remark: string

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  public createTime: Date

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  public updateTime: Date

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[]
}
