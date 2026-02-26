<template>
  <div class="ai-assistant-container">
    <!-- 左侧边栏 -->
    <ChatSidebar
      v-model:session-id="currentSessionId"
      :sessions="sessions"
      @new-session="handleNewSession"
      @switch-session="handleSwitchSession"
      @delete-session="handleDeleteSession"
      @update-title="handleUpdateTitle"
    />

    <!-- 右侧聊天区域 -->
    <div class="chat-main">
      <!-- 操作栏 -->
      <div class="chat-header">
        <span class="session-title">{{ currentSession?.title || 'AI 助手' }}</span>
        <div class="header-actions">
          <el-button text @click="handleSave">
            <el-icon><Document /></el-icon>
            保存
          </el-button>
          <el-button text @click="handleMore">
            <el-icon><More /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 消息区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <EmptyState
          v-if="messages.length === 0"
          :quick-actions="QUICK_ACTIONS"
          @action="handleQuickAction"
        />
        <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
        <TypingIndicator v-if="isLoading" />
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <ChatInput
          v-model="inputText"
          :disabled="isLoading"
          @send="handleSend"
          @stop="handleStop"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, getCurrentInstance } from 'vue'
import { Document, More } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAiChatStore } from '@/stores/aiChat'
import ChatSidebar from '@/components/ai/ChatSidebar.vue'
import ChatMessage from '@/components/ai/ChatMessage.vue'
import ChatInput from '@/components/ai/ChatInput.vue'
import EmptyState from '@/components/ai/EmptyState.vue'
import TypingIndicator from '@/components/ai/TypingIndicator.vue'
import { QUICK_ACTIONS } from '@/constants/intents'
import { createAiService } from '@/services/aiService'
import type { AiResponse } from '@/types/ai'

const { proxy } = getCurrentInstance() as any
const router = useRouter()
const store = useAiChatStore()

// 创建 AI 服务实例
const aiService = createAiService(router)
const sessions = computed(() => store.sessions)
const currentSessionId = computed(() => store.currentSessionId)
const currentSession = computed(() => store.currentSession)
const messages = computed(() => store.messages)
const isLoading = computed(() => store.isLoading)

const inputText = ref('')
const messagesContainer = ref<HTMLElement>()

onMounted(() => {
  store.loadFromStorage()
  if (!currentSessionId.value) {
    store.createSession()
  }
})

function handleNewSession() {
  store.createSession()
}

function handleSwitchSession(id: string) {
  store.switchSession(id)
}

function handleDeleteSession(id: string) {
  store.deleteSession(id)
}

function handleUpdateTitle(id: string, title: string) {
  store.updateSessionTitle(id, title)
}

function handleQuickAction(prompt: string) {
  inputText.value = prompt
  handleSend(prompt)
}

async function handleSend(text: string) {
  if (!text.trim()) return

  // 添加用户消息
  store.addMessage({
    role: 'user',
    content: text,
    type: 'text'
  })

  inputText.value = ''
  await scrollToBottom()

  // 调用 AI 服务处理
  store.isLoading = true
  try {
    const response: AiResponse = await aiService.processMessage(text)

    // 执行响应中的操作（如导航等）
    if (response.action) {
      await executeAction(response.action)
    }

    // 添加 AI 响应消息
    store.addMessage({
      role: 'assistant',
      content: response.message,
      type: 'text'
    })

    await scrollToBottom()
  } catch (error) {
    console.error('AI processing error:', error)
    store.addMessage({
      role: 'assistant',
      content: '抱歉，处理您的请求时出错，请稍后重试。',
      type: 'error'
    })
  } finally {
    store.isLoading = false
  }
}

/**
 * 执行 AI 响应中的操作
 */
async function executeAction(action: NonNullable<AiResponse['action']>) {
  switch (action.type) {
    case 'navigate':
      if (action.payload.route) {
        router.push(action.payload.route)
      }
      break
    case 'api':
      // API 操作可以通过事件总线或其他方式触发
      console.log('API action:', action.payload)
      break
    case 'callback':
      // 回调操作
      console.log('Callback action:', action.payload)
      break
  }
}

function handleSave() {
  // 会话已自动保存到 localStorage
  // 这里可以添加额外的保存逻辑，如保存到服务器
  store.saveToStorage()
  proxy.$message.success('会话已保存')
}

function handleStop() {
  store.isLoading = false
}

function handleMore() {
  // 更多选项逻辑
  console.log('更多选项')
}

function scrollToBottom() {
  nextTick(() => {
    messagesContainer.value?.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  })
}
</script>

<style scoped lang="less">
.ai-assistant-container {
  display: flex;
  height: 100%;
  background: #f5f5f5;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5e5;

  .session-title {
    font-size: 16px;
    font-weight: 500;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.chat-input {
  padding: 16px 24px;
  border-top: 1px solid #e5e5e5;
}
</style>
