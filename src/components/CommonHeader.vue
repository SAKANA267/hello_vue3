<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-07-26
 * CommonHeader.vue
-->
<template>
    <div class="header">
        <!-- 左侧内容 -->
        <div class="l-cont">
            <el-button @click="toggleCollapse" role="button" aria-label="toggleCollapse" size="large" type="primary" text>
                <el-icon>
                    <IconMenu />
                </el-icon>
            </el-button>

            <!-- breadCrumb -->
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>导航</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 右侧内容 -->
        <div class="r-cont">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img :src="getImageUrl('user')" class="user" alt="用户头像"/>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="$router.push('/profile')">个人中心</el-dropdown-item>
                        <el-dropdown-item>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useAllDataStore} from '@/stores/index.js';
import {
    ArrowRight,
    Menu as IconMenu
} from '@element-plus/icons-vue'

const getImageUrl = (user: string) => {
    return new URL(`../assets/images/${user}.png`,import.meta.url).href;
}

const store = useAllDataStore();
const toggleCollapse = () => {
    store.state.isCollapse = !store.state.isCollapse;
}
</script>

<style scoped>

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px;
    height: 100%;
    width: 100%;
}

.l-cont, .r-cont {
    display: flex;
    align-items: center;
}

.user{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.el-breadcrumb {
    margin-left: 10px;
    font-size: 14px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

:deep(.el-breadcrumb i){
    color: #fff !important;
}
:deep(.el-breadcrumb span) {
    color: #fff !important;
    cursor: pointer !important;
    transition: color 0.2s;
}
:deep(.el-breadcrumb span:hover) {
    color: #000000 !important;
}
</style>
