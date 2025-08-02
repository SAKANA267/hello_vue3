<template>
        <router-view />
</template>

<script lang="ts">
//js or ts
import Home from '@/views/Home.vue';
export default {
    name: 'App',
    components: {
        Home
    },
}
</script>

<style scoped>
/* css */
html,body,#app{
 
 height: 100%;
 
}
</style>