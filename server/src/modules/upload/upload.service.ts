import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import fs from 'fs'
import path from 'path'
import iconv from 'iconv-lite'
import { UploadEntity } from './upload.entity'
import { ChunkDto } from './upload.dto'
import { responseSuccess, responseFail, generateUUID } from '@/utils'

@Injectable()
export class UploadService {
  private uploadDirPath: string
  private chunkDirPath: string

  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadEntityRep: Repository<UploadEntity>,
    @Inject(ConfigService)
    private config: ConfigService,
  ) {
    // 上传目录路径
    this.uploadDirPath = path.join(process.cwd(), this.config.get('upload.dest'))

    // 切片目录路径
    this.chunkDirPath = path.join(this.uploadDirPath, 'chunk')
  }

  /**
   * 获取文件上传任务Id
   * @returns
   */
  async getUploadId() {
    const uploadId = generateUUID()
    return responseSuccess('', { uploadId })
  }

  /**
   * 文件上传
   * @param file
   * @returns
   */
  async uploadFile(file: Express.Multer.File) {
    const fileSize = (file.size / 1024 / 1024).toFixed(2)
    if (fileSize > this.config.get('upload.maxSize')) {
      return responseFail(500, `文件大小不能超过${this.config.get('upload.maxSize')}MB`)
    }
    let result = await this.saveFileLocal(file)

    return responseSuccess('', result)
  }

  /**
   * 保存文件到本地
   * @param file
   */
  async saveFileLocal(file: Express.Multer.File) {
    // 对文件名转码
    const fileName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf8')
    // 文件路径
    const targetFile = path.join(this.uploadDirPath, fileName)
    // 文件目录
    const sourceFilesDir = path.dirname(targetFile)
    // 文件相对地址
    const relativeFilePath = targetFile.replace(this.uploadDirPath, '')

    if (!fs.existsSync(sourceFilesDir)) {
      this.mkdirsSync(sourceFilesDir)
    }
    fs.writeFileSync(targetFile, file.buffer)

    //文件服务完整路径
    const filePath = path.join(this.config.get('upload.serveRoot'), relativeFilePath)
    const url = path.join(this.config.get('upload.domain'), filePath)

    let result = {
      fileName,
      filePath,
      url,
    }
    await this.uploadEntityRep.save({
      uploadId: generateUUID(),
      ext: path.extname(result.fileName),
      size: file.size,
      ...result,
    })
    return result
  }

  /**
   * 检查切片
   */
  checkChunk(body: ChunkDto) {
    const chunkDirPath = path.join(this.chunkDirPath, body.hash)
    // 切片状态列表
    let chunkList = []

    // 判断切片目录
    if (fs.existsSync(chunkDirPath)) {
      // 读取切片 & 过滤
      const chunks = fs.readdirSync(chunkDirPath).filter((filename) => filename.includes(body.hash))

      if (chunks.length > 0) {
        // 初始切片状态
        chunkList = new Array<boolean>(+body.chunkTotal).fill(false)
        // 根据切片索引设置切片状态
        chunks.forEach((chunk) => {
          // 已有切片索引
          const chunkIndex = +chunk.split('_').at(-1)
          chunkList[chunkIndex] = true
        })
      }
    } else {
    }
    return responseSuccess('', chunkList)
  }

  /**
   * 文件切片上传
   */
  async uploadChunk(file: Express.Multer.File, body) {
    const chunkDirPath = path.join(this.chunkDirPath, body.hash)

    if (!fs.existsSync(chunkDirPath)) {
      this.mkdirsSync(chunkDirPath)
    }
    const chunkPath = path.join(chunkDirPath, `${body.hash}_${body.index}`)
    if (fs.existsSync(chunkPath)) {
      return responseSuccess()
    } else {
      fs.writeFileSync(chunkPath, file.buffer)
      return responseSuccess()
    }
  }

  /**
   * 递归创建目录 同步方法
   * @param dirname
   * @returns
   */
  mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  }

  /**
   * 文件切片合并
   */
  async mergeChunk(body: ChunkDto) {
    const chunkDirPath = path.join(this.chunkDirPath, body.hash)

    if (!fs.existsSync(chunkDirPath)) {
      return responseFail(500, '文件不存在')
    }
    const targetFile = path.join(this.uploadDirPath, body.name)

    await this.mergeChunkStream(chunkDirPath, targetFile)
    //文件相对地址
    const relativeFilePath = targetFile.replace(this.uploadDirPath, '')
    const filePath = path.join(this.config.get('upload.dest'), relativeFilePath)
    const url = path.join(this.config.get('upload.domain'), filePath)

    const stats = fs.statSync(targetFile)

    const result = {
      fileName: body.name,
      filePath,
      url,
    }

    await this.uploadEntityRep.save({
      uploadId: generateUUID(),
      ext: path.extname(result.fileName),
      size: stats.size,
      ...result,
    })
    return responseSuccess('', result)
  }

  /**
   * 文件合并
   * @param {string} sourceFiles 源文件目录
   * @param {string} targetFile 目标文件路径
   */
  async mergeChunkStream(sourceFilesDir, targetFile) {
    const fileList = fs
      .readdirSync(sourceFilesDir)
      .filter((file) => fs.lstatSync(path.join(sourceFilesDir, file)).isFile())
      .sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]))
      .map((name) => ({
        name,
        filePath: path.join(sourceFilesDir, name),
      }))

    const fileWriteStream = fs.createWriteStream(targetFile)

    let onResolve: (value) => void
    const callbackPromise = new Promise((resolve) => {
      onResolve = resolve
    })

    this.mergeChunkStreamProgress(fileList, fileWriteStream, sourceFilesDir, onResolve)
    return callbackPromise
  }

  /**
   * 合并每一个切片
   * @param {Array} fileList 文件数据列表
   * @param {WritableStream} fileWriteStream 最终的写入结果流
   * @param {string} sourceFilesDir 源文件目录
   */
  mergeChunkStreamProgress(fileList, fileWriteStream, sourceFilesDir, onResolve) {
    if (!fileList.length) {
      // 删除临时目录
      fs.rmSync(sourceFilesDir, { recursive: true })
      onResolve()
      return
    }

    const { filePath } = fileList.shift()
    const currentReadStream = fs.createReadStream(filePath)

    // 把结果往最终的生成文件上进行拼接
    currentReadStream.pipe(fileWriteStream, { end: false })

    currentReadStream.on('end', () => {
      // 拼接完之后进入下一次循环
      this.mergeChunkStreamProgress(fileList, fileWriteStream, sourceFilesDir, onResolve)
    })
  }

  /**
   * 上传进度
   */
  getUploadProgress(query) {
    const chunkDirPath = path.join(this.chunkDirPath, query.hash)
    let uploadedSize = 0

    if (fs.existsSync(chunkDirPath)) {
      // 读取切片
      const chunks = fs.readdirSync(chunkDirPath).filter((filename) => filename.includes(query.hash))
      if (chunks.length > 0) {
        uploadedSize = chunks
          .map((chunk) => {
            // 读取切片文件信息
            const chunkFile = path.join(chunkDirPath, chunk)
            const stats = fs.statSync(chunkFile)
            return stats.size
          })
          .reduce((pre, cur) => pre + cur, 0)
      }
    }
    let progress = Math.ceil((uploadedSize / query.totalSize) * 100)
    return responseSuccess('', { progress })
  }

  /**
   * 生成新的文件名
   * @param originalname
   * @returns
   */
  getNewFileName(originalname: string): string {
    if (!originalname) {
      return originalname
    }
    const fileNameArr = originalname.split('.')
    fileNameArr[fileNameArr.length - 2] = `${fileNameArr[fileNameArr.length - 2]}_${new Date().getTime()}`
    return fileNameArr.join('.')
  }
}
