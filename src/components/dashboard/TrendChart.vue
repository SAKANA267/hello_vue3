<!--
 * TrendChart component
 * @author: SAKANA267
 * @since: 2026-01-16
 * TrendChart.vue
-->
<template>
  <el-card shadow="hover" class="trend-chart-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <el-radio-group v-model="currentPeriod" size="small" @change="handlePeriodChange">
          <el-radio-button v-for="option in periodOptions" :key="option.value" :label="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </template>
    <div class="chart-content">
      <el-progress
        v-for="(item, index) in data"
        :key="index"
        :text-inside="true"
        :stroke-width="24"
        :percentage="item.percentage"
        :color="item.color"
        class="progress-item"
      >
        <span>{{ item.label }}: {{ item.value }} {{ unit }}</span>
      </el-progress>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ChartDataItem {
  label: string
  value: number
  percentage: number
  color: string
}

interface PeriodOption {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  title?: string
  data: ChartDataItem[]
  unit?: string
  period?: string
  periodOptions?: PeriodOption[]
}>(), {
  title: '访问趋势',
  unit: '访问',
  period: 'week',
  periodOptions: () => [
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
    { label: '本年', value: 'year' }
  ]
})

const emit = defineEmits<{
  (e: 'period-change', value: string): void
}>()

const currentPeriod = ref(props.period)

watch(() => props.period, (newVal) => {
  currentPeriod.value = newVal
})

const handlePeriodChange = (value: string) => {
  emit('period-change', value)
}
</script>

<style scoped lang="less">
.trend-chart-card {
  margin-bottom: 15px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .chart-content {
    min-height: 250px;
    padding: 20px 0;

    .progress-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
