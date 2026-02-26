import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
  function createSession() {
    const newSession: ChatSession = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    sessions.value.unshift(newSession)
    currentSessionId.value = newSession.id
    saveToStorage()
    return newSession
  }

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

  function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
  }

  function deleteSession(sessionId: string) {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = sessions.value[0]?.id || null
      }
      saveToStorage()
    }
  }

  function updateSessionTitle(sessionId: string, title: string) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.title = title
      session.updatedAt = Date.now()
      saveToStorage()
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions.value))
    if (currentSessionId.value) {
      localStorage.setItem(STORAGE_KEY_CURRENT, currentSessionId.value)
    }
  }

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
