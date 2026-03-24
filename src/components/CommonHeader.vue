<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-07-26
 * CommonHeader.vue
-->
<template>
  <div class="header-wrapper">
    <div class="header">
      <!-- 左侧内容 -->
      <div class="l-cont">
        <el-button
          role="button"
          aria-label="toggleCollapse"
          size="large"
          type="primary"
          text
          @click="toggleCollapse"
        >
          <el-icon>
            <IconMenu />
          </el-icon>
        </el-button>
      </div>
      <div class="m-cont">
        <common-tab />
      </div>
      <!-- 右侧内容 -->
      <div class="r-cont">
        <el-dropdown>
          <span class="el-dropdown-link">
            <img :src="getImageUrl('user')" class="user" alt="用户头像" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/profile')"> 个人中心 </el-dropdown-item>
              <el-dropdown-item @click="handleLogout"> 退出 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAllDataStore } from '@/stores/index.js'
import { Menu as IconMenu } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import CommonTab from '@/components/CommonTab.vue'

const getImageUrl = (user: string) => {
  return new URL(`../assets/images/${user}.svg`, import.meta.url).href
}

const store = useAllDataStore()
const router = useRouter()

const toggleCollapse = () => {
  store.state.isCollapse = !store.state.isCollapse
}

const handleLogout = () => {
  store.clearToken()
  router.push('/login')
}
</script>

<style scoped>
.header-wrapper {
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  padding: 0;
  width: 100%;
}

.l-cont {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin: 10px;
  background-color: aliceblue;
  border-radius: 10%;
}

:deep(.m-cont) {
  flex: 1;
  padding-bottom: 0;
  margin-bottom: 0;
}

:deep(.tags-nav) {
  flex: 1;
  display: flex;
}

:deep(.tags-nav .el-tabs) {
  width: 100%;
  display: flex;
}

:deep(.tags-nav .el-tabs__header) {
  width: 100%;
}

:deep(.tags-nav .el-tabs__nav-wrap) {
  width: 100%;
}

:deep(.tags-nav .el-tabs__nav-scroll) {
  overflow-x: auto;
  overflow-y: hidden;
}

:deep(.tags-nav .el-tabs__nav) {
  display: flex;
  flex-wrap: nowrap;
}

.r-cont {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin: 10px;
  background-color: aliceblue;
  border: 1px;
  border-radius: 50%;
}

.user {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
