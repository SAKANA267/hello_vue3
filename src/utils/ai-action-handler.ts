/*
AI Action Handler Utility
处理从后端 AI API 返回的操作（NAVIGATE, API, CALLBACK）

参考后端 API 文档：../public-health-api/docs/ai-action-handling-guide.md
*/

import type { Router } from 'vue-router'
import request from '@/api/request'
import type { Action, ActionType, IntentType } from '@/types/ai'

// ============== 类型定义 ==============

/** HTTP 方法类型 */
type HttpMethod = 'get' | 'post' | 'put' | 'delete'

/** API 映射配置 */
interface ApiMappingConfig {
  method: HttpMethod
  pathTemplate: string // 支持占位符，如 /report-cards/:id
}

/** 回调处理器类型 */
type CallbackHandler = (params?: Record<string, any>) => void | Promise<void>

// ============== API 映射配置 ==============

/** 实体类型常量 */
const ENTITY_TYPE = {
  REPORT_CARD: 'reportCard',
  USER: 'user',
  AUDIT: 'audit',
  OBJECT: 'object'
} as const

/** 意图类型常量 */
const INTENT_TYPE = {
  NAVIGATE: 'NAVIGATE',
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  QUERY: 'QUERY',
  COUNT: 'COUNT',
  HELP: 'HELP',
  UNKNOWN: 'UNKNOWN'
} as const

type EntityType = (typeof ENTITY_TYPE)[keyof typeof ENTITY_TYPE]
type Intent = (typeof INTENT_TYPE)[keyof typeof INTENT_TYPE]

/**
 * API 映射表
 * 根据 entity + intent 组合查找对应的 HTTP 方法和路径模板
 */
const API_MAPPING: Record<string, Record<string, ApiMappingConfig>> = {
  [ENTITY_TYPE.REPORT_CARD]: {
    [INTENT_TYPE.CREATE]: { method: 'post', pathTemplate: '/report-cards' },
    [INTENT_TYPE.READ]: { method: 'get', pathTemplate: '/report-cards/:id' },
    [INTENT_TYPE.UPDATE]: { method: 'put', pathTemplate: '/report-cards/:id' },
    [INTENT_TYPE.DELETE]: { method: 'delete', pathTemplate: '/report-cards/:id' },
    [INTENT_TYPE.QUERY]: { method: 'get', pathTemplate: '/report-cards' },
    [INTENT_TYPE.COUNT]: { method: 'get', pathTemplate: '/report-cards/count' }
  },
  [ENTITY_TYPE.USER]: {
    [INTENT_TYPE.CREATE]: { method: 'post', pathTemplate: '/users' },
    [INTENT_TYPE.READ]: { method: 'get', pathTemplate: '/users/:id' },
    [INTENT_TYPE.UPDATE]: { method: 'put', pathTemplate: '/users/:id' },
    [INTENT_TYPE.DELETE]: { method: 'delete', pathTemplate: '/users/:id' },
    [INTENT_TYPE.QUERY]: { method: 'get', pathTemplate: '/users' }
  },
  [ENTITY_TYPE.AUDIT]: {
    [INTENT_TYPE.QUERY]: { method: 'get', pathTemplate: '/report-cards' },
    [INTENT_TYPE.READ]: { method: 'get', pathTemplate: '/report-cards/:id' }
  },
  [ENTITY_TYPE.OBJECT]: {
    [INTENT_TYPE.CREATE]: { method: 'post', pathTemplate: '/report-cards' },
    [INTENT_TYPE.READ]: { method: 'get', pathTemplate: '/report-cards/:id' },
    [INTENT_TYPE.UPDATE]: { method: 'put', pathTemplate: '/report-cards/:id' },
    [INTENT_TYPE.DELETE]: { method: 'delete', pathTemplate: '/report-cards/:id' },
    [INTENT_TYPE.QUERY]: { method: 'get', pathTemplate: '/report-cards' }
  }
}

// ============== 路由映射配置 ==============

