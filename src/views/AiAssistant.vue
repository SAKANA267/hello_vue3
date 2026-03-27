<template>
  <div class="ai-assistant-container">
    <!-- 移动端侧边栏抽屉 -->
    <el-drawer
      v-model="sidebarVisible"
      :size="280"
      direction="ltr"
      :with-header="false"
      class="sidebar-drawer"
    >
      <ChatSidebar
        v-model:session-id="currentSessionId"
        :sessions="sessions"
        :is-in-drawer="true"
        @new-session="handleNewSession"
        @switch-session="handleSwitchSession"
        @delete-session="handleDeleteSession"
        @update-title="handleUpdateTitle"
        @close-mobile-sidebar="closeSidebar"
      />
    </el-drawer>

    <!-- 桌面端侧边栏 -->
    <div v-if="!isMobile" class="sidebar-desktop">
      <ChatSidebar
        v-model:session-id="currentSessionId"
        :sessions="sessions"
        @new-session="handleNewSession"
        @switch-session="handleSwitchSession"
        @delete-session="handleDeleteSession"
        @update-title="handleUpdateTitle"
      />
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-main">
      <!-- 操作栏 -->
      <div class="chat-header">
        <div class="header-left">
          <el-button v-if="isMobile" class="menu-toggle" text @click="toggleSidebar">
            <el-icon><Menu /></el-icon>
          </el-button>
          <span class="session-title">{{ currentSession?.title || 'AI 助手' }}</span>
        </div>
        <div class="header-actions">
          <el-button text @click="handleSave">
            <el-icon><Document /></el-icon>
            <span v-if="!isMobile">保存</span>
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
import { ref, computed, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue'
import { Document, More, Menu } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAiChatStore } from '@/stores/aiChat'
import ChatSidebar from '@/components/ai/ChatSidebar.vue'
import ChatMessage from '@/components/ai/ChatMessage.vue'
import ChatInput from '@/components/ai/ChatInput.vue'
import EmptyState from '@/components/ai/EmptyState.vue'
import TypingIndicator from '@/components/ai/TypingIndicator.vue'
import { QUICK_ACTIONS } from '@/constants/intents'
import { createAiService } from '@/services/aiService'
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

// 响应式状态
const isMobile = ref(window.innerWidth <= 768)
const sidebarVisible = ref(false)

// 处理窗口大小变化
function handleResize() {
  isMobile.value = window.innerWidth <= 768
  // 桌面端关闭抽屉
  if (!isMobile.value) {
    sidebarVisible.value = false
  }
}

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value
}

function closeSidebar() {
  sidebarVisible.value = false
}

