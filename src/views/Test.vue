<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-07
 * Test.vue
-->
<template>
  <div class="container">
    <CommonTable :tableLabel="tableLabel"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonTable from '@/components/CommonTable.vue';

//表格列配置
const tableLabel = [
    { prop: 'date', label: '日期', width:"110"},
    { prop: 'name', label: '姓名', width:"80"},
    { prop: 'address', label: '地址', },
]
</script>

<style scoped>

</style>
