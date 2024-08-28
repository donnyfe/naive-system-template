# 简介

本项目是一个全栈应用，项目主要分为客户端和服务端两部分。客户端端使用 Vue3 + NaiveUI 搭建，服务端使用 NestJS + TypeORM + MySQL + Redis搭建。

## 特性

### 服务端

- 使用 NestJS 开发
- 使用 TypeORM 连接操作数据库
- 使用 Redis 缓存数据
- 支持 TypeScript

### 客户端

- 使用 Vue3.4 开发
- 使用 Vite5 作为项目开发、打包工具（配置 gzip 代码压缩、 图像压缩、cdn、打包分析……）
- 使用 VueRouter 配置动态路由权限拦截、路由懒加载，支持页面按钮权限控制
- 使用 KeepAlive 对页面进行缓存
- 使用 UnoCSS 实现原子化CSS样式编写
- 支持多主题布局、暗黑模式、i18n 国际化
- 支持 TypeScript

## 功能

- 注册
- 登录
- 用户管理
- 聊天助手

## 安装 & 运行

本地开发环境建议:

- pnpm 8.x
- Node.js 20.x

### 服务端


**项目运行前准备：**

1. 需先运行 MySQL 服务
2. 需先运行 Redis 服务
3. 准备千帆 API Key 和 API Secret 并于项目根目录下`config.development.yaml`和`config.porduction.yaml`的配置文件中填入


**千帆 API Key 和 API Secret 获取步骤：**

1. 打开并登录[百度智能云千帆平台](https://qianfan.cloud.baidu.com)
2. 操作路径：首页点击立即使用 --》左侧菜单栏中选择模型服务下的应用接入栏目 --》创建应用 --》拷贝 Key 和 Secret

**数据库文件导入：**

根目录下的`admin.sql`数据库文件可导入到 MySQL 中

```bash
# install dependencies
pnpm i

# Run
pnpm start

# Build product
pnpm build

```

### 客户端


```sh
# install dependencies
pnpm i

# Run
pnpm dev

# Build product
pnpm build

```
