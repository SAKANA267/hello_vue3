<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-14
 * CommonTab.vue
-->
<template>
  <div class="tags">
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.path !== '/home'"
      :effect="route.path == tag.path ? 'dark' : 'light'"
      @click="handleTag(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores/index.js'

const store = useAllDataStore()
const router = useRouter()
const route = useRoute()
const tags = computed(() => store.state.tags)

// 点击标签跳转
const handleTag = (tag: any) => {
  router.push(tag.path)
}

// 关闭标签
const handleClose = (tag: any, index: any) => {
  store.state.tags.splice(index, 1)
  // 如果关闭的是当前标签，跳转到最后一个标签
  if (route.path === tag.path) {
    const lastTag = store.state.tags[store.state.tags.length - 1]
    router.push(lastTag.path)
  }
}
</script>

<style scoped>
.tags {
  margin: 10px 0 10px 20px;
}
.el-tag {
  margin-right: 8px;
}
</style>
