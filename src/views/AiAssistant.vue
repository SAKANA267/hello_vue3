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
        <template v-for="message in messages" :key="message.id">
          <ChatMessage :message="message" />
        </template>
        <TypingIndicator v-if="isLoading" />
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <!-- 建议操作按钮 -->
        <div v-if="currentSuggestions.length > 0" class="suggestions-wrapper">
          <el-button
            v-for="(suggestion, index) in currentSuggestions"
            :key="index"
            size="small"
            plain
            @click="handleSuggestionClick(suggestion)"
          >
            {{ suggestion }}
          </el-button>
        </div>
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
import { extractQueryParams } from '@/utils/ai-utils'
import type { AiResponse, TableColumn } from '@/types/ai'

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
const currentSuggestions = computed(() => store.currentSuggestions)

const inputText = ref('')
const messagesContainer = ref<HTMLElement>()

onMounted(async () => {
  // 加载本地存储的会话历史
  store.loadFromStorage()

  // 如果本地有会话，恢复第一个会话
  // 如果没有会话，等用户首次发送消息时再由后端创建
  if (!currentSessionId.value && sessions.value.length > 0) {
    store.switchSession(sessions.value[0].id)
  }
})

async function handleNewSession() {
  await store.createSession()
}

function handleSwitchSession(id: string) {
  store.switchSession(id)
}

async function handleDeleteSession(id: string) {
  await store.deleteSession(id)
}

function handleUpdateTitle(id: string, title: string) {
  store.updateSessionTitle(id, title)
}

function handleQuickAction(prompt: string) {
  inputText.value = prompt
  handleSend(prompt)
}

function handleSuggestionClick(suggestion: string) {
  inputText.value = suggestion
  handleSend(suggestion)
}

async function handleSend(text: string) {
  if (!text.trim()) return

  inputText.value = ''

  // 立即添加用户消息到界面，提升用户体验
  store.addMessage({
    role: 'user',
    content: text,
    type: 'text'
  })

  // 调用 AI 服务处理
  store.isLoading = true
  try {
    // 首次对话：currentSessionId 为空，不传 sessionId
    // 后续对话：使用 currentSessionId
    const response: AiResponse = await aiService.processMessage(
      text,
      currentSessionId.value || undefined
    )

    // 如果后端返回了新的 sessionId（首次对话），创建本地会话
    if (response.sessionId && response.sessionId !== currentSessionId.value) {
      store.createSessionWithId(response.sessionId, text.slice(0, 20))
    }

    // 检查是否为删除操作，需要显示确认对话框
    const isDeleteAction = response.action?.payload?.intent === 'delete'
    // 检查是否为查询操作，需要展示数据表格
    const isQueryAction = response.action?.payload?.intent === 'query' || response.action?.payload?.intent === 'QUERY'

    console.log('[AI Response]', response)
    console.log('[Is Delete Action]', isDeleteAction, response.action?.payload?.intent)
    console.log('[Is Query Action]', isQueryAction, response.action?.payload?.intent)

    if (isDeleteAction && response.action?.payload) {
      // 显示删除确认对话框
      const { id, entity } = response.action.payload

      store.addMessage({
        role: 'assistant',
        content: response.message,
        type: 'delete-confirm',
        confirmData: {
          objectInfo: {
            id,
            entity,
            ...response.action.payload
          },
          onConfirm: async () => {
            await executeDelete(response.action?.payload)
          },
          onCancel: () => {
            store.addMessage({
              role: 'assistant',
              content: '已取消删除操作',
              type: 'text'
            })
          }
        }
      })
    } else if (isQueryAction && response.action?.payload) {
      // 执行查询并展示数据表格
      await executeQuery(response.action.payload, response.message, response.action)
    } else {
      // 普通消息
      store.addMessage({
        role: 'assistant',
        content: response.message,
        type: 'text'
      })

      // 执行响应中的操作（如导航等）
      if (response.action) {
        aiService.executeAction(response.action)
      }
    }

    // 更新建议列表（统一处理）
    if (response.suggestions && response.suggestions.length > 0) {
      store.updateSuggestions(response.suggestions)
    } else {
      store.clearSuggestions()
    }

    await scrollToBottom()
  } catch (error) {
    console.error('AI processing error:', error)

    // 确保有会话才添加错误消息
    if (!currentSessionId.value) {
      store.createSessionWithId(
        Date.now().toString(36),
        '新对话'
      )
    }

    store.addMessage({
      role: 'assistant',
      content: '抱歉，处理您的请求时出错，请稍后重试。',
      type: 'error'
    })

    store.clearSuggestions()

    await scrollToBottom()
  } finally {
    store.isLoading = false
  }
}

