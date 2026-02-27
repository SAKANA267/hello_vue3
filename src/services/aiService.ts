import { aiApi } from '@/api/ai'
import type { AiResponse, ChatRequest, Action } from '@/types/ai'

/**
 * AI 服务类（重构版）
 * 负责与后端AI API通信，并执行返回的操作
 *
 * 所有意图识别由后端处理，前端只负责：
 * 1. 发送用户消息到后端
 * 2. 执行后端返回的action
 */
export class AiService {
  private router: any

  constructor(router: any) {
    this.router = router
  }

  /**
   * 处理用户消息
   * @param message 用户输入的消息
   * @param sessionId 会话ID（可选）
   * @returns AI 响应
   */
  async processMessage(message: string, sessionId?: string): Promise<AiResponse> {
    try {
      // 构建请求：首次对话（无 sessionId）时不传该字段
      const request: ChatRequest = {
        message,
        ...(sessionId && { sessionId })  // 只有当 sessionId 存在时才添加
      }

      // aiApi.chat 返回的已经是解包后的 AiResponse（响应拦截器处理）
      return await aiApi.chat(request)
    } catch (error) {
      console.error('AI API error:', error)
      return {
        message: '抱歉，服务暂时不可用，请稍后重试。',
        suggestions: ['重新尝试', '联系管理员']
      }
    }
  }

  /**
   * 执行AI返回的操作
   * @param action 操作对象
   */
  executeAction(action: Action): void {
    switch (action.type) {
      case 'NAVIGATE':
        this.handleNavigate(action)
        break
      case 'API':
        this.handleApi(action)
        break
      case 'CALLBACK':
        this.handleCallback(action)
        break
    }
  }

  /**
   * 处理导航操作
   */
  private handleNavigate(action: Action): void {
    const route = action.payload.route
    if (route) {
      this.router.push(route)
    }
  }

  /**
   * 处理API操作
   * 后端返回需要调用的API信息，前端执行调用
   */
  private handleApi(action: Action): void {
    // 可以通过事件总线或其他方式通知相关组件
    // 这里留空，由具体业务场景决定如何处理
    console.log('API action:', action.payload)
  }

  /**
   * 处理回调操作
   * 后端返回的自定义操作，前端执行相应逻辑
   */
  private handleCallback(action: Action): void {
    const callbackAction = action.payload.action
    const entity = action.payload.entity
    const params = action.payload.params

    // 可以通过事件总线通知相关组件
    // 例如：打开创建对话框、预填表单等
    console.log('Callback action:', { callbackAction, entity, params })
  }
}

/**
 * 创建 AI 服务实例
 */
export function createAiService(router: any): AiService {
  return new AiService(router)
}

/**
 * 默认导出单例
 */
let defaultAiService: AiService | null = null

export function initAiService(router: any): AiService {
  if (!defaultAiService) {
    defaultAiService = new AiService(router)
  }
  return defaultAiService
}

export function getAiService(): AiService | null {
  return defaultAiService
}
