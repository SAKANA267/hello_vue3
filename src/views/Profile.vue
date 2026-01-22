<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-08-02
 * Profile.vue
-->
<template>
  <div class="profile-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">个人资料</h1>
      <p class="page-subtitle">查看您的个人信息和活动记录</p>
    </div>

    <!-- Main Content -->
    <div class="profile-content">
      <!-- User Info Card -->
      <div class="user-info-section">
        <UserInfo />
      </div>

      <!-- Contribution Graph Card -->
      <div class="contribution-section">
        <el-card shadow="hover">
          <ContributionGraph :contributions="mockContributions" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContributionGraph from '@/components/ContributionGraph.vue'
import UserInfo from '@/components/UserInfo.vue'

// 定义贡献数据的类型接口
interface Contribution {
  date: string
  count: number
}

// 模拟贡献数据
const mockContributions = ref<Contribution[]>([])

// 生成模拟数据
const generateMockData = () => {
  const contributions = []
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    // 随机生成贡献次数，周末贡献较少
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

mockContributions.value = generateMockData()
</script>

<style scoped lang="less">
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;

  .page-title {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 600;
    color: #303133;
  }

  .page-subtitle {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-info-section {
  .el-card {
    border-radius: 8px;
  }
}

.contribution-section {
  .el-card {
    border-radius: 8px;

    :deep(.el-card__body) {
      padding: 20px;
    }
  }
}

/* Responsive Design */
@media (min-width: 992px) {
  .profile-content {
    flex-direction: row;
    align-items: flex-start;

    .user-info-section {
      flex: 0 0 380px;
      position: sticky;
      top: 24px;
    }

    .contribution-section {
      flex: 1;
    }
  }

  .page-header {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }

  .page-header {
    .page-title {
      font-size: 24px;
    }

    .page-subtitle {
      font-size: 13px;
    }
  }

  .profile-content {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 12px;
  }

  .page-header {
    margin-bottom: 16px;

    .page-title {
      font-size: 20px;
    }
  }
}
</style>
