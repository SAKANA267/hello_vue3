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
      <div ref="chartRef" class="echarts-container"></div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

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
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

watch(() => props.period, (newVal) => {
  currentPeriod.value = newVal
})

// Get color from data or use default
const chartColor = computed(() => {
  return props.data[0]?.color || '#409EFF'
})

// Initialize chart
const initChart = () => {
  if (!chartRef.value) return

  // Dispose existing chart if any
  if (chartInstance) {
    chartInstance.dispose()
  }

  // Create new chart instance
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// Update chart with data
const updateChart = () => {
  if (!chartInstance) return

  const color = chartColor.value

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}: ${param.value} ${props.unit}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.label),
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'line',
      data: props.data.map(item => item.value),
      smooth: true,
      showSymbol: true,
      symbolSize: 8,
      areaStyle: {
        opacity: 0.3,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: `${color}80` },
          { offset: 1, color: `${color}1A` }
        ])
      },
      itemStyle: {
        color: color,
        borderColor: '#fff',
        borderWidth: 2
      },
      lineStyle: {
        width: 3,
        color: color
      }
    }]
  }

  chartInstance.setOption(option)
}

// Handle window resize
const handleResize = () => {
  chartInstance?.resize()
}

const handlePeriodChange = (value: string) => {
  emit('period-change', value)
}

// Watch data changes
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

    .echarts-container {
      width: 100%;
      height: 250px;
    }
  }
}
</style>
