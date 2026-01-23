<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-08-02
 * UserInfo.vue
-->
<template>
  <div class="container">
    <el-card>
      <el-row class="profile-info" :gutter="20">
        <el-col :span="8" class="profile-img">
          <img :src="getImageUrl('user')" class="user-img" alt="用户头像" />
        </el-col>
        <el-col :span="16" class="profile-text">
          <div class="user-info">
            <p class="user-name">
              {{ userData.username }}
            </p>
            <p>{{ userData.role }}</p>
            <p>{{ userData.hobbies.split(',').join('、') }}</p>
          </div>
          <div class="login-info">
            <p>注册时间：{{ loginData.registerDate }}</p>
            <p>最近登录：{{ loginData.lastLoginDate }}</p>
            <p>登录地点：{{ loginData.loginLocation }}</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { UserInfo, LoginInfo } from '@/assets/types/user'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const getImageUrl = (user: string) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href
}

const userData = ref<UserInfo>({
  username: '加载中...',
  role: '获取中...',
  hobbies: '获取中...'
})
const loginData = ref<LoginInfo>({
  registerDate: '2023-01-01',
  lastLoginDate: '2025-08-02',
  loginLocation: '无'
})

const getUserInfo = async () => {
  const userInfo = await proxy?.$api.getUserInfo()
  userData.value = userInfo
  console.log('userInfo', userInfo)
}
const getLoginInfo = async () => {
  const loginInfo = await proxy?.$api.getLoginInfo()
  loginData.value = loginInfo
  console.log('loginInfo', loginInfo)
}
onMounted(() => {
  getUserInfo()
  getLoginInfo()
})
</script>

<style scoped>
.container {
  margin: 0 auto;
}

.profile-info {
  align-items: center;
}

.profile-img {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  max-width: 230px;
  margin: 0 auto;
}

.user-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e6e6e6;
  transition: transform 0.2s ease;
}

.user-img:hover {
  transform: scale(1.05);
}

.profile-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-info {
  padding: 16px 0;
}

.user-name {
  font-size: 24px !important;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.user-info p {
  margin: 4px 0;
  color: #34495e;
  font-size: 14px;
  line-height: 1.5;
}

.login-info {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.login-info p {
  margin: 6px 0;
  color: #7f8c8d;
  font-size: 13px;
}
</style>
