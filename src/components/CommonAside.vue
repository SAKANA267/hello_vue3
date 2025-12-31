<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-07-22
 * CommonAside.vue
-->
<template>
    <el-aside :width="width">
        <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
            @close="handleClose">
            <h3 class="mb-2" v-show="!isCollapse" role="heading" aria-level="3">公共卫生平台</h3>
            <h3 class="mb-2" v-show="isCollapse" role="heading" aria-level="3">后台</h3>

            <!-- 使用 v-for 遍历菜单数据 -->
            <template v-for="item in menuItems" :key="item.index">
                <!-- 如果有子菜单，渲染 el-sub-menu -->
                <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.index" role="menuitem"
                    aria-haspopup="true">
                    <template #title>
                        <el-icon v-if="item.icon">
                            <component :is="item.icon" />
                        </el-icon>
                        <span>{{ item.title }}</span>
                    </template>
                    <!-- 渲染子菜单 -->
                    <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index"
                        @click="$router.push(child.route)">
                        {{ child.title }}
                    </el-menu-item>
                </el-sub-menu>
            </template>
        </el-menu>
    </el-aside>
</template>

<script setup lang="ts">
import { computed, ref, markRaw} from 'vue'
import { useAllDataStore } from '@/stores/index.js';
import {
    Document,
    Menu as IconMenu,
    Location,
    MoreFilled,
} from '@element-plus/icons-vue'

// 定义菜单数据，确保每个子菜单项都有 route 属性
const menuItems = ref([
    {
        index: '1',
        title: '导航',
        icon: markRaw(Location),
        children: [
            { index: '1-1', title: '对象管理', route: '/objectManagement' },
            { index: '1-2', title: '用户管理', route: '/objectManagement' }, 
        ],
    },
    {
        index: '2',
        title: '菜单',
        icon: markRaw(IconMenu),
        children: [
            { index: '2-1', title: '仪表盘', route: '/dashboard' },
            { index: '2-2', title: '个人资料', route: '/profile' },
        ],
    },
    {
        index: '3',
        title: '文档',
        icon: markRaw(Document),
        children: [
            { index: '3-1', title: '快速开始', route: '/quickStart' },
            { index: '3-2', title: 'API 文档', route: '/apiDocs' },
        ],
    },
    {
        index: '4',
        title: '其他',
        icon: markRaw(MoreFilled),
        children: [
            { index: '4-1', title: '设置', route: '/settings' },
            { index: '4-2', title: '帮助', route: '/help' },
        ],
    },
]);

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