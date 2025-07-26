<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-07-21
 * Home.vue
-->
<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <common-aside />
      <el-container>
        <el-header>
          <common-header />
        </el-header>
        <el-main>
          Main
          <br>
          footer
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import CommonAside from '@/components/CommonAside.vue';
import CommonHeader from '@/components/CommonHeader.vue';

</script>

<style scoped lang="less">
.common-layout, .lay-container {
  height: 100%;
}

.el-header {
  background-color: #4facfe;
  display: flex;
  align-items: center;
}

.el-main {
  background-color: #f5f5f5;
}
</style>
