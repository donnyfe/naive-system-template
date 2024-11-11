import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { PagingDto } from '@/common/dto'

export class CreateRoleDto {
  @ApiProperty({ required: true, description: '角色编码' })
  @IsNotEmpty({ message: '角色编码不能为空' })
  @IsString()
  @Length(2, 30)
  code: string

  @ApiProperty({ required: true, description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString()
  @Length(2, 30)
  name: string

  @ApiProperty({ required: false, description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string

  @ApiProperty({ required: false, description: '排序' })
  @IsOptional()
  sort?: number

  @ApiProperty({ required: false, description: '状态:0-禁用,1-启用' })
  @IsOptional()
  status?: number
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({ required: true, description: '角色ID' })
  @IsNotEmpty({ message: '角色ID不能为空' })
  id: number
}

export class GetRoleListDto extends PagingDto {
  @ApiProperty({ required: false, description: '角色编码' })
  @IsOptional()
  @IsString()
  code?: string

  @ApiProperty({ required: false, description: '角色名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ required: false, description: '状态' })
  @IsOptional()
  status?: number
}

export class AssignRoleDto {
  @ApiProperty({ required: true, description: '用户ID' })
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: number

  @ApiProperty({ required: true, description: '角色ID列表' })
  @IsNotEmpty({ message: '角色ID列表不能为空' })
  roleIds: number[]
}
