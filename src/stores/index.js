import { defineStore } from 'pinia'
import { ref } from 'vue'

// localStorage keys
const TOKEN_KEY = 'auth_token'
const MENU_LIST_KEY = 'menu_list'
const USER_INFO_KEY = 'user_info'

function initState() {
  return {
    isCollapse: true,
    tags: [
      {
        name: 'home',
        path: '/home',
        label: '首页',
        icon: ''
      }
    ],
    currentMenu: null,
    menuList: [],
    token: '',
    user: null
  }
}
export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState())

  // CommonAside.vue tags 标签栏操作
  function selectMenu(val) {
    //传入值为对象 eg：index: '1-1', title: '对象管理', route: '/objectManagement'
    if (val.route !== '/home') {
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

  // login.vue 根据用户更新菜单列表
  function updateMenuList(newMenuList) {
    state.value.menuList = newMenuList
    // 持久化菜单列表到 localStorage
    localStorage.setItem(MENU_LIST_KEY, JSON.stringify(newMenuList))
  }

  // 设置 token 并持久化到 localStorage
  function setToken(token) {
    state.value.token = token
    localStorage.setItem(TOKEN_KEY, token)
  }

  // 设置用户信息并持久化到 localStorage
  function setUser(userInfo) {
    state.value.user = userInfo
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
  }

  // 清除 token 和 localStorage
  function clearToken() {
    state.value.token = ''
    state.value.user = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(MENU_LIST_KEY)
    localStorage.removeItem(USER_INFO_KEY)
    state.value.menuList = []
    state.value.tags = [{ name: 'home', path: '/home', label: '首页', icon: '' }]
    state.value.currentMenu = null
  }

  // 检查是否已登录
  function isAuthenticated() {
    return !!state.value.token
  }

  // 从 localStorage 恢复认证状态（应用初始化时调用）
  function initAuth() {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedMenuList = localStorage.getItem(MENU_LIST_KEY)
    const savedUser = localStorage.getItem(USER_INFO_KEY)

    if (savedToken) {
      state.value.token = savedToken
    }
    if (savedMenuList) {
      try {
        state.value.menuList = JSON.parse(savedMenuList)
      } catch (e) {
        console.error('Failed to parse saved menu list:', e)
        state.value.menuList = []
      }
    }
    if (savedUser) {
      try {
        state.value.user = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse saved user info:', e)
        state.value.user = null
      }
    }
  }

  return {
    state,
    selectMenu,
    updateMenuList,
    setToken,
    setUser,
    clearToken,
    isAuthenticated,
    initAuth
  }
})
