import { computed, type Component } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAllDataStore } from '@/stores/index.js'
import { MENU_GROUPS } from '@/constants/menuGroups'
import { MENU_ROLES } from '@/constants/menu'

export interface SidebarChild {
  index: string
  title: string
  route: string
  menuIndex: string
}

export interface SidebarGroup {
  index: string
  title: string
  icon: Component
  children: SidebarChild[]
}

export function useMenuFromRoutes() {
  const router = useRouter()
  const store = useAllDataStore()
  const route = useRoute()

  const visibleMenuItems = computed<SidebarGroup[]>(() => {
    const userRole = store.state.user?.role
    if (!userRole) return []

    const homeRoute = router.options.routes.find((r) => r.path === '/home')
    if (!homeRoute?.children) return []

    const grouped = new Map<number, (SidebarChild & { _sortOrder: number })[]>()

    for (const childRoute of homeRoute.children) {
      const meta = childRoute.meta
      if (!meta?.menuIndex || meta.hidden) continue

      const menuIndex = meta.menuIndex as string
      const parts = menuIndex.split('-')
      const groupNumber = parseInt(parts[0], 10)
      const sortOrder = parseInt(parts[1], 10)

      const allowedRoles = meta.roles || MENU_ROLES[menuIndex] || []
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) continue

      if (!grouped.has(groupNumber)) {
        grouped.set(groupNumber, [])
      }

      grouped.get(groupNumber)!.push({
        index: menuIndex,
        title: (meta.title as string) || childRoute.name?.toString() || menuIndex,
        route: `/home/${childRoute.path}`,
        menuIndex,
        _sortOrder: sortOrder
      })
    }

    const result: SidebarGroup[] = []
    for (const groupConfig of MENU_GROUPS) {
      const children = grouped.get(groupConfig.groupNumber)
      if (!children || children.length === 0) continue

      children.sort((a, b) => a._sortOrder - b._sortOrder)

      result.push({
        index: String(groupConfig.groupNumber),
        title: groupConfig.title,
        icon: groupConfig.icon,
        children: children.map(({ _sortOrder, ...rest }) => rest)
      })
    }

    return result
  })

  const activeMenu = computed(() => {
    for (const group of visibleMenuItems.value) {
      const child = group.children.find((c) => c.route === route.path)
      if (child) return child.index
    }
    return ''
  })

  return { visibleMenuItems, activeMenu }
}
