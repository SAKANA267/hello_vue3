import Mock from 'mockjs'
import { IntentType, EntityType } from '@/types/ai'
import type { ParsedIntent, AiResponse } from '@/types/ai'
import {
  INTENT_PATTERNS,
  ENTITY_ALIASES,
  RESPONSE_TEMPLATES,
  ENTITY_NAMES
} from '@/constants/intents'

// Mock 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 简单的意图匹配器（模拟 AI 服务）
 */
function matchIntent(message: string): ParsedIntent {
  const normalizedMessage = message.toLowerCase().trim()

  // 1. 尝试匹配导航意图
  if (/打开|跳转|去|管理.*页面/.test(normalizedMessage)) {
    for (const [entity, aliases] of Object.entries(ENTITY_ALIASES)) {
      for (const alias of aliases) {
        if (normalizedMessage.includes(alias)) {
          return {
            intent: IntentType.NAVIGATE,
            entity: entity as EntityType,
            params: {},
            confidence: 0.9
          }
        }
      }
    }
  }

  // 2. 尝试匹配创建意图
  if (/新增|添加|创建|新建/.test(normalizedMessage)) {
    for (const [entity, aliases] of Object.entries(ENTITY_ALIASES)) {
      for (const alias of aliases) {
        if (normalizedMessage.includes(alias)) {
          // 提取参数（如姓名）
          const nameMatch = message.match(
            /(?:新增|添加|创建|新建).*?(?:叫|名为|名\s*[:：]?\s*)([\u4e00-\u9fa5]+)/i
          )
          const params = nameMatch ? { name: nameMatch[1] } : {}

          return {
            intent: IntentType.CREATE,
            entity: entity as EntityType,
            params,
            confidence: 0.85
          }
        }
      }
    }
  }

  // 3. 尝试匹配查询意图
  if (/显示|查看|列出|所有|待审核|待处理/.test(normalizedMessage)) {
    for (const [entity, aliases] of Object.entries(ENTITY_ALIASES)) {
      for (const alias of aliases) {
        if (normalizedMessage.includes(alias)) {
          const params: Record<string, any> = {}

          // 检测状态
          if (/待审核|pending|未审核/.test(normalizedMessage)) {
            params.status = 'pending'
          } else if (/已审核|approved|通过/.test(normalizedMessage)) {
            params.status = 'approved'
          } else if (/已拒绝|rejected|不通过/.test(normalizedMessage)) {
            params.status = 'rejected'
          }

          return {
            intent: IntentType.QUERY,
            entity: entity as EntityType,
            params,
            confidence: 0.88
          }
        }
      }
    }
  }

  // 4. 尝试匹配统计意图
  if (/多少|数量|统计/.test(normalizedMessage)) {
    for (const [entity, aliases] of Object.entries(ENTITY_ALIASES)) {
      for (const alias of aliases) {
        if (normalizedMessage.includes(alias)) {
          return {
            intent: IntentType.COUNT,
            entity: entity as EntityType,
            params: {},
            confidence: 0.92
          }
        }
      }
    }
  }

  // 5. 尝试匹配更新意图
  if (/修改|更新|编辑|把.*改为/.test(normalizedMessage)) {
    const statusMatch = normalizedMessage.match(/(?:状态改为|改为|变成)([\u4e00-\u9fa5]+)/i)
    if (statusMatch) {
      return {
        intent: IntentType.UPDATE,
        entity: EntityType.REPORT_CARD,
        params: { status: statusMatch[1] },
        confidence: 0.8
      }
    }
  }

  // 6. 匹配帮助意图
  if (/帮助|你能做什么|怎么用|help/i.test(normalizedMessage)) {
    return {
      intent: IntentType.HELP,
      params: {},
      confidence: 0.95
    }
  }

  // 未识别
  return {
    intent: IntentType.UNKNOWN,
    params: {},
    confidence: 0
  }
}

/**
 * 生成 AI 响应
 */
