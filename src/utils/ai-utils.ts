/**
 * AI 模块参数提取工具
 */

/**
 * 可用于 keyword 搜索的字段
 */
const SEARCHABLE_FIELDS = [
  'name',
  'id',
  'address',
  'username',
  'phone',
  'email',
  'diseaseName',
  'department'
]

/**
 * 从 payload 中提取查询参数
 * 将可搜索的字段合并到 keyword 中
 *
 * @param payload 后端返回的 payload
 * @returns 提取后的查询参数
 *
 * @example
 * extractQueryParams({ entity: 'user', intent: 'query', name: '张三', page: 1 })
 * // => { keyword: '张三', page: 1 }
 */
export function extractQueryParams(payload: Record<string, any>): Record<string, any> {
  const params: Record<string, any> = {}

  // 提取可搜索字段的值作为 keyword
  for (const field of SEARCHABLE_FIELDS) {
    if (payload[field] !== undefined && payload[field] !== null) {
      params.keyword = payload[field]
      break // 只取第一个匹配的字段
    }
  }

  // 复制其他查询参数（分页、筛选等）
  const QUERY_KEYS = ['page', 'size', 'limit', 'status', 'sort', 'order']
  for (const key of QUERY_KEYS) {
    if (payload[key] !== undefined && payload[key] !== null) {
      params[key] = payload[key]
    }
  }

  return params
}
