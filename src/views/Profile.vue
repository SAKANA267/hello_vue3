<!--
 * Profile Page - GitHub Inspired Design
 * @author: SAKANA267
 * @since: 2025-08-02
 * Profile.vue
-->
<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header" :class="{ 'is-loaded': isLoaded }">
      <div class="profile-cover">
        <div class="cover-pattern"></div>
      </div>

      <div class="profile-content">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img
              :src="getImageUrl('user')"
              class="profile-avatar"
              alt="用户头像"
            />
            <div class="avatar-status" :class="{ 'online': isOnline }">
              <span class="status-dot"></span>
            </div>
          </div>
        </div>

        <!-- User Info -->
        <div class="user-details">
          <h1 class="user-name">{{ userData.username }}</h1>
          <p class="user-role">{{ userData.role }}</p>
          <p class="user-bio">{{ userData.hobbies.split(',').join('、') }}</p>

          <div class="user-meta">
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM4.5 7.5a.5.5 0 010-1h5.793L8.146 4.354a.5.5 0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L10.293 8H4.5z"/>
              </svg>
              <span>加入于 {{ formatDate(loginData.registerDate) }}</span>
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 .5a.5.5 0 01.5.5v5.793l2.146-2.147a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L7.5 6.293V1a.5.5 0 01.5-.5z"/>
              </svg>
              <span>上次登录 {{ formatRelativeDate(loginData.lastLoginDate) }}</span>
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 16s6-5.686 6-10A6 6 0 002 6c0 4.314 6 10 6 10zm0-7a3 3 0 100-6 3 3 0 000 6z"/>
              </svg>
              <span>{{ loginData.loginLocation }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" :class="{ 'is-loaded': isLoaded }">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index" :style="{ 'animation-delay': `${index * 100}ms` }">
        <div class="stat-icon" :style="{ background: stat.color }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="stat.icon"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid" :class="{ 'is-loaded': isLoaded }">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Contribution Card -->
        <div class="content-card contribution-card">
          <div class="card-header">
            <h2 class="card-title">
              <svg class="title-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                <path d="M11 5.5a.5.5 0 01 .5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z"/>
              </svg>
              贡献活动
            </h2>
            <div class="contribution-count">{{ totalContributions }} 次贡献</div>
          </div>

          <ContributionGraph :contributions="mockContributions" />

          <div class="contribution-legend">
            <span class="legend-label">活跃度</span>
            <div class="legend-colors">
              <div class="legend-box" style="background: #ebedf0"></div>
              <div class="legend-box" style="background: #9be9a8"></div>
              <div class="legend-box" style="background: #40c463"></div>
              <div class="legend-box" style="background: #30a14e"></div>
              <div class="legend-box" style="background: #216e39"></div>
            </div>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="content-card activity-card">
          <div class="card-header">
            <h2 class="card-title">
              <svg class="title-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H4a.5.5 0 010-1h3.5V4a.5.5 0 01.5-.5z"/>
                <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm7-8A7 7 0 111 8a7 7 0 0114 0z"/>
              </svg>
              最近活动
            </h2>
          </div>

          <div class="activity-list">
            <div class="activity-item" v-for="(activity, index) in activities" :key="index">
              <div class="activity-icon" :class="activity.type">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path :d="activity.icon"/>
                </svg>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Achievements -->
        <div class="content-card achievements-card">
          <div class="card-header">
            <h2 class="card-title">
              <svg class="title-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.058 2.5a.5.5 0 01.5.5v4.638l1.97-1.97a.5.5 0 01.707.707l-2.828 2.828a.5.5 0 01-.707 0L4.872 6.375a.5.5 0 01.707-.707l1.97 1.97V3a.5.5 0 01.5-.5z"/>
                <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm0-1A7 7 0 118 1a7 7 0 010 14z"/>
              </svg>
              成就徽章
            </h2>
          </div>

          <div class="achievements-grid">
            <div
              class="achievement-badge"
              v-for="(achievement, index) in achievements"
              :key="index"
            >
              <div class="badge-icon" :style="{ background: achievement.color }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path :d="achievement.icon"/>
                </svg>
              </div>
              <div class="badge-info">
                <div class="badge-name">{{ achievement.name }}</div>
                <div class="badge-desc">{{ achievement.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="content-card skills-card">
          <div class="card-header">
            <h2 class="card-title">
              <svg class="title-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z"/>
                <path d="M9 2.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z"/>
                <path d="M1 10.5A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z"/>
                <path d="M9 10.5A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z"/>
              </svg>
              专业技能
            </h2>
          </div>

          <div class="skills-list">
            <div class="skill-item" v-for="(skill, index) in skills" :key="index">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: `${skill.level}%`, background: skill.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import ContributionGraph from '@/components/ContributionGraph.vue'
import type { UserInfo, LoginInfo } from '@/assets/types/user'

const { proxy } = getCurrentInstance() as ComponentInternalInstance

// State
const isLoaded = ref(false)
const isOnline = ref(true)

// User Data
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

// Contribution Data
interface Contribution {
  date: string
  count: number
}

const mockContributions = ref<Contribution[]>([])

// Stats
const stats = ref([
  {
    label: '完成任务',
    value: '127',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    label: '审核记录',
    value: '89',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    label: '工作时长',
    value: '342h',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    label: '准确率',
    value: '98.5%',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
])

// Activities
const activities = ref([
  {
    type: 'create',
    icon: 'M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z',
    text: '完成了新对象审核任务',
    time: '2 小时前'
  },
  {
    type: 'audit',
    icon: 'M8 2a.5.5 0 01.5.5V4h5a.5.5 0 01.5.5v5.5h1.5a.5.5 0 010 1H14v5.5a.5.5 0 01-.5.5h-5v1.5a.5.5 0 01-1 0V17h-5A.5.5 0 012 16.5v-5H.5a.5.5 0 010-1H2v-5A.5.5 0 012.5 5h5V2.5A.5.5 0 018 2z',
    text: '更新了用户权限配置',
    time: '5 小时前'
  },
  {
    type: 'update',
    icon: 'M8 3c0-1.103.897-2 2-2s2 .897 2 2-.897 2-2 2-2-.897-2-2zm2 2.5a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm-3.5 3A.5.5 0 017 8v3.5a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm7 0a.5.5 0 01.5.5v3.5a.5.5 0 01-1 0V8a.5.5 0 01.5-.5z',
    text: '提交了季度工作报告',
    time: '1 天前'
  },
  {
    type: 'login',
    icon: 'M8 8a3 3 0 100-6 3 3 0 000 6zM2.049 9.763A6.002 6.002 0 018 6c3.431 0 6.23 2.558 6.499 5.922.034.397-.285.75-.665.75H2.714c-.38 0-.699-.353-.665-.75.269-3.364 3.068-5.922 6.5-5.922z',
    text: '从新设备登录',
    time: '2 天前'
  },
  {
    type: 'star',
    icon: 'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z',
    text: '获得月度优秀员工',
    time: '1 周前'
  }
])

// Achievements
const achievements = ref([
  {
    name: '快速审核',
    description: '单日审核 10+ 条记录',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
  },
  {
    name: '精准专家',
    description: '准确率保持 99%+',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
  },
  {
    name: '连续登录',
    description: '连续登录 30 天',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
  },
  {
    name: '团队协作',
    description: '协助完成 5+ 项目',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  }
])

// Skills
const skills = ref([
  { name: '数据审核', level: 95, color: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' },
  { name: '系统操作', level: 88, color: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)' },
  { name: '报告撰写', level: 92, color: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '团队协作', level: 85, color: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' }
])

// Computed
const totalContributions = computed(() => {
  return mockContributions.value.reduce((sum, c) => sum + c.count, 0)
})

// Methods
const getImageUrl = (user: string) => {
  return new URL(`../assets/images/${user}.svg`, import.meta.url).href
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
}

const formatRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff < 7) return `${diff} 天前`
  if (diff < 30) return `${Math.floor(diff / 7)} 周前`
  return `${Math.floor(diff / 30)} 月前`
}

const generateMockData = () => {
  const contributions: Contribution[] = []
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const maxContributions = isWeekend ? 5 : 15
    const count = Math.floor(Math.random() * maxContributions)

    if (count > 0) {
      contributions.push({
        date: date.toISOString().split('T')[0],
        count: count
      })
    }
  }

  return contributions
}

const getUserInfo = async () => {
  const userInfo = await proxy?.$api.getUserInfo()
  userData.value = userInfo
}

const getLoginInfo = async () => {
  const loginInfo = await proxy?.$api.getLoginInfo()
  loginData.value = loginInfo
}

// Lifecycle
onMounted(async () => {
  mockContributions.value = generateMockData()
  await Promise.all([getUserInfo(), getLoginInfo()])

  // Trigger animations
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<style scoped lang="less">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

// Variables
@primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
@bg-color: #f6f8fa;
@card-bg: #ffffff;
@text-primary: #24292f;
@text-secondary: #656d76;
@text-tertiary: #8b949e;
@border-color: #d0d7de;
@border-light: #e6e8eb;
@shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
@shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
@shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

.profile-page {
  min-height: 100vh;
  background: @bg-color;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 0;
  overflow-x: hidden;
}

// Profile Header
.profile-header {
  position: relative;
  background: @card-bg;
  margin-bottom: 24px;

  .profile-cover {
    height: 140px;
    position: relative;
    overflow: hidden;

    .cover-pattern {
      position: absolute;
      inset: 0;
      background: @primary-gradient;
      opacity: 0.9;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        animation: patternShift 20s ease-in-out infinite;
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.05)' fill-rule='evenodd'/%3E%3C/svg%3E");
        opacity: 0.5;
      }
    }
  }

  .profile-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
  }

  .avatar-section {
    margin-top: -60px;
    z-index: 2;

    .avatar-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: @card-bg;
      padding: 4px;
      box-shadow: @shadow-md;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      .profile-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid @card-bg;
      }

      .avatar-status {
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3fb950;
        border: 3px solid @card-bg;
        display: flex;
        align-items: center;
        justify-content: center;

        &.online .status-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
        }
      }
    }
  }

  .user-details {
    padding: 8px 0;

    .user-name {
      font-size: 28px;
      font-weight: 700;
      color: @text-primary;
      margin: 0 0 4px 0;
      letter-spacing: -0.5px;
    }

    .user-role {
      font-size: 16px;
      color: @text-secondary;
      margin: 0 0 8px 0;
      font-weight: 400;
    }

    .user-bio {
      font-size: 15px;
      color: @text-secondary;
      margin: 0 0 16px 0;
      line-height: 1.6;
    }

    .user-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: @text-secondary;

        .meta-icon {
          width: 16px;
          height: 16px;
          color: @text-tertiary;
        }
      }
    }
  }
}

