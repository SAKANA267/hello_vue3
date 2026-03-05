<template>
  <router-view />
</template>

<script lang="ts">
//js or ts
import { onMounted } from 'vue'
import { useAllDataStore } from '@/stores/index.js'
import Home from '@/views/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  },
  setup() {
    const store = useAllDataStore()

    // 应用初始化时恢复认证状态
    onMounted(() => {
      store.initAuth()
    })

    return {}
  }
}
</script>

<style>
/* 全局样式 - 移除滚动条 */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
