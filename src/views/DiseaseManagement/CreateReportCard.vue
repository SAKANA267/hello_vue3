<!--
 * @page CreateReportCard
 * @description 医生创建传染病报告卡页面
 * @author: SAKANA267
 * @since: 2026-04-28
 -->
<template>
  <div class="create-report-card-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">创建传染病报告卡</h1>
      <p class="page-subtitle">填写传染病患者信息并提交审核</p>
    </div>

    <!-- 主要内容区 -->
    <div class="content-section">
      <div class="empty-state">
        <el-icon class="empty-icon" :size="80">
          <DocumentAdd />
        </el-icon>
        <h2 class="empty-title">开始创建新的传染病报告卡</h2>
        <p class="empty-description">
          请点击下方按钮填写患者信息、病例分类和发病诊断信息，提交后将进入审核流程
        </p>
        <el-button type="primary" size="large" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新建报卡
        </el-button>
      </div>

      <!-- 最近创建的报卡列表（可选展示） -->
      <div v-if="recentCards.length > 0" class="recent-cards">
        <div class="section-header">
          <h3>最近创建的报卡</h3>
          <el-button text type="primary" @click="viewAllCards">查看全部</el-button>
        </div>
        <el-table :data="recentCards" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="卡片编号" width="180" />
          <el-table-column prop="name" label="患者姓名" width="120" />
          <el-table-column prop="diagnosisName" label="疾病名称" />
          <el-table-column prop="auditStatus" label="审核状态" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.auditStatus === 'APPROVED'" type="success">已通过</el-tag>
              <el-tag v-else-if="row.auditStatus === 'REJECTED'" type="danger">已驳回</el-tag>
              <el-tag v-else type="warning">待审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button text type="primary" @click="handleView(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 传染病报告卡对话框 -->
    <InfectiousReportCardDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :data="currentCardData"
      @save="handleSave"
      @revoke="handleRevoke"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentAdd } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import InfectiousReportCardDialog, {
  type InfectiousReportCardData
} from '@/components/DiseaseManagement/InfectiousReportCardDialog.vue'
import type { ReportCardMode } from '@/components/DiseaseManagement/InfectiousReportCardDialog.vue'
import type {
  ReportCardDTO,
  CreateReportCardRequest
} from '@/api/types'

const { proxy } = getCurrentInstance() as any
const router = useRouter()

// 对话框状态
const dialogVisible = ref(false)
const dialogMode = ref<ReportCardMode>('add')
const currentCardData = ref<Partial<InfectiousReportCardData> | null>(null)
const loading = ref(false)

// 最近创建的报卡
const recentCards = ref<ReportCardDTO[]>([])

// 将 InfectiousReportCardData 转换为 CreateReportCardRequest
const convertToCreateRequest = (data: InfectiousReportCardData): CreateReportCardRequest => {
  return {
    hospitalArea: data.hospitalArea || '',
    department: data.department || '',
    diagnosisName: data.diseaseName || data.diagnosisName || '',
    inpatientNo: data.inpatientNo || '',
    outpatientNo: data.outpatientNo || '',
    name: data.patientName,
    gender: data.gender,
    age: data.age,
    phone: data.phone,
    reportDoctor: data.doctorName || data.reportDoctor,
    fillDate: data.diagnosisDate || data.fillDate
  }
}

// 将 ReportCardDTO 转换为 InfectiousReportCardData
const convertToInfectiousData = (dto: ReportCardDTO): Partial<InfectiousReportCardData> => {
  return {
    id: dto.id,
    cardNumber: dto.id,
    patientName: dto.name,
    diseaseName: dto.diagnosisName,
    phone: dto.phone,
    gender: dto.gender,
    age: dto.age,
    hospitalArea: dto.hospitalArea,
    department: dto.department,
    doctorName: dto.reportDoctor,
    fillDate: dto.fillDate,
    diagnosisDate: dto.fillDate,
    reportStatus: 'unreported',
    reportCategory: '初次报告',
    auditStatus: dto.auditStatus,
    assignStatus: dto.assignStatus,
    // 默认值
    idCard: '',
    birthday: '',
    parentName: '',
    workUnit: '',
    addressType: '本县',
    detailAddress: '',
    patientBelong: '本地',
    crowdCategories: [],
    caseType: '疑似',
    caseAttribute: '急性',
    onsetDate: '',
    deathDate: '',
    remark: dto.remark
  }
}

