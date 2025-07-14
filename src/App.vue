<template>
    <!-- html -->
     <div class="app">
        <h1>Hello Vue3</h1>
        <Test />
     </div>
</template>

<script lang="ts">
    //js or ts
    import Test from './components/Test.vue';
    export default {
        name: 'App',
        components: {
            Test
        },
    }
</script>

<style>
    /* css */
    .app{
        background-color: #ddd;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        border-radius: 8px;
    }
</style>