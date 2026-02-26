import { INTENT_PATTERNS, ENTITY_ALIASES, ENTITY_NAMES } from '@/constants/intents'
import { IntentType, EntityType } from '@/types/ai'
import type { ParsedIntent } from '@/types/ai'

/**
 * 本地意图匹配器
 * 用于快速识别常见意图，减少对 AI API 的调用
 *
 * @param input - 用户输入的自然语言文本
 * @returns 匹配到的意图结果
 */
export function matchLocalIntent(input: string): ParsedIntent {
  const normalizedInput = input.toLowerCase().trim()

  // 1. 尝试匹配模式模板
  for (const [intentKey, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      const matchResult = matchPattern(pattern, normalizedInput)
      if (matchResult) {
        const intent = intentKey as IntentType
        const entity = extractEntity(normalizedInput)
        const params = extractParams(normalizedInput, entity)

        return {
          intent,
          entity,
          params,
          confidence: calculateConfidence(intent, normalizedInput, matchResult)
        }
      }
    }
  }

  // 2. 关键词匹配（降级方案）
  return matchByKeywords(normalizedInput)
}

/**
 * 匹配单个模式
 */
function matchPattern(pattern: string, input: string): string[] | null {
  // 将模板转换为正则表达式
  // {entity} -> (.+?)
  // {status} -> (.+?)
  let regexPattern = pattern
    .replace('{entity}', '([\\u4e00-\\u9fa5a-zA-Z]+)')
    .replace('{status}', '([\\u4e00-\\u9fa5a-zA-Z]+)')

  const regex = new RegExp(regexPattern, 'i')
  const match = input.match(regex)
  return match ? match.slice(1) : null
}

/**
 * 从输入中提取实体类型
 */
function extractEntity(input: string): EntityType | undefined {
  for (const [entityKey, aliases] of Object.entries(ENTITY_ALIASES)) {
    for (const alias of aliases) {
      if (input.includes(alias.toLowerCase())) {
        return entityKey as EntityType
      }
    }
  }
  return undefined
}

/**
 * 从输入中提取参数
 */
function extractParams(input: string, entity?: EntityType): Record<string, any> {
  const params: Record<string, any> = {}

  // 提取状态
  if (/待审核|pending|未审核/.test(input)) {
    params.status = 'pending'
  } else if (/已审核|approved|通过/.test(input)) {
    params.status = 'approved'
  } else if (/已拒绝|rejected|不通过/.test(input)) {
    params.status = 'rejected'
  }

  // 提取名称（用于创建操作）
  const nameMatch = input.match(
    /(?:新增|添加|创建|新建).*?(?:叫|名为|名\s*[:：]?\s*)([\u4e00-\u9fa5a-zA-Z0-9]+)/i
  )
  if (nameMatch) {
    params.name = nameMatch[1]
  }

  // 提取 ID
  const idMatch = input.match(/(?:ID|id)\s*[:：]?\s*(\d+)/i)
  if (idMatch) {
    params.id = idMatch[1]
  }

  // 提取数量
  const countMatch = input.match(/(\d+)/)
  if (countMatch) {
    params.count = parseInt(countMatch[1], 10)
  }

  return params
}

/**
 * 计算匹配置信度
 */
function calculateConfidence(intent: IntentType, input: string, matchResult: string[]): number {
  let confidence = 0.7 // 基础置信度

  // 完全匹配加分
  if (matchResult && matchResult.length > 0) {
    confidence += 0.15
  }

  // 包含关键词加分
  const keywordBonus = getKeywordBonus(intent, input)
  confidence += keywordBonus

  // 检查输入完整性
  if (input.length >= 5) {
    confidence += 0.05
  }

  return Math.min(confidence, 1.0)
}

/**
 * 根据关键词计算额外置信度
 */