// Stats Grid
.stats-grid {
  max-width: 1280px;
  margin: 0 auto 24px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }

  .stat-card {
    background: @card-bg;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: @shadow-sm;
    border: 1px solid @border-light;
    transition: all 0.3s ease;
    cursor: default;
    opacity: 0;
    animation: slideUp 0.5s ease forwards;

    &:hover {
      transform: translateY(-2px);
      box-shadow: @shadow-md;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .stat-info {
      flex: 1;
      min-width: 0;

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: @text-primary;
        line-height: 1.2;
        margin-bottom: 2px;
      }

      .stat-label {
        font-size: 13px;
        color: @text-secondary;
        font-weight: 500;
      }
    }
  }
}

// Content Grid
.content-grid {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }

  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

// Content Cards
.content-card {
  background: @card-bg;
  border-radius: 12px;
  border: 1px solid @border-light;
  box-shadow: @shadow-sm;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: @shadow-md;
  }

  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid @border-light;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;

      .title-icon {
        width: 18px;
        height: 18px;
        color: @text-tertiary;
      }
    }
  }
}

// Contribution Card
.contribution-card {
  .contribution-count {
    font-size: 14px;
    color: @text-secondary;
    font-weight: 500;
  }

  :deep(.contribution-graph) {
    background: transparent;
    border-radius: 0;
    padding: 20px;
  }

  .contribution-legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 20px;
    border-top: 1px solid @border-light;

    .legend-label {
      font-size: 12px;
      color: @text-tertiary;
    }

    .legend-colors {
      display: flex;
      gap: 3px;

      .legend-box {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
    }
  }
}

