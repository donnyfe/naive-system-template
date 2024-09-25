import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('upload', { comment: '文件上传记录' })
export class UploadEntity {
  @PrimaryColumn({ type: 'varchar', comment: '任务Id' })
  uploadId: string

  @Column({ type: 'varchar', comment: '文件名' })
  fileName: string

  @Column({ type: 'varchar', comment: '文件路径' })
  filePath: string

  @Column({ type: 'varchar', comment: '文件地址' })
  url: string

  @Column({ type: 'int', comment: '文件大小' })
  size: number

  @Column({ type: 'varchar', comment: '拓展名', nullable: true })
  ext: string
}
