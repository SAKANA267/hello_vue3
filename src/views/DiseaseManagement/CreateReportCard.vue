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
        <el-table :data="recentCards" style="width: 100%">
          <el-table-column prop="cardNumber" label="卡片编号" width="180" />
          <el-table-column prop="patientName" label="患者姓名" width="120" />
          <el-table-column prop="diseaseName" label="疾病名称" />
          <el-table-column prop="reportStatus" label="状态" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.reportStatus === 'reported'" type="success">已上报</el-tag>
              <el-tag v-else type="info">待审核</el-tag>
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentAdd } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import InfectiousReportCardDialog, {
  type InfectiousReportCardData
} from '@/components/DiseaseManagement/InfectiousReportCardDialog.vue'
import type { ReportCardMode } from '@/components/DiseaseManagement/InfectiousReportCardDialog.vue'

const router = useRouter()

// 对话框状态
const dialogVisible = ref(false)
const dialogMode = ref<ReportCardMode>('add')
const currentCardData = ref<Partial<InfectiousReportCardData> | null>(null)

// 最近创建的报卡（模拟数据）
const recentCards = ref<
  Array<{
    cardNumber: string
    patientName: string
    diseaseName: string
    reportStatus: 'reported' | 'unreported'
    createTime: string
  }>
>([])

// 创建新报卡
const handleCreate = () => {
  dialogMode.value = 'add'
  currentCardData.value = null
  dialogVisible.value = true
}

// 保存报卡
const handleSave = (data: InfectiousReportCardData) => {
  console.log('保存的报卡数据：', data)

  // 模拟API调用
  const newCard = {
    cardNumber: data.cardNumber || '1432599-0101',
    patientName: data.patientName,
    diseaseName: data.diseaseName,
    reportStatus: data.reportStatus,
    createTime: new Date().toLocaleString('zh-CN')
  }

  // 添加到最近列表
  recentCards.value.unshift(newCard)
  if (recentCards.value.length > 5) {
    recentCards.value.pop()
  }

  ElMessage.success('报卡创建成功，已提交审核')
}

// 查看报卡
const handleView = (row: any) => {
  dialogMode.value = 'view'
  currentCardData.value = {
    cardNumber: row.cardNumber,
    patientName: row.patientName,
    diseaseName: row.diseaseName,
    reportStatus: row.reportStatus
  }
  dialogVisible.value = true
}

// 撤销报卡
const handleRevoke = () => {
  ElMessage.success('报卡已撤销')
}

// 查看全部报卡
const viewAllCards = () => {
  // 可以跳转到报卡列表页面
  ElMessage.info('跳转到报卡列表页面')
}
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
