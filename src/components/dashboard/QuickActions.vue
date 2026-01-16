<!--
 * QuickActions component
 * @author: SAKANA267
 * @since: 2026-01-16
 * QuickActions.vue
-->
<template>
  <el-card shadow="hover" class="quick-actions-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <div class="quick-actions">
      <el-button
        v-for="(action, index) in actions"
        :key="index"
        :type="action.type"
        :icon="action.icon"
        @click="handleAction(action.key)"
      >
        {{ action.label }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
interface ActionItem {
  key: string
  label: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: object
}

withDefaults(defineProps<{
  title?: string
  actions: ActionItem[]
}>(), {
  title: '快捷操作'
})

const emit = defineEmits<{
  (e: 'action', key: string): void
}>()

const handleAction = (key: string) => {
  emit('action', key)
}
</script>

<style scoped lang="less">
.quick-actions-card {
  margin-bottom: 15px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    :deep(.el-button) {
      width: 100%;
      justify-content: flex-start;
      padding-left: 20px;
    }
  }
}

@media screen and (max-width: 768px) {
  .quick-actions-card {
    .quick-actions {
      grid-template-columns: 1fr;
    }
  }
}
</style>
