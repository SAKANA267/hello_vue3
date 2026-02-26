import request from './request'
import type { ApiResponse } from './types'
import type { ParsedIntent, AiResponse } from '@/types/ai'

/** AI 请求参数 */
export interface AiChatRequest {
  message: string
  sessionId?: string
  context?: {
    previousMessages?: Array<{ role: string; content: string }>
    currentPage?: string
  }
}

/** AI 意图识别请求 */
export interface IntentRequest {
  message: string
}

/** AI 响应结果 */
export type AiChatResponse = ApiResponse<AiResponse>

/** 意图识别响应 */
export type IntentResponse = ApiResponse<ParsedIntent>

/**
 * AI API 接口
 */
export const aiApi = {
  /**
   * 发送聊天消息
   */
  chat(data: AiChatRequest): Promise<AiChatResponse> {
    return request({
      url: '/ai/chat',
      method: 'post',
      data,
      mock: true
    })
  },

  /**
   * 识别用户意图
   */
  recognizeIntent(data: IntentRequest): Promise<IntentResponse> {
    return request({
      url: '/ai/intent',
      method: 'post',
      data,
      mock: true
    })
  },

  /**
   * 执行意图操作
   */
  executeIntent(intent: ParsedIntent): Promise<AiChatResponse> {
    return request({
      url: '/ai/execute',
      method: 'post',
      data: { intent },
      mock: true
    })
  }
}
