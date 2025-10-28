<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-08-02
 * Profile.vue
-->
<template>
  <div class="container">
    <h1>个人资料</h1>
    <UserInfo />
    <hr>
    <ContributionGraph :contributions="mockContributions" />
    <hr>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContributionGraph from '@/components/ContributionGraph.vue';
import UserInfo from '@/components/UserInfo.vue';




// 定义贡献数据的类型接口
interface Contribution {
  date: string;
  count: number;
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

<style scoped>

</style>
