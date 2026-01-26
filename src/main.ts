import { createApp } from 'vue'
import '@/assets/main.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@/api/mock'
import api from '@/api/api'
import 'element-plus/theme-chalk/index.css'

// 导入权限指令
import permission from './directives/permission'

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$api = api
app.use(pinia)
app.use(router)
app.directive('permission', permission) // 注册全局权限指令
app.mount('#app')
