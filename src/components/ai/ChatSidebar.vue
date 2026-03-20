<template>
  <div class="chat-sidebar">
    <!-- 移动端关闭按钮 -->
    <div v-if="isInDrawer" class="mobile-close-btn">
      <el-button text @click="$emit('close-mobile-sidebar')">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>

    <!-- 新建对话按钮 -->
    <div class="sidebar-header">
      <el-button class="new-chat-btn" @click="$emit('new-session')">
        <el-icon><Plus /></el-icon>
        新建对话
      </el-button>
    </div>

    <!-- 会话列表 -->
    <div class="sidebar-content">
      <div v-for="group in groupedSessions" :key="group.key" class="session-group">
        <div class="group-title">{{ group.label }}</div>
        <div
          v-for="session in group.sessions"
          :key="session.id"
          class="session-item"
          :class="{ active: session.id === sessionId }"
          @click="handleClick(session)"
        >
          <span class="session-title">{{ session.title }}</span>
          <div class="session-actions" @click.stop>
            <el-icon class="action-icon" @click="handleEdit(session)">
              <Edit />
            </el-icon>
            <el-icon class="action-icon" @click="handleDelete(session)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部用户信息 -->
    <div class="sidebar-footer">
      <div class="new-chat-small" @click="$emit('new-session')">
        <el-icon><Plus /></el-icon>
        <span>新对话</span>
      </div>
      <el-dropdown>
        <div class="user-info">
          <img :src="getImageUrl('user')" class="user-avatar" />
          <span class="user-name">{{ userName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Edit, Delete, ArrowDown, Close } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import type { ChatSession } from '@/types/ai'

const props = defineProps<{
  sessionId: string | null
  sessions: ChatSession[]
  isInDrawer?: boolean
}>()

const emit = defineEmits<{
  'update:sessionId': [value: string]
  'new-session': []
  'switch-session': [id: string]
  'delete-session': [id: string]
  'update-title': [id: string, title: string]
  'close-mobile-sidebar': []
}>()

const userName = computed(() => 'Administrator')

// 按时间分组
const groupedSessions = computed(() => {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

  const groups = [
    { key: 'today', label: '今天', sessions: [] as ChatSession[] },
    { key: 'yesterday', label: '昨天', sessions: [] as ChatSession[] },
    { key: 'week', label: '最近7天', sessions: [] as ChatSession[] },
    { key: 'older', label: '更早', sessions: [] as ChatSession[] }
  ]

  props.sessions.forEach(session => {
    const diff = now - session.updatedAt
    if (diff < day) {
      groups[0].sessions.push(session)
    } else if (diff < 2 * day) {
      groups[1].sessions.push(session)
    } else if (diff < 7 * day) {
      groups[2].sessions.push(session)
    } else {
      groups[3].sessions.push(session)
    }
  })

  return groups.filter(g => g.sessions.length > 0)
})

function handleClick(session: ChatSession) {
  emit('update:sessionId', session.id)
  emit('switch-session', session.id)
}

function handleEdit(session: ChatSession) {
  ElMessageBox.prompt('请输入新的会话标题', '修改会话标题', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: session.title,
    inputPattern: /\S+/,
    inputErrorMessage: '标题不能为空'
  })
    .then(({ value }) => {
      emit('update-title', session.id, value)
    })
    .catch(() => {
      // 用户取消操作
    })
}

function handleDelete(session: ChatSession) {
  ElMessageBox.confirm(`确定要删除 "${session.title}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      emit('delete-session', session.id)
    })
    .catch(() => {
      // 用户取消操作
    })
}

function getImageUrl(name: string): string {
  return new URL(`../../assets/images/${name}.svg`, import.meta.url).href
}
</script>

<style scoped lang="less">
.chat-sidebar {
  width: 260px;
  height: 100%;
  background: #171717;
  color: #ececec;
  display: flex;
  flex-direction: column;
}

.mobile-close-btn {
  display: flex;
  justify-content: flex-end;
  padding: 12px;

  :deep(.el-button) {
    color: #ececec;
    font-size: 20px;
  }
}

.sidebar-header {
  padding: 12px;
}

.new-chat-btn {
  width: 100%;
  background: #2d2d2d;
  border: 1px solid #3e3e3e;
  color: #ececec;
  justify-content: flex-start;

  &:hover {
    background: #3e3e3e;
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}

.session-group {
  margin-bottom: 16px;

  .group-title {
    font-size: 12px;
    color: #8e8e8e;
    padding: 8px 8px 4px;
  }
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2d2d2d;

    .session-actions {
      opacity: 1;
    }
  }

  &.active {
    background: #3e3e3e;
  }

  .session-title {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .session-actions {
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s;

    .action-icon {
      font-size: 14px;
      color: #8e8e8e;

      &:hover {
        color: #ececec;
      }
    }
  }
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #2d2d2d;
}

.new-chat-small {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 8px;

  &:hover {
    background: #2d2d2d;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #2d2d2d;
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-name {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
