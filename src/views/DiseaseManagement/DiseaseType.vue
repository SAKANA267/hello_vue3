<template>
  <div class="disease-type-page">
    <!-- 顶部操作栏 -->
    <div class="header-actions">
      <div class="title-section">
        <h2>疾病种类管理</h2>
        <p class="subtitle">管理具体的传染病种类</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        新建疾病
      </el-button>
    </div>

    <div class="filter-bar">
      <el-select
        v-model="filterCategory"
        placeholder="选择分类"
        clearable
        class="filter-select"
        @change="loadData"
      >
        <el-option
          v-for="cat in allCategories"
          :key="cat.id"
          :label="cat.categoryName"
          :value="cat.id"
        />
      </el-select>

      <el-select
        v-model="filterInfectious"
        placeholder="传染级别"
        clearable
        class="filter-select"
        @change="loadData"
      >
        <el-option label="甲类" :value="1" />
        <el-option label="乙类" :value="2" />
        <el-option label="丙类" :value="3" />
        <el-option label="非传染病" :value="4" />
      </el-select>

      <el-input
        v-model="searchKeyword"
        placeholder="搜索疾病名称/编码/ICD..."
        :prefix-icon="Search"
        clearable
        class="search-input"
        @input="handleSearch"
      />

      <el-radio-group v-model="statusFilter" @change="loadData">
        <el-radio-button :label="undefined">全部</el-radio-button>
        <el-radio-button :label="1">启用</el-radio-button>
        <el-radio-button :label="0">停用</el-radio-button>
      </el-radio-group>
    </div>

    <el-table
      v-loading="loading"
      :data="diseases"
      stripe
      class="disease-table"
    >
      <el-table-column prop="diseaseCode" label="编码" width="100">
        <template #default="{ row }">
          <code class="code-cell">{{ row.diseaseCode }}</code>
        </template>
      </el-table-column>

      <el-table-column prop="diseaseName" label="疾病名称" min-width="140" />

      <el-table-column prop="categoryName" label="所属分类" width="120" />

      <el-table-column prop="icdCode" label="ICD-10" width="80" />

      <el-table-column label="传染级别" width="100">
        <template #default="{ row }">
          <InfectiousBadge :level="row.infectiousLevel" />
        </template>
      </el-table-column>

      <el-table-column label="报卡" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.reportRequired ? 'success' : 'info'" size="small">
            {{ row.reportRequired ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="时限" width="70" align="center">
        <template #default="{ row }">
          <span>{{ row.reportDeadline }}h</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status === 1"
            @change="(val: boolean) => handleToggleStatus(row, val)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next"
      :page-sizes="[10, 20, 50, 100]"
      @current-change="loadData"
      @size-change="loadData"
    />

    <!-- 创建/编辑弹窗 -->
    <DiseaseDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :data="currentDisease"
      @success="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { diseaseApi } from '@/api/disease'
import type { DiseaseType, DiseaseCategory } from '@/types/disease'
import InfectiousBadge from '@/components/DiseaseManagement/InfectiousBadge.vue'
import DiseaseDialog from '@/components/DiseaseManagement/DiseaseDialog.vue'

const searchKeyword = ref('')
const filterCategory = ref<string>()
const filterInfectious = ref<number>()
const statusFilter = ref<number | undefined>(undefined)
const loading = ref(false)
const diseases = ref<DiseaseType[]>([])
const allCategories = ref<DiseaseCategory[]>([])
const pagination = ref({ page: 1, size: 20, total: 0 })

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const currentDisease = ref<DiseaseType | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const data = await diseaseApi.getPage({
      page: pagination.value.page,
      size: pagination.value.size,
      keyword: searchKeyword.value || undefined,
      categoryId: filterCategory.value,
      infectiousLevel: filterInfectious.value,
      status: statusFilter.value
    })
    diseases.value = data.records
    pagination.value.total = data.total
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  const data = await diseaseApi.getActiveSorted()
  allCategories.value = data
}

let searchTimer: ReturnType<typeof setTimeout>
const handleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.value.page = 1
    loadData()
  }, 300)
}

const handleCreate = () => {
  dialogMode.value = 'create'
  currentDisease.value = null
  dialogVisible.value = true
}

const handleEdit = (disease: DiseaseType) => {
  dialogMode.value = 'edit'
  currentDisease.value = disease
  dialogVisible.value = true
}

const handleToggleStatus = async (disease: DiseaseType, enabled: boolean) => {
  try {
    const api = enabled ? diseaseApi.activate : diseaseApi.deactivate
    await api(disease.id)
    ElMessage.success(enabled ? '已启用' : '已停用')
    loadData()
  } catch {
    loadData()
  }
}

const handleDelete = async (disease: DiseaseType) => {
  try {
    await ElMessageBox.confirm(`确定要删除「${disease.diseaseName}」吗？`, '删除确认', {
      type: 'warning'
    })
    await diseaseApi.delete(disease.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {}
}

onMounted(() => {
  loadData()
  loadCategories()
})
</script>

<style scoped lang="less">
.disease-type-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;

  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title-section {
      h2 {
        margin: 0 0 4px 0;
        font-size: 20px;
        color: #303133;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .filter-select {
    width: 140px;
  }

  .search-input {
    width: 280px;
  }

  .code-cell {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    color: #475569;
  }

  .disease-table {
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .disease-type-page {
    padding: 12px;

    .header-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .filter-bar {
      flex-direction: column;
      gap: 12px;

      .filter-select,
      .search-input {
        width: 100%;
      }
    }
  }
}
</style>
