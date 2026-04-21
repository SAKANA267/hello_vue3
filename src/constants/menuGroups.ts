import { markRaw, type Component } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  MoreFilled
} from '@element-plus/icons-vue'

export interface MenuGroupConfig {
  groupNumber: number
  title: string
  icon: Component
}

export const MENU_GROUPS: MenuGroupConfig[] = [
  { groupNumber: 1, title: '数据管理', icon: markRaw(Document) },
  { groupNumber: 2, title: '系统管理', icon: markRaw(IconMenu) },
  { groupNumber: 3, title: '审核中心', icon: markRaw(Location) },
  { groupNumber: 4, title: '个人与帮助', icon: markRaw(MoreFilled) }
]