/** 实体到路由的映射表 */
const ROUTE_MAPPING: Record<string, string> = {
  [ENTITY_TYPE.REPORT_CARD]: '/objectManagement',
  [ENTITY_TYPE.USER]: '/userManagement',
  [ENTITY_TYPE.AUDIT]: '/auditManagement',
  [ENTITY_TYPE.OBJECT]: '/objectManagement'
}

// ============== 辅助函数 ==============

/**
 * 构建 API 路径
 * 替换路径参数（:id）并附加查询字符串
 *
 * @param pathTemplate 路径模板，如 /report-cards/:id
 * @param params 参数对象，包含 pathParams（路径参数）和 queryParams（查询参数）
 * @returns 完整的 API 路径
 *
 * @example
 * buildApiPath('/report-cards/:id', { pathParams: { id: '123' } }) // '/report-cards/123'
 * buildApiPath('/report-cards', { queryParams: { status: 'PENDING' } }) // '/report-cards?status=PENDING'
 * buildApiPath('/report-cards/:id', { pathParams: { id: '123' }, queryParams: { detail: 'true' } }) // '/report-cards/123?detail=true'
 */
function buildApiPath(
  pathTemplate: string,
  params?: {
    pathParams?: Record<string, any>
    queryParams?: Record<string, any>
  }
): { url: string; queryParams?: Record<string, any> } {
  let path = pathTemplate
  const queryParams: Record<string, any> = {}

  // 处理路径参数（替换 :id, :name 等）
  if (params?.pathParams) {
    Object.entries(params.pathParams).forEach(([key, value]) => {
      const placeholder = `:${key}`
      if (path.includes(placeholder)) {
        path = path.replace(placeholder, String(value))
      }
    })
  }

  // 收集查询参数（不用于路径替换的参数）
  if (params?.queryParams) {
    Object.entries(params.queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams[key] = value
      }
    })
  }

  return { url: path, queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined }
}

/**
 * 从 payload 中提取路径参数和查询参数
 * 路径参数：id, code 等用于构建 URL 的参数
 * 查询参数：filters, page, size 等用于筛选的参数
 */
function extractParamsFromPayload(payload: Record<string, any>): {
  pathParams: Record<string, any>
  queryParams: Record<string, any>
  data: Record<string, any>
} {
  const pathParams: Record<string, any> = {}
  const queryParams: Record<string, any> = {}
  const data: Record<string, any> = {}

  // 常见的路径参数名
  const pathParamKeys = ['id', 'code', 'userId']

  Object.entries(payload).forEach(([key, value]) => {
    if (pathParamKeys.includes(key)) {
      pathParams[key] = value
    } else if (key === 'filters') {
      // filters 对象展开到查询参数
      Object.entries(value || {}).forEach(([filterKey, filterValue]) => {
        queryParams[filterKey] = filterValue
      })
    } else if (['page', 'size', 'limit', 'keyword', 'status', 'department'].includes(key)) {
      queryParams[key] = value
    } else {
      // 其他参数作为请求体数据（POST/PUT）
      data[key] = value
    }
  })

  return { pathParams, queryParams, data }
}

// ============== 操作处理器 ==============

/**
 * 处理导航操作
 * 使用 Vue Router 跳转到指定路由
 */
