<template>
  <div class="forbidden-container">
    <el-result icon="warning" title="403" sub-title="抱歉，您没有访问该页面的权限">
      <template #extra>
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/home')
</script>

<style scoped lang="less">
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

@media (max-width: 768px) {
  .forbidden-container {
    padding: 12px;
  }

  :deep(.el-result) {
    padding: 20px 0;

    .el-result__title {
      font-size: 32px;
    }

    .el-result__subtitle {
      font-size: 14px;
    }
  }
}
</style>
