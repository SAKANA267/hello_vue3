/*
HTTP 请求模块 - 后端 API 对接版本
统一处理认证、错误处理、令牌刷新
*/

import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import type { RequestConfig } from './types'
import { authApi } from './api'

// 扩展 Axios 配置以支持 metadata
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: number
  }
  _retry?: boolean
}

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_INFO_KEY = 'user_info'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API || '/api',
  timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000
})

// 请求拦截器 - 自动注入 Authorization 头
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加用户角色信息到请求头（后端权限验证用）
    const userInfo = localStorage.getItem(USER_INFO_KEY)
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo)
        config.headers['X-User-Role'] = user.role || 'GUEST'
        config.headers['X-User-Id'] = user.id || ''
      } catch (e) {
        console.error('Failed to parse user info for headers:', e)
      }
    }

    // 记录请求开始时间
    ;(config as ExtendedAxiosRequestConfig).metadata = { startTime: Date.now() }

    console.log('[Request Start]', {
      url: config.url,
      fullUrl: `${config.baseURL || ''}${config.url}`,
      method: config.method?.toUpperCase(),
      params: config.params,
      data: config.data,
      headers: config.headers,
      timeout: config.timeout,
      timestamp: new Date().toISOString()
    })
    return config
  },
  error => {
    console.error('[Request Config Error]', error.message)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理后端响应格式和令牌刷新
service.interceptors.response.use(
  res => {
    const { code, message, data } = res.data

    if (code === 200) {
      return data
    }

    // 业务错误
    return Promise.reject(new Error(message || '请求失败'))
  },
  async error => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    // 401 令牌过期，尝试刷新
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        if (refreshToken) {
          // 调用刷新令牌接口
          const res = await authApi.refreshToken({ refreshToken })

          // 更新令牌
          localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken)
          localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken)

          // 更新用户信息
          localStorage.setItem(USER_INFO_KEY, JSON.stringify(res.userInfo))

          // 更新请求头
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${res.accessToken}`
          }
          return service(originalRequest)
        }
      } catch (refreshError) {
        // 刷新失败，清除认证信息
        console.error('[Token Refresh Failed]', refreshError)
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_INFO_KEY)
        window.location.href = '#/login'
        return Promise.reject(refreshError)
      }
    }

    // HTTP 错误状态处理
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      switch (status) {
        case 401:
          console.warn('[Authentication Error]', {
            url: error.config?.url,
            method: error.config?.method,
            requestData: error.config?.data,
            requestParams: error.config?.params,
            responseStatus: status,
            responseData: error.response.data
          })
          // 清除 token 并跳转到登录页
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          localStorage.removeItem(USER_INFO_KEY)
          window.location.href = '#/login'
          return Promise.reject(new Error(message || '登录已过期'))

        case 403:
          console.warn('[Permission Error]', {
            url: error.config?.url,
            method: error.config?.method,
            requestData: error.config?.data,
            requestParams: error.config?.params,
            responseStatus: status,
            responseData: error.response.data
          })
          return Promise.reject(new Error(message || '您没有执行此操作的权限'))

        case 404:
          return Promise.reject(new Error(message || '请求的资源不存在'))

        case 500:
          return Promise.reject(new Error(message || '服务器错误'))

        default:
          console.error('[HTTP Error]', {
            url: error.config?.url,
            method: error.config?.method,
            status,
            message,
            responseData: error.response.data
          })
          return Promise.reject(new Error(message || `请求失败 (${status})`))
      }
    }

    // 网络错误
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时，请检查网络连接'))
    }

    if (!window.navigator.onLine) {
      return Promise.reject(new Error('网络连接已断开，请检查网络设置'))
    }

    console.error('[Request Error]', error)
    return Promise.reject(error)
  }
)

function request<T = unknown>(options: RequestConfig): Promise<T> {
  options.method = options.method || 'get'

  // 修复GET请求参数处理：如果已有 params 则保留，否则使用 data
  if (options.method.toLowerCase() === 'get') {
    if (!options.params) {
      options.params = options.data
    }
  }

  return service(options)
}

export default request
