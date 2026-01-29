import Mock from 'mockjs'
import type {
  MockConfig,
  MockResponse,
  ObjectItem,
  ParsedParams,
  TableDataResponse
} from '../types'

function param2Obj(url: string): ParsedParams {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
      '"}'
  )
}

let List: ObjectItem[] = []
const count = 200 // 模拟数据条数
for (let i = 0; i < count; i++) {
  const status = Mock.Random.pick(['待审核', '已审核', '审核不通过'])
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      hospitalArea: Mock.Random.pick(['总院', '分院', '东院区', '西院区']),
      department: Mock.Random.pick(['内科', '外科', '儿科', '妇产科', '骨科', '心内科', '神经科']),
      diagnosisName: Mock.Random.pick(['高血压', '糖尿病', '冠心病', '肺炎', '胃炎', '骨折']),
      inpatientNo: Mock.Random.string('number', 8),
      outpatientNo: Mock.Random.string('number', 8),
      name: Mock.Random.cname(),
      gender: Mock.Random.pick(['男', '女']),
      age: Mock.Random.integer(1, 100),
      phone: /^1[3-9]\d{9}$/,
      reportDoctor: Mock.Random.cname(),
      fillDate: Mock.Random.date('yyyy-MM-dd'),
      auditDate: status !== '待审核' ? Mock.Random.date('yyyy-MM-dd') : '-',
      auditor: status !== '待审核' ? Mock.Random.cname() : '-',
      status: status
    }) as ObjectItem
  )
}

export default {
  // 可搜索字段: name(姓名), hospitalArea(院区), department(科室), diagnosisName(诊断名称), inpatientNo(住院号), outpatientNo(门诊号), phone(联系电话)
  getObjectList: (config: MockConfig): MockResponse<TableDataResponse<ObjectItem>> => {
    const { keyWord, page = 1, limit = 15 } = param2Obj(config.url)

    const mockList = List.filter(item => {
      if (keyWord) {
        const keyword = keyWord.toLowerCase()
        return (
          item.name?.toLowerCase().includes(keyword) ||
          item.hospitalArea?.toLowerCase().includes(keyword) ||
          item.department?.toLowerCase().includes(keyword) ||
          item.diagnosisName?.toLowerCase().includes(keyword) ||
          item.inpatientNo?.includes(keyword) ||
          item.outpatientNo?.includes(keyword) ||
          item.phone?.includes(keyword)
        )
      }
      return true
    })

    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1)
    )
    return {
      code: 200,
      data: {
        success: true,
        list: pageList,
        count: mockList.length
      },
      msg: '获取成功'
    }
  },

  // 删除对象
  deleteObject: (config: MockConfig): MockResponse<{ success: boolean }> => {
    const { id } = param2Obj(config.url)

    if (!id) {
      return {
        code: 500,
        data: { success: false },
        msg: '参数错误'
      }
    } else {
      List = List.filter(item => item.id !== id)
      return {
        code: 200,
        data: { success: true },
        msg: '删除成功'
      }
    }
  },

  // 添加对象
  createObject: (config: MockConfig): MockResponse<{ success: boolean }> => {
    const body = JSON.parse(config.body || '{}')
    const {
      hospitalArea,
      department,
      diagnosisName,
      inpatientNo,
      outpatientNo,
      name,
      gender,
      age,
      phone,
      reportDoctor,
      fillDate,
      auditDate,
      auditor,
      status
    } = body
    List.unshift({
      id: Mock.Random.guid(),
      hospitalArea,
      department,
      diagnosisName,
      inpatientNo,
      outpatientNo,
      name,
      gender,
      age,
      phone,
      reportDoctor,
      fillDate,
      auditDate,
      auditor,
      status
    } as ObjectItem)
    return {
      code: 200,
      data: { success: true },
      msg: '添加成功'
    }
  },

  // 更新对象
  updateObject: (config: MockConfig): MockResponse<{ success: boolean }> => {
    const body = JSON.parse(config.body || '{}')
    const {
      id,
      hospitalArea,
      department,
      diagnosisName,
      inpatientNo,
      outpatientNo,
      name,
      gender,
      age,
      phone,
      reportDoctor,
      fillDate,
      auditDate,
      auditor,
      status
    } = body
    const index = List.findIndex(item => item.id === id)

    if (index === -1) {
      return {
        code: 500,
        data: { success: false },
        msg: '对象不存在'
      }
    }

    List[index] = {
      ...List[index],
      hospitalArea: hospitalArea ?? List[index].hospitalArea,
      department: department ?? List[index].department,
      diagnosisName: diagnosisName ?? List[index].diagnosisName,
      inpatientNo: inpatientNo ?? List[index].inpatientNo,
      outpatientNo: outpatientNo ?? List[index].outpatientNo,
      name: name ?? List[index].name,
      gender: gender ?? List[index].gender,
      age: age ?? List[index].age,
      phone: phone ?? List[index].phone,
      reportDoctor: reportDoctor ?? List[index].reportDoctor,
      fillDate: fillDate ?? List[index].fillDate,
      auditDate: auditDate ?? List[index].auditDate,
      auditor: auditor ?? List[index].auditor,
      status: status ?? List[index].status
    }

    return {
      code: 200,
      data: { success: true },
      msg: '更新成功'
    }
  },

  // 审核通过
  auditPass: (config: MockConfig): MockResponse<{ success: boolean }> => {
    const body = JSON.parse(config.body || '{}')
    const { id, auditor, auditDate, status } = body

    if (!id) {
      return {
        code: 500,
        data: { success: false },
        msg: '参数错误'
      }
    }

    const index = List.findIndex(item => item.id === id)
    if (index === -1) {
      return {
        code: 500,
        data: { success: false },
        msg: '对象不存在'
      }
    }

    List[index] = {
      ...List[index],
      status: status || '已审核',
      auditor: auditor || List[index].auditor,
      auditDate: auditDate || List[index].auditDate
    }

    return {
      code: 200,
      data: { success: true },
      msg: '审核通过'
    }
  },

  // 审核不通过
  auditReject: (config: MockConfig): MockResponse<{ success: boolean }> => {
    const body = JSON.parse(config.body || '{}')
    const { id, auditor, auditDate, status } = body

    if (!id) {
      return {
        code: 500,
        data: { success: false },
        msg: '参数错误'
      }
    }

    const index = List.findIndex(item => item.id === id)
    if (index === -1) {
      return {
        code: 500,
        data: { success: false },
        msg: '对象不存在'
      }
    }

    List[index] = {
      ...List[index],
      status: status || '审核不通过',
      auditor: auditor || List[index].auditor,
      auditDate: auditDate || List[index].auditDate
    }

    return {
      code: 200,
      data: { success: true },
      msg: '审核不通过'
    }
  },

  // 撤回审核
  auditRevoke: (config: MockConfig): MockResponse<{ success: boolean }> => {
    const body = JSON.parse(config.body || '{}')
    const { id, status } = body

    if (!id) {
      return {
        code: 500,
        data: { success: false },
        msg: '参数错误'
      }
    }

    const index = List.findIndex(item => item.id === id)
    if (index === -1) {
      return {
        code: 500,
        data: { success: false },
        msg: '对象不存在'
      }
    }

    List[index] = {
      ...List[index],
      status: status || '待审核',
      auditor: '-',
      auditDate: '-'
    }

    return {
      code: 200,
      data: { success: true },
      msg: '撤回成功'
    }
  }
}
