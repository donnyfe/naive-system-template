import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ChatDto {
  @ApiProperty({ required: true, description: '对话Id' })
  @IsNotEmpty({ message: '对话Id不能为空' })
  @IsString()
  chatId: string

  @ApiProperty({ required: true, description: '上一消息Id' })
  @IsNotEmpty({ message: '上一条消息Id不能为空' })
  @IsString()
  previousId: string
}

export class CreateChatDto {
  @ApiProperty({ required: true, description: '对话名称' })
  @IsNotEmpty({ message: '对话名称不能为空' })
  @IsString()
  chatName: string
}

export class UpdateChatDto extends CreateChatDto {
  @ApiProperty({ required: true, description: '对话Id' })
  @IsNotEmpty({ message: '对话Id不能为空' })
  @IsString()
  chatId: string

  // @ApiProperty({ required: false, description: '对话用户' })
  // @IsOptional()
  // @IsString()
  // username?: string
}
