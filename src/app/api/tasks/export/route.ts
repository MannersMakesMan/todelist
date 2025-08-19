import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'

    const tasks = await prisma.task.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const exportData = tasks.map(task => ({
      '标题': task.title,
      '描述': task.description || '',
      '状态': task.completed ? '已完成' : '未完成',
      '优先级': getPriorityText(task.priority),
      '分类': task.category?.name || '无分类',
      '截止日期': task.dueDate ? formatDate(task.dueDate) : '',
      '创建时间': formatDate(task.createdAt),
      '更新时间': formatDate(task.updatedAt)
    }))

    if (format === 'json') {
      return NextResponse.json({
        data: exportData,
        total: tasks.length,
        exportTime: new Date().toISOString()
      })
    }

    // 生成CSV格式
    const headers = Object.keys(exportData[0] || {})
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
      )
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="tasks-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('导出任务失败:', error)
    return NextResponse.json(
      { error: '导出任务失败' },
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