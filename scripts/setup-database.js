const { PrismaClient } = require('@prisma/client')

async function setupDatabase() {
  const prisma = new PrismaClient()

  try {
    console.log('检查数据库连接...')
    await prisma.$connect()
    
    console.log('运行数据库迁移...')
    // 在 Vercel 环境中，我们需要推送 schema 而不是运行 migrate
    if (process.env.VERCEL) {
      const { execSync } = require('child_process')
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
    }
    
    console.log('检查是否需要种子数据...')
    const taskCount = await prisma.task.count()
    
    if (taskCount === 0) {
      console.log('数据库为空，创建种子数据...')
      // 运行种子脚本
      const seed = require('../prisma/seed.ts')
      await seed()
    } else {
      console.log(`数据库已有 ${taskCount} 条任务记录`)
    }
    
    console.log('数据库设置完成！')
  } catch (error) {
    console.error('数据库设置失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }