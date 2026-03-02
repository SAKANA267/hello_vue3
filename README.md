# 公共卫生平台管理系统

基于 Vue 3 + TypeScript + Element Plus 构建的公共卫生平台管理系统，提供传染病上报、审核流程、用户管理和 AI 智能助手等核心功能。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.17 | 渐进式前端框架 |
| TypeScript | 5.8 | 类型安全开发 |
| Vite | 6.3 | 现代化构建工具 |
| Element Plus | 2.10 | UI 组件库 |
| Pinia | 3.0 | 状态管理 |
| Vue Router | 4.5 | 路由管理 |
| Axios | 1.11 | HTTP 请求 |
| ECharts | 6.0 | 数据可视化 |
| Mock.js | 1.1 | 数据模拟 |
| Less | 4.4 | CSS 预处理器 |

## 项目结构

```
src/
├── api/                      # API 层
│   ├── request.ts           # Axios 请求封装
│   ├── api.ts               # API 接口定义
│   ├── types.ts             # API 类型定义
│   ├── ai.ts                # AI 接口
│   ├── mock.ts              # Mock 入口
│   └── mockData/            # Mock 数据
│       ├── dashboard.ts     # 仪表盘数据
│       ├── userInfo.ts      # 用户信息
│       ├── permission.ts    # 权限数据
│       ├── ai.ts            # AI 对话数据
│       └── ...
├── assets/                   # 静态资源
│   ├── images/              # 图片资源
│   ├── main.css             # 全局样式
│   └── types/               # 业务类型定义
├── components/               # 公共组件
│   ├── CommonTable.vue      # 通用表格
│   ├── TableEditDialog.vue  # 表单编辑对话框
│   ├── AuditDialog.vue      # 审核对话框
│   ├── CommonHeader.vue     # 公共头部
│   ├── CommonAside.vue      # 公共侧边栏
│   ├── CommonTab.vue        # 标签页
│   ├── UserInfo.vue         # 用户信息组件
│   ├── PermissionButton.vue # 权限按钮
│   ├── ai/                  # AI 相关组件
│   │   ├── ChatSidebar.vue  # 聊天侧边栏
│   │   ├── ChatMessage.vue  # 聊天消息
│   │   ├── ChatInput.vue    # 聊天输入
│   │   └── TypingIndicator.vue
│   └── dashboard/           # 仪表盘组件
│       ├── StatCard.vue     # 统计卡片
│       ├── TrendChart.vue   # 趋势图表
│       └── ...
├── composables/              # 组合式函数
│   └── usePermissions.ts    # 权限钩子
├── config/                   # 配置
│   └── index.ts             # 环境配置
├── constants/                # 常量定义
│   ├── menu.ts              # 菜单常量
│   ├── permissions.ts       # 权限常量
│   └── intents.ts           # AI 意图常量
├── directives/               # 自定义指令
│   └── permission.ts        # 权限指令
├── router/                   # 路由配置
│   └── index.ts
├── services/                 # 业务服务层
│   └── aiService.ts         # AI 服务
├── stores/                   # Pinia 状态管理
│   ├── index.js             # 主 Store
│   └── aiChat.ts            # AI 聊天 Store
├── types/                    # 类型定义
│   └── ai.ts                # AI 类型
├── utils/                    # 工具函数
│   ├── permissions.ts       # 权限工具
│   └── ai-action-handler.ts # AI 动作处理器
├── views/                    # 页面组件
│   ├── Login.vue            # 登录页
│   ├── Register.vue         # 注册页
│   ├── Home.vue             # 首页布局
│   ├── Dashboard.vue        # 仪表盘
│   ├── Profile.vue          # 个人中心
│   ├── ObjectManagement.vue # 对象管理
│   ├── ObjectAudit.vue      # 对象审核
│   ├── UserManagement.vue   # 用户管理
│   ├── AiAssistant.vue      # AI 助手
│   ├── Forbidden.vue        # 403 页面
│   └── ...
├── App.vue                   # 根组件
└── main.ts                   # 应用入口
```

## 功能模块

### 1. 用户认证
- 登录 / 注册
- JWT Token 认证
- 路由守卫
- 自动登出（Token 过期）

### 2. 仪表盘
- 统计数据卡片
- 趋势图表
- 分布列表
- 快捷操作
- 待办事项
- 最近活动

### 3. 对象管理
- 数据表格展示（桌面端/移动端适配）
- 新增/编辑/删除对象
- 分页查询
- 关键词搜索

### 4. 对象审核
- 审核流程
- 通过/驳回操作
- 备注信息

### 5. 用户管理
- 用户 CRUD
- 登录历史记录
- 贡献统计图表

### 6. AI 智能助手
- 自然语言对话
- 意图识别
- 动作执行（跳转页面、查询数据等）
- 打字指示器动画

### 7. 权限管理
- 基于角色的菜单权限
- 按钮级权限控制
- 自定义权限指令
- 权限工具函数

### 8. 系统功能
- 可折叠侧边栏
- 标签页导航
- 面包屑导航
- 响应式布局（768px 断点）

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev    # 开发环境，访问 http://localhost:5173
npm run prd    # 生产环境模拟
```

### 构建

```bash
npm run build          # 类型检查 + 构建
npm run build-only     # 仅构建
npm run type-check     # 仅类型检查
npm run preview        # 预览构建产物
```

### 代码质量

```bash
npm run lint    # ESLint 检查并自动修复
npm run format  # Prettier 格式化
```

## 环境变量

`.env.development` / `.env.production`

```bash
VITE_APP_TITLE=公共卫生平台管理系统
VITE_BASE_API=/api
VITE_MOCK_API=/api
VITE_MOCK=true          # 是否使用 Mock 数据
VITE_REQUEST_TIMEOUT=30000
```

## 架构设计

### 分层架构

```
Views（页面视图）
    ↓
Components（可复用组件）
    ↓
Pinia Stores（状态管理）
    ↓
API Layer（接口层）
    ↓
Mock APIs / Backend APIs
```

### 核心设计模式

| 模式 | 应用场景 |
|------|----------|
| Repository Pattern | API 层抽象数据源 |
| Singleton | Axios 单例 |
| Interceptor Pattern | 请求/响应拦截器 |
| Observer Pattern | Pinia 响应式状态 |
| Strategy Pattern | 表格多种操作模式 |

### 全局 API 访问

通过 `proxy.$api` 在任何组件中调用 API：

```typescript
const { proxy } = getCurrentInstance() as any
const data = await proxy.$api.getTableData(config)
```

## 代码规范

### Prettier 配置

- 无分号
- 单引号
- 行宽 100 字符
- 无尾随逗号
- 单参数箭头函数省略括号

### 命名规范

- 组件：`PascalCase`（如 `CommonTable.vue`）
- 视图：`PascalCase`（如 `UserManagement.vue`）
- 工具/配置：`kebab-case`（如 `request.ts`）

### Vue 组件规范

- 使用 `<script setup lang="ts">`
- `defineProps` 和 `defineEmits` 定义组件 API
- Less 样式作用域

## 部署说明

1. **构建生产版本**

```bash
npm run build
```

2. **部署产物**

将 `dist` 目录部署到服务器

3. **Nginx 配置示例**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | 最新 |
| Firefox | 最新 |
| Safari | 最新 |
| Edge | 最新 |

## 许可证

MIT License