function getKeywordBonus(intent: IntentType, input: string): number {
  const keywordMap: Record<IntentType, string[]> = {
    [IntentType.NAVIGATE]: ['打开', '跳转', '去', '页面', '管理'],
    [IntentType.CREATE]: ['新增', '添加', '创建', '新建'],
    [IntentType.READ]: ['显示', '查看', '列出', '所有'],
    [IntentType.UPDATE]: ['修改', '更新', '编辑', '改为'],
    [IntentType.DELETE]: ['删除', '移除'],
    [IntentType.QUERY]: ['查询', '搜索', '找', '待'],
    [IntentType.COUNT]: ['多少', '数量', '统计'],
    [IntentType.HELP]: ['帮助', '能做什么', '怎么用'],
    [IntentType.UNKNOWN]: []
  }

  const keywords = keywordMap[intent] || []
  let bonus = 0

  for (const keyword of keywords) {
    if (input.includes(keyword)) {
      bonus += 0.03
    }
  }

  return Math.min(bonus, 0.15)
}

/**
 * 关键词匹配（降级方案）
 */
function matchByKeywords(input: string): ParsedIntent {
  // 按优先级检查
  const checks = [
    // 帮助
    {
      condition: /帮助|你能做什么|怎么用|help/i.test(input),
      result: { intent: IntentType.HELP, params: {}, confidence: 0.9 }
    },
    // 导航
    {
      condition: /打开|跳转|去.*页面/i.test(input),
      result: {
        intent: IntentType.NAVIGATE,
        entity: extractEntity(input),
        params: {},
        confidence: 0.7
      }
    },
    // 创建
    {
      condition: /新增|添加|创建|新建/i.test(input),
      result: {
        intent: IntentType.CREATE,
        entity: extractEntity(input),
        params: extractParams(input),
        confidence: 0.7
      }
    },
    // 统计
    {
      condition: /多少|数量|统计/i.test(input),
      result: {
        intent: IntentType.COUNT,
        entity: extractEntity(input),
        params: {},
        confidence: 0.7
      }
    },
    // 查询
    {
      condition: /显示|查看|查询|搜索|待审核/i.test(input),
      result: {
        intent: IntentType.QUERY,
        entity: extractEntity(input) || EntityType.REPORT_CARD,
        params: extractParams(input),
        confidence: 0.65
      }
    }
  ]

  for (const check of checks) {
    if (check.condition) {
      return check.result as ParsedIntent
    }
  }

  // 未匹配
  return {
    intent: IntentType.UNKNOWN,
    params: {},
    confidence: 0
  }
}

/**
 * 格式化响应消息
 */
export function formatResponseMessage(intent: ParsedIntent, result?: any): string {
  const { intent: intentType, entity, params } = intent
  const entityName = entity ? ENTITY_NAMES[entity] : ''

  const templates: Record<IntentType, string> = {
    [IntentType.NAVIGATE]: `正在为您跳转到 ${entityName} 页面...`,
    [IntentType.CREATE]: `已为您打开 ${entityName} 添加表单`,
    [IntentType.READ]: `为您列出 ${entityName} 数据`,
    [IntentType.UPDATE]: `正在更新 ${entityName}`,
    [IntentType.DELETE]: `正在删除 ${entityName}`,
    [IntentType.QUERY]: result?.count
      ? `为您找到 ${result.count} 条${params.status === 'pending' ? '待审核' : ''}${entityName}`
      : `为您查询符合条件的 ${entityName}`,
    [IntentType.COUNT]: `当前共有 ${result?.count || 0} 条 ${entityName}`,
    [IntentType.HELP]: '我可以帮您进行数据查询、新增、修改、删除以及页面导航等操作。',
    [IntentType.UNKNOWN]: '抱歉，我没有理解您的意思，请换一种说法。'
  }

  return templates[intentType] || templates[IntentType.UNKNOWN]
}

/**
 * 判断是否需要调用 AI API
 */
export function shouldUseAiApi(localIntent: ParsedIntent): boolean {
  // 低置信度需要调用 AI API
  if (localIntent.confidence < 0.75) {
    return true
  }

  // 未知意图需要调用 AI API
  if (localIntent.intent === IntentType.UNKNOWN) {
    return true
  }

  return false
}
