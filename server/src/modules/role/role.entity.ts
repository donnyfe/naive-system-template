import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { UserRoleEntity } from './user-role.entity'

/**
 * 定义角色表
 */
@Entity('sys_role')
export class RoleEntity {
  @PrimaryGeneratedColumn({ comment: '角色ID' })
  id: number

  @Column({ type: 'varchar', length: 30, unique: true, comment: '角色编码' })
  code: string

  @Column({ type: 'varchar', length: 30, comment: '角色名称' })
  name: string

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '备注' })
  remark: string

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number

  @Column({ type: 'tinyint', default: 1, comment: '状态:0-禁用,1-启用' })
  status: number

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: Date

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updateTime: Date

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRoles: UserRoleEntity[]
}
