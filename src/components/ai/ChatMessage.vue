<template>
  <div class="chat-message" :class="message.role">
    <div class="message-avatar">
      <img v-if="message.role === 'assistant'" :src="aiAvatar" />
      <span v-else class="user-avatar-icon">{{ userInitial }}</span>
    </div>
    <div class="message-content">
      <div class="message-text">{{ message.content }}</div>
      <div class="message-time">{{ formatTime(message.timestamp) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessage } from '@/types/ai'

const props = defineProps<{
  message: ChatMessage
}>()

const aiAvatar = computed(() => new URL('../../assets/images/user.svg', import.meta.url).href)

const userInitial = computed(() => 'A')

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
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
</style>
