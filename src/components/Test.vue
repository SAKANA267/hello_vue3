<template>
    <!-- html -->
     <div class="header">
        <h1>Comment</h1>
        <h2>姓名：{{ name }}</h2>
        <h2>评论：{{ comment }}</h2>
        <button @click = 'showId'>查看评论id</button>
     </div>
</template>

<script lang="ts">
    //js or ts
    export default {
        name: 'Comment',
        data() {
            return{
                name: 'username',
                comment: 'comment content',
                id: 1
            }
        },
        methods:{
            showId(){
                alert(`评论id: ${this.id}`);
            }
        }
    }
</script>

<style>
    /* css */
    .header{
        background-color: #4adada;
        box-shadow: 0 0 10px rgba(5, 189, 235, 0.1);
        padding: 5px;
        border-radius: 2px;
    }
</style>