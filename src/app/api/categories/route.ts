import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { CategoryFormData } from '@/types'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('获取分类失败:', error)
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CategoryFormData = await request.json()

    const category = await prisma.category.create({
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

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('创建分类失败:', error)
    return NextResponse.json(
      { error: '创建分类失败' },
      { status: 500 }
    )
  }
}