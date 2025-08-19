import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { CategoryFormData } from '@/types'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data: CategoryFormData = await request.json()

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color
      },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('更新分类失败:', error)
    return NextResponse.json(
      { error: '更新分类失败' },
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

    // 检查是否有关联的任务
    const taskCount = await prisma.task.count({
      where: { categoryId: id }
    })

    if (taskCount > 0) {
      return NextResponse.json(
        { error: '该分类下还有任务，无法删除' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: '分类删除成功' })
  } catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: '删除分类失败' },
      { status: 500 }
    )
  }
}