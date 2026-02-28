import { aiApi } from '@/api/ai'
import { createAiActionHandler } from '@/utils/ai-action-handler'
import type { AiResponse, ChatRequest, Action } from '@/types/ai'
import type { Router } from 'vue-router'
import type { CallbackHandler } from '@/utils/ai-action-handler'

/**
 * AI 服务类
 * 负责与后端AI API通信，并执行返回的操作
 *
 * 所有意图识别由后端处理，前端只负责：
 * 1. 发送用户消息到后端
 * 2. 执行后端返回的action（通过 AiActionHandler）
 */
export class AiService {
  private actionHandler: ReturnType<typeof createAiActionHandler>

  constructor(router: Router) {
    this.actionHandler = createAiActionHandler(router)
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
   * @returns 操作执行结果
   */
  async executeAction(action: Action | null): Promise<any> {
    return await this.actionHandler.handleAction(action)
  }

  /**
   * 注册回调处理器
   * 用于处理 CALLBACK 类型的操作
   *
   * @param intent 回调意图名称（如 'HELP', 'SHOW_DIALOG' 等）
   * @param handler 处理函数
   *
   * @example
   * aiService.registerCallback('HELP', () => {
   *   ElMessageBox.alert('帮助内容...', '帮助')
   * })
   */
  registerCallback(intent: string, handler: CallbackHandler): void {
    this.actionHandler.registerCallback(intent, handler)
  }

  /**
   * 取消注册回调处理器
   * @param intent 回调意图名称
   * @param handler 要移除的处理函数（可选）
   */
  unregisterCallback(intent: string, handler?: CallbackHandler): void {
    this.actionHandler.unregisterCallback(intent, handler)
  }

  /**
   * 获取底层 actionHandler 实例
   * 用于高级用法
   */
  getActionHandler() {
    return this.actionHandler
  }
}

/**
 * 创建 AI 服务实例
 */
export function createAiService(router: Router): AiService {
  return new AiService(router)
}

/**
 * 默认导出单例
 */
let defaultAiService: AiService | null = null

export function initAiService(router: Router): AiService {
  if (!defaultAiService) {
    defaultAiService = new AiService(router)
  }
  return defaultAiService
}

export function getAiService(): AiService | null {
  return defaultAiService
}
