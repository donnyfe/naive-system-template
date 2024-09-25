import { Controller, Get, Post, Body, Query, UploadedFile, UseInterceptors, HttpCode } from '@nestjs/common'
import { UploadService } from './upload.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger'
import { UploadFileDto, UploadIdDto } from './upload.dto'

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 获取文件上传任务Id
   * @param file
   * @returns
   */
  @ApiOperation({ summary: '获取文件上传任务Id' })
  @ApiBody({ required: true })
  @HttpCode(200)
  @Get('/getUploadId')
  getUploadId() {
    return this.uploadService.getUploadId()
  }

  /**
   * 单文件上传
   * @param file
   * @returns
   */
  @ApiOperation({ summary: '文件上传' })
  @ApiBody({ type: UploadFileDto, required: true })
  @HttpCode(200)
  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file)
  }

  /**
   * 文件切片上传
   * @param file
   * @returns
   */
  @ApiOperation({ summary: '文件切片上传' })
  @ApiBody({ required: true })
  @HttpCode(200)
  @Post('/chunk')
  @UseInterceptors(FileInterceptor('file'))
  uploadChunk(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return this.uploadService.uploadChunk(file, body)
  }

  /**
   * 文件切片合并
   * @returns
   */
  @ApiOperation({ summary: '合并切片' })
  @ApiBody({ required: true })
  @HttpCode(200)
  @Post('/chunk/merge')
  mergeChunk(@Body() body: any) {
    return this.uploadService.mergeChunk(body)
  }

  /**
   * 检查切片
   * @returns
   */
  @ApiOperation({ summary: '检查分片' })
  @ApiQuery({ type: UploadIdDto, required: true })
  @HttpCode(200)
  @Get('/chunk/check')
  checkChunk(@Query() query) {
    return this.uploadService.checkChunk(query)
  }

  /**
   * 获取上传进度
   * @returns
   */
  @ApiOperation({ summary: '上传进度' })
  @ApiQuery({ type: UploadIdDto, required: true })
  @HttpCode(200)
  @Get('/progress')
  getUploadProgress(@Query() query) {
    return this.uploadService.getUploadProgress(query)
  }
}
