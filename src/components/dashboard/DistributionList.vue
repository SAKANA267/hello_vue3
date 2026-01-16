<!--
 * DistributionList component
 * @author: SAKANA267
 * @since: 2026-01-16
 * DistributionList.vue
-->
<template>
  <el-card shadow="hover" class="distribution-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <div class="distribution-list">
      <div v-for="(item, index) in data" :key="index" class="distribution-item">
        <div class="distribution-info">
          <span class="distribution-label">{{ item.label }}</span>
          <span class="distribution-value">{{ item.value }}%</span>
        </div>
        <el-progress :percentage="item.value" :color="item.color" :show-text="false" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
interface DistributionItem {
  label: string
  value: number
  color: string
}

withDefaults(defineProps<{
  title?: string
  data: DistributionItem[]
}>(), {
  title: '用户分布'
})
</script>

<style scoped lang="less">
.distribution-card {
  margin-bottom: 15px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
}

.distribution-list {
  .distribution-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .distribution-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .distribution-label {
        color: #606266;
      }

      .distribution-value {
        color: #303133;
        font-weight: 500;
      }
    }
  }
}
</style>
