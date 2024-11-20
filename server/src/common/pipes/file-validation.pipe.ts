import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
/**
 * 文件验证管道
 */
@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}
  transform(value: Express.Multer.File) {
    // 验证文件类型
    const validMimeTypes = [
      // 图片
      'image/jpeg',
      'image/png',
      // 视频
      'video/mp4',
      // 文档
      'application/pdf',
    ]
    if (!validMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException('Invalid file type')
    }

    // 验证文件大小
    const maxSize = this.configService.get('upload.maxSize')
    if (value.size > maxSize) {
      throw new BadRequestException('File too large')
    }

    return value
  }
}
