/*
AI Action Handler Utility
处理从后端 AI API 返回的操作（NAVIGATE, API, CALLBACK）

参考后端文档：../public-health-api/docs/ai/ai-frontend-guide.md
*/

import type { Router } from 'vue-router'
import request from '@/api/request'
import type { Action } from '@/types/ai'

// ============== 类型定义 ==============

/** 回调处理器类型 */
type CallbackHandler = (params?: Record<string, any>) => void | Promise<void>

/** HTTP 方法类型 */
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

/** API Action Payload */
interface ApiActionPayload {
  api: string           // API路径，如 /api/report-cards/123
  method: HttpMethod    // HTTP方法
  params?: Record<string, any>   // 查询参数
  body?: Record<string, any>     // 请求体（POST/PUT/PATCH使用）
}

/** Navigate Action Payload */
interface NavigateActionPayload {
  page: string                         // 目标页面路径
  prefill?: Record<string, any>        // 预填充数据
  params?: Record<string, any>         // 路由参数
}

/** Callback Action Payload */
interface CallbackActionPayload {
  callback: string                     // 回调函数名
  params?: Record<string, any>         // 回调参数
}

// ============== 类型守卫 ==============

/** 提取 payload 数据（处理嵌套的 data 结构） */
function extractPayloadData(payload: any): any {
  return payload?.data || payload
}

/** 检查是否为 NavigateActionPayload */
function isNavigateActionPayload(payload: any): payload is NavigateActionPayload {
  const data = extractPayloadData(payload)
  return data && typeof data.page === 'string'
}

/** 检查是否为 ApiActionPayload */
function isApiActionPayload(payload: any): payload is ApiActionPayload {
  const data = extractPayloadData(payload)
  return data && typeof data.api === 'string' && typeof data.method === 'string'
}

/** 检查是否为 CallbackActionPayload */
function isCallbackActionPayload(payload: any): payload is CallbackActionPayload {
  const data = extractPayloadData(payload)
  return data && (typeof data.callback === 'string' || typeof data.action === 'string')
}

// ============== 操作处理器 ==============

/**
 * 处理导航操作
 * 使用 Vue Router 跳转到指定路由
 */
function handleNavigateAction(
  payload: NavigateActionPayload,
  router: Router
): { success: boolean; route?: string; error?: string } {
  try {
    // 提取实际的 payload 数据
    const data = extractPayloadData(payload)
    const { page, prefill, params } = data

    console.log('[🧭 handleNavigateAction]', { page, prefill, params })

    // 如果有预填充数据，存储到 sessionStorage 供目标页面使用
    if (prefill) {
      try {
        sessionStorage.setItem('ai_prefill_data', JSON.stringify(prefill))
      } catch (e) {
        console.warn('[AiActionHandler] Failed to store prefill data:', e)
      }
    }

    // 执行路由跳转
    // params 通常用作查询参数，使用 query 传递
    router.push({ path: page, query: params })

    return { success: true, route: page }
  } catch (error) {
    console.error('[AiActionHandler] Navigate error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * 处理 API 操作
 * 根据 payload 中的 api、method、params、body 直接执行 HTTP 请求
 */
async function handleApiAction(
  payload: ApiActionPayload
): Promise<{ success: boolean; data?: any; error?: string }> {
  console.log('[🔧 handleApiAction START]', payload)
  try {
    // 提取实际的 payload 数据
    const data = extractPayloadData(payload)
    const { api, method, params, body } = data

    console.log('[📡 About to make HTTP request]', { method, url: api, params, body })

    // 执行 HTTP 请求
    const response = await request({
      method,
      url: api,
      params,
      data: ['post', 'put', 'patch'].includes(method.toLowerCase()) ? body : undefined
    })

    console.log('[✅ HTTP request completed]', response)

    return { success: true, data: response }
  } catch (error) {
    console.error('[❌ AiActionHandler] API error:', error)
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
    console.log('[🎯 AiActionHandler.handleAction START]', action)
    if (!action) {
      console.log('[❌ No action provided]')
      return { success: false, error: 'No action provided' }
    }

    const { type, payload } = action
    console.log('[📋 Action details]', { type, payload })

    switch (type) {
      case 'NAVIGATE':
        console.log('[🧭 Handling NAVIGATE action]')
        if (isNavigateActionPayload(payload)) {
          return handleNavigateAction(payload, this.router)
        }
        return { success: false, error: 'Invalid NAVIGATE payload' }

      case 'API':
        console.log('[🌐 Handling API action]')
        if (isApiActionPayload(payload)) {
          return await handleApiAction(payload)
        }
        return { success: false, error: 'Invalid API payload' }

      case 'CALLBACK':
        console.log('[📞 Handling CALLBACK action]')
        if (isCallbackActionPayload(payload)) {
          return this.handleCallbackAction(payload)
        }
        return { success: false, error: 'Invalid CALLBACK payload' }

      default:
        console.warn('[AiActionHandler] Unknown action type:', type)
        return { success: false, error: `Unknown action type: ${type}` }
    }
  }

  /**
   * 处理回调操作
   * 执行已注册的自定义回调函数
   */
  private handleCallbackAction(payload: CallbackActionPayload): {
    success: boolean
    error?: string
  } {
    try {
      // 提取实际的 payload 数据
      const data = extractPayloadData(payload)
      const callback = data.callback || data.action
      const params = data.params

      console.log('[📞 handleCallbackAction]', { callback, params })

      if (!callback) {
        return { success: false, error: 'Missing callback name' }
      }

      const handlers = this.callbacks.get(callback)
      if (!handlers || handlers.length === 0) {
        console.warn(`[AiActionHandler] No registered callback for: ${callback}`)
        return { success: false, error: `No registered callback for: ${callback}` }
      }

      // 执行所有注册的处理器
      handlers.forEach(handler => {
        try {
          handler(params)
        } catch (err) {
          console.error(`[AiActionHandler] Callback ${callback} error:`, err)
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
   * @param callbackName 回调函数名称（如 'openAuditDialog', 'showConfirm' 等）
   * @param handler 处理函数
   */
  registerCallback(callbackName: string, handler: CallbackHandler): void {
    if (!this.callbacks.has(callbackName)) {
      this.callbacks.set(callbackName, [])
    }
    this.callbacks.get(callbackName)!.push(handler)
  }

  /**
   * 取消注册回调处理器
   * @param callbackName 回调函数名称
   * @param handler 要移除的处理函数（可选）
   */
  unregisterCallback(callbackName: string, handler?: CallbackHandler): void {
    if (!this.callbacks.has(callbackName)) return

    if (handler) {
      const handlers = this.callbacks.get(callbackName)!
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
      if (handlers.length === 0) {
        this.callbacks.delete(callbackName)
      }
    } else {
      this.callbacks.delete(callbackName)
    }
  }

  /**
   * 获取所有已注册的回调名称
   */
  getRegisteredCallbacks(): string[] {
    return Array.from(this.callbacks.keys())
  }
}

// ============== 导出 ==============

export { AiActionHandler }
export type { CallbackHandler, ApiActionPayload, NavigateActionPayload, CallbackActionPayload }

/** 创建 AI Action Handler 实例的工厂函数 */
export function createAiActionHandler(router: Router): AiActionHandler {
  return new AiActionHandler(router)
}
