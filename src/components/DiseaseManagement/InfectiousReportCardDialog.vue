<!--
 * @component InfectiousReportCardDialog
 * @description 中华人民共和国传染病报告卡 Dialog 组件
 * @author: SAKANA267
 * @since: 2026-04-14
 -->
<template>
  <el-dialog
    :model-value="modelValue"
    title=" "
    :width="dialogWidth"
    :fullscreen="isMobile"
    :before-close="handleClose"
    class="infectious-report-card-dialog"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- 顶部状态栏 -->
    <template #header>
      <div class="dialog-header">
        <div class="dialog-title">
          中华人民共和国传染病报告卡
        </div>
        <div class="status-tags">
          <span v-if="formData.reportStatus === 'reported'" class="status-tag reported">
            <span class="status-dot"></span>
            已上报
          </span>
          <span v-else class="status-tag unreported">
            <span class="status-dot"></span>
            未上报
          </span>
        </div>
      </div>
    </template>

    <!-- 头部操作区 -->
    <div class="report-card-header">
      <div class="card-number">卡片编号：{{ cardNumber }}</div>
      <div class="report-category">
        <span class="category-label">报卡类别：</span>
        <el-radio-group v-model="formData.reportCategory" size="small">
          <el-radio-button label="初次报告" />
          <el-radio-button label="订正报告" />
        </el-radio-group>
      </div>
    </div>

    <!-- 主体表单区 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-position="left"
      label-width="120px"
      class="report-card-form"
    >
      <!-- 患者基本信息 -->
      <div class="form-section">
        <div class="section-title">患者基本信息</div>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="患者姓名" prop="patientName">
              <el-input
                v-model="formData.patientName"
                placeholder="请输入患者姓名"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="身份证号" prop="idCard">
              <el-input
                v-model="formData.idCard"
                placeholder="请输入18位身份证号"
                maxlength="18"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="formData.birthday"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                :editable="false"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入11位联系电话"
                maxlength="11"
                clearable
                class="phone-input"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="患儿家长姓名" prop="parentName">
              <el-input
                v-model="formData.parentName"
                placeholder="14岁以下必填"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="工作单位" prop="workUnit">
              <el-input
                v-model="formData.workUnit"
                placeholder="请输入工作单位"
                maxlength="100"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 地址选择 -->
        <el-form-item label="现住址" prop="addressType" required>
          <el-radio-group v-model="formData.addressType">
            <el-radio label="本县">本县(区)</el-radio>
            <el-radio label="本市">本市其他县(区)</el-radio>
            <el-radio label="本省">本省其他市</el-radio>
            <el-radio label="外省">外省</el-radio>
            <el-radio label="港澳台">港澳台</el-radio>
            <el-radio label="外籍">外籍</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="详细地址" prop="detailAddress">
          <el-input
            v-model="formData.detailAddress"
            placeholder="请输入详细地址（省/市/区/街道/门牌号）"
            maxlength="200"
            clearable
          />
        </el-form-item>
      </div>

      <!-- 病例分类 -->
      <div class="form-section">
        <div class="section-title">病例分类</div>

        <el-form-item label="病人属于" prop="patientBelong">
          <el-radio-group v-model="formData.patientBelong">
            <el-radio label="本地">本地病人</el-radio>
            <el-radio label="外来">外来病人</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="人群分类" prop="crowdCategories">
          <el-checkbox-group v-model="formData.crowdCategories">
            <el-checkbox label="散居儿童">散居儿童</el-checkbox>
            <el-checkbox label="幼托儿童">幼托儿童</el-checkbox>
            <el-checkbox label="学生">学生</el-checkbox>
            <el-checkbox label="教师">教师</el-checkbox>
            <el-checkbox label="保育员">保育员</el-checkbox>
            <el-checkbox label="餐饮食品">餐饮食品业</el-checkbox>
            <el-checkbox label="公共场所">公共场所服务</el-checkbox>
            <el-checkbox label="商业服务">商业服务</el-checkbox>
            <el-checkbox label="医务人员">医务人员</el-checkbox>
            <el-checkbox label="工人">工人</el-checkbox>
            <el-checkbox label="民工">民工</el-checkbox>
            <el-checkbox label="农民">农民</el-checkbox>
            <el-checkbox label="牧民">牧民</el-checkbox>
            <el-checkbox label="渔(船)民">渔(船)民</el-checkbox>
            <el-checkbox label="海员">海员及长途驾驶员</el-checkbox>
            <el-checkbox label="干部">干部职员</el-checkbox>
            <el-checkbox label="离退休">离退休人员</el-checkbox>
            <el-checkbox label="家务待业">家务及待业</el-checkbox>
            <el-checkbox label="其他">其他</el-checkbox>
            <el-checkbox label="不详">不详</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="病例分类" prop="caseType" required>
              <el-radio-group v-model="formData.caseType">
                <el-radio label="疑似">疑似病例</el-radio>
                <el-radio label="临床">临床诊断</el-radio>
                <el-radio label="确诊">确诊病例</el-radio>
                <el-radio label="病原">病原携带者</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12">
            <el-form-item label="病例属性" prop="caseAttribute" required>
              <el-radio-group v-model="formData.caseAttribute">
                <el-radio label="急性">急性</el-radio>
                <el-radio label="慢性">慢性</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 发病日期与疾病信息 -->
      <div class="form-section">
        <div class="section-title">发病与诊断信息</div>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="发病日期" prop="onsetDate">
              <el-date-picker
                v-model="formData.onsetDate"
                type="date"
                placeholder="请选择发病日期"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                :editable="false"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="诊断日期" prop="diagnosisDate">
              <el-date-picker
                v-model="formData.diagnosisDate"
                type="date"
                placeholder="请选择诊断日期"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                :editable="false"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="死亡日期" prop="deathDate">
              <el-date-picker
                v-model="formData.deathDate"
                type="date"
                placeholder="如患者死亡请填写"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                :editable="false"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="疾病名称" prop="diseaseName">
              <el-select
                v-model="formData.diseaseName"
                placeholder="请选择疾病"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="disease in diseaseOptions"
                  :key="disease.value"
                  :label="disease.label"
                  :value="disease.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12">
            <el-form-item label="填卡医生" prop="doctorName">
              <el-input
                v-model="formData.doctorName"
                placeholder="请输入医生姓名"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注说明" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注说明"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </div>
    </el-form>

    <!-- 底部操作按钮区 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-if="mode === 'view' || mode === 'edit'"
          class="footer-btn cancel-btn"
          @click="handleRevoke"
        >
          撤销报卡
        </el-button>
        <el-button class="footer-btn" @click="handleClose">取消</el-button>
        <el-button
          v-if="mode === 'view'"
          type="default"
          class="footer-btn"
          @click="handleEdit"
        >
          编辑报卡
        </el-button>
        <el-button
          v-if="mode === 'add' || mode === 'edit'"
          type="primary"
          class="footer-btn primary-btn"
          :loading="submitting"
          @click="handleSave"
        >
          保存
        </el-button>
        <el-button
          v-if="mode === 'audit'"
          type="success"
          class="footer-btn success-btn"
          :loading="submitting"
          @click="handleAuditPass"
        >
          审核通过
        </el-button>
        <el-button
          v-if="mode === 'audit'"
          type="danger"
          class="footer-btn danger-btn"
          :loading="submitting"
          @click="handleAuditReject"
        >
          驳回
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

