# 📦 Vercel 完整部署指南

## 🎯 概述

本指南将帮你在 Vercel 上完整部署 TodoList 应用，包括前端应用和 Vercel Postgres 数据库。

## 🏗️ 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **数据库**: Vercel Postgres (PostgreSQL)
- **ORM**: Prisma
- **部署平台**: Vercel

## 📋 部署步骤

### 第一步：准备代码仓库

1. **将代码推送到 GitHub**
   ```bash
   # 初始化 git 仓库（如果还没有）
   git init
   git add .
   git commit -m "Initial commit: TodoList application"
   
   # 推送到 GitHub
   git remote add origin https://github.com/你的用户名/todo-app.git
   git push -u origin main
   ```

2. **确保项目结构正确**
   ```
   todo-app2/
   ├── src/
   ├── prisma/
   ├── package.json
   ├── next.config.js
   └── .env (包含环境变量模板)
   ```

### 第二步：创建 Vercel 项目

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库 `todo-app`
   - 点击 "Import"

3. **配置项目设置**
   - **Project Name**: `todo-app` (或你喜欢的名称)
   - **Framework Preset**: Next.js (自动检测)
   - **Root Directory**: `./` (如果代码在根目录)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)
   - **Install Command**: `npm install` (默认)

4. **先不要点击 Deploy**，我们需要先设置数据库

### 第三步：创建 Vercel Postgres 数据库

1. **在 Vercel Dashboard 中创建数据库**
   - 在项目页面，点击 "Storage" 标签
   - 点击 "Create Database"
   - 选择 "Postgres"
   - 输入数据库名称：`todo-app-db`
   - 选择地区（建议选择距离用户最近的）
   - 点击 "Create"

2. **连接数据库到项目**
   - 创建完成后，点击 "Connect Project"
   - 选择你的 todo-app 项目
   - 点击 "Connect"

3. **验证环境变量**
   - 在项目 Settings → Environment Variables 中查看
   - 应该自动添加了以下变量：
     ```
     POSTGRES_URL
     POSTGRES_PRISMA_URL
     POSTGRES_URL_NO_SSL
     POSTGRES_URL_NON_POOLING
     POSTGRES_USER
     POSTGRES_HOST
     POSTGRES_PASSWORD
     POSTGRES_DATABASE
     ```

### 第四步：配置数据库迁移

1. **在项目根目录创建部署脚本**
   
   创建 `scripts/deploy.js`:
   ```javascript
   const { execSync } = require('child_process');
   
   async function deploy() {
     try {
       console.log('🔄 Running Prisma migrations...');
       execSync('npx prisma generate', { stdio: 'inherit' });
       execSync('npx prisma db push', { stdio: 'inherit' });
       console.log('✅ Database migration completed');
       
       console.log('🌱 Seeding database...');
       execSync('npm run db:seed', { stdio: 'inherit' });
       console.log('✅ Database seeding completed');
     } catch (error) {
       console.error('❌ Deployment failed:', error);
       process.exit(1);
     }
   }
   
   deploy();
   ```

2. **更新 package.json 添加部署脚本**
   ```json
   {
     "scripts": {
       "build": "next build",
       "postbuild": "node scripts/deploy.js",
       "db:seed": "tsx prisma/seed.ts"
     }
   }
   ```

### 第五步：部署应用

1. **首次部署**
   - 回到 Vercel 项目页面
   - 点击 "Deploy"
   - 等待构建完成（大约 2-3 分钟）

2. **检查部署状态**
   - 在 "Deployments" 标签查看构建日志
   - 确保数据库迁移成功执行

3. **访问应用**
   - 部署成功后，点击生成的 URL
   - 测试应用功能

### 第六步：配置自定义域名（可选）

1. **添加域名**
   - 在项目 Settings → Domains
   - 输入你的域名
   - 按照 DNS 配置说明设置

## 🔧 本地开发环境配置

### 连接到 Vercel Postgres

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并链接项目**
   ```bash
   vercel login
   vercel link
   ```

3. **下载环境变量**
   ```bash
   vercel env pull .env.local
   ```

4. **运行本地开发**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

## 📊 监控和维护

### 数据库管理

1. **访问数据库**
   - 在 Vercel Dashboard → Storage → 你的数据库
   - 使用 "Browse Data" 查看数据
   - 使用 "Query" 执行 SQL 命令

2. **Prisma Studio**
   ```bash
   # 本地查看数据库
   npx prisma studio
   ```

### 性能监控

1. **Vercel Analytics**
   - 在项目设置中启用 Analytics
   - 监控页面加载速度和用户行为

2. **数据库监控**
   - 在 Storage 页面查看数据库使用情况
   - 监控连接数和查询性能

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查依赖
   npm install
   npm run build
   ```

2. **数据库连接失败**
   - 确保环境变量正确设置
   - 检查 Prisma schema 配置

3. **迁移失败**
   ```bash
   # 重新生成 Prisma 客户端
   npx prisma generate
   npx prisma db push --force-reset
   ```

### 调试步骤

1. **查看构建日志**
   - Vercel Dashboard → Deployments → 点击构建
   - 查看详细错误信息

2. **本地测试**
   ```bash
   # 模拟生产环境构建
   npm run build
   npm start
   ```

## 📈 扩展功能

### 生产环境优化

1. **环境变量分离**
   - 开发环境：`.env.local`
   - 生产环境：Vercel Dashboard 设置

2. **数据库备份**
   - 定期导出数据
   - 设置自动备份策略

### 持续集成

1. **GitHub Actions**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to Vercel
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v20
   ```

## 🎉 部署完成

部署成功后，你将拥有：

- ✅ 完全托管的 Next.js 应用
- ✅ Vercel Postgres 数据库
- ✅ 自动 SSL 证书
- ✅ 全球 CDN 加速
- ✅ 零配置扩展

你的 TodoList 应用现已准备好为用户提供服务！

## 📞 技术支持

如遇到问题：
1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 检查 [Prisma 文档](https://www.prisma.io/docs)
3. 查看项目的 GitHub Issues