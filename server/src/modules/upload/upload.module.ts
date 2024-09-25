import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { UploadEntity } from './upload.entity'
@Module({
  imports: [TypeOrmModule.forFeature([UploadEntity])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
