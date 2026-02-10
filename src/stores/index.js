import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/api'
import { ROLE_PERMISSIONS } from '@/constants/permissions'

// localStorage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_INFO_KEY = 'user_info'
const MENU_LIST_KEY = 'menu_list'

function initState() {
  return {
    isCollapse: true,
    tags: [
      {
        name: 'dashboard',
        path: '/dashboard',
        label: '首页',
        icon: ''
      }
    ],
    currentMenu: null,
    menuList: [],
    accessToken: '',
    refreshToken: '',
    user: null
  }
}

export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState())

  // CommonAside.vue tags 标签栏操作
  function selectMenu(val) {
    //传入值为对象 eg：index: '1-1', title: '对象管理', route: '/objectManagement'
    if (val.route !== '/dashboard') {
      // 检查标签是否已存在
      const index = state.value.tags.findIndex(item => item.path === val.route)
      if (index === -1) {
        // 不存在则添加新标签，转换数据格式
        state.value.tags.push({
          name: val.index, // 使用 index 作为 name
          path: val.route, // 使用 route 作为 path
          label: val.title, // 使用 title 作为 label
          icon: val.icon || '' // 如果有 icon 就使用，没有就为空
        })
      }
      // 更新当前菜单
      state.value.currentMenu = {
        name: val.index,
        path: val.route,
        label: val.title,
        icon: val.icon || ''
      }
    }
  }

  // 根据用户更新菜单列表
  function updateMenuList(newMenuList) {
    state.value.menuList = newMenuList
    // 持久化菜单列表到 localStorage
    localStorage.setItem(MENU_LIST_KEY, JSON.stringify(newMenuList))
  }

  // ========== 认证相关方法 (双令牌管理) ==========

  /** 设置认证信息 */
  function setAuth(accessToken, refreshToken, user) {
    state.value.accessToken = accessToken
    state.value.refreshToken = refreshToken

    // 根据 role 映射 permissions（用于组件级权限控制）
    const userWithPermissions = {
      ...user,
      permissions: ROLE_PERMISSIONS[user.role] || []
    }
    state.value.user = userWithPermissions

    // 持久化
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userWithPermissions))
  }

  /** 清除认证信息 */
  function clearAuth() {
    state.value.accessToken = ''
    state.value.refreshToken = ''
    state.value.user = null
    state.value.menuList = []
    state.value.tags = [{ name: 'dashboard', path: '/dashboard', label: '主页', icon: '' }]
    state.value.currentMenu = null

    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_INFO_KEY)
    localStorage.removeItem(MENU_LIST_KEY)
  }

  /** 检查是否已登录 */
  function isAuthenticated() {
    return !!state.value.accessToken
  }

  /** 获取当前 access token */
  function getAccessToken() {
    return state.value.accessToken || localStorage.getItem(ACCESS_TOKEN_KEY) || ''
  }

  /** 获取当前用户信息 */
  function getUser() {
    return state.value.user
  }

  /** 初始化认证状态 - 从 localStorage 恢复 */
  function initAuth() {
    const savedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_INFO_KEY)
    const savedMenuList = localStorage.getItem(MENU_LIST_KEY)

    if (savedAccessToken) {
      state.value.accessToken = savedAccessToken
    }
    if (savedRefreshToken) {
      state.value.refreshToken = savedRefreshToken
    }
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        // 兼容旧数据：如果没有 permissions，根据 role 添加
        if (!user.permissions || user.permissions.length === 0) {
          user.permissions = ROLE_PERMISSIONS[user.role] || []
        }
        state.value.user = user
      } catch (e) {
        console.error('Failed to parse saved user info:', e)
        state.value.user = null
      }
    }
    if (savedMenuList) {
      try {
        state.value.menuList = JSON.parse(savedMenuList)
      } catch (e) {
        console.error('Failed to parse saved menu list:', e)
        state.value.menuList = []
      }
    }
  }

  /** 刷新令牌 */
  async function refreshTokens() {
    try {
      const res = await authApi.refreshToken({
        refreshToken: state.value.refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY) || ''
      })
      setAuth(res.accessToken, res.refreshToken, res.userInfo)
      return res.accessToken
    } catch (error) {
      console.error('Failed to refresh tokens:', error)
      clearAuth()
      throw error
    }
  }

  // ========== 兼容旧代码的方法 ==========

  /** 设置 token (兼容旧代码) */
  function setToken(token) {
    state.value.accessToken = token
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }

  /** 设置用户信息 (兼容旧代码) */
  function setUser(userInfo) {
    state.value.user = userInfo
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
  }

  /** 清除 token (兼容旧代码) */
  function clearToken() {
    clearAuth()
  }

  return {
    state,
    selectMenu,
    updateMenuList,
    // 新认证方法
    setAuth,
    clearAuth,
    isAuthenticated,
    getAccessToken,
    getUser,
    initAuth,
    refreshTokens,
    // 兼容旧代码
    setToken,
    setUser,
    clearToken
  }
})