/**
 * 传染病报告卡对话框模式
 */
export type ReportCardMode = 'add' | 'edit' | 'view' | 'audit'

/**
 * 表单数据接口
 */
export interface InfectiousReportCardData {
  // 基本信息
  cardNumber?: string
  reportCategory: string
  reportStatus: 'reported' | 'unreported'
  patientName: string
  idCard: string
  birthday: string
  phone: string
  parentName: string
  workUnit: string
  addressType: string
  detailAddress: string
  // 病例分类
  patientBelong: string
  crowdCategories: string[]
  caseType: string
  caseAttribute: string
  // 发病诊断
  onsetDate: string
  diagnosisDate: string
  deathDate: string
  diseaseName: string
  doctorName: string
  remark: string
}

const props = defineProps<{
  modelValue: boolean
  mode?: ReportCardMode
  data?: Partial<InfectiousReportCardData> | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: InfectiousReportCardData): void
  (e: 'audit-pass', data: InfectiousReportCardData): void
  (e: 'audit-reject', data: InfectiousReportCardData): void
  (e: 'revoke'): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const isMobile = ref(window.innerWidth <= 768)

// 对话框宽度
const dialogWidth = computed(() => {
  if (isMobile.value) return '95%'
  return '900px'
})

// 卡片编号生成
const cardNumber = computed(() => {
  if (props.data?.cardNumber) {
    return props.data.cardNumber
  }
  return '1432599-0101'
})

