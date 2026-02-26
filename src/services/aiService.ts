import { aiApi } from '@/api/ai'
import { matchLocalIntent, shouldUseAiApi, formatResponseMessage } from '@/utils/intentMatcher'
import { IntentType, EntityType } from '@/types/ai'
import type { ParsedIntent, AiResponse } from '@/types/ai'
import { RESPONSE_TEMPLATES, ENTITY_NAMES } from '@/constants/intents'

/**
 * AI 服务类
 * 负责处理用户消息，识别意图，执行操作，生成响应
 */
export class AiService {
  private router: any
  private eventBus: any

  constructor(router: any, eventBus?: any) {
    this.router = router
    this.eventBus = eventBus
  }

  /**
   * 处理用户消息
   * @param message 用户输入的消息
   * @returns AI 响应
   */
  async processMessage(message: string): Promise<AiResponse> {
    try {
      // 1. 尝试本地意图匹配（快速路径）
      const localIntent = matchLocalIntent(message)

      // 2. 判断是否需要调用 AI API
      if (shouldUseAiApi(localIntent)) {
        const apiResponse = await this.callAiApi(message)
        return apiResponse
      }

      // 3. 执行本地识别的意图
      return await this.executeIntent(localIntent, message)
    } catch (error) {
      console.error('AI service error:', error)
      return {
        message: '抱歉，处理您的请求时出错，请稍后重试。',
        suggestions: ['重新尝试', '联系管理员']
      }
    }
  }

  /**
   * 调用 AI API
   */
  private async callAiApi(message: string): Promise<AiResponse> {
    const response = await aiApi.chat({ message })
    return response.data
  }

  /**
   * 执行意图
   */
  private async executeIntent(intent: ParsedIntent, originalMessage: string): Promise<AiResponse> {
    switch (intent.intent) {
      case IntentType.NAVIGATE:
        return this.handleNavigate(intent)
      case IntentType.CREATE:
        return this.handleCreate(intent)
      case IntentType.READ:
        return this.handleRead(intent)
      case IntentType.QUERY:
        return this.handleQuery(intent)
      case IntentType.COUNT:
        return this.handleCount(intent)
      case IntentType.UPDATE:
        return this.handleUpdate(intent)
      case IntentType.DELETE:
        return this.handleDelete(intent)
      case IntentType.HELP:
        return this.handleHelp()
      default:
        return this.handleUnknown(intent)
    }
  }

  /**
   * 处理导航意图
   */
  private handleNavigate(intent: ParsedIntent): AiResponse {
    const route = this.getRouteForEntity(intent.entity)

    if (route) {
      this.router.push(route)
    }

    return {
      message: RESPONSE_TEMPLATES[IntentType.NAVIGATE].replace(
        '{entityName}',
        ENTITY_NAMES[intent.entity!]
      ),
      action: {
        type: 'navigate',
        payload: { route }
      }
    }
  }

  /**
   * 处理创建意图
   */
  private handleCreate(intent: ParsedIntent): AiResponse {
    const entityName = ENTITY_NAMES[intent.entity!]
    let message = RESPONSE_TEMPLATES[IntentType.CREATE].replace('{entityName}', entityName)

    // 如果有预填数据，提示用户
    if (intent.params.name) {
      message += `，已预填姓名：${intent.params.name}`
    }

    // 触发事件通知页面打开创建对话框
    if (this.eventBus) {
      this.eventBus.emit(`ai:open-create-${intent.entity}`, intent.params)
    }

    return {
      message,
      action: {
        type: 'callback',
        payload: {
          action: 'open-create',
          entity: intent.entity,
          params: intent.params
        }
      },
      suggestions: ['继续添加', '查看列表', '返回']
    }
  }

  /**
   * 处理读取意图
   */
  private handleRead(intent: ParsedIntent): AiResponse {
    const route = this.getRouteForEntity(intent.entity)

    return {
      message: `为您列出 ${ENTITY_NAMES[intent.entity!]} 数据`,
      action: {
        type: 'navigate',
        payload: { route }
      }
    }
  }

