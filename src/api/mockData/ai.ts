import Mock from 'mockjs'
import type { AiResponse, IntentApiResponse } from '@/types/ai'
import { IntentType, ActionType } from '@/types/ai'

// Mock 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 生成模拟AI响应（与后端API格式一致）
 */
function generateMockResponse(message: string): AiResponse {
  const normalizedMessage = message.toLowerCase().trim()

  // 导航意图
  if (/打开|跳转|去|管理.*页面/.test(normalizedMessage)) {
    if (/用户|user/.test(normalizedMessage)) {
      return {
        message: '正在为您跳转到用户管理页面...',
        action: {
          type: ActionType.NAVIGATE,
          payload: {
            page: '/userManagement'
          }
        },
        suggestions: ['查看详情', '新增用户', '返回']
      }
    }
    return {
      message: '正在为您跳转到报告卡页面...',
      action: {
        type: ActionType.NAVIGATE,
        payload: {
          page: '/objectManagement'
        }
      },
      suggestions: ['查看详情', '导出数据', '返回']
    }
  }

  // 创建意图
  if (/新增|添加|创建|新建/.test(normalizedMessage)) {
    return {
      message: '已为您打开添加表单',
      action: {
        type: ActionType.CALLBACK,
        payload: {
          callback: 'open-create',
          params: { entity: 'user' }
        }
      },
      suggestions: ['继续添加', '查看列表', '返回']
    }
  }

  // 查询意图
  if (/显示|查看|列出|所有|待审核/.test(normalizedMessage)) {
    const count = Mock.Random.integer(5, 50)
    return {
      message: `为您找到 ${count} 条待审核的报告卡`,
      action: {
        type: ActionType.NAVIGATE,
        payload: {
          page: '/objectManagement',
          params: { status: 'pending' }
        }
      },
      suggestions: ['查看详情', '导出数据', '修改筛选']
    }
  }

  // 统计意图
  if (/多少|数量|统计/.test(normalizedMessage)) {
    const count = Mock.Random.integer(50, 500)
    return {
      message: `当前共有 ${count} 条报告卡`,
      action: {
        type: ActionType.API,
        payload: {
          api: '/api/report-cards/count',
          method: 'GET'
        }
      },
      suggestions: ['查看列表', '统计分析', '导出报表']
    }
  }

  // 帮助意图
  if (/帮助|你能做什么|怎么用|help/i.test(normalizedMessage)) {
    return {
      message: '我可以帮您进行数据查询、新增、修改、删除以及页面导航等操作。',
      suggestions: ['显示待审核的报告卡', '新增用户', '打开用户管理页面', '有多少个用户']
    }
  }

  // 默认响应
  return {
    message: '抱歉，我没有理解您的意思，请换一种说法。',
    suggestions: ['显示待审核的报告卡', '新增用户', '打开用户管理页面']
  }
}

/**
 * 生成模拟意图识别响应
 */
function generateMockIntent(message: string): IntentApiResponse {
  const normalizedMessage = message.toLowerCase().trim()

  if (/打开|跳转|去/.test(normalizedMessage)) {
    return {
      intent: IntentType.NAVIGATE,
      entity: {
        code: 'reportCard',
        name: '报告卡',
        aliases: ['报告卡', '报卡', '报告', 'card']
      },
      params: {},
      confidence: 0.9
    }
  }

  if (/新增|添加|创建|新建/.test(normalizedMessage)) {
    return {
      intent: IntentType.CREATE,
      entity: {
        code: 'user',
        name: '用户',
        aliases: ['用户', 'user', '账号']
      },
      params: {},
      confidence: 0.85
    }
  }

  return {
    intent: IntentType.UNKNOWN,
    params: {},
    confidence: 0
  }
}

// Mock API: 聊天接口
// POST /api/ai/chat
Mock.mock('/api/ai/chat', 'post', (options: { body: string }) => {
  const { message } = JSON.parse(options.body)
  const response = generateMockResponse(message)

  return {
    code: 200,
    data: response,
    msg: '操作成功'
  }
})

// Mock API: 意图识别接口
// POST /api/ai/intent
Mock.mock('/api/ai/intent', 'post', (options: { body: string }) => {
  const { message } = JSON.parse(options.body)
  const intent = generateMockIntent(message)

  return {
    code: 200,
    data: intent,
    msg: '操作成功'
  }
})

// Mock API: 执行意图接口
// POST /api/ai/execute
Mock.mock('/api/ai/execute', 'post', (options: { body: string }) => {
  const { intent, entity } = JSON.parse(options.body)
  const response = generateMockResponse(`${intent} ${entity || ''}`)

  return {
    code: 200,
    data: response,
    msg: '操作成功'
  }
})

// Mock API: 创建会话接口
// POST /api/ai/sessions
Mock.mock('/api/ai/sessions', 'post', () => {
  return {
    code: 200,
    data: {
      sessionId: Mock.Random.guid(),
      timestamp: Date.now()
    },
    msg: '操作成功'
  }
})

// Mock API: 获取会话历史接口
// GET /api/ai/sessions/{sessionId}
Mock.mock(/\/api\/ai\/sessions\/[\w-]+$/, 'get', () => {
  return {
    code: 200,
    data: {
      sessionId: Mock.Random.guid(),
      title: '测试对话',
      messages: []
    },
    msg: '操作成功'
  }
})

// Mock API: 删除会话接口
// DELETE /api/ai/sessions/{sessionId}
Mock.mock(/\/api\/ai\/sessions\/[\w-]+$/, 'delete', () => {
  return {
    code: 200,
    data: null,
    msg: '会话已删除'
  }
})
