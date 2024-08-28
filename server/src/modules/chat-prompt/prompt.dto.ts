import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

// 添加
export class CreatePromptDto {
  @ApiProperty({ required: true, description: '提示标题' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ required: true, description: '提示内容' })
  @IsNotEmpty()
  @IsString()
  content: string
}

// 修改
export class UpdatePromptDto extends CreatePromptDto {
  @ApiProperty({ required: true, description: '提示Id' })
  @IsNotEmpty()
  @IsString()
  promptId: string
}
