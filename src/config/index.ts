/**
 * 配置文件 - 后端 API 对接版本
 * 从环境变量读取配置
 */

const env = import.meta.env.MODE || 'production'

// 环境配置类型
interface EnvConfig {
  baseApi: string
  timeout: number
}

// 从环境变量读取配置，提供默认值
const config: EnvConfig = {
  // API 基础路径
  baseApi: import.meta.env.VITE_BASE_API || '/api',

  // 请求超时时间
  timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000
}

// 导出配置
export default {
  // 当前环境
  env: env,

  // 当前环境的配置
  ...config
} as typeof config & { env: string }
