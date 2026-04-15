/**
 * 模拟数据生成配置
 */

export interface MockDataConfig {
  // 数据量配置
  counts: {
    diseaseCategories: number
    diseaseTypesPerCategory: number
    users: {
      admin: number
      leader: number
      auditor: number
      reporter: number
    }
    auditGroups: number
    membersPerGroup: number
    reportCards: number
    loginHistoryPerUser: number
  }

  // 状态分布配置
  distributions: {
    reportCardStatus: {
      UNASSIGNED: number
      ASSIGNED: number
      IN_PROGRESS: number
      COMPLETED: number
      VOID: number
    }
    auditStatus: {
      PENDING: number
      APPROVED: number
      REJECTED: number
    }
    priority: {
      LOW: number
      NORMAL: number
      HIGH: number
      URGENT: number
    }
  }

  // 测试配置
  defaultPassword: string

  // 数据时间范围（天数）
  dateRange: {
    past: number // 从多少天前开始
  }
}

/**
 * 默认配置
 */
export const mockConfig: MockDataConfig = {
  // 数据量配置
  counts: {
    diseaseCategories: 4,
    diseaseTypesPerCategory: 4,
    users: {
      admin: 1,
      leader: 2,
      auditor: 8,
      reporter: 6
    },
    auditGroups: 3,
    membersPerGroup: 4,
    reportCards: 80,
    loginHistoryPerUser: 3
  },

  // 状态分布配置 (总和应为 1)
  distributions: {
    reportCardStatus: {
      UNASSIGNED: 0.10,    // 待分配
      ASSIGNED: 0.15,      // 已分配待接单
      IN_PROGRESS: 0.25,   // 审核中
      COMPLETED: 0.45,     // 已完成
      VOID: 0.05           // 已作废
    },
    auditStatus: {
      PENDING: 0.30,       // 待审核
      APPROVED: 0.60,      // 已通过
      REJECTED: 0.10       // 已驳回
    },
    priority: {
      LOW: 0.10,           // 低优先级
      NORMAL: 0.70,        // 普通
      HIGH: 0.15,          // 高优先级
      URGENT: 0.05         // 紧急
    }
  },

  // 测试密码
  defaultPassword: '123456',

  // 数据时间范围
  dateRange: {
    past: 30 // 从30天前开始生成数据
  }
}

/**
 * 病种分类预设数据
 */
export const diseaseCategories = [
  {
    category_code: 'CLASS_A',
    category_name: '甲类传染病',
    description: '鼠疫、霍乱等强制管理的传染病',
    sort_order: 1
  },
  {
    category_code: 'CLASS_B',
    category_name: '乙类传染病',
    description: '新型冠状病毒肺炎、艾滋病、病毒性肝炎等',
    sort_order: 2
  },
  {
    category_code: 'CLASS_C',
    category_name: '丙类传染病',
    description: '流行性感冒、流行性腮腺炎等监测管理传染病',
    sort_order: 3
  },
  {
    category_code: 'OTHER',
    category_name: '其他传染病',
    description: '其他需要报告的传染病',
    sort_order: 4
  }
]

/**
 * 疾病类型预设数据
 */
export const diseaseTypes = [
  // 甲类
  { disease_code: 'A001', disease_name: '鼠疫', icd_code: 'A20', category_code: 'CLASS_A', infectious_level: 1, report_deadline: 2 },
  { disease_code: 'A002', disease_name: '霍乱', icd_code: 'A00', category_code: 'CLASS_A', infectious_level: 1, report_deadline: 2 },

  // 乙类
  { disease_code: 'B001', disease_name: '新型冠状病毒肺炎', icd_code: 'U07.1', category_code: 'CLASS_B', infectious_level: 2, report_deadline: 4 },
  { disease_code: 'B002', disease_name: '艾滋病', icd_code: 'B20', category_code: 'CLASS_B', infectious_level: 2, report_deadline: 24 },
  { disease_code: 'B003', disease_name: '病毒性肝炎', icd_code: 'B15-B19', category_code: 'CLASS_B', infectious_level: 2, report_deadline: 12 },
  { disease_code: 'B004', disease_name: '肺结核', icd_code: 'A15-A16', category_code: 'CLASS_B', infectious_level: 2, report_deadline: 24 },
  { disease_code: 'B005', disease_name: '伤寒', icd_code: 'A01', category_code: 'CLASS_B', infectious_level: 2, report_deadline: 12 },
  { disease_code: 'B006', disease_name: '细菌性痢疾', icd_code: 'A03', category_code: 'CLASS_B', infectious_level: 2, report_deadline: 12 },

  // 丙类
  { disease_code: 'C001', disease_name: '流行性感冒', icd_code: 'J11', category_code: 'CLASS_C', infectious_level: 3, report_deadline: 24 },
  { disease_code: 'C002', disease_name: '流行性腮腺炎', icd_code: 'B26', category_code: 'CLASS_C', infectious_level: 3, report_deadline: 24 },
  { disease_code: 'C003', disease_name: '风疹', icd_code: 'B06', category_code: 'CLASS_C', infectious_level: 3, report_deadline: 24 },
  { disease_code: 'C004', disease_name: '急性出血性结膜炎', icd_code: 'H10.0', category_code: 'CLASS_C', infectious_level: 3, report_deadline: 24 },

  // 其他
  { disease_code: 'O001', disease_name: '手足口病', icd_code: 'A08.4', category_code: 'OTHER', infectious_level: 3, report_deadline: 24 },
  { disease_code: 'O002', disease_name: '水痘', icd_code: 'B01', category_code: 'OTHER', infectious_level: 3, report_deadline: 24 }
]

/**
 * 院区和科室预设数据
 */
export const hospitalAreas = [
  { name: '总院', departments: ['感染科', '呼吸内科', '消化内科', '儿科', '急诊科', '发热门诊'] },
  { name: '东院', departments: ['感染科', '呼吸内科', '儿科', '急诊科'] },
  { name: '南院', departments: ['感染科', '内科', '儿科', '发热门诊'] }
]

/**
 * 审核组预设配置
 */
export const auditGroupTemplates = [
  {
    group_name: '传染病一组',
    group_code: 'INFECT_GROUP_01',
    description: '负责甲类和部分乙类传染病审核'
  },
  {
    group_name: '传染病二组',
    group_code: 'INFECT_GROUP_02',
    description: '负责乙类和丙类传染病审核'
  },
  {
    group_name: '结核病专项组',
    group_code: 'TB_SPECIAL_GROUP',
    description: '负责结核病专项审核'
  }
]

/**
 * 获取随机分布值
 */
export function getRandomByDistribution<T extends string>(
  distribution: Record<T, number>
): T {
  const random = Math.random()
  let cumulative = 0

  for (const [key, probability] of Object.entries(distribution)) {
    cumulative += probability
    if (random <= cumulative) {
      return key as T
    }
  }

  // 如果浮点精度问题导致没有匹配，返回第一个
  return Object.keys(distribution)[0] as T
}

/**
 * 打乱数组
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