// 疾病选项（模拟数据）
const diseaseOptions = ref([
  { label: '鼠疫', value: '鼠疫' },
  { label: '霍乱', value: '霍乱' },
  { label: '传染性非典型肺炎', value: '传染性非典型肺炎' },
  { label: '艾滋病', value: '艾滋病' },
  { label: '病毒性肝炎', value: '病毒性肝炎' },
  { label: '脊髓灰质炎', value: '脊髓灰质炎' },
  { label: '人感染高致病性禽流感', value: '人感染高致病性禽流感' },
  { label: '麻疹', value: '麻疹' },
  { label: '流行性出血热', value: '流行性出血热' },
  { label: '狂犬病', value: '狂犬病' },
  { label: '流行性乙型脑炎', value: '流行性乙型脑炎' },
  { label: '登革热', value: '登革热' },
  { label: '新冠肺炎', value: '新冠肺炎' },
  { label: '细菌性痢疾', value: '细菌性痢疾' },
  { label: '肺结核', value: '肺结核' },
  { label: '伤寒副伤寒', value: '伤寒副伤寒' },
  { label: '流行性脑脊髓膜炎', value: '流行性脑脊髓膜炎' },
  { label: '百日咳', value: '百日咳' },
  { label: '白喉', value: '白喉' },
  { label: '新生儿破伤风', value: '新生儿破伤风' },
  { label: '猩红热', value: '猩红热' },
  { label: '布鲁氏菌病', value: '布鲁氏菌病' },
  { label: '淋病', value: '淋病' },
  { label: '梅毒', value: '梅毒' },
  { label: '钩端螺旋体病', value: '钩端螺旋体病' },
  { label: '血吸虫病', value: '血吸虫病' },
  { label: '疟疾', value: '疟疾' },
  { label: '流行性感冒', value: '流行性感冒' },
  { label: '流行性腮腺炎', value: '流行性腮腺炎' },
  { label: '风疹', value: '风疹' },
  { label: '急性出血性结膜炎', value: '急性出血性结膜炎' },
  { label: '麻风病', value: '麻风病' },
  { label: '流行性和地方性斑疹伤寒', value: '流行性和地方性斑疹伤寒' },
  { label: '黑热病', value: '黑热病' },
  { label: '包虫病', value: '包虫病' },
  { label: '丝虫病', value: '丝虫病' },
  { label: '除霍乱、细菌性和阿米巴性痢疾、伤寒和副伤寒以外的感染性腹泻病', value: '除霍乱、细菌性和阿米巴性痢疾、伤寒和副伤寒以外的感染性腹泻病' }
])

