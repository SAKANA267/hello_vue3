// AI Assistant Type Definitions (与后端API保持一致)

/** 删除确认对话框数据 */
export interface DeleteConfirmData {
  objectInfo: Record<string, any>
  onConfirm: () => void
  onCancel: () => void
}

/** 会话消息类型 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  type?: 'text' | 'action' | 'error' | 'loading' | 'delete-confirm'
  suggestions?: string[] // 建议操作按钮
  confirmData?: DeleteConfirmData // 删除确认对话框数据
}

/** 历史会话 */
export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

/** 意图类型枚举 */
export enum IntentType {
  NAVIGATE = 'NAVIGATE',
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  QUERY = 'QUERY',
  COUNT = 'COUNT',
  HELP = 'HELP',
  UNKNOWN = 'UNKNOWN'
}

/** 实体类型 */
export interface EntityType {
  code: string
  name: string
  aliases: string[]
}

/** 操作类型枚举 */
export enum ActionType {
  NAVIGATE = 'NAVIGATE',
  API = 'API',
  CALLBACK = 'CALLBACK'
}

/** 操作 */
export interface Action {
  type: ActionType
  payload: {
    intent?: string
    entity?: string
    route?: string
    filters?: Record<string, any>
    [key: string]: any
  }
}

/** 解析后的意图（后端返回） */
export interface ParsedIntent {
  intent: IntentType | string
  entity?: EntityType
  params: Record<string, any>
  confidence: number
}

/** AI 响应（后端返回） */
export interface AiResponse {
  message: string
  action?: Action
  suggestions?: string[]
  sessionId?: string
}

/** 聊天请求（发送给后端） */
export interface ChatRequest {
  message: string
  sessionId?: string
  context?: {
    previousMessages?: Array<{ role: string; content: string }>
    currentPage?: string
  }
}

/** 意图识别请求 */
export interface IntentRequest {
  message: string
}

/** 意图识别响应 */
export interface IntentApiResponse {
  intent: string
  entity?: EntityType
  params: Record<string, any>
  confidence: number
}

/** 执行意图请求 */
export interface ExecuteRequest {
  intent: string
  entity?: string
  params?: Record<string, any>
}

/** 创建会话请求 */
export interface CreateSessionRequest {
  userId?: string
  title?: string
}

/** 创建会话响应 */
export interface CreateSessionResponse {
  sessionId: string
  timestamp: number
}

/** 会话详情响应 */
export interface SessionDetailResponse {
  sessionId: string
  title: string
  messages: ChatMessage[]
}

/** 快捷操作配置 */
export interface QuickAction {
  label: string
  icon: string
  prompt: string
}
