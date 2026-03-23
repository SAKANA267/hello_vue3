<template>
  <div class="api-docs-page">
    <!-- Top Banner - Similar to Vue docs -->
    <div class="docs-banner">
      <div class="banner-content">
        <h1 class="docs-title">{{ apiDocsConfig.title }}</h1>
        <p class="docs-subtitle">{{ apiDocsConfig.description }}</p>
      </div>
      <div class="banner-actions">
        <el-button :icon="Search" circle @click="showSearchDialog = true" />
        <el-button
          :icon="Menu"
          class="menu-toggle"
          @click="toggleMobileDrawer"
          circle
          v-if="isMobile"
        />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="docs-layout">
      <!-- Sidebar Navigation (Desktop) -->
      <aside class="docs-sidebar" v-if="!isMobile">
        <div class="sidebar-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文档..."
            :prefix-icon="Search"
            clearable
            size="default"
          />
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section" v-for="group in groupedSections" :key="group.category">
            <div class="nav-section-title">{{ group.category }}</div>
            <a
              v-for="section in group.sections"
              :key="section.id"
              class="nav-link"
              :class="{ active: currentSectionId === section.id }"
              @click="handleSectionClick(section.id)"
            >
              {{ section.title }}
            </a>
          </div>
        </nav>
      </aside>

      <!-- Mobile Drawer Navigation -->
      <el-drawer
        v-model="drawerVisible"
        direction="ltr"
        :with-header="false"
        :size="280"
        class="docs-drawer"
      >
        <div class="drawer-header">
          <span class="drawer-title">文档导航</span>
          <el-button :icon="Close" text @click="drawerVisible = false" />
        </div>
        <div class="sidebar-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文档..."
            :prefix-icon="Search"
            clearable
            size="default"
          />
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section" v-for="group in groupedSections" :key="group.category">
            <div class="nav-section-title">{{ group.category }}</div>
            <a
              v-for="section in group.sections"
              :key="section.id"
              class="nav-link"
              :class="{ active: currentSectionId === section.id }"
              @click="handleMobileSectionClick(section.id)"
            >
              {{ section.title }}
            </a>
          </div>
        </nav>
      </el-drawer>

      <!-- Main Content -->
      <main class="docs-main">
        <!-- Mobile Breadcrumb -->
        <div class="mobile-breadcrumb" v-if="isMobile">
          <el-button :icon="Menu" text @click="drawerVisible = true">
            {{ currentSection?.title || '文档' }}
          </el-button>
        </div>

        <!-- Content Card -->
        <article class="docs-content">
          <el-skeleton v-if="loading" :rows="10" animated />
          <div v-else-if="currentContent" class="markdown-content">
            <MarkdownRenderer :content="currentContent" />
          </div>
          <el-empty v-else description="无法加载文档内容" />
        </article>

        <!-- Page Navigation (Footer) -->
        <div class="docs-navigation" v-if="!loading && currentContent">
          <a v-if="prevSection" class="nav-link prev" @click="handleSectionClick(prevSection.id)">
            <span class="nav-label">← 上一页</span>
            <span class="nav-title">{{ prevSection.title }}</span>
          </a>
          <a v-if="nextSection" class="nav-link next" @click="handleSectionClick(nextSection.id)">
            <span class="nav-label">下一页 →</span>
            <span class="nav-title">{{ nextSection.title }}</span>
          </a>
        </div>
      </main>
    </div>

    <!-- Search Dialog -->
    <el-dialog v-model="showSearchDialog" title="搜索文档" width="500px" :fullscreen="isMobile">
      <el-input
        v-model="searchKeyword"
        placeholder="输入关键词搜索..."
        :prefix-icon="Search"
        size="large"
        autofocus
        clearable
        @input="handleSearchInput"
      />
      <div class="search-results" v-if="searchResults.length > 0">
        <a
          v-for="result in searchResults"
          :key="result.id"
          class="search-result-item"
          @click="handleSearchResultClick(result.id)"
        >
          <Document class="result-icon" />
          <div class="result-content">
            <div class="result-title">{{ result.title }}</div>
            <div class="result-category">{{ result.category }}</div>
          </div>
        </a>
      </div>
      <el-empty
        v-else-if="searchKeyword && searchResults.length === 0"
        description="未找到相关文档"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, Document, Menu, Close } from '@element-plus/icons-vue'
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
const showSearchDialog = ref(false)

// Computed
const currentSection = computed(() => {
  return apiDocsConfig.sections.find(s => s.id === currentSectionId.value)
})

const currentIndex = computed(() => {
  return apiDocsConfig.sections.findIndex(s => s.id === currentSectionId.value)
})

const prevSection = computed(() => {
  if (currentIndex.value > 0) {
    return apiDocsConfig.sections[currentIndex.value - 1]
  }
  return null
})

const nextSection = computed(() => {
  if (currentIndex.value < apiDocsConfig.sections.length - 1) {
    return apiDocsConfig.sections[currentIndex.value + 1]
  }
  return null
})

// Group sections by category (similar to Vue docs)
const groupedSections = computed(() => {
  const groups: Record<string, ApiDocSection[]> = {}
  apiDocsConfig.sections.forEach(section => {
    const category = section.category || '其他'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(section)
  })
  return Object.entries(groups).map(([category, sections]) => ({ category, sections }))
})

const filteredSections = computed(() => {
  if (!searchKeyword.value) {
    return apiDocsConfig.sections
  }
  const keyword = searchKeyword.value.toLowerCase()
  return apiDocsConfig.sections.filter(s => s.title.toLowerCase().includes(keyword))
})

