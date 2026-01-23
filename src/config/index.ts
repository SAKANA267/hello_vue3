/**
 * 配置文件
 * 从环境变量读取配置，向后兼容原有导出结构
 */

const env = import.meta.env.MODE || 'production'

// 环境配置类型
interface EnvConfig {
  baseApi: string
  mockApi: string
  mock: boolean
  timeout: number
}

// 从环境变量读取配置，提供默认值
const config: EnvConfig = {
  // API 基础路径
  baseApi: import.meta.env.VITE_BASE_API || '/api',

  // Mock API 基础路径
  mockApi: import.meta.env.VITE_MOCK_API || '/api',

  // Mock 开关
  mock: import.meta.env.VITE_MOCK === 'true' || false,

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
