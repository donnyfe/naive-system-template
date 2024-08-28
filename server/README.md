# 简介

本项目使用 Nestjs + TypeOrm + MySql + Redis 搭建。


## 安装 & 运行

本地开发环境建议:

- pnpm 8.x
- Node.js 20.x

项目运行前准备：

1. 运行MySQL服务
2. 运行Redis服务
3. 准备千帆API Key和Secret于项目根目录下`config.development.yaml`和`config.porduction.yaml`的配置文件中填入


获取千帆 API Key 和 API Secret 步骤：

1. 打开并登录[百度智能云千帆平台](https://qianfan.cloud.baidu.com)
2. 操作路径：首页点击立即使用--》左侧菜单栏中选择模型服务下的应用接入栏目--》创建应用


```sh
# install dependencies
pnpm i

# Run
pnpm start

# Build product
pnpm build

```

## 接口文档

接口文档地址：http://localhost:8085/swagger
