import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { RoleEntity } from './role.entity'
import { UserRoleEntity } from './user-role.entity'
import { CreateRoleDto, UpdateRoleDto, GetRoleListDto, AssignRoleDto } from './role.dto'
import { responseSuccess, responseFail } from '@/utils'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepo: Repository<UserRoleEntity>,
  ) {}

  async create(roleDto: CreateRoleDto) {
    // 检查角色编码是否存在
    const existRole = await this.roleRepo.findOne({
      where: { code: roleDto.code },
    })

    if (existRole) {
      return responseFail(500, '角色编码已存在')
    }

    try {
      const role = this.roleRepo.create(roleDto)
      await this.roleRepo.save(role)
      return responseSuccess(null, '角色创建成功')
    } catch (err) {
      return responseFail(500, '角色创建失败')
    }
  }

  async update(id: number, roleDto: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id } })
    if (!role) {
      return responseFail(500, '角色不存在')
    }

    // 检查新的角色编码是否与其他角色冲突
    if (roleDto.code !== role.code) {
      const existRole = await this.roleRepo.findOne({
        where: { code: roleDto.code },
      })
      if (existRole) {
        return responseFail(500, '角色编码已存在')
      }
    }

    try {
      const newRole = this.roleRepo.merge(role, roleDto)
      await this.roleRepo.save(newRole)
      return responseSuccess(null, '角色更新成功')
    } catch (err) {
      return responseFail(500, '角色更新失败')
    }
  }

  async remove(id: number) {
    // 检查角色是否被用户使用
    const userRole = await this.userRoleRepo.findOne({
      where: { roleId: id },
    })
    if (userRole) {
      return responseFail(500, '该角色已被用户使用,不能删除')
    }

    try {
      await this.roleRepo.delete(id)
      return responseSuccess(null, '角色删除成功')
    } catch (err) {
      return responseFail(500, '角色删除失败')
    }
  }

  async findAll(query: GetRoleListDto) {

    const pageNumber = query.pageNumber || 1
    const pageSize = query.pageSize || 10

    // 构建 where 条件
    const where: any = {}

    if (query.code?.trim()) {
      where.code = Like(`%${query.code.trim()}%`)
    }

    if (query.name?.trim()) {
      where.name = Like(`%${query.name.trim()}%`)
    }

    // status 可能为 0,所以要用 !== undefined 判断
    if (typeof query.status === 'number') {
      where.status = Number(query.status)
    }

    const [roles, total] = await this.roleRepo.findAndCount({
      where,
      order: {
        sort: 'ASC',
        createTime: 'DESC',
      },
      skip: (pageNumber - 1) * pageSize,
      // take: pageSize,
    })

    console.log(roles, total)

    return responseSuccess({
      list: roles,
      total,
    })
  }

  async assignRole(assignDto: AssignRoleDto) {
    try {
      // 删除用户原有角色
      await this.userRoleRepo.delete({ userId: assignDto.userId })

      // 分配新角色
      const userRoles = assignDto.roleIds.map((roleId) => ({
        userId: assignDto.userId,
        roleId,
      }))
      await this.userRoleRepo.save(userRoles)

      return responseSuccess(null, '角色分配成功')
    } catch (err) {
      return responseFail(500, '角色分配失败')
    }
  }

  async getUserRoles(userId: number) {
    const userRoles = await this.userRoleRepo.find({
      where: { userId },
      relations: ['role'],
    })
    return responseSuccess(userRoles.map((ur) => ur.role))
  }
}
