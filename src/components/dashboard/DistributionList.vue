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
    <div ref="chartRef" class="echarts-container"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface DistributionItem {
  label: string
  value: number
  color: string
}

const props = withDefaults(defineProps<{
  title?: string
  data: DistributionItem[]
}>(), {
  title: '用户分布'
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance) return

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [{
      type: 'pie',
      roseType: 'area',
      data: props.data.map(item => ({
        name: item.label,
        value: item.value,
        itemStyle: { color: item.color }
      })),
      radius: ['30%', '70%']
    }]
  }

  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(() => props.data, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
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

  .echarts-container {
    width: 100%;
    height: 300px;
  }
}
</style>