onMounted(async () => {
  // Fetch sessions from backend (per-user)
  await store.fetchSessionList()

  // Restore last active session or first session
  if (!currentSessionId.value && sessions.value.length > 0) {
    store.switchSession(sessions.value[0].id)
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理窗口大小变化监听
  window.removeEventListener('resize', handleResize)
})

async function handleNewSession() {
  await store.createSession()
}

async function handleSwitchSession(id: string) {
  await store.switchSession(id)
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

    // 处理 action
    if (response.action) {
      const { type, payload } = response.action

      // 类型守卫：检查是否为 API action
      // 注意：后端返回的 payload 结构可能是 { data: { api, method } }
      const payloadData = payload.data || payload
      const isApiAction = type === 'API' && 'api' in payloadData && 'method' in payloadData

      if (isApiAction) {
        const { api, method } = payloadData

        // DELETE 操作：智能查询对象详情，再显示确认对话框
        if (method === 'DELETE') {
          // 先显示 AI 消息
          store.addMessage({
            role: 'assistant',
            content: response.message,
            type: 'text'
          })

          // 定义删除执行的回调函数（复用）
          const executeDelete = async () => {
            const result = await aiService.executeAction(response.action!)
            if (result.success) {
              store.addMessage({
                role: 'assistant',
                content: '删除成功',
                type: 'text'
              })
            } else {
              store.addMessage({
                role: 'assistant',
                content: `删除失败：${result.error}`,
                type: 'error'
              })
            }
          }

          const cancelDelete = () => {
            store.addMessage({
              role: 'assistant',
              content: '已取消删除操作',
              type: 'text'
            })
          }

          try {
            let objectInfo: any = { api, method }

            // 判断 URL 格式并智能处理
            if (api.includes('?')) {
              // 带查询参数：如 /users?name=张三 或 /report-cards?name=肺炎
              const [resourcePath, queryString] = api.split('?')
              const params = new URLSearchParams(queryString)

              // 构造搜索 API 请求
              // 检测资源类型并使用对应的搜索接口
              let searchApi = resourcePath + '/search'
              // 特殊处理：如果是 report-cards，可能需要不同的搜索端点
              if (resourcePath.includes('report-cards')) {
                searchApi = resourcePath + '/search'
              }

              const searchAction = {
                type: 'API',
                payload: {
                  data: {
                    api: searchApi,
                    method: 'GET',
                    params: Object.fromEntries(params)
                  }
                }
              }

              const searchResult = await aiService.executeAction(searchAction)

              if (searchResult.success && searchResult.data) {
                // 提取搜索结果
                let items = searchResult.data
                if (items?.records) items = items.records
                else if (items?.list) items = items.list
                else if (items?.data) items = items.data

                if (Array.isArray(items) && items.length > 0) {
                  // 使用搜索结果的第一项
                  objectInfo = { api, method, ...items[0] }
                } else if (!Array.isArray(items)) {
                  // 单个对象
                  objectInfo = { api, method, ...items }
                }
              }
            } else if (api.match(/\/(users|report-cards)\/[^/]+$/)) {
              // 资源标识符路径：如 /users/1, /users/admin, /report-cards/123
              // 先尝试直接 GET，如果失败再用搜索接口兜底
              const identifier = api.split('/').pop()!
              const resourcePath = api.substring(0, api.lastIndexOf('/'))

              // 尝试1: 直接 GET 请求
              const getAction = {
                type: 'API',
                payload: { data: { api, method: 'GET' } }
              }

              const getResult = await aiService.executeAction(getAction)

              if (getResult.success && getResult.data) {
                let objectData = getResult.data
                if (objectData?.records) objectData = objectData.records
                else if (objectData?.list) objectData = objectData.list
                else if (objectData?.data) objectData = objectData.data

                const item = Array.isArray(objectData) ? objectData[0] : objectData
                if (item) {
                  objectInfo = { api, method, ...item }
                }
              } else {
                // 尝试2: 使用搜索接口兜底（可能是用户名而非 ID）
                const searchAction = {
                  type: 'API',
                  payload: {
                    data: {
                      api: `${resourcePath}/search`,
                      method: 'GET',
                      params: { keyword: identifier }
                    }
                  }
                }

                const searchResult = await aiService.executeAction(searchAction)

                if (searchResult.success && searchResult.data) {
                  let items = searchResult.data
                  if (items?.records) items = items.records
                  else if (items?.list) items = items.list
                  else if (items?.data) items = items.data

                  if (Array.isArray(items) && items.length > 0) {
                    objectInfo = { api, method, ...items[0] }
                  } else if (!Array.isArray(items)) {
                    objectInfo = { api, method, ...items }
                  }
                }
              }
            } else if (api.match(/\/(users|report-cards)\/\w+\/[\w%]+$/)) {
              // 用户名/名称路径：如 /users/username/张三 或 /report-cards/name/肺炎
              // 尝试提取查询条件并用搜索接口
              const matches = api.match(/\/(users|report-cards)\/(\w+)\/([^/]+)$/)
              if (matches) {
                const [, resource, field, value] = matches
                const searchAction = {
                  type: 'API',
                  payload: {
                    data: {
                      api: `/${resource}/search`,
                      method: 'GET',
                      params: { [field]: decodeURIComponent(value) }
                    }
                  }
                }

                const searchResult = await aiService.executeAction(searchAction)

                if (searchResult.success && searchResult.data) {
                  let items = searchResult.data
                  if (items?.records) items = items.records
                  else if (items?.list) items = items.list
                  else if (items?.data) items = items.data

                  if (Array.isArray(items) && items.length > 0) {
                    objectInfo = { api, method, ...items[0] }
                  } else if (!Array.isArray(items)) {
                    objectInfo = { api, method, ...items }
                  }
                }
              }
            }

            // 显示删除确认对话框
            store.addMessage({
              role: 'assistant',
              content: '确认删除',
              type: 'delete-confirm',
              confirmData: {
                objectInfo,
                onConfirm: executeDelete,
                onCancel: cancelDelete
              }
            })
          } catch (error) {
            // 任何错误，显示简化版确认框
            console.error('[DELETE] 获取对象详情失败:', error)
            store.addMessage({
              role: 'assistant',
              content: '确认删除',
              type: 'delete-confirm',
              confirmData: {
                objectInfo: { api, method },
                onConfirm: executeDelete,
                onCancel: cancelDelete
              }
            })
          }
        }
        // GET 操作：查询数据并展示表格
        else if (method === 'GET') {
          await handleQueryAction(response.action, response.message)
        }
        // POST/PUT/PATCH 操作：直接执行
        else {
          store.addMessage({
            role: 'assistant',
            content: response.message,
            type: 'text'
          })
          await aiService.executeAction(response.action)
        }
      }
      // NAVIGATE 操作
      else if (type === 'NAVIGATE') {
        store.addMessage({
          role: 'assistant',
          content: response.message,
          type: 'text'
        })
        await aiService.executeAction(response.action)
      }
      // CALLBACK 或其他操作
      else {
        store.addMessage({
          role: 'assistant',
          content: response.message,
          type: 'text'
        })
        await aiService.executeAction(response.action)
      }
    } else {
      // 无action，仅显示文本消息
      store.addMessage({
        role: 'assistant',
        content: response.message,
        type: 'text'
      })
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
      store.createSessionWithId(Date.now().toString(36), '新对话')
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

// 处理查询操作（GET请求）
async function handleQueryAction(action: any, aiMessage: string) {
  try {
    // 处理 payload 结构，兼容两种格式
    const payloadData = action.payload.data || action.payload
    const { api } = payloadData

    // 执行 API 请求
    const result = await aiService.executeAction(action)

    if (!result.success) {
      throw new Error(result.error || '查询失败')
    }

    // 解析返回的数据
    const data = result.data

    // 根据不同的 API 路径确定表格配置
    let title = '查询结果'
    let columns: TableColumn[] = []

    // 判断数据类型并设置列配置
    if (api.includes('/users')) {
      title = '用户列表'
      columns = [
        { key: 'id', label: 'ID', width: '60' },
        { key: 'username', label: '用户名' },
        { key: 'name', label: '姓名' },
        { key: 'email', label: '邮箱' },
        { key: 'phone', label: '电话' },
        { key: 'role', label: '角色' }
      ]
    } else if (api.includes('/report-cards')) {
      title = '报告卡列表'
      columns = [
        { key: 'id', label: 'ID', width: '60' },
        { key: 'date', label: '日期', width: '110' },
        { key: 'name', label: '姓名', width: '100' },
        { key: 'diseaseName', label: '疾病名称' },
        { key: 'status', label: '状态', width: '80' }
      ]
    }

    // 提取实际数据（处理不同的响应格式）
    let displayData = data
    if (data?.records) displayData = data.records
    else if (data?.list) displayData = data.list
    else if (data?.data) displayData = data.data
    else if (!Array.isArray(data)) displayData = [data]

    // 显示查询结果表格
    store.addMessage({
      role: 'assistant',
      content: aiMessage,
      type: 'request-data',
      requestData: {
        title,
        description: `查询到 ${Array.isArray(displayData) ? displayData.length : 1} 条记录`,
        data: displayData,
        columns,
        pageSize: 5,
        onAction: () => {}
      }
    })
  } catch (error) {
    store.addMessage({
      role: 'assistant',
      content: `查询失败：${error instanceof Error ? error.message : '未知错误'}`,
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
  position: relative;
}

.sidebar-desktop {
  display: block;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5e5;

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .menu-toggle {
    padding: 8px;
    font-size: 20px;
  }

  .session-title {
    font-size: 16px;
    font-weight: 500;
  }

  .header-actions {
    display: flex;
    gap: 8px;
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

// 移动端样式
@media (max-width: 768px) {
  .sidebar-desktop {
    display: none;
  }

  .chat-header {
    padding: 12px 16px;

    .session-title {
      font-size: 15px;
    }
  }

  .chat-messages {
    padding: 16px;
  }

  .chat-input {
    padding: 12px 16px;
  }

  .suggestions-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    :deep(.el-button) {
      font-size: 13px;
      padding: 6px 12px;
      height: auto;
      white-space: normal;
      text-align: left;
    }
  }
}
</style>

<style lang="less">
// 侧边栏抽屉样式（非scoped）
.sidebar-drawer {
  :deep(.el-drawer__body) {
    padding: 0;
    background: #171717;
  }
}
</style>
