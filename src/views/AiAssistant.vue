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
import { ref, computed, onMounted, nextTick } from 'vue'
import { Document, More } from '@element-plus/icons-vue'
import { useAiChatStore } from '@/stores/aiChat'
import ChatSidebar from '@/components/ai/ChatSidebar.vue'
import ChatMessage from '@/components/ai/ChatMessage.vue'
import ChatInput from '@/components/ai/ChatInput.vue'
import EmptyState from '@/components/ai/EmptyState.vue'
import TypingIndicator from '@/components/ai/TypingIndicator.vue'
import { QUICK_ACTIONS } from '@/constants/intents'

const store = useAiChatStore()
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

  // TODO: 调用 AI 服务处理
  // 这里先模拟响应
  store.isLoading = true
  setTimeout(() => {
    store.addMessage({
      role: 'assistant',
      content: `收到您的消息: ${text}`,
      type: 'text'
    })
    store.isLoading = false
    scrollToBottom()
  }, 1000)
}

function handleSave() {
  // 保存会话逻辑
  console.log('保存会话')
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
