# 开发说明文档

## 项目概述

这是一个基于 Next.js 15 的全功能 TodoList 任务管理应用，采用现代化的技术栈构建，包含完整的 CRUD 功能、数据统计、AI 助手、主题切换等高级特性。

## 技术架构

### 前端架构
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS 4
- **状态管理**: React Context + useState/useEffect
- **UI组件**: 自定义组件库
- **图标**: Lucide React
- **图表**: Recharts

### 后端架构
- **API**: Next.js API Routes
- **数据库**: PostgreSQL
- **ORM**: Prisma 6.14
- **类型安全**: 全栈 TypeScript

### 部署架构
- **平台**: Vercel
- **数据库**: Vercel Postgres / Supabase
- **CDN**: Vercel Edge Network
- **域名**: 自定义域名支持

## 核心功能模块

### 1. 任务管理 (src/app/page.tsx)
- 任务 CRUD 操作
- 状态切换 (完成/未完成)
- 优先级设置
- 截止日期管理
- 分类关联

### 2. 分类管理 (src/app/categories/)
- 分类 CRUD 操作
- 颜色标识系统
- 任务数量统计
- 分类关联管理

### 3. 数据统计 (src/app/stats/)
- 任务完成率分析
- 优先级分布图表
- 分类分布统计
- 时间趋势分析

### 4. 数据导入导出
- CSV 格式支持
- Excel 格式支持
- JSON 格式支持
- 数据验证和错误处理

### 5. AI 助手功能
- 智能任务描述生成
- 分类智能推荐
- 关键词匹配算法

### 6. 主题系统
- 浅色/深色/自动模式
- 本地存储持久化
- 系统偏好检测

## 文件结构说明

```
src/
├── app/                    # App Router 页面
│   ├── api/               # API 路由
│   │   ├── tasks/        # 任务相关 API
│   │   ├── categories/   # 分类相关 API
│   │   ├── stats/        # 统计相关 API
│   │   └── ai/          # AI 功能 API
│   ├── categories/       # 分类管理页面
│   ├── stats/           # 统计看板页面
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
├── components/           # React 组件
│   ├── TaskCard.tsx     # 任务卡片
│   ├── TaskForm.tsx     # 任务表单
│   ├── TaskFilters.tsx  # 任务筛选
│   ├── CategoryForm.tsx # 分类表单
│   ├── ImportExportModal.tsx # 导入导出
│   ├── ThemeToggle.tsx  # 主题切换
│   ├── LoadingSpinner.tsx # 加载状态
│   └── EmptyState.tsx   # 空状态
├── contexts/            # React Context
│   └── ThemeContext.tsx # 主题上下文
├── lib/                # 工具库
│   ├── prisma.ts       # Prisma 客户端
│   ├── utils.ts        # 通用工具函数
│   └── import-export.ts # 导入导出工具
└── types/              # TypeScript 类型
    └── index.ts        # 类型定义
```

## API 设计

### 任务 API

#### GET /api/tasks
获取任务列表，支持筛选和搜索

**查询参数:**
- `completed`: boolean - 完成状态筛选
- `categoryId`: string - 分类筛选
- `search`: string - 关键词搜索

**返回:**
```typescript
TaskWithCategory[]
```

#### POST /api/tasks
创建新任务

**请求体:**
```typescript
{
  title: string
  description?: string
  categoryId?: string
  priority: Priority
  dueDate?: Date
}
```

#### PUT /api/tasks/[id]
更新任务

#### DELETE /api/tasks/[id]
删除任务

### 分类 API

#### GET /api/categories
获取所有分类

#### POST /api/categories
创建新分类

#### PUT /api/categories/[id]
更新分类

#### DELETE /api/categories/[id]
删除分类

### 统计 API

#### GET /api/stats
获取统计数据

**返回:**
```typescript
{
  overview: {
    total: number
    completed: number
    pending: number
    completionRate: number
  }
  charts: {
    priority: Array<{name: string, value: number}>
    category: Array<{name: string, value: number, color: string}>
    weekTrend: Array<{date: string, created: number, completed: number}>
    monthTrend: Array<{date: string, created: number, completed: number}>
  }
  recent: {
    last7Days: {created: number, completed: number}
    last30Days: {created: number, completed: number}
  }
}
```

### AI API

#### POST /api/ai/generate-description
生成任务描述

**请求体:**
```typescript
{
  title: string
}
```

#### POST /api/ai/suggest-category
推荐任务分类