function handleNavigateAction(
  payload: Record<string, any>,
  router: Router
): { success: boolean; route?: string; error?: string } {
  try {
    const route = payload.route
    const entity = payload.entity

    // 如果指定了 route，直接跳转
    if (route) {
      router.push(route)
      return { success: true, route }
    }

    // 如果指定了 entity，查找对应路由
    if (entity && ROUTE_MAPPING[entity]) {
      const targetRoute = ROUTE_MAPPING[entity]
      router.push(targetRoute)
      return { success: true, route: targetRoute }
    }

    return { success: false, error: 'No valid route or entity specified' }
  } catch (error) {
    console.error('[AiActionHandler] Navigate error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * 处理 API 操作
 * 根据 entity + intent 查找 API 配置并执行 HTTP 请求
 */
async function handleApiAction(
  payload: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const intent = payload.intent as Intent
    const entity = payload.entity as EntityType

    if (!intent || !entity) {
      return { success: false, error: 'Missing intent or entity in payload' }
    }

    // 查找 API 配置
    const entityConfig = API_MAPPING[entity]
    if (!entityConfig) {
      return { success: false, error: `Unknown entity: ${entity}` }
    }

    const apiConfig = entityConfig[intent]
    if (!apiConfig) {
      return { success: false, error: `Unsupported intent ${intent} for entity ${entity}` }
    }

    // 提取参数
    const { pathParams, queryParams, data } = extractParamsFromPayload(payload)

    // 构建请求路径
    const { url, queryParams: finalQueryParams } = buildApiPath(apiConfig.pathTemplate, {
      pathParams,
      queryParams
    })

    // 执行 HTTP 请求
    const response = await request({
      method: apiConfig.method,
      url,
      params: finalQueryParams,
      data: ['post', 'put'].includes(apiConfig.method) ? data : undefined
    })

    return { success: true, data: response }
  } catch (error) {
    console.error('[AiActionHandler] API error:', error)
    return { success: false, error: String(error) }
  }
}

// ============== AI Action Handler 类 ==============

/**
 * AI Action Handler 类
 * 负责处理从后端 AI API 返回的所有操作
 */
class AiActionHandler {
  private router: Router
  private callbacks: Map<string, CallbackHandler[]> = new Map()

  constructor(router: Router) {
    this.router = router
  }

  /**
   * 处理 AI 返回的操作
   * @param action 操作对象（可能为 null）
   * @returns 操作执行结果
   */
  async handleAction(action: Action | null): Promise<any> {
    if (!action) {
      return { success: false, error: 'No action provided' }
    }

    const { type, payload } = action

    switch (type) {
      case 'NAVIGATE':
        return handleNavigateAction(payload, this.router)

      case 'API':
        return await handleApiAction(payload)

      case 'CALLBACK':
        return this.handleCallbackAction(payload)

      default:
        console.warn('[AiActionHandler] Unknown action type:', type)
        return { success: false, error: `Unknown action type: ${type}` }
    }
  }

  /**
   * 处理回调操作
   * 执行已注册的自定义回调函数
   */
  private handleCallbackAction(payload: Record<string, any>): {
    success: boolean
    error?: string
  } {
    try {
      const callbackAction = payload.action
      const params = payload.params

      if (!callbackAction) {
        return { success: false, error: 'Missing callback action name' }
      }

      const handlers = this.callbacks.get(callbackAction)
      if (!handlers || handlers.length === 0) {
        console.warn(`[AiActionHandler] No registered callback for: ${callbackAction}`)
        return { success: false, error: `No registered callback for: ${callbackAction}` }
      }

      // 执行所有注册的处理器
      handlers.forEach(handler => {
        try {
          handler(params)
        } catch (err) {
          console.error(`[AiActionHandler] Callback ${callbackAction} error:`, err)
        }
      })

      return { success: true }
    } catch (error) {
      console.error('[AiActionHandler] Callback error:', error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * 注册回调处理器
   * @param intent 回调意图名称（如 'HELP', 'SHOW_DIALOG' 等）
   * @param handler 处理函数
   */
  registerCallback(intent: string, handler: CallbackHandler): void {
    if (!this.callbacks.has(intent)) {
      this.callbacks.set(intent, [])
    }
    this.callbacks.get(intent)!.push(handler)
  }

  /**
   * 取消注册回调处理器
   * @param intent 回调意图名称
   * @param handler 要移除的处理函数（如果不提供，移除该意图的所有处理器）
   */
  unregisterCallback(intent: string, handler?: CallbackHandler): void {
    if (!this.callbacks.has(intent)) return

    if (handler) {
      const handlers = this.callbacks.get(intent)!
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
      if (handlers.length === 0) {
        this.callbacks.delete(intent)
      }
    } else {
      this.callbacks.delete(intent)
    }
  }
}

// ============== 导出 ==============

export { AiActionHandler, buildApiPath, API_MAPPING, ROUTE_MAPPING }
export type { ApiMappingConfig, CallbackHandler }

/** 创建 AI Action Handler 实例的工厂函数 */
export function createAiActionHandler(router: Router): AiActionHandler {
  return new AiActionHandler(router)
}
