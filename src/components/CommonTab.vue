<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-14
 * CommonTab.vue
-->
<template>
  <div class="tags-nav">
    <el-tabs
      v-model="activeTab"
      type="card"
      closable
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="tag in tags"
        :key="tag.path"
        :label="tag.label"
        :name="tag.path"
        :closable="tag.path !== '/home'"
      />
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores/index.js'

interface TabItem {
  name: string
  path: string
  label: string
  icon: string
}

const store = useAllDataStore()
const router = useRouter()
const route = useRoute()
const tags = computed(() => store.state.tags)

const activeTab = ref(route.path)

watch(
  () => route.path,
  newPath => {
    activeTab.value = newPath
  }
)

const handleTabClick = (tab: { paneName: string }) => {
  router.push(tab.paneName)
}

const handleTabRemove = (targetName: string) => {
  const index = tags.value.findIndex((tag: TabItem) => tag.path === targetName)
  if (index > -1) {
    store.state.tags.splice(index, 1)
    if (route.path === targetName) {
      const lastTag = store.state.tags[store.state.tags.length - 1]
      if (lastTag) {
        router.push(lastTag.path)
      }
    }
  }
}
</script>

<style scoped>
.tags-nav {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 0 12px;
}

.tags-nav :deep(.el-tabs) {
  width: 100%;
}

.tags-nav :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: none;
}

.tags-nav :deep(.el-tabs__item) {
  background: #fff;
}

.tags-nav :deep(.el-tabs__nav) {
  display: flex;
  flex-wrap: nowrap;
}

@media (max-width: 768px) {
  .tags-nav {
    padding: 0 8px;
  }
}
</style>
