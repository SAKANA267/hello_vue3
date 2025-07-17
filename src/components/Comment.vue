<template>
    <div class='comment'>
        <h2>{{ name }}</h2>
        <h2>{{ comment }}</h2>
        <button @click="changeName">修改姓名</button>
        <button @click="changeComment">修改评论内容</button>
        <button @click="showId">查看评论id</button>
    </div>
</template>

<script lang="ts">

export default {
    data () {
        return {
            name: 'username',
            comment: 'comment content',
            id: 1
        };
    },
    methods: {
        changeName(){
            this.name = 'new username';
        },
        changeComment(){
            this.comment = 'new comment content';
        },
        showId(){
            alert(`评论id: ${this.id}`);
        }
    },
};
</script>

<style lang='scss' scoped>

</style>