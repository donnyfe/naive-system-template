import 'dotenv/config'
import { ServerDeploy } from './ServerDeploy.mjs'

// 部署管理器
export class DeployManager {
  constructor() {
    this.deployers = []
  }

  addDeployer(deployer) {
    this.deployers.push(deployer)
    return this
  }

  async deploy() {
    for (const deployer of this.deployers) {
      await deployer.deploy()
    }
  }
}

// 配置各种部署选项
const npmOptions = {
  defaultRegistry: 'https://registry.npmmirror.com',
  publishRegistry: 'https://registry.npmjs.org',
  publishScope: 'public',
}

const serverOptions = {
  ssh: {
    host: process.env.SSH_HOST,
    port: process.env.SSH_PORT || 22,
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD,
  },
  serverRootPath: process.env.SERVER_ROOT_PATH,
  files: [],
  // 忽略文件，当files为空时，默认上传根目录所有文件，此时ignore生效
  ignore: [
    'node_modules', // 忽略 node_modules 目录
    '*.tmp', // 忽略所有临时文件
    '.tmp', // 忽略 .tmp 目录
    '.git', // 忽略 .git 目录
    '.vscode', // 忽略 vscode 配置目录
    '.env', // 忽略环境变量文件
    'scripts', // 忽略脚本目录
    'uploads', // 忽略上传目录
    'src', // 忽略源码目录
    'tsconfig.json',
    'tsconfig.build.json',
    'pnpm-lock.yaml',
    '.prettierrc',
    '.eslintrc.js',
    '.gitignore',
    'README.md',
  ],
  shell: [
    `cd ${process.env.SERVER_ROOT_PATH}`,
    // 'rm -rf dist',
    // 'tar zxvf dist.tar.gz',
    // 'rm -rf dist.tar.gz',
    'exit',
  ],
}

// 使用示例
const deployManager = new DeployManager()

// 按需添加部署器
deployManager
  // 添加npm部署器
  // .addDeployer(new NpmDeploy(npmOptions))
  // 添加服务器部署器
  .addDeployer(new ServerDeploy(serverOptions))

// 执行部署
deployManager.deploy()
