<!--
 * new page
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
      <template v-for="item in menuItems" :key="item.index">
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

// 定义菜单项类型
interface MenuItem {
  index: string
  title: string
  route: string
}
// 定义菜单数据，确保每个子菜单项都有 route 属性
const allMenuItems = [
  {
    index: '1',
    title: '导航',
    icon: markRaw(Location),
    children: [
      { index: '1-1', title: '对象管理', route: '/objectManagement' },
      { index: '1-2', title: '用户管理', route: '/userManagement' },
      { index: '1-3', title: '审核管理', route: '/auditManagement' }
    ]
  },
  {
    index: '2',
    title: '菜单',
    icon: markRaw(IconMenu),
    children: [
      { index: '2-1', title: '首页', route: '/dashboard' },
      { index: '2-2', title: '个人资料', route: '/profile' }
    ]
  },
  {
    index: '3',
    title: '文档',
    icon: markRaw(Document),
    children: [
      { index: '3-1', title: '快速开始', route: '/quickStart' },
      { index: '3-2', title: 'API 文档', route: '/apiDocs' }
    ]
  },
  {
    index: '4',
    title: '其他',
    icon: markRaw(MoreFilled),
    children: [
      { index: '4-1', title: '设置', route: '/settings' },
      { index: '4-2', title: '帮助', route: '/help' },
      { index: '4-3', title: '测试页面', route: '/test' }
    ]
  }
]
const store = useAllDataStore()
const menuItems = computed(() => {
  const menuList = store.state.menuList
  return allMenuItems
    .map(menu => ({
      ...menu,
      children: menu.children.filter(child => menuList.includes(child.index))
    }))
    .filter(menu => menu.children.length > 0)
})
const isCollapse = computed(() => store.state.isCollapse)
const width = computed(() => {
  return store.state.isCollapse ? '64px' : '180px'
})

const router = useRouter()
const route = useRoute()
const activeMenu = computed(() => {
  const path = route.path
  for (const menu of menuItems.value) {
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
