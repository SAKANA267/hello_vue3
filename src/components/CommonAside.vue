<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-07-22
 * CommonAside.vue
-->
<template>
    <el-aside :width="width">
        <el-menu 
        default-active="2" 
        class="el-menu-vertical-demo" 
        :collapse="isCollapse" 
        @open="handleOpen"
        @close="handleClose">
            <h3 class="mb-2" v-show="!isCollapse">公共卫生平台</h3>
            <h3 class="mb-2" v-show="isCollapse">后台</h3>
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <location />
                    </el-icon>
                    <span>导航</span>
                </template>
                <el-menu-item index="1-1">
                    <template #title>对象管理</template>
                </el-menu-item>
                <el-menu-item index="1-2">
                    <template #title>用户管理</template>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="2">
                <el-icon><icon-menu /></el-icon>
                <span>菜单</span>
            </el-menu-item>
            <el-sub-menu index="3">
                <template #title>
                    <el-icon>
                        <document />
                    </el-icon>
                    <span>文档</span>
                </template>
                <el-menu-item index="3-1">
                    <template #title>快速开始</template>
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="4">
                <template #title>
                    <el-icon>
                        <MoreFilled />
                    </el-icon>
                    <span>其他</span>
                </template>
                <el-menu-item index="4-1">
                    <template #title>设置</template>
                </el-menu-item>
                <el-menu-item index="4-2">
                    <template #title>帮助</template>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAllDataStore } from '@/stores/index.js';
import {
    Document,
    Menu as IconMenu,
    Location,
    MoreFilled,
} from '@element-plus/icons-vue'

const store = useAllDataStore();
const isCollapse = computed(() => store.state.isCollapse);
const width = computed(() => {
    return store.state.isCollapse ? '64px' : '180px';
});

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style scoped>
.el-aside, .el-menu-vertical-demo, .el-sub-menu, .el-menu-item {
    transition: all 0.3s ease;
}
.mb-2 {
    text-align: center;
}
</style>