**请求体:**
```typescript
{
  title: string
  description?: string
}
```

## 数据库设计

### 表关系
```
categories (1) ——————— (n) tasks
    ↓                      ↓
- id (PK)              - id (PK)
- name (UNIQUE)        - title
- color                - description
- createdAt           - completed
- updatedAt           - priority
                      - dueDate
                      - categoryId (FK)
                      - createdAt
                      - updatedAt
```

### 索引优化
```sql
-- 任务表索引
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_category_id ON tasks(categoryId);
CREATE INDEX idx_tasks_created_at ON tasks(createdAt DESC);
CREATE INDEX idx_tasks_due_date ON tasks(dueDate);

-- 分类表索引
CREATE INDEX idx_categories_name ON categories(name);
```

## 组件设计原则

### 1. 单一职责原则
每个组件只负责一个特定功能，便于维护和测试。

### 2. 可复用性
组件设计考虑通用性，支持 props 配置不同场景。

### 3. 类型安全
所有组件都有完整的 TypeScript 类型定义。

### 4. 响应式设计
使用 Tailwind CSS 的响应式工具类，确保移动端兼容。

### 5. 无障碍访问
添加适当的 ARIA 标签和键盘导航支持。

## 状态管理策略

### 1. 本地状态 (useState)
- 组件内部的临时状态
- 表单数据
- 加载状态

### 2. 全局状态 (Context)
- 主题设置
- 用户偏好

### 3. 服务器状态
- 通过 API 获取的数据
- 使用 fetch 进行数据同步

## 性能优化

### 1. 代码分割
- 使用 Next.js 自动代码分割
- 动态导入非关键组件

### 2. 图片优化
- 使用 Next.js Image 组件
- 自动格式转换和尺寸优化

### 3. 包体积优化
- Tree shaking 消除无用代码
- 使用 Bundle Analyzer 分析

### 4. 缓存策略
- API 响应缓存
- 静态资源缓存

## 错误处理

### 1. API 错误处理
- 统一的错误响应格式
- 客户端错误边界
- 用户友好的错误消息

### 2. 表单验证
- 客户端实时验证
- 服务端数据验证
- 错误消息国际化

### 3. 网络错误
- 重试机制
- 离线状态检测
- 优雅降级

## 测试策略

### 1. 单元测试
- 使用 Jest + React Testing Library
- 测试组件行为和渲染
- 测试工具函数

### 2. 集成测试
- API 路由测试
- 数据库集成测试
- 组件交互测试

### 3. E2E 测试
- 使用 Playwright
- 关键用户流程测试
- 多浏览器兼容性测试

## 部署流程

### 1. 开发环境
```bash
npm run dev
```

### 2. 测试环境
```bash
npm run build
npm start
```

### 3. 生产环境
- 通过 Vercel 自动部署
- 环境变量配置
- 数据库迁移

## 监控和分析

### 1. 性能监控
- Core Web Vitals 跟踪
- 页面加载时间分析
- API 响应时间监控

### 2. 错误监控
- 生产环境错误捕获
- 用户行为分析
- 崩溃报告

### 3. 用户分析
- 页面访问统计
- 功能使用情况
- 用户留存分析

## 安全考虑

### 1. 数据验证
- 输入数据验证
- SQL 注入防护
- XSS 攻击防护

### 2. 身份认证
- JWT token 验证
- 会话管理
- 权限控制

### 3. 数据保护
- 敏感数据加密
- 安全的环境变量管理
- HTTPS 强制使用

## 贡献指南

### 1. 代码规范
- 使用 ESLint + Prettier
- TypeScript 严格模式
- 统一的命名约定

### 2. 提交规范
- 使用 Conventional Commits
- 清晰的提交信息
- 单一功能提交

### 3. PR 流程
- 功能分支开发
- Code Review 必须
- 自动化测试通过

## 常见问题解决

### 1. 数据库连接问题
- 检查环境变量配置
- 验证数据库凭据
- 确认网络连接

### 2. 构建失败
- 检查 TypeScript 类型错误
- 验证依赖版本兼容性
- 清理 node_modules 重装

### 3. 样式问题
- 检查 Tailwind CSS 配置
- 验证类名拼写
- 确认响应式断点

## 维护计划

### 1. 依赖更新
- 定期更新依赖包
- 安全漏洞修复
- 性能优化更新

### 2. 功能迭代
- 用户反馈收集
- 新功能规划
- 性能持续优化

### 3. 技术债务
- 代码重构
- 测试覆盖率提升
- 文档更新维护