// 执行查询操作
async function executeQuery(payload: any, aiMessage: string, action?: any) {
  try {
    const entity = payload.entity
    // 提取查询参数
    const queryParams = extractQueryParams(payload)

    console.log('[Execute Query] Received payload:', payload)
    console.log('[Execute Query] entity:', entity, 'queryParams:', queryParams)

    let queryResult: any = null
    let title = '查询结果'
    let columns: TableColumn[] = []

    // 根据实体类型调用相应的查询 API
    if (entity === 'user') {
      const res = await proxy.$api.getUsers({
        keyword: queryParams.keyword || '',
        page: queryParams.page || 1,
        size: queryParams.size || 10
      })
      queryResult = res.records || []
      title = '用户列表'
      columns = [
        { key: 'id', label: 'ID', width: '60' },
        { key: 'username', label: '用户名' },
        { key: 'name', label: '姓名' },
        { key: 'email', label: '邮箱' },
        { key: 'phone', label: '电话' }
      ]
    } else if (entity === 'reportCard' || entity === 'object') {
      const res = await proxy.$api.getReportCards({
        keyword: queryParams.keyword || '',
        page: queryParams.page || 1,
        size: queryParams.size || 10
      })
      queryResult = res.records || []
      title = '报告卡列表'
      columns = [
        { key: 'id', label: 'ID', width: '60' },
        { key: 'date', label: '日期', width: '110' },
        { key: 'name', label: '姓名', width: '100' },
        { key: 'diseaseName', label: '疾病名称' },
        { key: 'status', label: '状态', width: '80' }
      ]
    } else {
      // 不支持的实体类型，尝试通过 ai-action-handler 执行
      console.log('[Execute Query] Using ai-action-handler for entity:', entity)
      const result = await aiService.executeAction(action)
      if (result.success && result.data) {
        queryResult = result.data.records || result.data.list || result.data.data || result.data
        title = `${entity} 查询结果`
      } else {
        throw new Error(result.error || '查询失败')
      }
    }

    console.log('[Execute Query] Result:', queryResult)

    // 显示查询结果（使用 RequestDataCard）
    store.addMessage({
      role: 'assistant',
      content: aiMessage,
      type: 'request-data',
      requestData: {
        title,
        description: `查询到 ${Array.isArray(queryResult) ? queryResult.length : 0} 条记录`,
        data: queryResult,
        columns,
        pageSize: 5,
        onAction: () => {
          console.log('Query data action clicked')
        }
      }
    })
  } catch (error) {
    console.error('[Execute Query] Error:', error)
    store.addMessage({
      role: 'assistant',
      content: `查询失败：${error instanceof Error ? error.message : '未知错误'}`,
      type: 'error'
    })
  }
}

// 执行删除操作
async function executeDelete(payload: any) {
  try {
    const { id, entity } = payload
    const idStr = String(id)

    // 根据实体类型调用相应的删除 API
    if (entity === 'user') {
      await proxy.$api.deleteUserRestful(idStr)
      store.addMessage({
        role: 'assistant',
        content: `删除成功：用户 #${id}`,
        type: 'text'
      })
    } else if (entity === 'reportCard' || entity === 'object') {
      await proxy.$api.deleteReportCard(idStr)
      store.addMessage({
        role: 'assistant',
        content: `删除成功：报告卡 #${id}`,
        type: 'text'
      })
    } else {
      store.addMessage({
        role: 'assistant',
        content: `暂不支持删除 ${entity} 类型的数据`,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Delete error:', error)
    store.addMessage({
      role: 'assistant',
      content: '删除失败，请稍后重试',
      type: 'error'
    })
  }
}

function handleSave() {
  // 会话已自动保存到 localStorage
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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestions-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
