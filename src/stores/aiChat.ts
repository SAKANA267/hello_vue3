import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { aiApi } from '@/api/ai'
import type { ChatMessage, ChatSession } from '@/types/ai'

const STORAGE_KEY_SESSIONS = 'ai_chat_sessions'
const STORAGE_KEY_CURRENT = 'ai_chat_current'

export const useAiChatStore = defineStore('aiChat', () => {
  // State
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isLoading = ref(false)

  // Computed
  const currentSession = computed(() => sessions.value.find(s => s.id === currentSessionId.value))
  const messages = computed(() => currentSession.value?.messages || [])

  // Actions

  /**
   * 创建新会话（调用后端API）
   */
  async function createSession(title = '新对话') {
    try {
      const response = await aiApi.createSession({ title })
      const sessionId = response.sessionId

      const newSession: ChatSession = {
        id: sessionId,
        title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      sessions.value.unshift(newSession)
      currentSessionId.value = sessionId
      saveToStorage()

      return newSession
    } catch (error) {
      console.error('Failed to create session:', error)
      // 降级：创建本地会话
      return createLocalSession(title)
    }
  }

  /**
   * 降级方案：创建本地会话（当后端不可用时）
   */
  function createLocalSession(title = '新对话') {
    const newSession: ChatSession = {
      id: generateId(),
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    sessions.value.unshift(newSession)
    currentSessionId.value = newSession.id
    saveToStorage()
    return newSession
  }

  /**
   * 使用后端返回的 sessionId 创建本地会话
   * @param sessionId 后端返回的会话ID
   * @param title 会话标题
   */
  function createSessionWithId(sessionId: string, title = '新对话') {
    // 检查会话是否已存在
    const existing = sessions.value.find(s => s.id === sessionId)
    if (existing) {
      currentSessionId.value = sessionId
      return existing
    }

    // 创建新会话
    const newSession: ChatSession = {
      id: sessionId,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    sessions.value.unshift(newSession)
    currentSessionId.value = sessionId
    saveToStorage()
    return newSession
  }

  /**
   * 添加消息到当前会话
   */
  function addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    if (!currentSessionId.value) {
      createSession()
    }

    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (session) {
      const newMessage: ChatMessage = {
        ...message,
        id: generateId(),
        timestamp: Date.now()
      }
      session.messages.push(newMessage)
      session.updatedAt = Date.now()

      // 更新会话标题（使用第一条用户消息）
      if (message.role === 'user' && session.messages.length === 1) {
        session.title = message.content.slice(0, 20)
      }

      saveToStorage()
    }
  }

  /**
   * 切换会话
   */
  function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
  }

  /**
   * 删除会话
   */
  async function deleteSession(sessionId: string) {
    try {
      // 调用后端删除
      await aiApi.deleteSession(sessionId)
    } catch (error) {
      console.error('Failed to delete session on server:', error)
    }

    // 从本地状态中删除
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = sessions.value[0]?.id || null
      }
      saveToStorage()
    }
  }

  /**
   * 更新会话标题
   */
  function updateSessionTitle(sessionId: string, title: string) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.title = title
      session.updatedAt = Date.now()
      saveToStorage()
    }
  }

  /**
   * 从本地存储加载会话
   */
  function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY_SESSIONS)
    if (stored) {
      try {
        sessions.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored sessions:', e)
        sessions.value = []
      }
    }
    currentSessionId.value = localStorage.getItem(STORAGE_KEY_CURRENT) || null
  }

  /**
   * 保存到本地存储
   */
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions.value))
    if (currentSessionId.value) {
      localStorage.setItem(STORAGE_KEY_CURRENT, currentSessionId.value)
    }
  }

  /**
   * 清除所有会话
   */
  function clearAll() {
    sessions.value = []
    currentSessionId.value = null
    localStorage.removeItem(STORAGE_KEY_SESSIONS)
    localStorage.removeItem(STORAGE_KEY_CURRENT)
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    messages,
    isLoading,
    createSession,
    createSessionWithId,
    addMessage,
    switchSession,
    deleteSession,
    updateSessionTitle,
    saveToStorage,
    loadFromStorage,
    clearAll
  }
})

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
