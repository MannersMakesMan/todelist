# 🚀 快速部署指南

## 📝 5分钟部署到 Vercel

### 1️⃣ 推送代码到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/todo-app.git
git push -u origin main
```

### 2️⃣ 部署到 Vercel
1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project" → 选择你的 GitHub 仓库
3. **暂停！先不要点击 Deploy**

### 3️⃣ 创建数据库
1. 在项目页面点击 "Storage" → "Create Database"
2. 选择 "Postgres" → 输入名称 `todo-app-db`
3. 点击 "Create" → "Connect Project" → 选择你的项目

### 4️⃣ 完成部署
1. 回到项目页面，点击 "Deploy"
2. 等待 2-3 分钟构建完成
3. 🎉 访问生成的 URL 查看应用！

## ✅ 部署后验证

访问你的应用，确保以下功能正常：
- [ ] 任务创建和编辑
- [ ] 分类管理
- [ ] 搜索和筛选
- [ ] 批量操作
- [ ] 数据导入导出
- [ ] 统计页面

## 🔧 本地开发连接

```bash
# 安装 Vercel CLI
npm i -g vercel

# 连接项目
vercel login
vercel link

# 获取环境变量
vercel env pull .env.local

# 本地开发
npm run dev
```

## 📚 详细文档

详细部署步骤请查看 [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)

## 🎯 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **数据库**: Vercel Postgres
- **部署**: Vercel (零配置)
- **特性**: 批量操作、高级搜索、AI助手、数据可视化