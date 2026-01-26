/*
权限指令 v-permission
用法:
  v-permission="'object:create'"
  v-permission="['object:edit', 'object:delete']"
  v-permission.any="['user:view', 'user:edit']"
*/

import type { Directive, DirectiveBinding } from 'vue'
import { hasPermission, hasAnyPermission } from '@/utils/permissions'
import type { Permission } from '@/api/types'

const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<Permission | Permission[]>) {
    const { value, modifiers } = binding
    let hasAuth = false

    if (Array.isArray(value)) {
      hasAuth = modifiers.any ? hasAnyPermission(value) : value.every(p => hasPermission(p))
    } else {
      hasAuth = hasPermission(value)
    }

    if (!hasAuth) {
      el.parentNode?.removeChild(el)
    }
  }
}

export default permission
