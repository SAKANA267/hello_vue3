/**
 * Dashboard Mock Data
 * 传染病报卡审核系统 Dashboard 模拟数据
 * @author: SAKANA267
 * @since: 2026-01-21
 */

// 传染病种类（模拟数据）
export const infectiousDiseases = [
  '新冠肺炎', '流感', '结核病', '病毒性肝炎', '手足口病',
  '猩红热', '麻疹', '水痘', '流行性腮腺炎', '细菌性痢疾'
]

// 院区数据
export const hospitalAreas = ['总院', '东院', '南院', '北院']

// 科室数据
export const departments = ['感染科', '呼吸内科', '儿科', '急诊科', '发热门诊']

// 报卡统计数据
export const cardStatsData = {
  totalCards: 1248,      // 报卡总数
  pendingCards: 156,     // 待审核数量
  auditedCards: 1092,    // 已审核数量
  todayCards: 28         // 今日新增
}

// 传染病种类分布数据
export const diseaseDistribution = [
  { label: '流感', value: 32, color: '#409EFF' },
  { label: '新冠肺炎', value: 25, color: '#F56C6C' },
  { label: '结核病', value: 18, color: '#E6A23C' },
  { label: '手足口病', value: 12, color: '#67C23A' },
  { label: '病毒性肝炎', value: 8, color: '#909399' },
  { label: '其他', value: 5, color: '#C0C4CC' }
]

// 时间趋势数据
export const trendData = {
  week: [
    { label: '周一', value: 45, percentage: 45, color: '#409EFF' },
    { label: '周二', value: 52, percentage: 52, color: '#67C23A' },
    { label: '周三', value: 38, percentage: 38, color: '#E6A23C' },
    { label: '周四', value: 65, percentage: 65, color: '#F56C6C' },
    { label: '周五', value: 58, percentage: 58, color: '#909399' },
    { label: '周六', value: 28, percentage: 28, color: '#409EFF' },
    { label: '周日', value: 22, percentage: 22, color: '#67C23A' }
  ],
  month: [
    { label: '第1周', value: 280, percentage: 70, color: '#409EFF' },
    { label: '第2周', value: 320, percentage: 80, color: '#67C23A' },
    { label: '第3周', value: 250, percentage: 62, color: '#E6A23C' },
    { label: '第4周', value: 398, percentage: 100, color: '#F56C6C' }
  ],
  year: [
    { label: '1月', value: 980, percentage: 65, color: '#409EFF' },
    { label: '2月', value: 650, percentage: 43, color: '#67C23A' },
    { label: '3月', value: 1200, percentage: 80, color: '#E6A23C' },
    { label: '4月', value: 1500, percentage: 100, color: '#F56C6C' },
    { label: '5月', value: 1100, percentage: 73, color: '#409EFF' },
    { label: '6月', value: 850, percentage: 57, color: '#67C23A' },
    { label: '7月', value: 1350, percentage: 90, color: '#E6A23C' },
    { label: '8月', value: 1450, percentage: 97, color: '#F56C6C' },
    { label: '9月', value: 950, percentage: 63, color: '#409EFF' },
    { label: '10月', value: 1050, percentage: 70, color: '#67C23A' },
    { label: '11月', value: 1250, percentage: 83, color: '#E6A23C' },
    { label: '12月', value: 1400, percentage: 93, color: '#F56C6C' }
  ]

}

// 院区分布数据
export const areaDistribution = [
  { label: '总院', value: 42, color: '#409EFF' },
  { label: '东院', value: 28, color: '#67C23A' },
  { label: '南院', value: 18, color: '#E6A23C' },
  { label: '北院', value: 12, color: '#F56C6C' }
]

// 最近审核活动数据
export const recentAudits = [
  { user: '张医生', action: '提交报卡', target: '新冠肺炎-李某某', time: '2026-01-21 10:30', status: 'pending' as const },
  { user: '李审核员', action: '审核通过', target: '流感-王某某', time: '2026-01-21 10:15', status: 'success' as const },
  { user: '王医生', action: '提交报卡', target: '结核病-赵某某', time: '2026-01-21 09:50', status: 'pending' as const },
  { user: '赵审核员', action: '审核驳回', target: '手足口病-孙某某', time: '2026-01-21 09:30', status: 'success' as const },
  { user: '刘医生', action: '提交报卡', target: '病毒性肝炎-周某某', time: '2026-01-21 09:00', status: 'pending' as const }
]
