import { PagingDto } from '@/common/dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

// 创建用户数据对象
export class CreateUserDto {
  @ApiProperty({ required: false, description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @Length(6, 20, { message: '用户名长度必须大于6到20之间' })
  username?: string

  @ApiProperty({ required: false, description: '用户昵称' })
  @IsOptional()
  @IsNotEmpty({ message: '用户昵称不能为空' })
  @IsString()
  nickName?: string

  @ApiProperty({ required: false, nullable: true, description: '性别; 0-男,1-女' })
  @IsOptional()
  sex?: string

  @ApiProperty({ required: false, default: '', description: '手机号' })
  @IsOptional()
  @IsMobilePhone()
  phone?: string

  @ApiProperty({ required: true, default: '', description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email: string

  // @ApiProperty({ required: false, description: '用户角色' })
  // @IsOptional()
  // @IsArray()
  // roles?: string[]

  @ApiProperty({ required: false, default: '', description: '备注信息' })
  @IsOptional()
  remark?: string
}

// 更新用户数据对象
export class UpdateUserDto {
  @ApiProperty({ required: true, description: '用户id' })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: number

  @ApiProperty({ required: false, description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @Length(6, 20, { message: '用户名长度必须大于6到20之间' })
  username?: string

  @ApiProperty({ required: false, description: '用户昵称' })
  @IsOptional()
  @IsNotEmpty({ message: '用户昵称不能为空' })
  @IsString()
  nickName?: string

  @ApiProperty({ required: false, nullable: true, description: '性别; 0-男,1-女' })
  @IsOptional()
  sex?: string

  @ApiProperty({ required: false, default: '', description: '手机号' })
  @IsOptional()
  @IsMobilePhone()
  phone?: string

  @ApiProperty({ required: false, default: '', description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string

  // @ApiProperty({ required: false, description: '用户角色' })
  // @IsOptional()
  // @IsArray()
  // roles?: string[]

  @ApiProperty({ required: false, default: '', description: '备注信息' })
  @IsOptional()
  remark?: string
}

export class GetUserListDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  username?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  nickName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  email?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sex?: string
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度必须大于6到20之间' })
  password: string
}

// export class GetUserDto {
//   @Allow()
//   pageSize: number

//   @Allow()
//   pageNumber: number

//   @Allow()
//   username: string

//   @Allow()
//   sex: string

//   @Allow()
//   role: number
// }

// export class AddUserRolesDto {
//   @IsArray()
//   roleIds: number[]
// }
