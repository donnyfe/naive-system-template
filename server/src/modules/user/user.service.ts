import { hashSync } from 'bcryptjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { CreateUserDto, UpdateUserDto, GetUserListDto } from './user.dto'
import { RegisterUserDto } from '@/core/auth/auth.dto'
import { UserRoleEntity } from '@/modules/role/user-role.entity'
import { LoggerService } from '@/core/logger/logger.service'
import { responseSuccess, responseFail } from '@/utils'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private logger: LoggerService,
    private configService: ConfigService,
  ) {}

  async register(userDto: RegisterUserDto) {
    // 根据用户名查重
    const { username } = userDto
    const existUser = await this.userRepo.findOne({
      where: { username },
    })

    if (existUser) {
      return responseFail(500, '用户已存在')
    }

    if (userDto.password) {
      userDto.password = hashSync(userDto.password)
    }

    try {
      const userRepo = this.userRepo.create(userDto)
      const user = await this.userRepo.save(userRepo)

      this.logger.log('用户注册成功', 'UserService.register', { userId: user.id })
    } catch (error) {
      this.logger.error('用户注册失败', error.stack, 'UserService.register')
      return responseFail(500, '用户注册失败')
    }

    return responseSuccess(null, '用户注册成功')
  }

  async create(userDto: CreateUserDto) {
    // 根据用户名查重
    const { username } = userDto
    const existUser = await this.userRepo.findOne({
      where: { username },
    })

    if (existUser) {
      return responseFail(500, '用户已存在')
    }

    try {
      // 初始密码
      const initialPassword = this.configService.get('user.initialPassword')

      const newUser = {
        ...userDto,
        password: hashSync(initialPassword),
      }
      const userRepo = this.userRepo.create(newUser)
      await this.userRepo.save(userRepo)

      this.logger.log('用户创建成功', 'UserService.create', { userId: userRepo.id })
    } catch (error) {
      this.logger.log('用户创建失败', error.stack, 'UserService.create')

      return responseFail(500, '用户创建失败')
    }
    return responseSuccess('用户创建成功')
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    })
    // 不能删除自己
    if (id === user.id) {
      return responseFail(500, '不能删除自己')
    }
    await this.userRepo.delete(id)
    return true
  }

  async update(id: number, user: UpdateUserDto) {
    const findUser = await this.userRepo.findOne({
      where: { id },
    })

    const newUser = this.userRepo.merge(findUser, user)

    await this.userRepo.save(newUser)
    return responseSuccess(newUser)
  }

  async findAll(query: GetUserListDto) {
    const pageNumber = query.pageNumber || 1
    const pageSize = query.pageSize || 10

    const [users, count] = await this.userRepo.findAndCount({
      where: {
        username: Like(`%${query.username || ''}%`),
      },
      order: {
        createTime: 'ASC',
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    })
    const list = users.map((item) => ({ ...item }))

    return responseSuccess({ list, count })
  }

  async findByUsername(username: string) {
    try {
      return await this.userRepo.findOne({
        where: { username },
        select: ['username', 'password'],
      })
    } catch (err) {
      console.log(err)
    }
  }

  async findUserInfo(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    })
    return responseSuccess({ ...user })
  }

  async getUserWithRoles(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        userRoles: {
          role: true,
        },
      },
    })

    return responseSuccess({
      ...user,
      roles: user.userRoles.map((ur) => ur.role),
    })
  }

  async assignRoles(userId: number, roleIds: number[]) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        userRoles: {
          role: true,
        },
      },
    })

    // 更新用户角色
    user.userRoles = roleIds.map((roleId) => {
      const userRole = new UserRoleEntity()
      userRole.userId = userId
      userRole.roleId = roleId
      return userRole
    })

    // 保存更新后的用户
    const savedUser = await this.userRepo.save(user)
    return responseSuccess(savedUser)
  }

  async resetPassword(id: number, password: string) {
    const user = await this.userRepo.findOne({ where: { id } })
    user.password = hashSync(password)
    await this.userRepo.save(user)
    return true
  }
}
