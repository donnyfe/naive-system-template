import { ApiProperty } from '@nestjs/swagger'

export class UploadIdDto {
  /** 文件上传ID */
  @ApiProperty({ type: 'string', description: '文件上传ID' })
  uploadId: string
}

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any
}

export class ChunkDto {
  /** 文件上传ID */
  @ApiProperty({ type: 'string', description: '文件上传ID' })
  uploadId: string

  /** 文件名 */
  @ApiProperty({ type: 'string', description: '文件名' })
  name: string

  /** 文件哈希 */
  @ApiProperty({ type: 'string', description: '文件哈希' })
  hash: string

  /** 切片索引 */
  @ApiProperty({ type: 'string', description: '切片索引' })
  index: string

  /** 切片总数 */
  @ApiProperty({ type: 'string', description: '切片总数' })
  chunkTotal: string
}
