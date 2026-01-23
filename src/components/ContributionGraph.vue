<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-08-02
 * ContributionGraph.vue
-->
<template>
  <div class="contribution-graph">
    <div class="contribution-header">
      <h1>{{ contributions.length }} contributions in the last year</h1>
      <div class="legend">
        <span>Less</span>
        <div class="legend-colors">
          <div
            v-for="(color, index) in legendColors"
            :key="index"
            class="legend-item"
            :style="{ backgroundColor: color }"
          />
        </div>
        <span>More</span>
      </div>
    </div>

    <div class="graph-container">
      <!-- 月份标签区域 -->
      <div class="months-area">
        <div class="months-labels">
          <span
            v-for="month in monthLabels"
            :key="month.name"
            :style="{ gridColumn: `${month.start} / span ${month.span}` }"
          >
            {{ month.name }}
          </span>
        </div>
      </div>

      <!-- 星期标签区域 -->
      <div class="weekdays-area">
        <div class="weekdays-labels">
          <!-- 空占位 -->
          <span>Mon</span>
          <span />
          <span>Wed</span>
          <span />
          <span>Fri</span>
          <span />
          <span />
        </div>
      </div>

      <!-- 贡献方块区域 -->
      <div class="contribution-area">
        <div class="contribution-grid">
          <el-tooltip
            v-for="(day, index) in contributionDays"
            :key="index"
            :content="getTooltipContent(day)"
            placement="top"
          >
            <div
              class="contribution-day"
              :class="getContributionLevel(day.count)"
              :style="{ backgroundColor: getContributionColor(day.count) }"
              @click="onDayClick(day)"
            />
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... 保持原有的 script 部分不变
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  contributions: {
    type: Array,
    default: () => []
  },
  startDate: {
    type: Date,
    default: () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() - 1)
      return date
    }
  }
})

// Emits
const emit = defineEmits(['day-click'])

// 颜色配置
const colors = {
  empty: '#ebedf0',
  level1: '#9be9a8',
  level2: '#40c463',
  level3: '#30a14e',
  level4: '#216e39'
}

const legendColors = [colors.empty, colors.level1, colors.level2, colors.level3, colors.level4]

// 生成一年的日期数据
const contributionDays = computed(() => {
  const days = []
  const startDate = new Date(props.startDate)
  const today = new Date()

  // 找到开始日期所在周的周一
  const startMonday = new Date(startDate)
  startMonday.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7))

  // 生成53周 * 7天的网格
  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(startMonday)
      date.setDate(startMonday.getDate() + week * 7 + day)

      if (date <= today) {
        const dateString = date.toISOString().split('T')[0]
        const contribution = props.contributions.find(c => c.date === dateString)

        days.push({
          date: date,
          dateString: dateString,
          count: contribution ? contribution.count : 0
        })
      } else {
        // 未来的日期显示为空
        days.push({
          date: date,
          dateString: '',
          count: 0,
          isFuture: true
        })
      }
    }
  }

  return days
})

// 月份标签
const monthLabels = computed(() => {
  const months = []
  const startDate = new Date(props.startDate)
  let currentMonth = startDate.getMonth()
  let currentYear = startDate.getFullYear()

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  for (let week = 0; week < 53; week++) {
    const weekDate = new Date(startDate)
    weekDate.setDate(startDate.getDate() + week * 7)

    if (weekDate.getMonth() !== currentMonth || week === 0) {
      currentMonth = weekDate.getMonth()
      currentYear = weekDate.getFullYear()

      months.push({
        name: monthNames[currentMonth],
        start: week + 1,
        span: 1
      })
    }
  }

  // 计算每个月标签的跨度
  for (let i = 0; i < months.length - 1; i++) {
    months[i].span = months[i + 1].start - months[i].start
  }
  if (months.length > 0) {
    months[months.length - 1].span = 54 - months[months.length - 1].start
  }

  return months
})

// 获取贡献等级
const getContributionLevel = count => {
  if (count === 0) return 'level-0'
  if (count <= 3) return 'level-1'
  if (count <= 6) return 'level-2'
  if (count <= 9) return 'level-3'
  return 'level-4'
}

