<!--
 * 侧边栏导航组件 - 基于路由 meta 自动生成菜单
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores/index.js'
import { useMenuFromRoutes } from '@/composables/useMenuFromRoutes'
import type { SidebarChild } from '@/composables/useMenuFromRoutes'

const store = useAllDataStore()
const router = useRouter()
const { visibleMenuItems, activeMenu } = useMenuFromRoutes()

const isCollapse = computed(() => store.state.isCollapse)
const width = computed(() => (store.state.isCollapse ? '64px' : '180px'))

const handleMenu = (item: SidebarChild) => {
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
