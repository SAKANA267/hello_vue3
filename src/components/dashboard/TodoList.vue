<!--
 * TodoList component
 * @author: SAKANA267
 * @since: 2026-01-16
 * TodoList.vue
-->
<template>
  <el-card shadow="hover" class="todo-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">添加</el-button>
      </div>
    </template>
    <div class="todo-list">
      <div v-for="(todo, index) in data" :key="index" class="todo-item">
        <el-checkbox v-model="todo.done" @change="handleToggle(index, todo)">
          <span :class="{ 'todo-done': todo.done }">{{ todo.text }}</span>
        </el-checkbox>
        <div class="todo-meta">
          <el-tag
            size="small"
            :type="getPriorityType(todo.priority)"
          >
            {{ getPriorityLabel(todo.priority) }}
          </el-tag>
          <span class="todo-date">{{ todo.dueDate }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

interface TodoItem {
  text: string
  done: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate: string
}

withDefaults(defineProps<{
  title?: string
  data: TodoItem[]
}>(), {
  title: '待办事项'
})

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'toggle', index: number, item: TodoItem): void
}>()

const getPriorityType = (priority: string) => {
  const types: Record<string, 'danger' | 'warning' | 'info'> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return types[priority] || 'info'
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return labels[priority] || '低'
}

const handleAdd = () => {
  emit('add')
}

const handleToggle = (index: number, item: TodoItem) => {
  emit('toggle', index, item)
}
</script>

<style scoped lang="less">
.todo-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
}

.todo-list {
  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .todo-done {
      text-decoration: line-through;
      color: #909399;
    }

    .todo-meta {
      display: flex;
      align-items: center;
      gap: 12px;

      .todo-date {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}
</style>
