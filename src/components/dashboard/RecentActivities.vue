<!--
 * RecentActivities component
 * @author: SAKANA267
 * @since: 2026-01-16
 * RecentActivities.vue
-->
<template>
  <el-card shadow="hover" class="activity-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <el-button type="primary" link @click="handleViewAll"> 查看全部 </el-button>
      </div>
    </template>
    <el-table :data="data" style="width: 100%" :max-height="maxHeight">
      <el-table-column prop="user" label="用户" width="120" />
      <el-table-column prop="action" label="操作" width="150" />
      <el-table-column prop="target" label="目标" />
      <el-table-column prop="time" label="时间" width="160" />
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'success' ? 'success' : 'warning'" size="small">
            {{ scope.row.status === 'success' ? '成功' : '处理中' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
interface ActivityItem {
  user: string
  action: string
  target: string
  time: string
  status: 'success' | 'pending'
}

withDefaults(
  defineProps<{
    title?: string
    data: ActivityItem[]
    maxHeight?: number
  }>(),
  {
    title: '最近活动',
    maxHeight: 280
  }
)

const emit = defineEmits<{
  (e: 'view-all'): void
}>()

const handleViewAll = () => {
  emit('view-all')
}
</script>

<style scoped lang="less">
.activity-card {
  margin-bottom: 15px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
}
</style>
