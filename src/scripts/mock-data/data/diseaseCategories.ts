/**
 * 病种分类预设数据
 *
 * 中国法定传染病分类:
 * - 甲类: 鼠疫、霍乱 (2种)
 * - 乙类: 新冠肺炎、艾滋病、病毒性肝炎等 (20+种)
 * - 丙类: 流感、腮腺炎等 (10+种)
 */

export const diseaseCategories = [
  {
    category_code: 'CLASS_A',
    category_name: '甲类传染病',
    description: '鼠疫、霍乱等强制管理的传染病，城镇2小时、农村6小时内上报',
    sort_order: 1
  },
  {
    category_code: 'CLASS_B',
    category_name: '乙类传染病',
    description: '新型冠状病毒肺炎、艾滋病、病毒性肝炎、肺结核等，24小时内上报',
    sort_order: 2
  },
  {
    category_code: 'CLASS_C',
    category_name: '丙类传染病',
    description: '流行性感冒、流行性腮腺炎等监测管理传染病，24-48小时内上报',
    sort_order: 3
  },
  {
    category_code: 'OTHER',
    category_name: '其他传染病',
    description: '其他需要报告的传染病',
    sort_order: 4
  }
]
