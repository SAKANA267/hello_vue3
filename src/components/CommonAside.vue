<!--
 * 侧边栏导航组件 - 基于角色控制菜单显示
 * @author: SAKANA267
 * @since: 2025-07-22
 * CommonAside.vue
-->
<template>
  <el-aside :width="width">
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse">
      <h3 v-show="!isCollapse" class="mb-2" role="heading" aria-level="3">公共卫生平台</h3>
      <h3 v-show="isCollapse" class="mb-2" role="heading" aria-level="3">后台</h3>

      <!-- 使用 v-for 遍历菜单数据 -->
      <template v-for="item in visibleMenuItems" :key="item.index">
        <!-- 如果有子菜单，渲染 el-sub-menu -->
        <el-sub-menu
          v-if="item.children && item.children.length > 0"
          :index="item.index"
          role="menuitem"
          aria-haspopup="true"
        >
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <!-- 渲染子菜单 -->
          <el-menu-item
            v-for="child in item.children"
            :key="child.index"
            :index="child.index"
            @click="handleMenu(child)"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useAllDataStore } from '@/stores/index.js'
import { Document, Menu as IconMenu, Location, MoreFilled } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { MENU_ROLES } from '@/constants/menu'

// 定义菜单项类型
interface MenuItem {
  index: string
  title: string
  route: string
  menuIndex: string
}

// 定义菜单数据（不再需要 roles 字段，通过 menuIndex 关联）
const allMenuItems = [
  {
    index: '1',
    title: '导航',
    icon: markRaw(Location),
    children: [
      { index: '1-1', title: '对象管理', route: '/objectManagement', menuIndex: '1-1' },
      { index: '1-2', title: '用户管理', route: '/userManagement', menuIndex: '1-2' },
      { index: '1-3', title: '审核管理', route: '/auditManagement', menuIndex: '1-3' }
    ]
  },
  {
    index: '2',
    title: '菜单',
    icon: markRaw(IconMenu),
    children: [
      { index: '2-1', title: '首页', route: '/dashboard', menuIndex: '2-1' },
      { index: '2-2', title: '个人资料', route: '/profile', menuIndex: '2-2' },
      { index: '2-3', title: '登录历史', route: '/loginHistory', menuIndex: '2-3' }
    ]
  },
  {
    index: '3',
    title: '文档',
    icon: markRaw(Document),
    children: [
      { index: '3-1', title: '快速开始', route: '/quickStart', menuIndex: '3-1' },
      { index: '3-2', title: 'API 文档', route: '/apiDocs', menuIndex: '3-2' }
    ]
  },
  {
    index: '4',
    title: '其他',
    icon: markRaw(MoreFilled),
    children: [
      { index: '4-1', title: '设置', route: '/settings', menuIndex: '4-1' },
      { index: '4-2', title: '帮助', route: '/help', menuIndex: '4-2' },
      { index: '4-3', title: '测试页面', route: '/test', menuIndex: '4-3' }
    ]
  }
]

const store = useAllDataStore()

// 基于用户角色过滤可见菜单
const visibleMenuItems = computed(() => {
  const userRole = store.state.user?.role
  if (!userRole) return []

  return allMenuItems
    .map(menu => ({
      ...menu,
      // 过滤出用户有权访问的子菜单
      children: menu.children.filter(child => {
        const allowedRoles = MENU_ROLES[child.menuIndex]
        // 如果没有配置角色，默认所有人可访问
        if (!allowedRoles || allowedRoles.length === 0) return true
        // 检查用户角色是否在允许列表中
        return allowedRoles.includes(userRole)
      })
    }))
    .filter(menu => menu.children.length > 0) // 移除没有子菜单的父菜单
})

const isCollapse = computed(() => store.state.isCollapse)
const width = computed(() => {
  return store.state.isCollapse ? '64px' : '180px'
})

const router = useRouter()
const route = useRoute()
const activeMenu = computed(() => {
  const path = route.path
  for (const menu of visibleMenuItems.value) {
    const child = menu.children.find(c => c.route === path)
    if (child) return child.index
  }
  return ''
})

const handleMenu = (item: MenuItem) => {
  router.push(item.route)
  store.selectMenu(item)
}
</script>

<style scoped>
.el-aside,
.el-menu-vertical-demo,
.el-sub-menu,
.el-menu-item {
  transition: all 0.3s ease;
}
.mb-2 {
  text-align: center;
}
</style>
