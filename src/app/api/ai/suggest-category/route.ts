import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { title, description = '' } = await request.json()

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: '任务标题不能为空' },
        { status: 400 }
      )
    }

    // 获取现有分类
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' }
    })

    // 简单的分类推荐逻辑
    const suggestedCategory = suggestCategory(title.trim(), description.trim(), categories)

    return NextResponse.json({ 
      suggestedCategory,
      availableCategories: categories
    })

  } catch (error) {
    console.error('推荐分类失败:', error)
    return NextResponse.json(
      { error: '推荐分类失败' },
      { status: 500 }
    )
  }
}

function suggestCategory(title: string, description: string, categories: any[]): any | null {
  const content = (title + ' ' + description).toLowerCase()
  
  // 定义关键词到分类的映射
  const keywordMapping = {
    work: ['工作', '任务', '会议', '报告', '项目', '开发', '设计', '客户', '业务', '计划'],
    personal: ['个人', '生活', '购买', '购物', '家务', '整理', '清洁', '维修', '保养'],
    health: ['健康', '健身', '运动', '锻炼', '医院', '体检', '药物', '饮食', '睡眠'],
    learning: ['学习', '课程', '培训', '考试', '复习', '读书', '阅读', '教育', '技能'],
    finance: ['财务', '理财', '投资', '预算', '账单', '税务', '保险', '银行', '支付'],
    travel: ['旅行', '旅游', '出行', '机票', '酒店', '行程', '签证', '景点', '度假'],
    family: ['家庭', '孩子', '父母', '亲人', '聚会', '生日', '节日', '陪伴', '照顾'],
    hobby: ['爱好', '娱乐', '游戏', '电影', '音乐', '摄影', '绘画', '手工', '收藏']
  }
  
  // 查找匹配的分类
  for (const category of categories) {
    const categoryName = category.name.toLowerCase()
    
    // 直接匹配分类名
    if (content.includes(categoryName)) {
      return category
    }
    
    // 通过关键词映射匹配
    for (const [key, keywords] of Object.entries(keywordMapping)) {
      if (categoryName.includes(key) || key.includes(categoryName)) {
        for (const keyword of keywords) {
          if (content.includes(keyword)) {
            return category
          }
        }
      }
    }
  }
  
  // 如果没有找到匹配的分类，推荐创建新分类
  for (const [key, keywords] of Object.entries(keywordMapping)) {
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        return {
          id: null,
          name: getCategoryNameByType(key),
          color: getCategoryColorByType(key),
          isNew: true
        }
      }
    }
  }
  
  return null
}

function getCategoryNameByType(type: string): string {
  const nameMapping = {
    work: '工作',
    personal: '个人生活',
    health: '健康',
    learning: '学习',
    finance: '财务',
    travel: '旅行',
    family: '家庭',
    hobby: '兴趣爱好'
  }
  return nameMapping[type as keyof typeof nameMapping] || '其他'
}

function getCategoryColorByType(type: string): string {
  const colorMapping = {
    work: '#3B82F6',
    personal: '#10B981',
    health: '#EF4444',
    learning: '#8B5CF6',
    finance: '#F59E0B',
    travel: '#06B6D4',
    family: '#EC4899',
    hobby: '#84CC16'
  }
  return colorMapping[type as keyof typeof colorMapping] || '#6B7280'
}