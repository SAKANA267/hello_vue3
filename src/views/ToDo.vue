<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="todo-container">
    <div class="todo-content">
      <el-empty description="此页面正在建设中">
        <template #image>
          <el-icon :size="100" color="#909399">
            <Tools />
          </el-icon>
        </template>
        <el-button type="primary" @click="goBack">返回上一页</el-button>
      </el-empty>
    </div>
  </div>
</template>

<style scoped lang="less">
.todo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;

  .todo-content {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .todo-container {
    padding: 12px;
    min-height: 50vh;
  }

  .todo-content {
    :deep(.el-icon) {
      font-size: 60px !important;
    }

    :deep(.el-empty__description) {
      font-size: 14px;
    }

    :deep(.el-button) {
      padding: 12px 20px;
      font-size: 14px;
    }
  }
}
</style>
