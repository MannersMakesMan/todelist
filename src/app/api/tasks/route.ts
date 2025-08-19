import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { TaskFormData } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const completed = searchParams.get('completed')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    const whereClause: any = {}
    
    if (completed !== null) {
      whereClause.completed = completed === 'true'
    }
    
    if (categoryId) {
      whereClause.categoryId = categoryId
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('获取任务失败:', error)
    return NextResponse.json(
      { error: '获取任务失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: TaskFormData = await request.json()

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId || null,
        priority: data.priority,
        dueDate: data.dueDate || null
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('创建任务失败:', error)
    return NextResponse.json(
      { error: '创建任务失败' },
      { status: 500 }
    )
  }
}