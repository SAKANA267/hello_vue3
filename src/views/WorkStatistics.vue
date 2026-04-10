<!--
 * Work Statistics Page
 * 工作统计页面
 * @author: SAKANA267
 * @since: 2026-04-07
-->
<template>
  <div class="work-statistics-container">
    <!-- 顶部操作栏 -->
    <div class="header-actions">
      <div class="title-section">
        <h2>工作统计</h2>
        <p class="subtitle">审核组工作量统计与分析</p>
      </div>
      <div class="action-buttons">
        <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
        <el-select v-model="selectedPeriod" @change="handlePeriodChange" style="width: 120px">
          <el-option label="今日" value="today" />
          <el-option label="本周" value="week" />
          <el-option label="本月" value="month" />
        </el-select>
      </div>
    </div>

    <!-- 统计概览卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="12" :sm="6" v-for="(card, index) in overviewCards" :key="index">
        <StatCard
          :label="card.label"
          :value="card.value"
          :icon="card.icon"
          :color="card.color"
          :trend="card.trend ?? 0"
        />
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-section">
      <!-- 工作量对比图 -->
      <el-col :xs="24" :md="16">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>审核组工作量对比</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="bar">柱状图</el-radio-button>
                <el-radio-button label="line">折线图</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="workloadChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 任务排行 -->
      <el-col :xs="24" :md="8">
        <el-card class="ranking-card" shadow="never">
          <template #header>
            <span>实时任务数排行</span>
          </template>
          <div class="ranking-list">
            <div
              v-for="(item, index) in workloadRanking"
              :key="item.id"
              class="ranking-item"
              :class="{ 'top-three': index < 3 }"
            >
              <div class="ranking-number" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
              <div class="ranking-content">
                <div class="group-name">{{ item.auditGroupName }}</div>
                <div class="group-stats">
                  <span class="stat-item">
                    <el-icon><Clock /></el-icon>
                    待处理: {{ item.pendingCount }}
                  </span>
                  <span class="stat-item">
                    <el-icon><Loading /></el-icon>
                    处理中: {{ item.inProgressCount }}
                  </span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width: `${(item.currentTaskCount / maxTaskCount) * 100}%`,
                      background: getProgressColor(index)
                    }"
                  ></div>
                </div>
              </div>
              <div class="ranking-value">
                <div class="task-count">{{ item.currentTaskCount }}</div>
                <div class="task-label">任务</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细统计表格 -->
    <el-card class="detail-table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>详细统计数据</span>
          <el-button type="primary" :icon="Download" @click="exportData" size="small">
            导出报表
          </el-button>
        </div>
      </template>
      <el-table :data="statsData" stripe style="width: 100%">
        <el-table-column prop="auditGroupName" label="审核组" width="140" />
        <el-table-column prop="auditGroupCode" label="组编码" width="110" />
        <el-table-column prop="totalAssigned" label="累计分配" width="100" align="center">
          <template #default="scope">
            <el-tag type="info" size="small">{{ scope.row.totalAssigned }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalCompleted" label="累计完成" width="100" align="center">
          <template #default="scope">
            <el-tag type="success" size="small">{{ scope.row.totalCompleted }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalCancelled" label="累计取消" width="100" align="center">
          <template #default="scope">
            <el-tag type="danger" size="small">{{ scope.row.totalCancelled }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pendingCount" label="待处理" width="90" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.pendingCount > 0 ? 'warning' : 'info'" size="small">
              {{ scope.row.pendingCount }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="inProgressCount" label="处理中" width="90" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.inProgressCount > 0 ? 'primary' : 'info'" size="small">
              {{ scope.row.inProgressCount }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentTaskCount" label="当前任务" width="90" align="center">
          <template #default="scope">
            <el-tag :type="getTaskCountTagType(scope.row.currentTaskCount)" size="small">
              {{ scope.row.currentTaskCount }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="avgProcessTime" label="平均处理时长" width="120" align="center">
          <template #default="scope">
            {{ formatTime(scope.row.avgProcessTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="completionRate" label="完成率" width="100" align="center">
          <template #default="scope">
            <el-progress
              :percentage="getCompletionRate(scope.row)"
              :color="getProgressColorByRate(getCompletionRate(scope.row))"
              :stroke-width="8"
            />
          </template>
        </el-table-column>
        <el-table-column prop="lastTaskTime" label="最后任务时间" min-width="155">
          <template #default="scope">
            {{ formatDateTime(scope.row.lastTaskTime) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  Download,
  Clock,
  Loading,
  Top,
  Bottom,
  DataLine,
  Checked,
  Warning,
  Timer
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import type { WorkStatsDTO } from '@/api/types'

// 导入 StatCard 组件
import StatCard from '@/components/dashboard/StatCard.vue'

// 获取全局 API proxy
const { proxy } = getCurrentInstance() as any

// 图表引用
const workloadChartRef = ref<HTMLElement>()
let workloadChart: ECharts | null = null

// 选中的时间周期
const selectedPeriod = ref('week')
const chartType = ref('bar')

// 统计数据
const statsData = ref<WorkStatsDTO[]>([])

// 概览卡片数据
const overviewCards = ref([
  { label: '总任务数', value: '0', icon: DataLine, color: '#409EFF', trend: 0 },
  { label: '已完成', value: '0', icon: Checked, color: '#67C23A', trend: 12.5 },
  { label: '进行中', value: '0', icon: Loading, color: '#E6A23C', trend: -5.2 },
  { label: '平均用时', value: '-', icon: Timer, color: '#909399', trend: 0 }
])

// 工作量排行（按当前任务数从少到多排序，推荐给任务少的组）
const workloadRanking = computed(() => {
  return [...statsData.value].sort((a, b) => a.currentTaskCount - b.currentTaskCount)
})

// 最大任务数（用于进度条计算）
const maxTaskCount = computed(() => {
  return Math.max(...statsData.value.map((s) => s.currentTaskCount), 1)
})

// 获取任务数标签类型
const getTaskCountTagType = (count: number) => {
  if (count === 0) return 'info'
  if (count < 5) return 'success'
  if (count < 10) return 'warning'
  return 'danger'
}

// 获取完成率
const getCompletionRate = (row: WorkStatsDTO) => {
  if (row.totalAssigned === 0) return 0
  return Math.round((row.totalCompleted / row.totalAssigned) * 100)
}

// 根据完成率获取进度条颜色
const getProgressColorByRate = (rate: number) => {
  if (rate >= 90) return '#67c23a'
  if (rate >= 70) return '#409eff'
  if (rate >= 50) return '#e6a23c'
  return '#f56c6c'
}

// 获取进度条颜色
const getProgressColor = (index: number) => {
  const colors = ['#67c23a', '#409eff', '#e6a23c', '#f56c6c', '#909399']
  return colors[index % colors.length]
}

// 格式化时间（分钟转为小时分钟）
const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 初始化工作量对比图表
const initWorkloadChart = () => {
  if (!workloadChartRef.value) return

  workloadChart = echarts.init(workloadChartRef.value)
  updateWorkloadChart()
}

// 更新工作量对比图表
const updateWorkloadChart = () => {
  if (!workloadChart) return

  const groupNames = statsData.value.map((s) => s.auditGroupName)
  const pendingData = statsData.value.map((s) => s.pendingCount)
  const inProgressData = statsData.value.map((s) => s.inProgressCount)
  const completedData = statsData.value.map((s) => s.totalCompleted)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['待处理', '处理中', '已完成'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: groupNames,
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '任务数'
    },
    series: [
      {
        name: '待处理',
        type: chartType.value === 'bar' ? 'bar' : 'line',
        data: pendingData,
        itemStyle: { color: '#e6a23c' },
        smooth: true
      },
      {
        name: '处理中',
        type: chartType.value === 'bar' ? 'bar' : 'line',
        data: inProgressData,
        itemStyle: { color: '#409eff' },
        smooth: true
      },
      {
        name: '已完成',
        type: chartType.value === 'bar' ? 'bar' : 'line',
        data: completedData,
        itemStyle: { color: '#67c23a' },
        smooth: true
      }
    ]
  }

  workloadChart.setOption(option)
}

// 加载统计数据
const loadStatsData = async () => {
  try {
    // 调用真实API获取所有审核组的工作统计数据
    const response = await proxy.$api.getAllWorkStats()
    statsData.value = response

    // 更新概览卡片
    const totalAssigned = statsData.value.reduce((sum, s) => sum + s.totalAssigned, 0)
    const totalCompleted = statsData.value.reduce((sum, s) => sum + s.totalCompleted, 0)
    const totalInProgress = statsData.value.reduce((sum, s) => sum + s.inProgressCount, 0)
    const avgTime = statsData.value.length > 0
      ? Math.round(statsData.value.reduce((sum, s) => sum + s.avgProcessTime, 0) / statsData.value.length)
      : 0

    overviewCards.value[0].value = totalAssigned.toString()
    overviewCards.value[1].value = totalCompleted.toString()
    overviewCards.value[2].value = totalInProgress.toString()
    overviewCards.value[3].value = avgTime > 0 ? formatTime(avgTime) : '-'

    // 更新图表
    nextTick(() => {
      updateWorkloadChart()
    })
  } catch (error) {
    console.error('加载统计数据失败:', error)
    ElMessage.error('加载失败')
  }
}

// 刷新数据
const refreshData = () => {
  loadStatsData()
  ElMessage.success('数据已刷新')
}

// 周期切换
const handlePeriodChange = () => {
  // TODO: 根据周期加载不同数据
  loadStatsData()
  ElMessage.info(`切换到${selectedPeriod.value === 'today' ? '今日' : selectedPeriod.value === 'week' ? '本周' : '本月'}数据`)
}

// 导出数据
const exportData = () => {
  // TODO: 实现导出功能
  ElMessage.info('导出功能开发中...')
}

// 监听图表类型变化
watch(chartType, () => {
  updateWorkloadChart()
})

// 响应式处理
const handleResize = () => {
  workloadChart?.resize()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadStatsData()
  nextTick(() => {
    initWorkloadChart()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  workloadChart?.dispose()
})
</script>

<style scoped lang="less">
.work-statistics-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;

  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title-section {
      h2 {
        margin: 0 0 4px 0;
        font-size: 20px;
        color: #303133;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }

    .action-buttons {
      display: flex;
      gap: 10px;
    }
  }

  .stat-cards {
    margin-bottom: 20px;
  }

  .charts-section {
    margin-bottom: 20px;

    .chart-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chart-container {
        height: 320px;
      }
    }

    .ranking-card {
      height: 100%;

      .ranking-list {
        .ranking-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f9fafc;
          }

          &.top-three {
            background: linear-gradient(90deg, rgba(103, 194, 58, 0.05) 0%, rgba(103, 194, 58, 0) 30%);
          }

          .ranking-number {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 12px;
            background: #f0f0f0;
            color: #909399;

            &.rank-1 {
              background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
              color: #8b5a00;
            }

            &.rank-2 {
              background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
              color: #5a5a5a;
            }

            &.rank-3 {
              background: linear-gradient(135deg, #cd7f32 0%, #e8a87c 100%);
              color: #5a3a00;
            }
          }

          .ranking-content {
            flex: 1;
            min-width: 0;

            .group-name {
              font-weight: 500;
              color: #303133;
              margin-bottom: 4px;
            }

            .group-stats {
              display: flex;
              gap: 12px;
              font-size: 12px;
              color: #909399;

              .stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
              }
            }

            .progress-bar {
              height: 4px;
              background: #f0f0f0;
              border-radius: 2px;
              margin-top: 8px;
              overflow: hidden;

              .progress-fill {
                height: 100%;
                border-radius: 2px;
                transition: width 0.3s;
              }
            }
          }

          .ranking-value {
            text-align: right;
            margin-left: 12px;

            .task-count {
              font-size: 20px;
              font-weight: bold;
              color: #303133;
            }

            .task-label {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
  }

  .detail-table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

@media (max-width: 768px) {
  .work-statistics-container {
    padding: 12px;

    .header-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .action-buttons {
        width: 100%;

        .el-select {
          flex: 1;
        }
      }
    }

    .charts-section {
      .el-col {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
