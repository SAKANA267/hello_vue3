import { IntentType, EntityType } from '@/types/ai'
import type { QuickAction } from '@/types/ai'

/** 意图模板配置 */
export const INTENT_PATTERNS = {
  [IntentType.NAVIGATE]: [
    '打开{entity}页面',
    '跳转到{entity}',
    '去{entity}',
    '{entity}管理'
  ],
  [IntentType.CREATE]: [
    '新增{entity}',
    '添加{entity}',
    '创建{entity}',
    '新建{entity}'
  ],
  [IntentType.READ]: [
    '显示{entity}',
    '查看{entity}',
    '{entity}列表',
    '列出所有{entity}'
  ],
  [IntentType.UPDATE]: [
    '修改{entity}',
    '更新{entity}',
    '编辑{entity}',
    '把状态改为'
  ],
  [IntentType.DELETE]: [
    '删除{entity}',
    '移除{entity}'
  ],
  [IntentType.QUERY]: [
    '查询{entity}',
    '搜索{entity}',
    '找{entity}',
    '显示待审核',
    '显示{status}的{entity}'
  ],
  [IntentType.COUNT]: [
    '有多少{entity}',
    '{entity}数量',
    '统计{entity}'
  ],
  [IntentType.HELP]: [
    '帮助',
    '你能做什么',
    '怎么用'
  ]
}

/** 实体别名映射 */
export const ENTITY_ALIASES: Record<EntityType, string[]> = {
  [EntityType.REPORT_CARD]: ['报告卡', '报卡', '报告', 'card'],
  [EntityType.USER]: ['用户', 'user', '账号'],
  [EntityType.OBJECT]: ['对象', 'object'],
  [EntityType.AUDIT]: ['审核', 'audit', '待审核']
}

/** 实体名称映射（用于显示） */
export const ENTITY_NAMES: Record<EntityType, string> = {
  [EntityType.REPORT_CARD]: '报告卡',
  [EntityType.USER]: '用户',
  [EntityType.OBJECT]: '对象',
  [EntityType.AUDIT]: '审核'
}

/** 响应模板 */
export const RESPONSE_TEMPLATES: Record<IntentType, string> = {
  [IntentType.NAVIGATE]: '正在为您跳转到 {entityName} 页面...',
  [IntentType.CREATE]: '已为您打开 {entityName} 添加表单',
  [IntentType.READ]: '为您列出 {entityName} 数据',
  [IntentType.UPDATE]: '正在更新 {entityName}',
  [IntentType.DELETE]: '正在删除 {entityName}',
  [IntentType.QUERY]: '为您查询符合条件的 {entityName}',
  [IntentType.COUNT]: '当前共有 {count} 条 {entityName}',
  [IntentType.HELP]: '我可以帮您进行数据查询、新增、修改、删除以及页面导航等操作。',
  [IntentType.UNKNOWN]: '抱歉，我没有理解您的意思，请换一种说法。'
}

/** 快捷操作配置 */
export const QUICK_ACTIONS: QuickAction[] = [
  { label: '查询数据', icon: 'Search', prompt: '显示待审核的报告卡' },
  { label: '新增记录', icon: 'Plus', prompt: '新增用户' },
  { label: '修改状态', icon: 'Edit', prompt: '把状态改为已审核' },
  { label: '页面导航', icon: 'Location', prompt: '打开用户管理页面' }
]

/** 示例问题列表 */
export const EXAMPLE_PROMPTS = [
  '显示待审核的报告卡',
  '新增用户张三',
  '打开用户管理页面',
  '有多少个用户'
]
