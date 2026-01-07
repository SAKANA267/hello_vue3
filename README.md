# 公共卫生平台管理系统

## 项目简介

这是一个基于 Vue 3 + TypeScript + Element Plus 构建的公共卫生平台管理系统，实现了用户管理、对象管理等核心功能，并支持响应式布局。

## 技术栈

* Vue 3
* TypeScript
* Element Plus
* Pinia (状态管理)
* Vue Router
* Axios
* Mock.js (数据模拟)
* Vite (构建工具)

## 项目结构

src/
├── api/          # API 接口
├── assets/       # 静态资源
├── components/   # 公共组件
├── router/       # 路由配置
├── stores/       # 状态管理
└── views/        # 页面组件

## 功能模块

1. 用户管理
   * 个人信息展示
   * 登录信息记录
   * 贡献统计图表
2. 对象管理
   * 数据表格展示
   * 新增/删除对象
   * 分页查询
   * 响应式布局适配
3. 系统功能
   * 侧边栏菜单
   * 面包屑导航
   * 响应式布局

## 开发环境配置

### 安装依赖

npm install

### 启动开发服务器

npm run dev

### 构建生产版本

npm run build

## 项目特点

* 采用 TypeScript 开发，提供更好的类型检查
* 使用 Pinia 进行状态管理
* 实现了完整的响应式布局
* 集成 Mock.js 进行数据模拟
* 组件化开发，代码复用性高

## 开发规范

* 组件命名采用 PascalCase
* 文件命名采用 kebab-case
* 使用 TypeScript 进行类型定义
* 遵循 Vue 3 Composition API 规范

## 部署说明

1. 执行构建命令
2. 将 dist 目录部署到服务器
3. 配置 nginx 反向代理


## 许可证

MIT License

