<!--
 * Login Page - Backend API Integration
 * @author: SAKANA267
 * @since: 2026-01-15
 * Login.vue
-->
<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>公共卫生平台管理系统</h2>
        </div>
      </template>

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" size="large">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>

        <div class="footer-link">
          <span>还没有账号？</span>
          <el-link type="primary" @click="goToRegister">去注册</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/api'
import { useAllDataStore } from '@/stores/index.js'

const router = useRouter()
const store = useAllDataStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const res = await authApi.login(loginForm)

        // 存储认证信息 (使用新的 setAuth 方法)
        store.setAuth(res.accessToken, res.refreshToken, res.userInfo)

        ElMessage.success('登录成功')
        router.push('/dashboard')
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%);
}

.login-card {
  width: 90%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
}

.card-header h2 {
  color: #1890ff;
  margin: 0;
  font-size: 24px;
}

.login-button {
  width: 100%;
  background-color: #1890ff;
  border-color: #1890ff;
}

.login-button:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .login-card {
    width: 95%;
    margin: 0 10px;
  }

  .card-header h2 {
    font-size: 20px;
  }
}

/* 表单项样式调整 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-button--large) {
  height: 44px;
  font-size: 16px;
}

.footer-link {
  text-align: center;
  color: #606266;
  font-size: 14px;
}
</style>
