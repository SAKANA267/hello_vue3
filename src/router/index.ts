import { createRouter, createWebHashHistory } from 'vue-router'
import type { Permission, UserRole } from '@/api/types'
import { MENU_ROLES } from '@/constants/menu'

// 扩展 RouteMeta 类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    permission?: Permission
    role?: UserRole
    roles?: UserRole[]
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
          roles: MENU_ROLES['2-1'],
          menuIndex: '2-1'
        }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
          title: '个人资料',
          roles: MENU_ROLES['2-2'],
          menuIndex: '2-2'
        }
      },
      {
        path: '/objectManagement',
        name: 'objectManagement',
        component: () => import('@/views/ObjectManagement.vue'),
        meta: {
          title: '对象管理',
          roles: MENU_ROLES['1-1'],
          menuIndex: '1-1'
        }
      },
      {
        path: '/userManagement',
        name: 'userManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: {
          title: '用户管理',
          roles: MENU_ROLES['1-2'],
          menuIndex: '1-2'
        }
      },
      {
        path: '/auditManagement',
        name: 'auditManagement',
        component: () => import('@/views/ObjectAudit.vue'),
        meta: {
          title: '审核管理',
          roles: MENU_ROLES['1-3'],
          menuIndex: '1-3'
        }
      },
      {
        path: '/quickStart',
        name: 'quickStart',
        component: () => import('@/views/ToDo.vue'),
        meta: {
          title: '快速开始',
          roles: MENU_ROLES['3-1'],
          menuIndex: '3-1'
        }
      },
      {
        path: '/apiDocs',
        name: 'apiDocs',
        component: () => import('@/views/ToDo.vue'),
        meta: {
          title: 'API 文档',
          roles: MENU_ROLES['3-2'],
          menuIndex: '3-2'
        }
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/ToDo.vue'),
        meta: {
          title: '设置',
          roles: MENU_ROLES['4-1'],
          menuIndex: '4-1'
        }
      },
      {
        path: '/help',
        name: 'help',
        component: () => import('@/views/ToDo.vue'),
        meta: {
          title: '帮助',
          roles: MENU_ROLES['4-2'],
          menuIndex: '4-2'
        }
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/Test.vue'),
        meta: {
          title: '测试页面',
          roles: MENU_ROLES['4-3'],
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
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册' }
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

import { hasRole, hasAnyRole } from '@/utils/permissions'
import { ElMessage } from 'element-plus'

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token')

  // 已登录状态下访问登录页或注册页，重定向到首页
  if ((to.path === '/login' || to.path === '/register') && accessToken) {
    next('/home')
    return
  }

  // 未登录状态下访问受保护页面，重定向到登录页
  if (to.path !== '/login' && to.path !== '/register' && !accessToken) {
    next('/login')
    return
  }

  // 角色鉴权 (跳过登录页和403页)
  if (to.path !== '/login' && to.path !== '/403' && (to.meta?.role || to.meta?.roles)) {
    const hasAccess =
      (to.meta.role && hasRole(to.meta.role)) || (to.meta.roles && hasAnyRole(to.meta.roles))

    if (!hasAccess) {
      ElMessage.warning('您没有访问该页面的权限')
      next('/403')
      return
    }
  }

  next()
})

export default router
