<!--
权限按钮组件
根据用户权限显示或隐藏按钮
-->
<template>
  <el-button v-if="hasAuth" v-bind="$attrs" @click="handleClick">
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hasPermission, hasAnyPermission } from '@/utils/permissions'
import type { Permission } from '@/api/types'

interface Props {
  permission?: Permission
  permissions?: Permission[]
  requireAny?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requireAny: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const hasAuth = computed(() => {
  if (props.permission) return hasPermission(props.permission)
  if (props.permissions) {
    return props.requireAny
      ? hasAnyPermission(props.permissions)
      : props.permissions.every(p => hasPermission(p))
  }
  return true
})

const handleClick = (e: MouseEvent) => emit('click', e)
</script>
