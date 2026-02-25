<template>
  <div class="empty-state">
    <div class="ai-title">AI 助手</div>
    <div class="ai-subtitle">公共卫生平台管理系统</div>

    <div class="quick-actions">
      <div
        class="action-item"
        v-for="action in quickActions"
        :key="action.label"
        @click="$emit('action', action.prompt)"
      >
        <el-icon :size="24">
          <component :is="getIcon(action.icon)" />
        </el-icon>
        <span>{{ action.label }}</span>
      </div>
    </div>

    <div class="example-section">
      <div class="section-title">💡 我能帮您做什么？</div>
      <div class="example-list">
        <div
          class="example-item"
          v-for="(example, index) in examples"
          :key="index"
          @click="$emit('action', example)"
        >
          {{ example }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Plus, Edit, Location } from '@element-plus/icons-vue'
import type { QuickAction } from '@/types/ai'

const props = defineProps<{
  quickActions: QuickAction[]
}>()

defineEmits<{
  action: [prompt: string]
}>()

const examples = ['显示待审核的报告卡', '新增用户张三', '打开用户管理页面', '有多少个用户']

function getIcon(name: string) {
  const icons = { Search, Plus, Edit, Location }
  return icons[name as keyof typeof icons] || Search
}
</script>

<style scoped lang="less">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.ai-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
}

.ai-subtitle {
  font-size: 14px;
  color: #909399;
  margin-bottom: 40px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
  margin-bottom: 40px;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #e6f0ff;
      transform: translateY(-2px);
    }
  }
}

.example-section {
  width: 100%;
  text-align: left;
}

.section-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .example-item {
    padding: 12px 16px;
    background: #f5f7fa;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #e6f0ff;
    }
  }
}
</style>