// 表单数据
const formData = reactive<InfectiousReportCardData>({
  reportCategory: '初次报告',
  reportStatus: 'unreported',
  patientName: '',
  idCard: '',
  birthday: '',
  phone: '',
  parentName: '',
  workUnit: '',
  addressType: '本县',
  detailAddress: '',
  patientBelong: '本地',
  crowdCategories: [],
  caseType: '疑似',
  caseAttribute: '急性',
  onsetDate: '',
  diagnosisDate: '',
  deathDate: '',
  diseaseName: '',
  doctorName: '',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  patientName: [
    { required: true, message: '请输入患者姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      message: '请输入正确的18位身份证号',
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的11位手机号',
      trigger: 'blur'
    }
  ],
  birthday: [
    { required: true, message: '请选择出生日期', trigger: 'change' }
  ],
  addressType: [
    { required: true, message: '请选择地址类型', trigger: 'change' }
  ],
  detailAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  patientBelong: [
    { required: true, message: '请选择病人属于', trigger: 'change' }
  ],
  crowdCategories: [
    { required: true, message: '请选择人群分类', trigger: 'change' }
  ],
  caseType: [
    { required: true, message: '请选择病例分类', trigger: 'change' }
  ],
  caseAttribute: [
    { required: true, message: '请选择病例属性', trigger: 'change' }
  ],
  onsetDate: [
    { required: true, message: '请选择发病日期', trigger: 'change' }
  ],
  diagnosisDate: [
    { required: true, message: '请选择诊断日期', trigger: 'change' }
  ],
  diseaseName: [
    { required: true, message: '请选择疾病名称', trigger: 'change' }
  ],
  doctorName: [
    { required: true, message: '请输入填卡医生姓名', trigger: 'blur' }
  ]
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    reportCategory: '初次报告',
    reportStatus: 'unreported',
    patientName: '',
    idCard: '',
    birthday: '',
    phone: '',
    parentName: '',
    workUnit: '',
    addressType: '本县',
    detailAddress: '',
    patientBelong: '本地',
    crowdCategories: [],
    caseType: '疑似',
    caseAttribute: '急性',
    onsetDate: '',
    diagnosisDate: '',
    deathDate: '',
    diseaseName: '',
    doctorName: '',
    remark: ''
  })
  formRef.value?.clearValidate()
}

// 监听外部数据变化
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      Object.assign(formData, newData)
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// 关闭对话框
const handleClose = () => {
  formRef.value?.clearValidate()
  emit('update:modelValue', false)
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('save', { ...formData })
    ElMessage.success('保存成功')
    emit('update:modelValue', false)
  } catch (error) {
    console.error('表单验证失败：', error)
  } finally {
    submitting.value = false
  }
}

// 编辑
const handleEdit = () => {
  ElMessage.info('进入编辑模式')
}

// 审核通过
const handleAuditPass = async () => {
  try {
    await ElMessageBox.confirm('确认审核通过该报卡？', '审核确认', {
      confirmButtonText: '确认通过',
      cancelButtonText: '取消',
      type: 'success'
    })

    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('audit-pass', { ...formData })
    ElMessage.success('审核通过')
    emit('update:modelValue', false)
  } catch {
    // 用户取消
  } finally {
    submitting.value = false
  }
}

// 审核驳回
const handleAuditReject = async () => {
  try {
    await ElMessageBox.prompt('请输入驳回原因', '驳回报卡', {
      confirmButtonText: '确认驳回',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '驳回原因不能为空'
    })

    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('audit-reject', { ...formData })
    ElMessage.success('已驳回')
    emit('update:modelValue', false)
  } catch {
    // 用户取消
  } finally {
    submitting.value = false
  }
}

// 撤销报卡
const handleRevoke = async () => {
  try {
    await ElMessageBox.confirm('确认撤销该报卡？撤销后无法恢复。', '撤销确认', {
      confirmButtonText: '确认撤销',
      cancelButtonText: '取消',
      type: 'warning'
    })

    emit('revoke')
    ElMessage.success('已撤销报卡')
    emit('update:modelValue', false)
  } catch {
    // 用户取消
  }
}

