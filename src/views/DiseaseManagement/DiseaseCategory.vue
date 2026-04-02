<template>
  <div class="disease-category-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">◈</span>
          疾病分类管理
        </h1>
        <p class="page-subtitle">管理传染病的大类分类体系</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        新建分类
      </el-button>
    </header>

    <div class="filter-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索分类名称或编码..."
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

    <div v-loading="loading" class="category-grid">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        :class="{ disabled: category.status === 0 }"
      >
        <div class="card-header">
          <div class="category-code">{{ category.categoryCode }}</div>
          <el-switch
            :model-value="category.status === 1"
            @change="(val: boolean) => handleToggleStatus(category, val)"
          />
        </div>

        <h3 class="category-name">{{ category.categoryName }}</h3>
        <p class="category-desc">{{ category.description || '暂无描述' }}</p>

        <div class="card-stats">
          <div class="stat-item">
            <span class="stat-value">{{ category.diseaseCount }}</span>
            <span class="stat-label">关联疾病</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ category.sortOrder }}</span>
            <span class="stat-label">排序</span>
          </div>
        </div>

        <div class="card-actions">
          <el-button link type="info" @click="handleViewDiseases(category)">
            查看疾病 ({{ category.diseaseCount }})
          </el-button>
          <el-button link type="primary" @click="handleEdit(category)">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(category)">
            删除
          </el-button>
        </div>
      </div>
    </div>

    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      layout="total, prev, pager, next"
      @current-change="loadData"
    />

    <!-- 创建/编辑弹窗 -->
    <CategoryDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :data="currentCategory"
      @success="loadData"
    />

    <!-- 查看疾病弹窗 -->
    <el-dialog
      v-model="diseaseDrawerVisible"
      :title="`${selectedCategory?.categoryName} - 疾病列表`"
      width="800px"
    >
      <el-table
        v-loading="loadingDiseases"
        :data="diseases"
        stripe
        max-height="400"
      >
        <el-table-column prop="diseaseCode" label="编码" width="100">
          <template #default="{ row }">
            <code class="code-cell">{{ row.diseaseCode }}</code>
          </template>
        </el-table-column>

        <el-table-column prop="diseaseName" label="疾病名称" min-width="140" />

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
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button @click="diseaseDrawerVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, List } from '@element-plus/icons-vue'
import { diseaseCategoryApi, diseaseTypeApi } from '@/api/disease'
import type { DiseaseCategory, DiseaseType } from '@/types/disease'
import CategoryDialog from '@/components/DiseaseManagement/CategoryDialog.vue'
import InfectiousBadge from '@/components/DiseaseManagement/InfectiousBadge.vue'

const searchKeyword = ref('')
const statusFilter = ref<number | undefined>(undefined)
const loading = ref(false)
const categories = ref<DiseaseCategory[]>([])
const pagination = ref({ page: 1, size: 12, total: 0 })

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const currentCategory = ref<DiseaseCategory | null>(null)

// 疾病列表相关状态
const diseaseDrawerVisible = ref(false)
const selectedCategory = ref<DiseaseCategory | null>(null)
const diseases = ref<DiseaseType[]>([])
const loadingDiseases = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const data = await diseaseCategoryApi.getPage({
      page: pagination.value.page,
      size: pagination.value.size,
      keyword: searchKeyword.value || undefined,
      status: statusFilter.value
    })
    categories.value = data.records
    pagination.value.total = data.total
  } finally {
    loading.value = false
  }
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
  currentCategory.value = null
  dialogVisible.value = true
}

const handleEdit = (category: DiseaseCategory) => {
  dialogMode.value = 'edit'
  currentCategory.value = category
  dialogVisible.value = true
}

const handleViewDiseases = async (category: DiseaseCategory) => {
  selectedCategory.value = category
  diseaseDrawerVisible.value = true
  loadingDiseases.value = true
  try {
    const data = await diseaseTypeApi.getByCategory(category.id)
    diseases.value = data
  } finally {
    loadingDiseases.value = false
  }
}

const handleToggleStatus = async (category: DiseaseCategory, enabled: boolean) => {
  try {
    const api = enabled ? diseaseCategoryApi.activate : diseaseCategoryApi.deactivate
    await api(category.id)
    ElMessage.success(enabled ? '已启用' : '已停用')
    loadData()
  } catch {
    loadData()
  }
}

const handleDelete = async (category: DiseaseCategory) => {
  if (category.diseaseCount > 0) {
    ElMessage.warning('该分类下还有疾病，无法删除')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除「${category.categoryName}」吗？`, '删除确认', {
      type: 'warning'
    })
    await diseaseCategoryApi.delete(category.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="less">
.disease-category-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.page-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  color: #0d9488;
  font-size: 32px;
}

.page-subtitle {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  width: 320px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  min-height: 200px;
}

.category-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: #0d9488;
  }

  &.disabled {
    opacity: 0.6;
    background: #f8fafc;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  color: #0d9488;
  background: #f0fdfa;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.category-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.code-cell {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  color: #475569;
}
</style>
