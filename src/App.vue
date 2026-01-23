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

<style scoped>
/* css */
html,
body,
#app {
  height: 100%;
}
</style>
