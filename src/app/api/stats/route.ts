import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export async function GET() {
  try {
    const now = new Date()
    const sevenDaysAgo = subDays(now, 7)
    const thirtyDaysAgo = subDays(now, 30)

    // 基础统计
    const [totalTasks, completedTasks, pendingTasks] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { completed: true } }),
      prisma.task.count({ where: { completed: false } })
    ])

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // 优先级分布
    const priorityStats = await prisma.task.groupBy({
      by: ['priority'],
      _count: {
        id: true
      }
    })

    const priorityData = priorityStats.map(stat => ({
      name: getPriorityText(stat.priority),
      value: stat._count.id,
      priority: stat.priority
    }))

    // 分类分布
    const categoryStats = await prisma.task.groupBy({
      by: ['categoryId'],
      _count: {
        id: true
      }
    })

    const categoryData = await Promise.all(
      categoryStats.map(async (stat) => {
        if (stat.categoryId) {
          const category = await prisma.category.findUnique({
            where: { id: stat.categoryId }
          })
          return {
            name: category?.name || '未知分类',
            value: stat._count.id,
            color: category?.color || '#3B82F6'
          }
        }
        return {
          name: '无分类',
          value: stat._count.id,
          color: '#9CA3AF'
        }
      })
    )

    // 本周任务趋势
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    const weekTasks = await prisma.task.findMany({
      where: {
        createdAt: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    })

    const weekData = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(weekEnd, 6 - i)
      const dayTasks = weekTasks.filter(task => 
        format(task.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
      return {
        date: format(date, 'M/dd'),
        created: dayTasks.length,
        completed: dayTasks.filter(task => task.completed).length
      }
    })

    // 本月任务趋势
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const monthTasks = await prisma.task.findMany({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    })

    const monthData = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(monthEnd, 29 - i)
      const dayTasks = monthTasks.filter(task => 
        format(task.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
      return {
        date: format(date, 'M/dd'),
        created: dayTasks.length,
        completed: dayTasks.filter(task => task.completed).length
      }
    })

    // 最近活动统计
    const recentStats = {
      last7Days: {
        created: await prisma.task.count({
          where: {
            createdAt: { gte: sevenDaysAgo }
          }
        }),
        completed: await prisma.task.count({
          where: {
            completed: true,
            updatedAt: { gte: sevenDaysAgo }
          }
        })
      },
      last30Days: {
        created: await prisma.task.count({
          where: {
            createdAt: { gte: thirtyDaysAgo }
          }
        }),
        completed: await prisma.task.count({
          where: {
            completed: true,
            updatedAt: { gte: thirtyDaysAgo }
          }
        })
      }
    }

    return NextResponse.json({
      overview: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate
      },
      charts: {
        priority: priorityData,
        category: categoryData,
        weekTrend: weekData,
        monthTrend: monthData
      },
      recent: recentStats
    })

  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}

function getPriorityText(priority: string): string {
  switch (priority) {
    case 'LOW': return '低'
    case 'MEDIUM': return '中'
    case 'HIGH': return '高'
    case 'URGENT': return '紧急'
    default: return '中'
  }
}