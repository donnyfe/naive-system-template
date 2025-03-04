import { hashSync } from 'bcryptjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { CreateUserDto, UpdateUserDto, GetUserListDto } from './user.dto'
import { RegisterUserDto } from '@/modules/auth/auth.dto'
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
    const { email, password } = userDto
    const existUser = await this.userRepo.findOne({
      where: { email },
    })

    if (existUser) {
      return responseFail(500, '用户已存在')
    }

    // 生成随机8位数包含大小写字母和数字的字符串
    const randomString = Math.random().toString(36).slice(2, 10)

    const userData = {
      email,
      password: hashSync(password),
      username: randomString,
      avatar: this.configService.get('initial.avatar'),
    }

    try {
      const userRepo = this.userRepo.create(userData)
      const user = await this.userRepo.save(userRepo)

      this.logger.log('用户注册成功', 'user-register', { userId: user.id })
    } catch (error) {
      this.logger.error('用户注册失败', error.stack, 'user-register')
      return responseFail(500, '用户注册失败')
    }

    return responseSuccess('用户注册成功')
  }

  async create(userDto: CreateUserDto) {
    // 根据用户名查重
    const { email } = userDto
    const existUser = await this.userRepo.findOne({
      where: { email },
    })

    if (existUser) {
      return responseFail(500, '用户已存在')
    }

    try {
      // 初始密码
      const password = this.configService.get('initial.password')

      const userData = {
        ...userDto,
        password,
      }
      const userRepo = this.userRepo.create(userData)
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
    console.log(`-----------------update ${id}: `, user)

    const findUser = await this.userRepo.findOne({
      where: { id },
    })

    const newUser = this.userRepo.merge(findUser, user)

    return await this.userRepo.save(newUser)
  }

  async findAll(query: GetUserListDto) {
    const pageNumber = query.pageNumber || 1
    const pageSize = query.pageSize || 10

    const [users, count] = await this.userRepo.findAndCount({
      where: {
        email: Like(`%${query.email || ''}%`),
      },
      order: {
        createTime: 'ASC',
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    })
    const list = users.map((item) => ({ ...item }))

    return { list, count }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { email }
      })
      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }
  /** 获取当前登录用户的详情信息 */
  async findUserInfo(id: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id },
        // 明确指定要查询的字段
        select: [
          'id',
          'avatar',
          'email',
          'username',
          'nickName',
          'phone',
          'remark',
          'sex',
          'createTime',
          'updateTime',
        ],
      })
      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getUserWithRoles(id: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id },
        relations: {
          userRoles: {
            role: true,
          },
        },
      })

      return {
      ...user,
        roles: user.userRoles.map((ur) => ur.role),
      }
    } catch (error) {
      throw new Error(error.message)
    }
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
    return responseSuccess('', savedUser)
  }

  async resetPassword(id: number, password: string) {
    const user = await this.userRepo.findOne({ where: { id } })
    user.password = hashSync(password)
    await this.userRepo.save(user)
    return null
  }
}
