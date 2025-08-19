import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Priority } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { tasks } = data

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: '数据格式错误' },
        { status: 400 }
      )
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    // 获取现有分类
    const categories = await prisma.category.findMany()
    const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]))

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      
      try {
        // 验证必需字段
        if (!task.title || typeof task.title !== 'string') {
          results.failed++
          results.errors.push(`第${i + 1}行：标题不能为空`)
          continue
        }

        // 处理优先级
        let priority = Priority.MEDIUM
        if (task.priority) {
          switch (task.priority.toLowerCase()) {
            case '低':
            case 'low':
              priority = Priority.LOW
              break
            case '高':
            case 'high':
              priority = Priority.HIGH
              break
            case '紧急':
            case 'urgent':
              priority = Priority.URGENT
              break
            default:
              priority = Priority.MEDIUM
          }
        }

        // 处理分类
        let categoryId = null
        if (task.category && typeof task.category === 'string') {
          categoryId = categoryMap.get(task.category) || null
          
          // 如果分类不存在，创建新分类
          if (!categoryId && task.category.trim()) {
            const newCategory = await prisma.category.create({
              data: {
                name: task.category.trim(),
                color: '#3B82F6'
              }
            })
            categoryId = newCategory.id
            categoryMap.set(newCategory.name, newCategory.id)
          }
        }

        // 处理日期
        let dueDate = null
        if (task.dueDate && typeof task.dueDate === 'string') {
          const parsedDate = new Date(task.dueDate)
          if (!isNaN(parsedDate.getTime())) {
            dueDate = parsedDate
          }
        }

        // 处理完成状态
        let completed = false
        if (task.status) {
          completed = task.status === '已完成' || task.status === 'completed' || task.completed === true
        }

        await prisma.task.create({
          data: {
            title: task.title.trim(),
            description: task.description ? task.description.trim() : null,
            completed,
            priority,
            dueDate,
            categoryId
          }
        })

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`第${i + 1}行：${error instanceof Error ? error.message : '创建失败'}`)
      }
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('导入任务失败:', error)
    return NextResponse.json(
      { error: '导入任务失败' },
      { status: 500 }
    )
  }
}