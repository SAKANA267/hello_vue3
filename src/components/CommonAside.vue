<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-07-22
 * CommonAside.vue
-->
<template>
    <el-row class="tac">
        <el-col :span="24">
            <h5 class="mb-2">项目的一个名称</h5>
            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
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
                </el-sub-menu>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import {
    Document,
    Menu as IconMenu,
    Location,
    MoreFilled,
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style scoped>

</style>