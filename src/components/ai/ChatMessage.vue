<template>
  <div class="chat-message" :class="message.role">
    <div class="message-avatar">
      <img v-if="message.role === 'assistant'" :src="aiAvatar" />
      <span v-else class="user-avatar-icon">{{ userInitial }}</span>
    </div>
    <div class="message-content">
      <div class="message-text" v-if="message.type === 'text' || message.type === 'error'">
        <span v-if="message.role === 'user'">{{ message.content }}</span>
        <div v-else v-html="renderedContent" class="markdown-body"></div>
      </div>
      <!-- 删除确认对话框 -->
      <DeleteConfirmDialog
        v-if="message.type === 'delete-confirm' && message.confirmData"
        :object-info="message.confirmData.objectInfo"
        @confirm="message.confirmData.onConfirm"
        @cancel="message.confirmData.onCancel"
      />
      <!-- 请求数据卡片 -->
      <RequestDataCard
        v-if="message.type === 'request-data' && message.requestData"
        :title="message.requestData.title"
        :description="message.requestData.description"
        :data="message.requestData.data"
        :columns="message.requestData.columns"
        :page-size="message.requestData.pageSize"
        :show-actions="message.requestData.showActions"
        :action-text="message.requestData.actionText"
        @action="message.requestData.onAction"
      />
      <!-- 创建表单对话框 -->
      <CreateFormDialog
        v-if="message.type === 'create-form' && message.createFormData"
        :create-form-data="message.createFormData"
        @success="handleCreateSuccess"
        @cancel="handleCreateCancel"
        @error="handleCreateError"
      />
      <div class="message-time">{{ formatTime(message.timestamp) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import type { ChatMessage } from '@/types/ai'
import DeleteConfirmDialog from './DeleteConfirmDialog.vue'
import RequestDataCard from './RequestDataCard.vue'
import CreateFormDialog from './CreateFormDialog.vue'

// 配置 marked 的渲染器
const renderer = new marked.Renderer()
// 自定义代码块渲染
renderer.code = function (code: { text: string; lang?: string; escaped?: boolean }) {
  const { text, lang } = code
  const validLang = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = hljs.highlight(text, { language: validLang }).value
  return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`
}

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
})

const props = defineProps<{
  message: ChatMessage
}>()

const emit = defineEmits<{
  createSuccess: [data: any]
  createCancel: []
  createError: [message: string]
}>()

// 渲染 Markdown 内容（仅对 AI 消息）
const renderedContent = computed(() => {
  if (props.message.role === 'assistant') {
    return marked(props.message.content || '')
  }
  return props.message.content
})

const aiAvatar = computed(() => new URL('../../assets/images/user.svg', import.meta.url).href)

const userInitial = computed(() => 'A')

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function handleCreateSuccess(data: any) {
  emit('createSuccess', data)
}

function handleCreateCancel() {
  emit('createCancel')
}

function handleCreateError(message: string) {
  emit('createError', message)
}
</script>

<style scoped lang="less">
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  &.user {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;
    }

    .message-text {
      background: #f4f4f4;
      color: #303133;
    }
  }

  &.assistant {
    .message-content {
      align-items: flex-start;
    }

    .message-text {
      background: #fff;
      color: #303133;
      border: 1px solid #e5e5e5;
    }
  }
}

.message-avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .user-avatar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #409eff;
    color: #fff;
    border-radius: 50%;
    font-size: 16px;
  }
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.message-time {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.message-content {
  :deep(.delete-confirm-dialog),
  :deep(.request-data-card) {
    margin-top: 8px;
    align-self: flex-start;
  }
}

// Markdown 样式
.markdown-body {
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin: 16px 0 8px;
    font-weight: 600;
    line-height: 1.4;
    color: #303133;

    &:first-child {
      margin-top: 0;
    }
  }

  :deep(h1) {
    font-size: 1.5em;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 8px;
  }

  :deep(h2) {
    font-size: 1.3em;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 6px;
  }

  :deep(h3) {
    font-size: 1.15em;
  }

  :deep(p) {
    margin: 8px 0;
    line-height: 1.7;
  }

  :deep(code) {
    background: #f5f7fa;
    color: #e74c3c;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: #282c34;
    color: #abb2bf;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;

    code {
      background: transparent;
      color: inherit;
      padding: 0;
      border-radius: 0;
    }
  }

  :deep(ul),
  :deep(ol) {
    margin: 8px 0;
    padding-left: 24px;
    line-height: 1.7;

    li {
      margin: 4px 0;
    }
  }

  :deep(ul) {
    list-style-type: disc;
  }

  :deep(ol) {
    list-style-type: decimal;
  }

  :deep(blockquote) {
    margin: 12px 0;
    padding: 8px 16px;
    border-left: 4px solid #409eff;
    background: #f0f9ff;
    color: #606266;

    p {
      margin: 0;
    }
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 13px;

    th,
    td {
      border: 1px solid #e5e5e5;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background: #f5f7fa;
      font-weight: 600;
      color: #303133;
    }

    tr:nth-child(even) {
      background: #fafafa;
    }

    tr:hover {
      background: #f0f9ff;
    }
  }

  :deep(a) {
    color: #409eff;
    text-decoration: none;
    border-bottom: 1px dashed #409eff;

    &:hover {
      color: #66b1ff;
      border-bottom-style: solid;
    }
  }

  :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 8px 0;
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 16px 0;
  }

  :deep(strong) {
    font-weight: 600;
    color: #303133;
  }

  :deep(em) {
    font-style: italic;
    color: #606266;
  }
}

// 代码高亮主题（One Dark）
:deep(pre code.hljs) {
  .hljs-comment,
  .hljs-quote {
    color: #5c6370;
    font-style: italic;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: #c678dd;
  }

  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: #e06c75;
  }

  .hljs-literal,
  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta-string {
    color: #98c379;
  }

  .hljs-built_in,
  .hljs-class .hljs-title {
    color: #e6c07b;
  }

  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo {
    color: #d19a66;
  }

  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-symbol,
  .hljs-title {
    color: #61aeee;
  }

  .hljs-number,
  .hljs-emphasis {
    color: #d19a66;
  }

  .hljs-strong,
  .hljs-param {
    color: #d19a66;
  }

  .hljs-params {
    color: #c678dd;
  }

  .hljs-property {
    color: #61aeee;
  }
}
</style>