// 响应式布局检测
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 暴露方法供父组件调用
defineExpose({
  resetForm,
  validate: () => formRef.value?.validate()
})
</script>

<style scoped lang="less">
// 颜色规范
@primary-color: #1890FF;
@success-color: #52C41A;
@warning-color: #FAAD14;
@danger-color: #F5222D;
@text-color: #000000;
@text-secondary: #666666;
@border-color: #D9D9D9;
@bg-color: #FFFFFF;

.infectious-report-card-dialog {
  // 对话框标题样式
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;

    .dialog-title {
      font-size: 20px;
      font-weight: bold;
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
      color: @text-color;
    }

    .status-tags {
      display: flex;
      gap: 12px;

      .status-tag {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: @text-secondary;

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
        }

        &.reported {
          .status-dot {
            background-color: @success-color;
          }
        }

        &.unreported {
          .status-dot {
            background-color: #BFBFBF;
          }
        }
      }
    }
  }

  // 头部操作区
  .report-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    margin-bottom: 20px;
    border-bottom: 1px solid @border-color;

    .card-number {
      font-size: 13px;
      color: @text-secondary;
    }

    .report-category {
      display: flex;
      align-items: center;

      .category-label {
        font-size: 14px;
        color: @text-color;
        margin-right: 8px;
      }
    }
  }

  // 表单区域
  .report-card-form {
    .form-section {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: 15px;
        font-weight: 600;
        color: @text-color;
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid @primary-color;
      }
    }

    // 联系电话高亮样式
    .phone-input {
      :deep(.el-input__wrapper) {
        border-color: @primary-color;
        box-shadow: 0 0 0 1px @primary-color inset;

        &:hover {
          box-shadow: 0 0 0 1px @primary-color inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px @primary-color inset !important;
        }
      }
    }

    // 多选框组样式优化
    :deep(.el-checkbox-group) {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 16px;

      .el-checkbox {
        margin-right: 0;
      }
    }

    // 单选框组样式优化
    :deep(.el-radio-group) {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 16px;
    }
  }

  // 底部操作按钮区
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 0;

    .footer-btn {
      min-width: 90px;
      padding: 8px 20px;
      font-size: 14px;
      border-radius: 4px;

      &.cancel-btn {
        color: @text-secondary;
        border: 1px solid @border-color;

        &:hover {
          color: @danger-color;
          border-color: @danger-color;
          background-color: #FFF1F0;
        }
      }

      &.primary-btn {
        background-color: @primary-color;
        border-color: @primary-color;

        &:hover {
          background-color: #40A9FF;
          border-color: #40A9FF;
        }
      }

      &.success-btn {
        background-color: @success-color;
        border-color: @success-color;

        &:hover {
          background-color: #73D13D;
          border-color: #73D13D;
        }
      }

      &.danger-btn {
        background-color: @danger-color;
        border-color: @danger-color;

        &:hover {
          background-color: #FF4D4F;
          border-color: #FF4D4F;
        }
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .infectious-report-card-dialog {
    .dialog-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .dialog-title {
        font-size: 18px;
      }
    }

    .report-card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .report-category {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        .category-label {
          margin-bottom: 8px;
        }

        :deep(.el-radio-group) {
          width: 100%;

          .el-radio-button {
            flex: 1;

            .el-radio-button__inner {
              width: 100%;
            }
          }
        }
      }
    }

    .report-card-form {
      :deep(.el-form-item__label) {
        width: 100% !important;
        text-align: left;
        margin-bottom: 4px;
      }

      :deep(.el-checkbox-group),
      :deep(.el-radio-group) {
        flex-direction: column;
        gap: 8px;
      }
    }

    .dialog-footer {
      flex-direction: column-reverse;

      .footer-btn {
        width: 100%;
      }
    }
  }
}
</style>