// Search results with category
const searchResults = computed(() => {
  if (!searchKeyword.value) {
    return []
  }
  const keyword = searchKeyword.value.toLowerCase()
  return apiDocsConfig.sections
    .filter(s => s.title.toLowerCase().includes(keyword))
    .map(s => ({
      ...s,
      category: s.category || '其他'
    }))
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

const toggleMobileDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}

const handleSearchInput = () => {
  // Search results are computed, just trigger reactivity
}

const handleSearchResultClick = (sectionId: string) => {
  handleSectionClick(sectionId)
  showSearchDialog.value = false
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
  min-height: 100vh;
  background: #fff;
}

// Top Banner - Similar to Vue.js docs
.docs-banner {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .banner-content {
    .docs-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .docs-subtitle {
      font-size: 13px;
      color: #666;
      margin: 4px 0 0 0;
    }
  }

  .banner-actions {
    display: flex;
    gap: 8px;

    .menu-toggle {
      display: none;
    }
  }
}

// Main Layout
.docs-layout {
  display: flex;
  max-width: 1440px;
  margin: 0 auto;
}

// Sidebar Navigation (Desktop)
.docs-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 24px 0;
  border-right: 1px solid #e5e5e5;

  .sidebar-search {
    padding: 0 16px 16px;
  }

  .sidebar-nav {
    .nav-section {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .nav-section-title {
        font-size: 12px;
        font-weight: 600;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 0 16px 8px;
      }

      .nav-link {
        display: block;
        padding: 8px 16px;
        font-size: 14px;
        color: #333;
        text-decoration: none;
        border-left: 3px solid transparent;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          color: #42b983;
          background: #f5f5f5;
        }

        &.active {
          color: #42b983;
          border-left-color: #42b983;
          background: #f0f9f4;
          font-weight: 500;
        }
      }
    }
  }
}

// Main Content Area
.docs-main {
  flex: 1;
  min-width: 0;
  padding: 32px 48px;
  max-width: 900px;

  .mobile-breadcrumb {
    display: none;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e5e5;

    :deep(.el-button) {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .docs-content {
    margin-bottom: 48px;

    .markdown-content {
      line-height: 1.7;

      :deep(h1) {
        font-size: 2rem;
        font-weight: 700;
        margin: 2rem 0 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e5e5e5;
      }

      :deep(h2) {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 1.75rem 0 0.75rem;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid #f0f0f0;
      }

      :deep(h3) {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 1.5rem 0 0.5rem;
      }

      :deep(p) {
        margin: 1rem 0;
      }

      :deep(code) {
        background: #f5f5f5;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.9em;
      }

      :deep(pre) {
        background: #282c34;
        color: #abb2bf;
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 1rem 0;

        code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
      }

      :deep(ul),
      :deep(ol) {
        padding-left: 1.5rem;
        margin: 1rem 0;
      }

      :deep(li) {
        margin: 0.5rem 0;
      }

      :deep(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;

        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e5e5;
        }

        th {
          background: #f5f5f5;
          font-weight: 600;
        }
      }

      :deep(a) {
        color: #42b983;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  // Page Navigation (Footer)
  .docs-navigation {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid #e5e5e5;

    .nav-link {
      flex: 1;
      padding: 16px;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #42b983;
        background: #f0f9f4;
      }

      &.prev {
        text-align: left;
      }

      &.next {
        text-align: right;
      }

      .nav-label {
        display: block;
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
      }

      .nav-title {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
    }
  }
}

// Drawer Styles
:deep(.docs-drawer) {
  .el-drawer__body {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;

    .drawer-title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .sidebar-search {
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
  }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    background: #f5f5f5;

    .nav-section {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .nav-section-title {
        font-size: 12px;
        font-weight: 600;
        color: #999;
        text-transform: uppercase;
        padding: 12px 16px 8px;
      }

      .nav-link {
        display: block;
        padding: 10px 16px;
        font-size: 14px;
        color: #333;
        border-left: 3px solid transparent;
        cursor: pointer;

        &:hover {
          background: #fff;
        }

        &.active {
          color: #42b983;
          border-left-color: #42b983;
          background: #fff;
          font-weight: 500;
        }
      }
    }
  }
}

// Search Results
.search-results {
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;

  .search-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f5f5f5;
    }

    .result-icon {
      font-size: 18px;
      color: #42b983;
    }

    .result-content {
      flex: 1;

      .result-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .result-category {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// Mobile Responsive
@media (max-width: 768px) {
  .docs-banner {
    padding: 12px 16px;

    .banner-content {
      .docs-title {
        font-size: 16px;
      }

      .docs-subtitle {
        display: none;
      }
    }

    .banner-actions {
      .menu-toggle {
        display: inline-flex;
      }
    }
  }

  .docs-sidebar {
    display: none;
  }

  .docs-main {
    padding: 20px 16px;

    .mobile-breadcrumb {
      display: block;
    }

    .docs-content {
      .markdown-content {
        :deep(h1) {
          font-size: 1.5rem;
        }

        :deep(h2) {
          font-size: 1.25rem;
        }

        :deep(h3) {
          font-size: 1.1rem;
        }

        :deep(pre) {
          padding: 12px;
          font-size: 14px;
        }

        :deep(table) {
          font-size: 14px;

          th,
          td {
            padding: 8px 4px;
          }
        }
      }
    }

    .docs-navigation {
      flex-direction: column;

      .nav-link {
        .nav-label {
          font-size: 11px;
        }

        .nav-title {
          font-size: 13px;
        }
      }
    }
  }

  :deep(.el-dialog) {
    &.is-fullscreen {
      .el-dialog__body {
        padding: 16px;
      }
    }
  }
}
</style>
