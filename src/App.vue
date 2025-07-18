<template>
    <!-- html -->
     <div class="app">
        <h1>Hello Vue3</h1>
        <Person/>
        <hr>
        <Comment/>
        <hr>
        <CarAndGames/>
        <hr>
        <ComputeFullName/>
        <hr>
        <WatchPerson/>
     </div>
</template>

<script lang="ts">
    //js or ts
    import Person from './components/Person.vue';
    import Comment from './components/Comment.vue';
    import CarAndGames from './components/CarAndGames.vue';
    import ComputeFullName from './components/ComputeFullName.vue';
    import WatchPerson from './components/WatchPerson.vue';
    export default {
        name: 'App',
        components: {
            Person,
            Comment,
            CarAndGames,
            ComputeFullName,
            WatchPerson
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