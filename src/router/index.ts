import { createRouter, createWebHashHistory } from 'vue-router'
import type { Permission } from '@/api/types'

// 扩展 RouteMeta 类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    permission?: Permission
    menuIndex?: string
  }
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          permission: 'dashboard:view' as Permission,
          menuIndex: '2-1'
        }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
          title: '个人资料',
          permission: 'profile:view' as Permission,
          menuIndex: '2-2'
        }
      },
      {
        path: '/objectManagement',
        name: 'objectManagement',
        component: () => import('@/views/ObjectManagement.vue'),
        meta: {
          title: '对象管理',
          permission: 'object:view' as Permission,
          menuIndex: '1-1'
        }
      },
      {
        path: '/userManagement',
        name: 'userManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: {
          title: '用户管理',
          permission: 'user:view' as Permission,
          menuIndex: '1-2'
        }
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/ObjectAudit.vue'),
        meta: {
          title: '审核页面',
          permission: 'audit:view' as Permission,
          menuIndex: '4-3'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/Forbidden.vue'),
    meta: { title: '无权限访问' }
  }
]

const router = createRouter({
  //设置路由模式
  history: createWebHashHistory(),
  routes
})

import { hasPermission } from '@/utils/permissions'
import { ElMessage } from 'element-plus'

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')

  // 已登录状态下访问登录页，重定向到首页
  if (to.path === '/login' && token) {
    next('/home')
    return
  }

  // 未登录状态下访问受保护页面，重定向到登录页
  if (to.path !== '/login' && !token) {
    next('/login')
    return
  }

  // 权限验证 (跳过登录页和403页)
  if (to.path !== '/login' && to.path !== '/403' && to.meta?.permission) {
    if (!hasPermission(to.meta.permission)) {
      ElMessage.warning('您没有访问该页面的权限')
      next('/403')
      return
    }
  }

  next()
})

export default router
