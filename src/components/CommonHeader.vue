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
      <common-tab />
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
  height: calc(100% - 42px);
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

:deep(.tags) {
  flex: 1;
  display: flex;
}

:deep(.tags .el-tag) {
  flex-shrink: 0;
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