  /**
   * 处理查询意图
   */
  private async handleQuery(intent: ParsedIntent): Promise<AiResponse> {
    const route = this.getRouteForEntity(intent.entity)

    // 模拟查询结果
    const count = this.generateMockCount()

    let message = intent.params.status
      ? `为您找到 ${count} 条${this.getStatusLabel(intent.params.status)}的${ENTITY_NAMES[intent.entity!]}`
      : `为您查询符合条件的 ${ENTITY_NAMES[intent.entity!]}`

    return {
      message,
      action: {
        type: 'navigate',
        payload: {
          route,
          filters: intent.params
        }
      },
      suggestions: ['查看详情', '导出数据', '修改筛选']
    }
  }

  /**
   * 处理统计意图
   */
  private async handleCount(intent: ParsedIntent): Promise<AiResponse> {
    // 模拟统计数据
    const count = this.generateMockCount()

    return {
      message: RESPONSE_TEMPLATES[IntentType.COUNT]
        .replace('{count}', count.toString())
        .replace('{entityName}', ENTITY_NAMES[intent.entity!]),
      action: {
        type: 'api',
        payload: {
          entity: intent.entity,
          operation: 'count'
        }
      },
      suggestions: ['查看列表', '统计分析', '导出报表']
    }
  }

  /**
   * 处理更新意图
   */
  private handleUpdate(intent: ParsedIntent): AiResponse {
    return {
      message: intent.params.status
        ? `已为您批量更新状态为：${this.getStatusLabel(intent.params.status)}`
        : RESPONSE_TEMPLATES[IntentType.UPDATE],
      action: {
        type: 'api',
        payload: {
          entity: intent.entity,
          operation: 'update',
          params: intent.params
        }
      }
    }
  }

  /**
   * 处理删除意图
   */
  private handleDelete(intent: ParsedIntent): AiResponse {
    return {
      message: RESPONSE_TEMPLATES[IntentType.DELETE],
      action: {
        type: 'api',
        payload: {
          entity: intent.entity,
          operation: 'delete',
          params: intent.params
        }
      }
    }
  }

  /**
   * 处理帮助意图
   */
  private handleHelp(): AiResponse {
    return {
      message: RESPONSE_TEMPLATES[IntentType.HELP],
      suggestions: ['显示待审核的报告卡', '新增用户', '打开用户管理页面', '有多少个用户']
    }
  }

  /**
   * 处理未知意图
   */
  private handleUnknown(intent: ParsedIntent): AiResponse {
    return {
      message: RESPONSE_TEMPLATES[IntentType.UNKNOWN],
      suggestions: ['显示待审核的报告卡', '新增用户', '打开用户管理页面']
    }
  }

  /**
   * 根据实体获取路由
   */
  private getRouteForEntity(entity?: EntityType): string {
    if (!entity) return '/home/dashboard'

    const routeMap: Record<EntityType, string> = {
      [EntityType.REPORT_CARD]: '/home/objectManagement',
      [EntityType.USER]: '/home/userManagement',
      [EntityType.OBJECT]: '/home/objectManagement',
      [EntityType.AUDIT]: '/home/objectManagement'
    }

    return routeMap[entity] || '/home/dashboard'
  }

  /**
   * 获取状态标签
   */
  private getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      pending: '待审核',
      approved: '已审核',
      rejected: '已拒绝'
    }
    return statusMap[status] || status
  }

  /**
   * 生成模拟数量
   */
  private generateMockCount(): number {
    return Math.floor(Math.random() * 100) + 10
  }
}

/**
 * 创建 AI 服务实例
 */
export function createAiService(router: any, eventBus?: any): AiService {
  return new AiService(router, eventBus)
}

/**
 * 默认导出单例
 */
let defaultAiService: AiService | null = null

export function initAiService(router: any, eventBus?: any): AiService {
  if (!defaultAiService) {
    defaultAiService = new AiService(router, eventBus)
  }
  return defaultAiService
}

export function getAiService(): AiService | null {
  return defaultAiService
}