// Activity Card
.activity-card {
  .activity-list {
    padding: 12px;

    .activity-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      transition: background 0.2s ease;

      &:hover {
        background: @bg-color;
      }

      .activity-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: white;

        svg {
          width: 16px;
          height: 16px;
        }

        &.create {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.audit {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.update {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.login {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        &.star {
          background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        }
      }

      .activity-content {
        flex: 1;
        min-width: 0;

        .activity-text {
          font-size: 14px;
          color: @text-primary;
          margin-bottom: 4px;
          line-height: 1.5;
        }

        .activity-time {
          font-size: 12px;
          color: @text-tertiary;
        }
      }
    }
  }
}

// Achievements Card
.achievements-card {
  .achievements-grid {
    padding: 16px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .achievement-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: @bg-color;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(4px);
      box-shadow: @shadow-sm;
    }

    .badge-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .badge-info {
      flex: 1;
      min-width: 0;

      .badge-name {
        font-size: 14px;
        font-weight: 600;
        color: @text-primary;
        margin-bottom: 2px;
      }

      .badge-desc {
        font-size: 12px;
        color: @text-secondary;
      }
    }
  }
}

// Skills Card
.skills-card {
  .skills-list {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .skill-item {
    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .skill-name {
        font-size: 14px;
        font-weight: 500;
        color: @text-primary;
      }

      .skill-level {
        font-size: 13px;
        font-weight: 600;
        color: @text-secondary;
      }
    }

    .skill-bar {
      height: 6px;
      background: @bg-color;
      border-radius: 3px;
      overflow: hidden;

      .skill-progress {
        height: 100%;
        border-radius: 3px;
        transition: width 1s ease-out;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: shimmer 2s infinite;
        }
      }
    }
  }
}

// Animations
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes patternShift {
  0%, 100% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.1) translate(-5%, -5%); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

// Responsive
@media (min-width: 992px) {
  .content-grid {
    grid-template-columns: 2fr 1fr;
  }
}

@media (max-width: 768px) {
  .profile-header {
    .profile-content {
      padding: 0 16px 20px;
      align-items: center;
      text-align: center;

      .user-meta {
        justify-content: center;
      }
    }
  }

  .stats-grid,
  .content-grid {
    padding: 0 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-header .avatar-section .avatar-wrapper {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .profile-header {
    .profile-cover {
      height: 100px;
    }

    .profile-content {
      padding: 0 12px 16px;
    }

    .avatar-section .avatar-wrapper {
      width: 90px;
      height: 90px;
      margin-top: -45px;
    }

    .user-details .user-name {
      font-size: 22px;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .stats-grid .stat-card {
    padding: 16px;
  }

  .content-grid {
    gap: 12px;
    padding-bottom: 16px;
  }
}
</style>
