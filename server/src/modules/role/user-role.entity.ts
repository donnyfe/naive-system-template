import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { UserEntity } from '@/modules/user/user.entity'
import { RoleEntity } from './role.entity'

/**
 * 定义用户角色关联表
 */
@Entity('sys_user_sys_role')
export class UserRoleEntity {
  @PrimaryColumn()
  userId: number

  @PrimaryColumn()
  roleId: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity
}
