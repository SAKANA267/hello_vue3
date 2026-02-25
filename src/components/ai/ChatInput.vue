<template>
  <div class="chat-input-container">
    <el-input
      v-model="inputValue"
      type="textarea"
      :rows="1"
      :autosize="{ minRows: 1, maxRows: 4 }"
      placeholder="请输入您的问题..."
      :disabled="disabled"
      @keydown.enter.exact="handleSend"
      @keydown.enter.shift.exact.prevent
    />
    <div class="input-actions">
      <span class="input-hint">已发送 {{ count }} 条消息</span>
      <el-button type="primary" :disabled="!canSend" @click="handleSend">
        发送
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: [text: string]
}>()

const inputValue = ref(props.modelValue)
const count = ref(0)

watch(
  () => props.modelValue,
  val => {
    inputValue.value = val
  }
)

watch(inputValue, val => {
  emit('update:modelValue', val)
})

const canSend = computed(() => {
  return inputValue.value.trim().length > 0 && !props.disabled
})

function handleSend(event?: KeyboardEvent) {
  if (!canSend.value) return

  // Shift+Enter 换行，Enter 发送
  if (event?.shiftKey) return

  const text = inputValue.value.trim()
  if (text) {
    emit('send', text)
    inputValue.value = ''
    count.value++
  }
}
</script>

<style scoped lang="less">
.chat-input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.el-textarea__inner) {
  border-radius: 12px;
  resize: none;
  padding: 12px 16px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-hint {
  font-size: 12px;
  color: #909399;
}
</style>
