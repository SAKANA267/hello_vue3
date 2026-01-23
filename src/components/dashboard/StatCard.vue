<!--
 * StatCard component
 * @author: SAKANA267
 * @since: 2026-01-16
 * StatCard.vue
-->
<template>
  <el-card shadow="hover" class="stat-card" :style="{ borderTop: `3px solid ${color}` }">
    <div class="stat-card-content">
      <div class="stat-info">
        <div class="stat-value">
          {{ value }}
        </div>
        <div class="stat-label">
          {{ label }}
        </div>
      </div>
      <div class="stat-icon" :style="{ backgroundColor: color }">
        <el-icon :size="28">
          <component :is="icon" />
        </el-icon>
      </div>
    </div>
    <div class="stat-footer">
      <span :class="trend > 0 ? 'trend-up' : 'trend-down'">
        <el-icon v-if="trend > 0"><Top /></el-icon>
        <el-icon v-else><Bottom /></el-icon>
        {{ Math.abs(trend) }}%
      </span>
      <span class="trend-text">较上月</span>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Top, Bottom } from '@element-plus/icons-vue'

defineProps<{
  label: string
  value: string
  icon: object
  color: string
  trend: number
}>()
</script>

<style scoped lang="less">
.stat-card {
  margin-bottom: 15px;

  .stat-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-info {
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #303133;
    }

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-top: 8px;
    }
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .stat-footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    font-size: 13px;

    .trend-up {
      color: #67c23a;
    }

    .trend-down {
      color: #f56c6c;
    }

    .trend-text {
      color: #909399;
      margin-left: 8px;
    }
  }
}

@media screen and (max-width: 768px) {
  .stat-card {
    .stat-value {
      font-size: 22px;
    }

    .stat-icon {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