function generateResponse(intent: ParsedIntent): AiResponse {
  const { intent: intentType, entity, params } = intent

  switch (intentType) {
    case IntentType.NAVIGATE:
      return {
        message: RESPONSE_TEMPLATES[intentType].replace('{entityName}', ENTITY_NAMES[entity!]),
        action: {
          type: 'navigate',
          payload: {
            route: getRouteForEntity(entity!)
          }
        }
      }

    case IntentType.CREATE:
      return {
        message: params.name
          ? `已为您打开${ENTITY_NAMES[entity!]}添加表单，已预填姓名：${params.name}`
          : RESPONSE_TEMPLATES[intentType].replace('{entityName}', ENTITY_NAMES[entity!]),
        action: {
          type: 'callback',
          payload: {
            action: 'open-create',
            entity,
            params
          }
        },
        suggestions: ['继续添加', '查看列表', '返回']
      }

    case IntentType.QUERY: {
      const count = Mock.Random.integer(5, 50)
      const message = params.status
        ? `为您找到 ${count} 条${params.status === 'pending' ? '待审核' : params.status === 'approved' ? '已审核' : '已拒绝'}的${ENTITY_NAMES[entity!]}`
        : RESPONSE_TEMPLATES[intentType].replace('{entityName}', ENTITY_NAMES[entity!])

      return {
        message,
        action: {
          type: 'navigate',
          payload: {
            route: getRouteForEntity(entity!),
            filters: params
          }
        },
        suggestions: ['查看详情', '导出数据', '修改筛选']
      }
    }

    case IntentType.COUNT: {
      const totalCount = Mock.Random.integer(50, 500)
      return {
        message: RESPONSE_TEMPLATES[intentType]
          .replace('{count}', totalCount.toString())
          .replace('{entityName}', ENTITY_NAMES[entity!]),
        action: {
          type: 'api',
          payload: {
            entity,
            operation: 'count'
          }
        },
        suggestions: ['查看列表', '统计分析', '导出报表']
      }
    }

    case IntentType.UPDATE:
      return {
        message: `已为您批量更新${params.status || ''}状态`,
        action: {
          type: 'api',
          payload: {
            entity,
            operation: 'update',
            params
          }
        }
      }

    case IntentType.HELP:
      return {
        message: RESPONSE_TEMPLATES[intentType],
        suggestions: ['显示待审核的报告卡', '新增用户', '打开用户管理页面', '有多少个用户']
      }

    default:
      return {
        message: RESPONSE_TEMPLATES[IntentType.UNKNOWN]
      }
  }
}

/**
 * 根据实体获取路由
 */
function getRouteForEntity(entity: EntityType): string {
  const routeMap: Record<EntityType, string> = {
    [EntityType.REPORT_CARD]: '/home/objectManagement',
    [EntityType.USER]: '/home/userManagement',
    [EntityType.OBJECT]: '/home/objectManagement',
    [EntityType.AUDIT]: '/home/objectManagement'
  }
  return routeMap[entity] || '/home/dashboard'
}

// Mock API: 聊天接口
Mock.mock('/api/ai/chat', 'post', (options: { body: string }) => {
  const { message } = JSON.parse(options.body)

  const intent = matchIntent(message)
  const response = generateResponse(intent)

  return {
    code: 200,
    data: response,
    msg: 'success'
  }
})

// Mock API: 意图识别接口
Mock.mock('/api/ai/intent', 'post', (options: { body: string }) => {
  const { message } = JSON.parse(options.body)

  const intent = matchIntent(message)

  return {
    code: 200,
    data: intent,
    msg: 'success'
  }
})

// Mock API: 执行意图接口
Mock.mock('/api/ai/execute', 'post', (options: { body: string }) => {
  const { intent } = JSON.parse(options.body)

  const response = generateResponse(intent)

  return {
    code: 200,
    data: response,
    msg: 'success'
  }
})

// 导出工具函数供其他模块使用
export { matchIntent, generateResponse, getRouteForEntity }
