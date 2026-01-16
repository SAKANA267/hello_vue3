<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-16
 * Dashboard.vue
-->
<template>
  <div class="dashboard-container">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :md="6" v-for="(card, index) in statCards" :key="index">
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
      <el-col :xs="24" :lg="16">
        <TrendChart
          title="访问趋势"
          :data="trendChartData"
          :period="chartPeriod"
          unit="访问"
          @period-change="handlePeriodChange"
        />
      </el-col>
      <el-col :xs="24" :lg="8">
        <DistributionList
          title="用户分布"
          :data="userDistribution"
        />
      </el-col>
    </el-row>

    <!-- 快捷操作和最近活动 -->
    <el-row :gutter="20" class="bottom-section">
      <el-col :xs="24" :lg="8">
        <QuickActions
          title="快捷操作"
          :actions="quickActions"
          @action="handleQuickAction"
        />
      </el-col>
      <el-col :xs="24" :lg="16">
        <RecentActivities
          title="最近活动"
          :data="recentActivities"
          @view-all="handleViewAllActivities"
        />
      </el-col>
    </el-row>

    <!-- 待办事项 -->
    <el-row :gutter="20" class="todo-section">
      <el-col :span="24">
        <TodoList
          title="待办事项"
          :data="todoList"
          @add="handleAddTodo"
          @toggle="handleToggleTodo"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  ShoppingCart,
  Money,
  TrendCharts,
  Plus,
  Download,
  Setting,
  Document
} from '@element-plus/icons-vue'

// 导入组件
import StatCard from '@/components/dashboard/StatCard.vue'
import TrendChart from '@/components/dashboard/TrendChart.vue'
import DistributionList from '@/components/dashboard/DistributionList.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import RecentActivities from '@/components/dashboard/RecentActivities.vue'
import TodoList from '@/components/dashboard/TodoList.vue'

// 统计卡片数据
const statCards = reactive([
  { label: '用户总数', value: '12,846', icon: User, color: '#409EFF', trend: 12.5 },
  { label: '订单总数', value: '8,562', icon: ShoppingCart, color: '#67C23A', trend: 8.2 },
  { label: '销售额', value: '¥128,450', icon: Money, color: '#E6A23C', trend: -3.1 },
  { label: '访问量', value: '56,842', icon: TrendCharts, color: '#F56C6C', trend: 15.8 }
])

// 图表周期
const chartPeriod = ref('week')

// 周访问数据
const weeklyData = reactive([
  { label: '周一', value: 1200, percentage: 60, color: '#409EFF' },
  { label: '周二', value: 1500, percentage: 75, color: '#67C23A' },
  { label: '周三', value: 1800, percentage: 90, color: '#E6A23C' },
  { label: '周四', value: 1400, percentage: 70, color: '#F56C6C' },
  { label: '周五', value: 2000, percentage: 100, color: '#909399' },
  { label: '周六', value: 800, percentage: 40, color: '#409EFF' },
  { label: '周日', value: 600, percentage: 30, color: '#67C23A' }
])

// 图表数据（根据周期切换）
const trendChartData = computed(() => {
  return weeklyData
})

// 用户分布数据
const userDistribution = reactive([
  { label: '直接访问', value: 35, color: '#409EFF' },
  { label: '搜索引擎', value: 28, color: '#67C23A' },
  { label: '社交媒体', value: 22, color: '#E6A23C' },
  { label: '外部链接', value: 15, color: '#F56C6C' }
])

// 快捷操作配置
const quickActions = reactive([
  { key: 'add', label: '新增用户', type: 'primary' as const, icon: Plus },
  { key: 'export', label: '导出报表', type: 'success' as const, icon: Download },
  { key: 'setting', label: '系统设置', type: 'warning' as const, icon: Setting },
  { key: 'doc', label: '查看文档', type: 'info' as const, icon: Document }
])

// 最近活动数据
const recentActivities = reactive([
  { user: '张三', action: '创建用户', target: '李四', time: '2026-01-16 10:30', status: 'success' as const },
  { user: '王五', action: '修改订单', target: '订单#1234', time: '2026-01-16 10:15', status: 'success' as const },
  { user: '赵六', action: '删除商品', target: '商品A', time: '2026-01-16 09:50', status: 'pending' as const },
  { user: '孙七', action: '导出报表', target: '月度报表', time: '2026-01-16 09:30', status: 'success' as const },
  { user: '周八', action: '系统设置', target: '权限配置', time: '2026-01-16 09:00', status: 'success' as const }
])

// 待办事项
const todoList = reactive([
  { text: '完成用户模块开发', done: false, priority: 'high' as const, dueDate: '2026-01-18' },
  { text: '审核新订单', done: false, priority: 'medium' as const, dueDate: '2026-01-17' },
  { text: '更新系统文档', done: true, priority: 'low' as const, dueDate: '2026-01-20' },
  { text: '优化数据库查询', done: false, priority: 'high' as const, dueDate: '2026-01-19' }
])

// 事件处理函数
const handlePeriodChange = (period: string) => {
  chartPeriod.value = period
  ElMessage.info(`切换到: ${period === 'week' ? '本周' : period === 'month' ? '本月' : '本年'}`)
}

const handleQuickAction = (key: string) => {
  const actions: Record<string, string> = {
    add: '新增用户',
    export: '导出报表',
    setting: '系统设置',
    doc: '查看文档'
  }
  ElMessage.success(`执行操作: ${actions[key]}`)
}

const handleViewAllActivities = () => {
  ElMessage.info('查看全部活动')
}

const handleAddTodo = () => {
  ElMessage.info('添加待办功能')
}

const handleToggleTodo = (index: number, item: { text: string; done: boolean }) => {
  ElMessage.success(item.done ? `已完成: ${item.text}` : `取消完成: ${item.text}`)
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

.bottom-section {
  margin-bottom: 20px;
}

.todo-section {
  margin-bottom: 20px;
}
</style>
