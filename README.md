# naive-nestjs-admin

本项目是一个全栈后台管理应用，结合了多种前端和后端技术，旨在提供一个综合性实践学习的平台，用于对 Web 技术进行持续性的探索学习及应用。

## 技术栈

### 前端

- 前端框架: 使用 Vue3.5 开发, 支持 TypeScript
- UI 组件库: 使用 NaiveUI 作为UI组件库，使用UnoCSS实现原子化CSS样式，支持自定义主题和暗黑模式
- 工具工具: 使用 Vite5 作为项目开发和打包工具，配置了 gzip 代码压缩、 图像压缩、CDN、打包分析等功能
- 路由管理: 使用 VueRouter 配置动态路由权限拦截、路由懒加载，支持页面按钮权限控制
- 页面缓存: 使用 KeepAlive 技术实现
- 状态管理: 使用 Pinia 作为状态管理库，使用 Pinia-plugin-persistedstate 插件持久化 Pinia 状态
- 国际化: 使用 Vue-i18n 插件实现。

### 后端

- 后端框架: 使用 NestJS、TypeORM 开发, 支持 TypeScript
- 数据库: 使用 MySQL 作为数据库
- 缓存: 使用 Redis 作为缓存

## 功能

- 注册/登录
- 用户管理
- 聊天助手
- 大文件上传

## 安装 & 运行

前端: [client/README.md](./client/README.md)

后端: [server/README.md](./server/README.md)
