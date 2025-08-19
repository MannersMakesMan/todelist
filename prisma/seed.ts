import { PrismaClient, Priority } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建种子数据...')

  // 创建分类
  const categories = [
    { name: '工作', color: '#3B82F6' },
    { name: '个人', color: '#10B981' },
    { name: '学习', color: '#8B5CF6' },
    { name: '健康', color: '#EF4444' }
  ]

  const createdCategories = []
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData
    })
    createdCategories.push(category)
    console.log(`创建分类: ${category.name}`)
  }

  // 创建示例任务
  const tasks = [
    {
      title: '完成项目计划书',
      description: '制定详细的项目实施计划，包括时间线、资源分配和里程碑设置。',
      priority: Priority.HIGH,
      categoryId: createdCategories.find(c => c.name === '工作')?.id,
      completed: false
    },
    {
      title: '购买生活用品',
      description: '去超市购买本周需要的生活必需品。',
      priority: Priority.MEDIUM,
      categoryId: createdCategories.find(c => c.name === '个人')?.id,
      completed: true
    },
    {
      title: '学习 Next.js 新特性',
      description: '深入了解 Next.js 15 的新功能和改进，包括 App Router 和服务器组件。',
      priority: Priority.MEDIUM,
      categoryId: createdCategories.find(c => c.name === '学习')?.id,
      completed: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 一周后
    },
    {
      title: '体检预约',
      description: '联系医院预约年度体检，确保身体健康。',
      priority: Priority.HIGH,
      categoryId: createdCategories.find(c => c.name === '健康')?.id,
      completed: false,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 三天后
    },
    {
      title: '整理代码文档',
      description: '完善项目代码注释和API文档，提高代码可维护性。',
      priority: Priority.LOW,
      categoryId: createdCategories.find(c => c.name === '工作')?.id,
      completed: false
    }
  ]

  for (const taskData of tasks) {
    const task = await prisma.task.create({
      data: taskData
    })
    console.log(`创建任务: ${task.title}`)
  }

  console.log('种子数据创建完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('种子数据创建失败:', e)
    await prisma.$disconnect()
    process.exit(1)
  })