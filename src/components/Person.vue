<template>
    <!-- html -->
     <div class="header">
        <h1>Person</h1>
        <h2>姓名：{{ name }}</h2>
        <h2>性别：{{ gender }}</h2>
        <h2>年龄：{{ age }}</h2>
        <button @click = 'changeName'>修改姓名</button>
        <button @click = 'changeGender'>修改性别</button>
        <button @click = 'showAge'>修改年龄</button>
     </div>
</template>

<script lang="ts" setup name="Person">
    import { ref } from 'vue';

    let name = ref('张三');
    let gender = ref('男');
    let age = ref(25);

    function changeName() {
        name.value = '李四';
        console.log(name);
    }

    function changeGender() {
        gender.value = '女';
        console.log(gender);
    }

    function showAge() {
        age.value ++;
        if (age.value > 100) {
            age.value = 0; // 重置年龄
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
    button {
        margin: 5px;
        padding: 5px 10px;
        background-color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>