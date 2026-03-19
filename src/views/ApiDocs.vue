<template>
  <div class="api-docs-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">{{ apiDocsConfig.title }}</h1>
    </div>

    <!-- Main Content -->
    <div class="docs-container">
      <!-- Sidebar Navigation (Desktop) -->
      <aside class="docs-sidebar" v-if="!isMobile">
        <div class="sidebar-header">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索 API 端点..."
            :prefix-icon="Search"
            clearable
            size="small"
          />
        </div>
        <nav class="sidebar-nav">
          <div
            v-for="section in filteredSections"
            :key="section.id"
            class="nav-item"
            :class="{ active: currentSectionId === section.id }"
            @click="handleSectionClick(section.id)"
          >
            <span class="nav-icon">
              <Document />
            </span>
            <span class="nav-text">{{ section.title }}</span>
          </div>
        </nav>
      </aside>

      <!-- Mobile Drawer Navigation -->
      <el-drawer
        v-else
        v-model="drawerVisible"
        direction="ltr"
        :with-header="false"
        size="280px"
        class="docs-drawer"
      >
        <div class="sidebar-header">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索 API..."
            :prefix-icon="Search"
            clearable
            size="small"
          />
        </div>
        <nav class="sidebar-nav">
          <div
            v-for="section in filteredSections"
            :key="section.id"
            class="nav-item"
            :class="{ active: currentSectionId === section.id }"
            @click="handleMobileSectionClick(section.id)"
          >
            <span class="nav-icon">
              <Document />
            </span>
            <span class="nav-text">{{ section.title }}</span>
          </div>
        </nav>
      </el-drawer>

      <!-- Mobile Header -->
      <div class="mobile-header" v-if="isMobile">
        <el-button :icon="Menu" @click="drawerVisible = true" circle />
        <span class="current-section-title">{{ currentSection?.title }}</span>
      </div>

      <!-- Markdown Content Area -->
      <main class="docs-content">
        <el-card shadow="never" class="content-card">
          <el-skeleton v-if="loading" :rows="8" animated />
          <MarkdownRenderer v-else-if="currentContent" :content="currentContent" />
          <el-empty v-else description="无法加载文档内容" />
        </el-card>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, Document, Menu } from '@element-plus/icons-vue'
import { apiDocsConfig } from '@/docs/api'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import type { ApiDocSection } from '@/docs/types'

// State
const currentSectionId = ref('overview')
const currentContent = ref('')
const loading = ref(false)
const searchKeyword = ref('')
const isMobile = ref(window.innerWidth <= 768)
const drawerVisible = ref(false)

// Computed
const currentSection = computed(() => {
  return apiDocsConfig.sections.find(s => s.id === currentSectionId.value)
})

const filteredSections = computed(() => {
  if (!searchKeyword.value) {
    return apiDocsConfig.sections
  }
  const keyword = searchKeyword.value.toLowerCase()
  return apiDocsConfig.sections.filter(s => s.title.toLowerCase().includes(keyword))
})

// Methods
const loadSectionContent = async (section: ApiDocSection) => {
  loading.value = true
  try {
    const module = await section.file()
    currentContent.value = module.default
  } catch (error) {
    console.error('Failed to load doc section:', error)
    currentContent.value = '# 加载失败\n\n无法加载该章节内容，请稍后重试。'
  } finally {
    loading.value = false
  }
}

const handleSectionClick = (sectionId: string) => {
  currentSectionId.value = sectionId
  const section = apiDocsConfig.sections.find(s => s.id === sectionId)
  if (section) {
    loadSectionContent(section)
  }
}

const handleMobileSectionClick = (sectionId: string) => {
  handleSectionClick(sectionId)
  drawerVisible.value = false
}

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

// Lifecycle
onMounted(() => {
  const initialSection = apiDocsConfig.sections.find(s => s.id === currentSectionId.value)
  if (initialSection) {
    loadSectionContent(initialSection)
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.api-docs-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);

  @media (max-width: 768px) {
    padding: 12px;
  }
}

.page-header {
  margin-bottom: 20px;

  .page-title {
    margin: 12px 0 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 20px;
    }
  }
}

.docs-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.docs-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;

  .sidebar-header {
    margin-bottom: 16px;
  }

  .sidebar-nav {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 1px solid #f5f7fa;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f5f7fa;
    }

    &.active {
      background: #ecf5ff;
      color: #409eff;
      border-right: 3px solid #409eff;

      .nav-icon {
        color: #409eff;
      }
    }

    .nav-icon {
      font-size: 16px;
      color: #909399;
    }

    .nav-text {
      font-size: 14px;
      color: #606266;
    }
  }
}

.mobile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .current-section-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
}

.docs-content {
  flex: 1;
  min-width: 0;

  .content-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    :deep(.el-card__body) {
      padding: 24px;

      @media (max-width: 768px) {
        padding: 16px;
      }
    }
  }
}

// Drawer styles
:deep(.docs-drawer) {
  .el-drawer__body {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    margin-bottom: 16px;
  }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    background: #f5f7fa;
    border-radius: 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 1px solid #e5e5e5;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #fff;
    }

    &.active {
      background: #ecf5ff;
      color: #409eff;

      .nav-icon {
        color: #409eff;
      }
    }

    .nav-icon {
      font-size: 16px;
      color: #909399;
    }

    .nav-text {
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
