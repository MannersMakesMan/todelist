import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: '任务标题不能为空' },
        { status: 400 }
      )
    }

    // 简单的描述生成逻辑（可替换为实际的AI服务）
    const description = generateDescription(title.trim())

    return NextResponse.json({ description })

  } catch (error) {
    console.error('生成描述失败:', error)
    return NextResponse.json(
      { error: '生成描述失败' },
      { status: 500 }
    )
  }
}

function generateDescription(title: string): string {
  // 简单的规则化描述生成
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('学习') || lowerTitle.includes('复习')) {
    return `制定学习计划，准备相关资料，安排时间进行系统性学习。建议分阶段完成，并记录学习笔记。`
  }
  
  if (lowerTitle.includes('会议') || lowerTitle.includes('开会')) {
    return `提前准备会议材料，确认参会人员，设置会议提醒。会议期间认真记录要点，会后跟进行动项。`
  }
  
  if (lowerTitle.includes('报告') || lowerTitle.includes('总结')) {
    return `收集相关数据和资料，整理分析内容，撰写初稿并进行修订。确保逻辑清晰，数据准确。`
  }
  
  if (lowerTitle.includes('购买') || lowerTitle.includes('采购')) {
    return `列出具体需求清单，比较不同供应商价格和质量，选择最优方案并完成采购。`
  }
  
  if (lowerTitle.includes('旅行') || lowerTitle.includes('出行')) {
    return `制定行程计划，预订交通和住宿，准备必要物品，检查相关证件和保险。`
  }
  
  if (lowerTitle.includes('项目') || lowerTitle.includes('开发')) {
    return `明确项目需求和目标，制定详细的实施计划，分配任务资源，定期跟踪进度和质量。`
  }
  
  if (lowerTitle.includes('健身') || lowerTitle.includes('运动')) {
    return `制定运动计划，选择合适的运动方式和时间，准备运动装备，坚持规律锻炼并记录进度。`
  }
  
  if (lowerTitle.includes('读书') || lowerTitle.includes('阅读')) {
    return `选择高质量的书籍，制定阅读计划，做好读书笔记，定期回顾和思考书中内容。`
  }
  
  // 默认描述
  return `详细分析任务需求，制定具体的执行计划，准备必要的资源和工具，按计划逐步推进完成。`
}