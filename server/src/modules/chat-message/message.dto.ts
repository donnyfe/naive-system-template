import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateMessageDto {
  @ApiProperty({ required: true, description: '对话Id' })
  @IsString()
  chatId: string

  @ApiProperty({ required: false, description: '上一条消息Id' })
  @IsOptional()
  @IsString()
  previousId?: string

  @ApiProperty({ required: true, description: '消息文本' })
  @IsString()
  messageText: string

  @ApiProperty({ required: true, description: '发送者' })
  @IsString()
  sender: string

  @ApiProperty({ required: false, description: '消息状态: 0 未完成, 1 已完成' })
  @IsOptional()
  @IsNumber()
  completed?: number
}

export class UpdateMessageDto extends CreateMessageDto {
  @ApiProperty({ required: true, description: '发送者' })
  @IsString()
  messageId: string
}
