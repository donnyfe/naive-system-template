import { Client } from 'ssh2'
import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { BaseDeploy } from './BaseDeploy.mjs'

// 服务器部署类
export class ServerDeploy extends BaseDeploy {
  constructor(options) {
    super()
    this.options = options
    this.client = new Client()
  }

  async deploy() {
    try {
      // await this.compression()

      try {
        this.log.info('开始部署服务器...')
        await this.connect(async () => {
          await this.upload()
          await this.runShell(this.options.shell)
        })
      } catch (error) {
        this.log.error(`部署失败: ${error}`)
        throw error
      }
    } finally {
      this.client?.end()
    }
  }

  async compression() {
    this.log.info('正在压缩代码包...')
    await this.execCommand('tar zcvf dist.tar.gz dist')
    this.log.success('代码包压缩成功!')
  }

  /**
   * 连接服务器
   */
  async connect(excutor) {
    return new Promise((resolve, reject) => {
      this.log.info('正在登录远程服务器...')
      // 连接ssh上传
      this.client.connect(this.options.ssh).on('ready', async () => {
        this.log.info('ssh2连接成功!')

        await excutor(this.client)
        // resolve(excutor(this.client))
        resolve()
      })
    })
  }

  /**
   * 上传资源文件
   */
  async upload() {
    return new Promise((resolve, reject) => {
      this.client.sftp(async (err, sftp) => {
        if (err) {
          this.log.error('SFTP连接失败')
          return reject(err)
        }

        const { files, serverRootPath } = this.options
        const localRootPath = process.cwd()

        let uploadFiles = []
        if (!files.length) {
          uploadFiles = await fs.readdir(localRootPath)
        } else {
          uploadFiles = files
        }

        uploadFiles = uploadFiles.filter((file) => {
          return !this.shouldIgnore(file)
        })

        try {
          // 使用Promise.all并行处理所有文件/目录上传
          await Promise.all(
            uploadFiles.map(async (file) => {
              const localPath = path.join(localRootPath, file)

              // 获取文件状态
              const stats = await fs.stat(localPath)

              if (stats.isDirectory()) {
                // 如果是目录,递归上传
                await this.uploadDirectory(sftp, localPath, path.join(serverRootPath, file))
              } else if (stats.isFile()) {
                // 检查是否在忽略列表中
                if (this.shouldIgnore(localPath)) {
                  this.log.info(`忽略文件: ${localPath}`)
                  return
                }
                // 上传单个文件
                await this.uploadFile(sftp, localPath, path.join(serverRootPath, file))
              }
            }),
          )
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  // 递归上传目录
  async uploadDirectory(sftp, localDir, remoteDir) {
    // 读取目录内容
    const files = await fs.readdir(localDir)

    // 确保远程目录存在
    await this.ensureRemoteDirectory(sftp, remoteDir)

    // 递归处理所有文件和子目录
    await Promise.all(
      files.map(async (file) => {
        const localPath = path.join(localDir, file)
        const remotePath = path.join(remoteDir, file)
        const stats = await fs.stat(localPath)

        // 检查是否应该忽略
        if (this.shouldIgnore(localPath)) {
          this.log.info(`忽略: ${localPath}`)
          return
        }

        if (stats.isDirectory()) {
          await this.uploadDirectory(sftp, localPath, remotePath)
        } else {
          await this.uploadFile(sftp, localPath, remotePath)
        }
      }),
    )
  }

  // 确保远程目录存在
  async ensureRemoteDirectory(sftp, remotePath) {
    try {
      await new Promise((resolve, reject) => {
        sftp.mkdir(remotePath, (err) => {
          if (err && err.code !== 'EEXIST') {
            reject(err)
          }
          resolve()
        })
      })
    } catch (error) {
      this.log.error(`创建远程目录失败: ${remotePath}, ${error.message}`)
    }
  }

  // 检查是否应该忽略文件/目录
  shouldIgnore(filePath) {
    const { ignore } = this.options
    const relativePath = filePath.split('/').pop()
    return ignore.some((pattern) => {
      if (pattern.startsWith('/')) {
        // 绝对路径匹配
        return filePath.includes(pattern)
      } else if (pattern.endsWith('/')) {
        // 目录匹配
        return relativePath === pattern.slice(0, -1)
      } else {
        // 文件名或通配符匹配
        return new RegExp(`^${pattern.replace(/\*/g, '.*')}$`).test(relativePath)
      }
    })
  }

  // 抽取单个文件上传逻辑为独立方法
  async uploadFile(sftp, localPath, remotePath) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const fileName = path.basename(localPath)
      // this.log.info('---------------------')
      // this.log.info(`上传文件: ${localPath}`)
      // this.log.info(`上传路径: ${remotePath}`)
      // this.log.info('---------------------')
      sftp.fastPut(
        localPath,
        remotePath,
        {
          step: (transferred, chunk, total) => {
            const percent = Math.round((transferred / total) * 100)
            this.log.info(`${fileName} 上传进度: ${percent}%`)
          },
        },
        (err) => {
          if (err) {
            this.log.error(`文件 ${fileName} 上传失败`)
            return reject(err)
          }
          const duration = ((Date.now() - startTime) / 1000).toFixed(2)
          this.log.success(`文件 ${fileName} 上传成功! 耗时${duration}秒`)
          resolve()
        },
      )
    })
  }
}