// 加载最近创建的报卡
const loadRecentCards = async () => {
  try {
    loading.value = true
    const res = await proxy.$api.getReportCards({
      page: 1,
      size: 5,
      sortBy: 'createTime',
      sortOrder: 'desc'
    })
    recentCards.value = res.data || []
  } catch (error) {
    console.error('加载报卡列表失败：', error)
  } finally {
    loading.value = false
  }
}

// 创建新报卡
const handleCreate = () => {
  dialogMode.value = 'add'
  currentCardData.value = null
  dialogVisible.value = true
}

// 保存报卡
const handleSave = async (data: InfectiousReportCardData) => {
  try {
    loading.value = true
    // 转换数据格式
    const createRequest = convertToCreateRequest(data)
    const res = await proxy.$api.createReportCard(createRequest)
    ElMessage.success('报卡创建成功，已提交审核')
    dialogVisible.value = false
    // 刷新列表
    await loadRecentCards()
  } catch (error: any) {
    console.error('创建报卡失败：', error)
    ElMessage.error(error.message || '创建失败，请重试')
  } finally {
    loading.value = false
  }
}

// 查看报卡
const handleView = async (row: ReportCardDTO) => {
  try {
    loading.value = true
    const res = await proxy.$api.getReportCardById(row.id)
    dialogMode.value = 'view'
    currentCardData.value = convertToInfectiousData(res)
    dialogVisible.value = true
  } catch (error) {
    console.error('获取报卡详情失败：', error)
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

// 撤销报卡
const handleRevoke = async () => {
  ElMessage.success('报卡已撤销')
  await loadRecentCards()
}

// 查看全部报卡
const viewAllCards = () => {
  // 可以跳转到报卡列表页面
  router.push('/home/reportCardList')
}

onMounted(() => {
  loadRecentCards()
})
</script>

<style scoped lang="less">
@primary-color: #1890FF;
@text-color: #000000;
@text-secondary: #666666;
@border-color: #D9D9D9;

.create-report-card-page {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);

  .page-header {
    text-align: center;
    margin-bottom: 32px;

    .page-title {
      font-size: 28px;
      font-weight: 600;
      color: @text-color;
      margin: 0 0 12px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: @text-secondary;
      margin: 0;
    }
  }

  .content-section {
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;

      .empty-icon {
        color: @primary-color;
        margin-bottom: 24px;
        opacity: 0.8;
      }

      .empty-title {
        font-size: 20px;
        font-weight: 600;
        color: @text-color;
        margin: 0 0 12px 0;
      }

      .empty-description {
        font-size: 14px;
        color: @text-secondary;
        max-width: 480px;
        margin: 0 0 32px 0;
        line-height: 1.6;
      }

      .el-button {
        min-width: 140px;
        height: 44px;
        font-size: 16px;
      }
    }

    .recent-cards {
      margin-top: 40px;
      padding-top: 40px;
      border-top: 1px solid @border-color;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: @text-color;
          margin: 0;
        }
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .create-report-card-page {
    padding: 16px;

    .page-header {
      margin-bottom: 24px;

      .page-title {
        font-size: 22px;
      }
    }

    .content-section {
      padding: 24px 16px;

      .empty-state {
        padding: 40px 16px;

        .empty-icon {
          font-size: 60px !important;
        }

        .empty-title {
          font-size: 18px;
        }

        .empty-description {
          font-size: 13px;
        }

        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
