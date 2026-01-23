<!--
 * Dashboard Page - 传染病报卡审核系统
 * @author: SAKANA267
 * @since: 2026-01-16
 * @updated: 2026-01-21 - 改造为传染病报卡审核系统专用仪表盘
-->
<template>
  <div class="dashboard-container">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" v-for="(card, index) in statCards" :key="index" :md="6">
        <StatCard
          :label="card.label"
          :value="card.value"
          :icon="card.icon"
          :color="card.color"
          :trend="card.trend"
        />
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :span="24">
        <TrendChart
          title="报卡趋势"
          :data="trendChartData"
          :period="chartPeriod"
          unit="报卡"
          @period-change="handlePeriodChange"
        />
      </el-col>
    </el-row>

    <!-- 分布列表区域 -->
    <el-row :gutter="20" class="distribution-section">
      <el-col :xs="24" :md="12">
        <DistributionList title="传染病种类分布" :data="diseaseDistribution" />
      </el-col>
      <el-col :xs="24" :md="12">
        <DistributionList title="院区分布" :data="areaDistribution" />
      </el-col>
    </el-row>

    <!-- 快捷操作和最近活动 -->
    <el-row :gutter="20" class="bottom-section">
      <el-col :xs="24" :lg="8">
        <QuickActions title="快捷操作" :actions="quickActions" @action="handleQuickAction" />
      </el-col>
      <el-col :xs="24" :lg="16">
        <RecentActivities
          title="最近报卡"
          :data="recentActivities"
          @view-all="handleViewAllActivities"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Clock, Check, Plus, Download, DocumentAdd } from '@element-plus/icons-vue'

// 导入组件
import StatCard from '@/components/dashboard/StatCard.vue'
import TrendChart from '@/components/dashboard/TrendChart.vue'
import DistributionList from '@/components/dashboard/DistributionList.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import RecentActivities from '@/components/dashboard/RecentActivities.vue'

// 导入模拟数据
import {
  diseaseDistribution,
  areaDistribution,
  trendData,
  recentAudits
} from '@/api/mockData/dashboard'

// 统计卡片数据
const statCards = reactive([
  { label: '报卡总数', value: '1,248', icon: Document, color: '#409EFF', trend: 12.5 },
  { label: '待审核', value: '156', icon: Clock, color: '#E6A23C', trend: -8.3 },
  { label: '已审核', value: '1,092', icon: Check, color: '#67C23A', trend: 15.2 },
  { label: '今日新增', value: '28', icon: Plus, color: '#F56C6C', trend: 5.8 }
])

// 图表周期
const chartPeriod = ref('week')

// 图表数据（根据周期切换）
const trendChartData = computed(() => {
  if (chartPeriod.value === 'week') return trendData.week
  if (chartPeriod.value === 'month') return trendData.month
  return trendData.year
})

// 快捷操作配置
const quickActions = reactive([
  { key: 'create', label: '新建报卡', type: 'primary' as const, icon: DocumentAdd },
  { key: 'batch-audit', label: '批量审核', type: 'success' as const, icon: Check },
  { key: 'export', label: '数据导出', type: 'warning' as const, icon: Download }
])

// 最近活动数据
const recentActivities = reactive(recentAudits)

// 事件处理函数
const handlePeriodChange = (period: string) => {
  chartPeriod.value = period
  ElMessage.info(`切换到: ${period === 'week' ? '本周' : period === 'month' ? '本月' : '本年'}`)
}

const handleQuickAction = (key: string) => {
  const actions: Record<string, string> = {
    create: '新建报卡',
    'batch-audit': '批量审核',
    export: '数据导出'
  }
  ElMessage.success(`执行操作: ${actions[key]}`)
  // TODO: 后续可添加实际路由跳转或功能实现
  // if (key === 'create') router.push('/object-management')
}

const handleViewAllActivities = () => {
  ElMessage.info('查看全部报卡')
}
</script>

<style scoped lang="less">
.dashboard-container {
  padding: 10px;
}

.stat-cards {
  margin-bottom: 20px;
}

.chart-section {
  margin-bottom: 20px;
}

.distribution-section {
  margin-bottom: 20px;
}

.bottom-section {
  margin-bottom: 20px;
}
</style>
