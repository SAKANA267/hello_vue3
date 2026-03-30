// AI Assistant Type Definitions (与后端API保持一致)

/** 表格列配置 */
export interface TableColumn {
  key: string
  label: string
  width?: string | number
}

/** 删除确认对话框数据 */
export interface DeleteConfirmData {
  objectInfo: Record<string, any>
  onConfirm: () => void
  onCancel: () => void
}

/** 请求数据卡片数据 */
export interface RequestDataData {
  title: string
  description?: string
  data: Record<string, any>[] | Record<string, any>
  columns?: TableColumn[]
  pageSize?: number
  showActions?: boolean
  actionText?: string
  onAction: () => void
}

/** 表单字段配置 */
export interface FormFieldConfig {
  prop: string
  label: string
  type: 'input' | 'select' | 'radio' | 'date' | 'textarea'
  options?: Array<{ label: string; value: any }> | string[]
  defaultValue?: any
  required?: boolean
  placeholder?: string
  disabled?: boolean
}

/** 创建表单数据 */
export interface CreateFormData {
  title: string // 对话框标题，如 "新增报告卡"
  description?: string // 表单描述
  fields: FormFieldConfig[] // 表单字段配置
  initialData?: Record<string, any> // AI预填充的默认值
  submitApi: string // 提交API路径
  submitMethod?: 'POST' | 'PUT' | 'PATCH'
}

/** 会话消息类型 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  type?: 'text' | 'action' | 'error' | 'loading' | 'delete-confirm' | 'request-data' | 'create-form'
  suggestions?: string[] // 建议操作按钮
  confirmData?: DeleteConfirmData // 删除确认对话框数据
  requestData?: RequestDataData // 请求数据卡片数据
  createFormData?: CreateFormData // 创建表单数据
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

/** 导航操作 Payload */
export interface NavigateActionPayload {
  page?: string // 目标页面路径
  prefill?: Record<string, any> // 预填充数据
  params?: Record<string, any> // 路由参数
}

/** API操作 Payload */
export interface ApiActionPayload {
  api?: string // API路径，如 /api/report-cards/123
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' // HTTP方法
  params?: Record<string, any> // 查询参数
  body?: Record<string, any> // 请求体（POST/PUT/PATCH使用）
  data?: ApiActionPayload // 嵌套的 data 字段（后端可能返回这种格式）
}

/** 回调操作 Payload */
export interface CallbackActionPayload {
  callback?: string // 回调函数名
  action?: string // 备选的回调名称字段
  params?: Record<string, any> // 回调参数
}

/** 操作 */
export interface Action {
  type: ActionType
  payload: Record<string, any> // 使用松散类型以兼容不同格式
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

/** 会话列表项（后端 SessionDTO） */
export interface SessionDTO {
  sessionId: string
  userId: string
  title: string
  messageCount: number
  lastMessageAt: number
  createdAt: number
  updatedAt: number
}

/** 消息列表项（后端 MessageDTO） */
export interface MessageDTO {
  messageId: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  messageType: 'text' | 'action' | 'error'
  metadata?: string // JSON string
  createdAt: number
}

/** 会话列表响应（后端直接返回数组） */
export type SessionListResponse = SessionDTO[]

/** 创建会话请求 */
export interface CreateSessionRequest {
  title?: string // userId no longer needed, extracted from JWT token
}

/** 创建会话响应（后端返回完整 SessionDTO） */
export interface CreateSessionResponse extends SessionDTO {}

/** 会话详情响应（后端返回完整会话信息） */
export interface SessionDetailResponse extends SessionDTO {
  messages: MessageDTO[]
}

/** 快捷操作配置 */
export interface QuickAction {
  label: string
  icon: string
  prompt: string
}
