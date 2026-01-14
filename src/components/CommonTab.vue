<!--
 * new page
 * @author: SAKANA267
 * @since: 2026-01-14
 * CommonTab.vue
-->
<template>
  <div class="tags">
    <el-tag
        v-for="(tag,index) in tags"
        :key="tag.name"  
        :closable="tag.name !== 'home'"
        :effect="route.name == tag.name ? 'dark' : 'light'"
    >
    {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const tags = ref([
    {
    path:'/home',
    name:'home',
    label:'首页',
    icon:'home'
    }
])
const route = useRoute();
</script>

<style scoped>
.tags{
    margin:10px 0 20px 10px;
}
</style>
