import request from './request'
import type {
  ChatRequest,
  AiResponse,
  IntentRequest,
  IntentApiResponse,
  ExecuteRequest,
  CreateSessionRequest,
  CreateSessionResponse,
  SessionDetailResponse,
  SessionListResponse
} from '@/types/ai'

/**
 * AI API 接口（与后端API保持一致）
 * Base URL: /api/ai
 *
 * 注意：响应拦截器已自动解包 ApiResponse，直接返回 data 部分
 */
export const aiApi = {
  /**
   * 聊天对话
   * POST /api/ai/chat
   */
  chat(data: ChatRequest): Promise<AiResponse> {
    return request({
      url: '/ai/chat',
      method: 'post',
      data
    })
  },

  /**
   * 意图识别
   * POST /api/ai/intent
   */
  recognizeIntent(data: IntentRequest): Promise<IntentApiResponse> {
    return request({
      url: '/ai/intent',
      method: 'post',
      data
    })
  },

  /**
   * 执行意图
   * POST /api/ai/execute
   */
  executeIntent(data: ExecuteRequest): Promise<AiResponse> {
    return request({
      url: '/ai/execute',
      method: 'post',
      data
    })
  },

  /**
   * 创建会话
   * POST /api/ai/sessions
   */
  createSession(data?: CreateSessionRequest): Promise<CreateSessionResponse> {
    return request({
      url: '/ai/sessions',
      method: 'post',
      data: data || {}
    })
  },

  /**
   * 获取当前用户的所有会话
   * GET /api/ai/sessions
   */
  getSessionList(): Promise<SessionListResponse> {
    return request({
      url: '/ai/sessions',
      method: 'get'
    })
  },

  /**
   * 获取会话历史
   * GET /api/ai/sessions/{sessionId}
   */
  getSession(sessionId: string): Promise<SessionDetailResponse> {
    return request({
      url: `/ai/sessions/${sessionId}`,
      method: 'get'
    })
  },

  /**
   * 删除会话
   * DELETE /api/ai/sessions/{sessionId}
   */
  deleteSession(sessionId: string): Promise<void> {
    return request({
      url: `/ai/sessions/${sessionId}`,
      method: 'delete'
    })
  }
}
