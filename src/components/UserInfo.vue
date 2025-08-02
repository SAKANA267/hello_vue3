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
                <el-col :span="8">
                    <div class="profile-img">
                        <img :src="getImageUrl('user')" class="user-img" alt="用户头像" />
                    </div>
                </el-col>
                <el-col :span="16" class="profile-text">
                    <div class="user-info">
                        <p class="user-name">{{ userData.name }}</p>
                        <p>{{ userData.role }}</p>
                        <p>{{ userData.hobbies.join('、') }}</p>
                    </div>
                    <div class="login-info">
                        <p>注册时间：{{ loginData.registrationDate }}</p>
                        <p>最近登录：{{ loginData.lastLogin }}</p>
                        <p>登录地点：{{ loginData.loginLocation }}</p>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserInfo, LoginInfo } from '@/types/user.ts'
const getImageUrl = (user: string) => {
    return new URL(`../assets/images/${user}.png`, import.meta.url).href;
}

const userData = ref<typeof UserInfo>({
    name: 'SAKANA267',
    role: '开发者',
    hobbies: ['编程', '阅读', '旅行'],

});
const loginData = ref<typeof LoginInfo>({
    registrationDate: '2023-01-01',
    lastLogin: '2025-08-02',
    loginLocation: '无'
});

</script>

<style scoped>
.user-info {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    color: rgb(0, 0, 0);
    margin-bottom: 20px;
}

.user-name {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
}

.login-info {
    background: #ffffff;
    padding: 20px;
    transition: all 0.3s ease;
}

.login-info p {
    margin: 12px 0;
    color: #909396;
    font-size: 15px;
}

.profile-img,
.profile-text {
    justify-content: center;
    align-items: center;
}

.user-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #ffffff;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.8);
}
</style>
