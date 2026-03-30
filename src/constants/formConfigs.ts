/**
 * 表单配置注册表
 * 用于 AI 对话中的对象创建表单
 */

import type { FormFieldConfig } from '@/types/ai'

export interface FormConfig {
  title: string
  description?: string
  fields: FormFieldConfig[]
}

export const FORM_CONFIGS: Record<string, FormConfig> = {
  'report-card': {
    title: '新增报告卡',
    description: '请填写传染病报告卡信息',
    fields: [
      {
        prop: 'hospitalArea',
        label: '院区',
        type: 'input',
        required: true,
        placeholder: '请输入院区'
      },
      {
        prop: 'department',
        label: '科室',
        type: 'input',
        required: true,
        placeholder: '请输入科室'
      },
      { prop: 'name', label: '姓名', type: 'input', required: true, placeholder: '请输入患者姓名' },
      {
        prop: 'gender',
        label: '性别',
        type: 'radio',
        options: ['男', '女'],
        required: true
      },
      { prop: 'age', label: '年龄', type: 'input', placeholder: '请输入年龄' },
      {
        prop: 'diseaseName',
        label: '疾病名称',
        type: 'input',
        required: true,
        placeholder: '请输入疾病名称'
      },
      {
        prop: 'fillDate',
        label: '填卡日期',
        type: 'date',
        required: true,
        placeholder: '请选择填卡日期'
      },
      { prop: 'remark', label: '备注', type: 'textarea', placeholder: '请输入备注信息（可选）' }
    ]
  },
  user: {
    title: '新增用户',
    description: '请填写用户账户信息',
    fields: [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        required: true,
        placeholder: '请输入用户名'
      },
      { prop: 'password', label: '密码', type: 'input', required: true, placeholder: '请输入密码' },
      { prop: 'name', label: '姓名', type: 'input', required: true, placeholder: '请输入真实姓名' },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        required: true,
        placeholder: '请输入邮箱地址'
      },
      { prop: 'phone', label: '电话', type: 'input', placeholder: '请输入联系电话' },
      {
        prop: 'role',
        label: '角色',
        type: 'select',
        options: [
          { label: '管理员', value: 'admin' },
          { label: '医生', value: 'doctor' },
          { label: '审核员', value: 'auditor' }
        ],
        required: true
      }
    ]
  }
}

/**
 * 根据实体类型获取表单配置
 */
export function getFormConfig(entityType: string): FormConfig | null {
  return FORM_CONFIGS[entityType] || null
}

/**
 * 获取所有支持的实体类型
 */
export function getSupportedEntityTypes(): string[] {
  return Object.keys(FORM_CONFIGS)
}
