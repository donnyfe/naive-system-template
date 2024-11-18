# 简介

本项目使用 Nestjs + TypeOrm + MySql + Redis 搭建。

## 特性

### 系统基础设施

- 配置管理
  支持开发/生产环境配置
  - 基于环境变量的配置验证
  - 模块化的配置文件组织
- 数据库集成
  - MySQL连接池管理
    TypeORM实体映射
  - 数据库迁移支持
- 缓存系统
  - Redis缓存集成
  - Session存储
    分布式锁支持

### 安全机制

- 身份认证
  - JWT token认证
  - 基于Redis的token存储和刷新
  - 密码加密存储
- 访问控制
  - API访问频率限制
  - 请求IP限制
- 安全防护
  - CORS跨域保护
  - XSS防护
  - CSRF防护
  - Helmet安全头

### 开发支持

- API文档
  - Swagger接口文档
- 日志系统

## 准备阶段

**项目运行前准备：**

1. 运行MySQL服务
2. 运行Redis服务
3. 准备千帆API Key和Secret于项目根目录下`config.development.yaml`和`config.porduction.yaml`的配置文件中填入

**获取千帆 API Key 和 API Secret 步骤：**

1. 打开并登录[百度智能云千帆平台](https://qianfan.cloud.baidu.com)
2. 操作路径：首页点击立即使用--》左侧菜单栏中选择模型服务下的应用接入栏目--》创建应用

**数据库文件导入：**

根目录下的`admin.sql`数据库文件可导入到 MySQL 中

## 安装 & 运行

本地开发环境建议:

- pnpm > 8.x
- Node.js > 20.x

```sh
# install dependencies
pnpm i

# Run
pnpm start

# Build product
pnpm build

```

## 接口文档

接口文档地址：http://localhost:5174/swagger
