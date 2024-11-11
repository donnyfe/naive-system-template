import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { CreateRoleDto, UpdateRoleDto, GetRoleListDto, AssignRoleDto } from './role.dto'
import { JwtGuard } from '@/common/guards'

@ApiTags('角色管理')
@Controller('role')
@UseGuards(JwtGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get('list')
  @ApiOperation({ summary: '角色列表' })
  findAll(@Query() query: GetRoleListDto) {
    return this.roleService.findAll(query)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新角色' })
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('id') id: number) {
    return this.roleService.remove(id)
  }

  @Post('assign')
  @ApiOperation({ summary: '分配角色' })
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.roleService.assignRole(assignRoleDto)
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '获取用户角色' })
  getUserRoles(@Param('userId') userId: number) {
    return this.roleService.getUserRoles(userId)
  }
}