// 获取贡献颜色
const getContributionColor = count => {
  if (count === 0) return colors.empty
  if (count <= 3) return colors.level1
  if (count <= 6) return colors.level2
  if (count <= 9) return colors.level3
  return colors.level4
}

// 获取工具提示内容
const getTooltipContent = day => {
  if (day.isFuture) return ''

  const date = day.date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (day.count === 0) {
    return `${date} 无贡献`
  }

  return `${date} ${day.count} 次贡献`
}

// 日期点击事件
const onDayClick = day => {
  if (!day.isFuture) {
    emit('day-click', day)
  }
}
</script>

<style scoped>
.contribution-graph {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: white;
  border-radius: 6px;
  padding: 20px;
}

.contribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.contribution-header h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #24292f;
}

.legend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #656d76;
}

.legend-colors {
  display: flex;
  gap: 2px;
}

.legend-item {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

/* 主要的网格容器 */
.graph-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  gap: 3px;
  grid-template-areas:
    '. months'
    'weekdays contributions';
}

/* 月份标签区域 */
.months-area {
  grid-area: months;
  display: grid;
  grid-template-columns: subgrid;
}

.months-labels {
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  gap: 3px;
  font-size: 12px;
  color: #656d76;
  margin-bottom: 4px;
}

/* 星期标签区域 */
.weekdays-area {
  grid-area: weekdays;
  display: grid;
  grid-template-rows: subgrid;
  align-items: start;
}

.weekdays-labels {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: 3px;
  font-size: 12px;
  color: #656d76;
  justify-items: end;
  padding-right: 8px;
}

.weekdays-labels span {
  height: 12.5px;
  display: flex;
  align-items: center;
  line-height: 1;
}

/* 贡献方块区域 */
.contribution-area {
  grid-area: contributions;
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}

.contribution-grid {
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  grid-template-rows: repeat(7, 1fr);
  gap: 3px;
  grid-auto-flow: column;
}

.contribution-day {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(27, 31, 36, 0.06);
}

.contribution-day:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 1px rgba(27, 31, 36, 0.15);
  border-color: rgba(27, 31, 36, 0.15);
}

.contribution-day.level-0 {
  background-color: #ebedf0;
}

.contribution-day.level-1 {
  background-color: #9be9a8;
}

.contribution-day.level-2 {
  background-color: #40c463;
}

.contribution-day.level-3 {
  background-color: #30a14e;
}

.contribution-day.level-4 {
  background-color: #216e39;
}

/* 降级方案：不支持subgrid的浏览器 */
@supports not (grid-template-columns: subgrid) {
  .graph-container {
    display: block;
  }

  .months-area {
    margin-left: 60px;
    margin-bottom: 4px;
  }

  .months-labels {
    display: grid;
    grid-template-columns: repeat(53, 11px);
    gap: 3px;
    justify-content: start;
  }

  .weekdays-area {
    float: left;
    width: 50px;
    margin-top: 4px;
  }

  .weekdays-labels {
    display: flex;
    flex-direction: column;
    gap: 3px;
    text-align: right;
    padding-right: 8px;
  }

  .weekdays-labels span {
    height: 11px;
    line-height: 11px;
  }

  .contribution-area {
    margin-left: 60px;
  }

  .contribution-grid {
    display: grid;
    grid-template-columns: repeat(53, 11px);
    grid-template-rows: repeat(7, 11px);
    gap: 3px;
    grid-auto-flow: column;
    justify-content: start;
  }

  .contribution-day {
    width: 11px;
    height: 11px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .contribution-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .contribution-day {
    width: 9px;
    height: 9px;
  }

  .legend-item {
    width: 8px;
    height: 8px;
  }

  .months-labels,
  .weekdays-labels {
    font-size: 10px;
  }

  @supports not (grid-template-columns: subgrid) {
    .months-labels {
      grid-template-columns: repeat(53, 9px);
    }

    .contribution-grid {
      grid-template-columns: repeat(53, 9px);
      grid-template-rows: repeat(7, 9px);
    }

    .weekdays-labels span {
      height: 9px;
      line-height: 9px;
    }
  }
}
</style>
