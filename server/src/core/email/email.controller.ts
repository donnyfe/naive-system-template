import { Controller, Get, Post, HttpCode, UseGuards, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { responseFail } from '@/utils';

@ApiTags('邮箱')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {

  }

  @Post('send')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发送邮件' })
  @UseGuards(AuthGuard('jwt'))
  send() {
    // this.emailService.sendEmail()
    return responseFail(500, '邮箱发送错误')
  }

}
