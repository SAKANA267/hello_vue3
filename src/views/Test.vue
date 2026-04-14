<!--
 * @component Test
 * @description 测试页面 - 传染病报告卡预览
 * @author: SAKANA267
 * @since: 2026-04-14
-->
<template>
  <div class="test-page">
    <div class="page-header">
      <h1 class="page-title">传染病报告卡预览</h1>
      <p class="page-subtitle">中华人民共和国传染病报告卡 Dialog 组件测试</p>
    </div>

    <div class="demo-section">
      <div class="section-title">模式切换</div>
      <div class="button-group">
        <el-button type="primary" @click="openDialog('add')">
          <el-icon><Plus /></el-icon>
          新增报卡
        </el-button>
        <el-button type="default" @click="openDialog('edit')">
          <el-icon><Edit /></el-icon>
          编辑报卡
        </el-button>
        <el-button type="info" @click="openDialog('view')">
          <el-icon><View /></el-icon>
          查看报卡
        </el-button>
        <el-button type="success" @click="openDialog('audit')">
          <el-icon><Select /></el-icon>
          审核报卡
        </el-button>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">功能说明</div>
      <el-alert
        title="传染病报告卡组件功能特性"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <ul class="feature-list">
            <li>✓ 支持新增、编辑、查看、审核四种模式</li>
            <li>✓ 完整的患者基本信息录入（姓名、身份证、联系方式、地址等）</li>
            <li>✓ 病例分类单选/多选（人群分类支持多选）</li>
            <li>✓ 发病与诊断日期录入</li>
            <li>✓ 身份证号18位格式验证</li>
            <li>✓ 联系电话高亮显示（蓝色边框）</li>
            <li>✓ 响应式设计，支持桌面端和移动端</li>
            <li>✓ 符合医疗行业标准UI设计</li>
          </ul>
        </template>
      </el-alert>
    </div>

    <!-- 传染病报告卡对话框 -->
    <InfectiousReportCardDialog
      v-model="dialogVisible"
      :mode="currentMode"
      :data="currentData"
      @save="handleSave"
      @audit-pass="handleAuditPass"
      @audit-reject="handleAuditReject"
      @revoke="handleRevoke"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Edit, View, Select } from '@element-plus/icons-vue'
import InfectiousReportCardDialog, {
  type ReportCardMode,
  type InfectiousReportCardData
} from '@/components/DiseaseManagement/InfectiousReportCardDialog.vue'

const dialogVisible = ref(false)
const currentMode = ref<ReportCardMode>('add')
const currentData = ref<Partial<InfectiousReportCardData> | null>(null)

// 模拟数据
const mockData: Partial<InfectiousReportCardData> = {
  cardNumber: '1432599-0101',
  reportCategory: '初次报告',
  reportStatus: 'unreported',
  patientName: '张三',
  idCard: '110101199001011234',
  birthday: '1990-01-01',
  phone: '13800138000',
  parentName: '张父',
  workUnit: '北京市某某医院',
  addressType: '本县',
  detailAddress: '北京市东城区某某街道1号',
  patientBelong: '本地',
  crowdCategories: ['医务人员'],
  caseType: '确诊',
  caseAttribute: '急性',
  onsetDate: '2026-04-10',
  diagnosisDate: '2026-04-12',
  diseaseName: '新冠肺炎',
  doctorName: '李医生',
  remark: '患者有发热、咳嗽症状，核酸检测阳性'
}

// 打开对话框
const openDialog = (mode: ReportCardMode) => {
  currentMode.value = mode
  if (mode === 'add') {
    currentData.value = null
  } else {
    currentData.value = { ...mockData }
  }
  dialogVisible.value = true
}

// 保存处理
const handleSave = (data: InfectiousReportCardData) => {
  console.log('保存数据：', data)
  ElMessage.success('保存成功，数据已输出到控制台')
}

// 审核通过
const handleAuditPass = (data: InfectiousReportCardData) => {
  console.log('审核通过：', data)
  ElMessage.success('审核通过')
}

// 审核驳回
const handleAuditReject = (data: InfectiousReportCardData) => {
  console.log('审核驳回：', data)
  ElMessage.warning('已驳回该报卡')
}

// 撤销报卡
const handleRevoke = () => {
  console.log('撤销报卡')
  ElMessage.info('报卡已撤销')
}
</script>

<style scoped lang="less">
.test-page {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100%;

  .page-header {
    margin-bottom: 32px;
    text-align: center;

    .page-title {
      font-size: 28px;
      font-weight: bold;
      color: #000;
      margin: 0 0 8px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }

  .demo-section {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e8e8e8;
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .el-button {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }

    .feature-list {
      margin: 12px 0 0 0;
      padding-left: 20px;

      li {
        margin-bottom: 8px;
        color: #333;
        line-height: 1.6;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .test-page {
    padding: 16px;

    .page-header {
      .page-title {
        font-size: 22px;
      }

      .page-subtitle {
        font-size: 13px;
      }
    }

    .demo-section {
      padding: 16px;

      .button-group {
        flex-direction: column;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
