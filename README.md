# TodoList 任务管理应用

<div align="center">
  <h3>🚀 现代化的任务管理解决方案</h3>
  <p>基于 Next.js 15 构建的全功能任务管理应用，支持分类、优先级、AI助手等高级功能</p>
</div>

## ✨ 功能特色

### 🎯 核心功能 (70分)
- ✅ **任务管理** - 创建、编辑、删除和查看任务
- ✅ **状态切换** - 标记任务完成/未完成状态
- ✅ **智能排序** - 按创建时间自动排序
- ✅ **响应式设计** - 完美适配桌面和移动端
- ✅ **错误处理** - 友好的加载状态和错误提示

### 🌟 加分功能 (30分)
- ✅ **数据导入导出** (15分) - 支持 CSV/Excel 格式
- ✅ **数据统计看板** (15分) - 完成率统计、图表分析、趋势展示
- ✅ **AI任务助手** (15分) - 智能生成任务描述、推荐分类
- ✅ **分类管理** (8分) - 创建/编辑/删除分类，颜色标识
- ✅ **高级搜索与过滤** (10分) - 多条件筛选、实时搜索、搜索历史
- ✅ **批量操作** (10分) - 批量选择、删除、标记完成、全选反选

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **数据库**: Vercel Postgres (PostgreSQL)
- **ORM**: Prisma
- **图表库**: Recharts
- **图标库**: Lucide React
- **部署平台**: Vercel

## 📦 依赖包

```json
{
  "@prisma/client": "^6.14.0",
  "@supabase/supabase-js": "^2.55.0", 
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.540.0",
  "next": "15.4.7",
  "papaparse": "^5.5.3",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "recharts": "^3.1.2",
  "tailwind-merge": "^3.3.1",
  "xlsx": "^0.18.5"
}
```

## 🚀 快速开始

### 环境要求

- Node.js 18.17+ 
- npm/yarn/pnpm
- PostgreSQL 数据库

### 1. 克隆项目

```bash
git clone <repository-url>
cd todo-app2
```

### 2. 安装依赖

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

### 3. 环境变量配置

复制环境变量模板并配置：

```bash
cp .env.example .env
```

在 `.env` 文件中配置以下变量：

```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"

# Vercel Postgres 示例
# DATABASE_URL="postgres://default:password@host:5432/verceldb"

# Supabase 示例  
# DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"

# AI API Keys (可选 - 用于AI功能)
COHERE_API_KEY=""
OPENAI_API_KEY=""

# 应用配置
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库 schema
npm run db:push

# 创建种子数据 (可选)
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
todo-app2/
├── prisma/
│   ├── schema.prisma          # 数据库模式定义
│   └── seed.ts               # 种子数据
├── src/
│   ├── app/                  # App Router 页面
│   │   ├── api/             # API 路由
│   │   ├── categories/      # 分类管理页面
│   │   ├── stats/          # 统计看板页面
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/          # React 组件
│   │   ├── CategoryForm.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ImportExportModal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskForm.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/           # React Context
│   │   └── ThemeContext.tsx
│   ├── lib/               # 工具库
│   │   ├── import-export.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   └── types/             # TypeScript 类型定义
│       └── index.ts
├── scripts/               # 部署脚本
├── .env.example          # 环境变量模板
├── next.config.ts        # Next.js 配置
├── tailwind.config.ts    # Tailwind 配置
└── vercel.json          # Vercel 部署配置
```

## 🌐 部署指南

### 🚀 一键部署到 Vercel

> **推荐使用 Vercel Postgres** - 与 Vercel 完美集成，零配置部署

#### 📋 快速部署步骤 (5分钟)
查看详细指南：[`DEPLOY_QUICK_START.md`](./DEPLOY_QUICK_START.md)

1. 推送代码到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入项目  
3. 创建 Vercel Postgres 数据库
4. 一键部署完成

#### 📖 完整部署文档
详细部署步骤和配置说明：[`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)

## 📖 使用说明

### 任务管理
- **创建任务**: 点击"新建任务"按钮，填写标题、描述、优先级等信息
- **编辑任务**: 点击任务卡片上的编辑按钮进行修改
- **删除任务**: 点击删除按钮并确认删除
- **标记完成**: 点击任务前的圆圈图标切换完成状态

### 分类管理
- 访问"管理分类"页面创建和管理任务分类
- 为每个分类设置名称和颜色标识
- 在创建任务时选择对应分类

### AI助手功能
- **智能描述**: 在任务表单中点击"AI生成"自动生成任务描述
- **分类推荐**: 系统根据任务标题智能推荐合适的分类

### 数据导入导出
- **导出**: 支持导出为 CSV、Excel、JSON 格式
- **导入**: 支持从 CSV、Excel 文件导入任务数据
- 导入时支持自动创建新分类

### 统计分析
- 查看任务完成率、优先级分布
- 分析分类任务分布情况
- 查看最近7天/30天的任务趋势

### 主题设置
- 支持浅色、深色、跟随系统三种主题模式
- 设置会自动保存到本地存储

## 🔧 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 数据库操作
npm run db:generate    # 生成 Prisma 客户端
npm run db:push       # 推送 schema 到数据库
npm run db:seed       # 运行种子数据
```

## 📊 数据库架构

### 表结构

**tasks 表**
```sql
- id: String (Primary Key)
- title: String (Required)
- description: String (Optional)
- completed: Boolean (Default: false)
- priority: Enum (LOW, MEDIUM, HIGH, URGENT)
- dueDate: DateTime (Optional)
- categoryId: String (Foreign Key, Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

**categories 表**
```sql
- id: String (Primary Key)
- name: String (Unique, Required)
- color: String (Default: #3B82F6)
- createdAt: DateTime
- updatedAt: DateTime
```

## 🎨 界面预览

### 主界面
- 现代化的卡片式设计
- 直观的任务状态显示
- 响应式布局适配各种设备

### 统计看板
- 丰富的图表展示
- 实时数据更新
- 多维度分析视图

### 深色模式
- 护眼的深色主题
- 智能跟随系统设置
- 平滑的主题切换动画

## 🔒 安全特性

- TypeScript 类型安全
- 输入数据验证
- SQL 注入防护 (Prisma ORM)
- 客户端状态管理
- 错误边界处理

## 🚧 后续计划

- [ ] 用户认证系统
- [ ] 团队协作功能  
- [ ] 任务提醒通知
- [ ] 更多AI功能集成
- [ ] 移动端APP开发

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙋‍♂️ 支持

如有问题或建议，请创建 [Issue](../../issues) 或联系开发团队。

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请考虑给它一个 Star ⭐</p>
  <p>💻 使用 Claude Code 和 Next.js 15 构建</p>
</div>
