# kenaito-dns-front

## 简介

kenaito-dns 前端

## 改造自d2admin项目

- 简约模板 https://github.com/d2-projects/d2-admin-start-kit
- 全功能模板 https://gitee.com/d2-projects/d2-admin
- 官方文档 https://d2.pub/doc/d2-admin/learn/start.html
- 项目图标 https://fontawesome.com/icons
- ElementUi文档 https://element.eleme.io/#/zh-CN/component/installation

## 项目依赖

- nodejs v14.15.1, 建议 12 ~ 16 之间

## 项目运行

``` bash
# 安装依赖
npm install --registry https://registry.npmmirror.com

# 启动服务 localhost:8080
npm run dev

# (或) 启动服务 localhost:8080
IDEA -> Current File -> Edit Configurations... -> Add New Configuration -> npm -> Script选dev -> Apply -> Ok

# 构建生产环境
npm run build:prod
```

## 添加菜单步骤

- src/menu/index.js中menuAside变量中，添加菜单配置
- src/router/routes.js中frameIn变量中，添加路由配置
- src/views目录中，新增页面文件