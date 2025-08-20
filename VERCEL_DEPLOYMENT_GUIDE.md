# 🚀 Vercel 部署完整指南

## 📋 部署步骤

### 第一步：登录 Vercel 并创建项目

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 **"New Project"**
3. 从 GitHub 选择你刚推送的仓库
4. **重要：先不要点击 Deploy！**

### 第二步：创建 Vercel Postgres 数据库

1. 在项目设置页面，点击 **"Storage"** 选项卡
2. 点击 **"Create Database"**
3. 选择 **"Postgres"**
4. 输入数据库名称：`todo-app-db`
5. 选择地区（建议选择离你最近的）
6. 点击 **"Create"**
7. 创建完成后，点击 **"Connect Project"**
8. 选择你的项目进行连接

### 第三步：配置环境变量（自动完成）

连接数据库后，Vercel 会自动添加以下环境变量：
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` 
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST` 
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 第四步：部署应用

1. 回到项目页面
2. 点击 **"Deploy"**
3. 等待 2-3 分钟构建完成
4. 🎉 部署成功！

### 第五步：验证部署

访问生成的 URL，检查以下功能：
- [ ] 页面正常加载
- [ ] 能够创建任务
- [ ] 分类功能正常
- [ ] 搜索和筛选工作
- [ ] 统计页面显示数据

## 🔧 本地开发连接到 Vercel

如果你想在本地开发时连接到 Vercel 数据库：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 连接到项目
vercel link

# 拉取环境变量到本地
vercel env pull .env.local

# 使用 Vercel 环境变量运行本地开发
npm run dev
```

## ⚡ 部署后的自动操作

部署时会自动执行：
1. **Prisma 客户端生成**：`npx prisma generate`
2. **数据库迁移**：`npx prisma db push`
3. **种子数据**：自动创建示例任务和分类

## 🐛 常见问题解决

### 问题1：数据库连接失败
**解决方案**：检查环境变量是否正确设置，重新连接数据库到项目。

### 问题2：部署后没有数据
**解决方案**：检查 build logs，确认种子脚本是否执行成功。

### 问题3：API 错误
**解决方案**：检查 Function logs，确认数据库连接和查询是否正常。

## 📊 部署配置文件

项目包含以下部署配置：

- **`vercel.json`**: Vercel 部署配置
- **`package.json`**: 构建和种子脚本
- **`scripts/deploy.js`**: 部署后自动执行脚本

## 🎯 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **数据库**: Vercel Postgres (PostgreSQL)
- **ORM**: Prisma
- **部署**: Vercel (零配置)

## 📝 重要提醒

1. **数据库会自动创建**：不需要手动创建数据库
2. **环境变量自动配置**：连接数据库后自动设置
3. **种子数据自动生成**：部署时会创建示例数据
4. **零配置部署**：推送代码即可自动部署

---

🎉 **完成部署后，你的 TodoList 应用就可以在全球范围内访问了！**