// AI Assistant Type Definitions

/** 会话消息类型 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  type?: 'text' | 'action' | 'error' | 'loading'
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
  NAVIGATE = 'navigate',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  QUERY = 'query',
  COUNT = 'count',
  HELP = 'help',
  UNKNOWN = 'unknown'
}

/** 实体类型枚举 */
export enum EntityType {
  REPORT_CARD = 'reportCard',
  USER = 'user',
  OBJECT = 'object',
  AUDIT = 'audit'
}

/** 解析后的意图 */
export interface ParsedIntent {
  intent: IntentType
  entity?: EntityType
  params: Record<string, any>
  confidence: number
}

/** AI 响应 */
export interface AiResponse {
  message: string
  action?: {
    type: 'navigate' | 'api' | 'callback'
    payload: any
  }
  suggestions?: string[]
}

/** 快捷操作配置 */
export interface QuickAction {
  label: string
  icon: string
  prompt: string
}
