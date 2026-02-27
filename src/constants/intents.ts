import type { QuickAction } from '@/types/ai'

/**
 * AI 助手常量配置
 * 只保留 UI 相关的配置，业务逻辑由后端处理
 */

/** 快捷操作配置（用于空状态页面） */
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
