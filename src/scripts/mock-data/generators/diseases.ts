import { query, insert, batchInsert, hasData, truncateTable } from '../db'
import { generateId, randomInt, printSuccess, printInfo } from '../utils'
import { diseaseCategories, diseaseTypes, mockConfig } from '../config'

/**
 * DiseaseCategory 接口
 */
interface DiseaseCategory {
  id: string
  category_code: string
  category_name: string
  description: string
  sort_order: number
  status: number
  deleted: boolean
  created_by: string
  create_time: Date
  updated_by?: string
  update_time?: Date
  remark?: string
}

/**
 * DiseaseType 接口
 */
interface DiseaseType {
  id: string
  disease_code: string
  disease_name: string
  category_id: string
  icd_code: string
  description: string
  infectious_level: number
  report_required: number
  report_deadline: number
  sort_order: number
  status: number
  deleted: boolean
  created_by: string
  create_time: Date
  updated_by?: string
  update_time?: Date
  remark?: string
}

/**
 * 存储生成的 ID 供后续使用
 */
export interface GeneratedDiseases {
  categories: Map<string, string> // category_code -> id
  types: Map<string, string>      // disease_code -> id
  typeByCategory: Map<string, string[]> // category_id -> disease_type_ids
}

const generatedData: GeneratedDiseases = {
  categories: new Map(),
  types: new Map(),
  typeByCategory: new Map()
}

/**
 * 生成病种分类数据
 */
async function generateDiseaseCategories(): Promise<void> {
  printInfo('正在生成病种分类数据...')

  const now = new Date()
  const createdBy = 'system'

  const records: DiseaseCategory[] = diseaseCategories.map((cat, index) => {
    const id = generateId()
    generatedData.categories.set(cat.category_code, id)

    return {
      id,
      category_code: cat.category_code,
      category_name: cat.category_name,
      description: cat.description,
      sort_order: cat.sort_order,
      status: 1, // 启用
      deleted: false,
      created_by: createdBy,
      create_time: now,
      update_time: now,
      remark: null
    }
  })

  // 批量插入
  const columns = ['id', 'category_code', 'category_name', 'description', 'sort_order',
                   'status', 'deleted', 'created_by', 'create_time', 'update_time', 'remark']

  await batchInsert('disease_category', columns, records.map(r => [
    r.id, r.category_code, r.category_name, r.description, r.sort_order,
    r.status, r.deleted, r.created_by, r.create_time, r.update_time, r.remark
  ]))

  printSuccess(`插入病种分类 ${records.length} 条`)
}

/**
 * 生成疾病类型数据
 */
async function generateDiseaseTypes(): Promise<void> {
  printInfo('正在生成疾病类型数据...')

  const now = new Date()
  const createdBy = 'system'

  const records: DiseaseType[] = []

  for (const disease of diseaseTypes) {
    const categoryId = generatedData.categories.get(disease.category_code)
    if (!categoryId) {
      console.warn(`警告: 未找到分类编码 ${disease.category_code}`)
      continue
    }

    const id = generateId()
    generatedData.types.set(disease.disease_code, id)

    // 按分类收集疾病类型 ID
    if (!generatedData.typeByCategory.has(categoryId)) {
      generatedData.typeByCategory.set(categoryId, [])
    }
    generatedData.typeByCategory.get(categoryId)!.push(id)

    records.push({
      id,
      disease_code: disease.disease_code,
      disease_name: disease.disease_name,
      category_id: categoryId,
      icd_code: disease.icd_code,
      description: `${disease.disease_name}，需要按照规定时限上报`,
      infectious_level: disease.infectious_level,
      report_required: 1, // 需要报告
      report_deadline: disease.report_deadline,
      sort_order: records.length + 1,
      status: 1, // 启用
      deleted: false,
      created_by: createdBy,
      create_time: now,
      update_time: now,
      remark: null
    })
  }

  // 批量插入
  const columns = ['id', 'disease_code', 'disease_name', 'category_id', 'icd_code',
                   'description', 'infectious_level', 'report_required', 'report_deadline',
                   'sort_order', 'status', 'deleted', 'created_by', 'create_time',
                   'update_time', 'remark']

  await batchInsert('disease_type', columns, records.map(r => [
    r.id, r.disease_code, r.disease_name, r.category_id, r.icd_code,
    r.description, r.infectious_level, r.report_required, r.report_deadline,
    r.sort_order, r.status, r.deleted, r.created_by, r.create_time,
    r.update_time, r.remark
  ]))

  printSuccess(`插入疾病类型 ${records.length} 条`)
}

/**
 * 生成病种数据（主函数）
 */
export async function generateDiseases(clean: boolean = false): Promise<GeneratedDiseases> {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('第 1 步: 生成病种数据')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 检查是否已有数据
  const hasCategories = await hasData('disease_category')
  const hasTypes = await hasData('disease_type')

  if (hasCategories || hasTypes) {
    if (clean) {
      printInfo('清理模式：清空现有数据...')
      if (hasTypes) await truncateTable('disease_type')
      if (hasCategories) await truncateTable('disease_category')
    } else {
      console.log('⚠ 数据库中已存在病种数据，跳过生成（使用 --clean 选项可清空并重新生成）')
      // 查询现有数据填充到 generatedData
      await loadExistingData()
      return generatedData
    }
  }

  await generateDiseaseCategories()
  await generateDiseaseTypes()

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  return generatedData
}

/**
 * 加载现有数据到 generatedData
 */
async function loadExistingData(): Promise<void> {
  // 加载分类数据
  const categories = await query(
    'SELECT id, category_code FROM disease_category WHERE deleted = 0'
  ) as Array<{ id: string, category_code: string }>
  for (const cat of categories) {
    generatedData.categories.set(cat.category_code, cat.id)
  }

  // 加载疾病类型数据
  const types = await query(
    'SELECT id, disease_code, category_id FROM disease_type WHERE deleted = 0'
  ) as Array<{ id: string, disease_code: string, category_id: string }>
  for (const type of types) {
    generatedData.types.set(type.disease_code, type.id)
    if (!generatedData.typeByCategory.has(type.category_id)) {
      generatedData.typeByCategory.set(type.category_id, [])
    }
    generatedData.typeByCategory.get(type.category_id)!.push(type.id)
  }

  printInfo(`已加载现有数据: ${categories.length} 个分类, ${types.length} 个疾病类型`)
}

/**
 * 获取所有疾病类型 ID
 */
export function getAllDiseaseTypeIds(): string[] {
  return Array.from(generatedData.types.values())
}

/**
 * 获取随机疾病类型 ID
 */
export function getRandomDiseaseTypeId(): string {
  const ids = getAllDiseaseTypeIds()
  return ids[Math.floor(Math.random() * ids.length)]
}

/**
 * 根据分类获取疾病类型 ID
 */
export function getDiseaseTypeIdsByCategory(categoryCode: string): string[] {
  const categoryId = generatedData.categories.get(categoryCode)
  if (!categoryId) return []
  return generatedData.typeByCategory.get(categoryId) || []
}

/**
 * 获取疾病类型信息
 */
export function getDiseaseTypeInfo(diseaseCode: string): { id: string, name: string, categoryId: string } | null {
  const id = generatedData.types.get(diseaseCode)
  if (!id) return null

  const disease = diseaseTypes.find(d => d.disease_code === diseaseCode)
  if (!disease) return null

  const categoryId = generatedData.categories.get(disease.category_code)
  if (!categoryId) return null

  return {
    id,
    name: disease.disease_name,
    categoryId
  }
}
