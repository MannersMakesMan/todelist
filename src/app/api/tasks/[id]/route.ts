import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { TaskFormData } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        category: true
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: '任务未找到' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('获取任务失败:', error)
    return NextResponse.json(
      { error: '获取任务失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data: Partial<TaskFormData & { completed?: boolean }> = await request.json()

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId || null }),
        ...(data.priority && { priority: data.priority }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate || null }),
        ...(data.completed !== undefined && { completed: data.completed })
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('更新任务失败:', error)
    return NextResponse.json(
      { error: '更新任务失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json({ message: '任务删除成功' })
  } catch (error) {
    console.error('删除任务失败:', error)
    return NextResponse.json(
      { error: '删除任务失败' },
      { status: 500 }
    )
  }
}