<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-07-19
 * WatchPerson.vue
-->
<template>
  <div class="WatchPerson">
    <h1>WatchPerson</h1>
    <h2>{{ Person.name }}</h2>
    <h2>{{ Person.age }}</h2>
    <h2>{{ Person.car.c1 }},{{ Person.car.c2 }}</h2>
    <button @click="Person.name = '李四'">修改姓名</button>
    <button @click="Person.age ++ ">修改年龄</button>
    <button @click="Person.car.c1 = '李四'">修改第一辆车</button>
    <button @click="Person.car.c2 = '李四'">修改第二辆车</button>
    <button @click="Object.assign(Person,{ name: '李四', age: 26, car: { c1: '李四', c2: '李四' } })">修改整个对象</button>
  </div>
</template>

<script setup lang="ts">
    import { reactive, watch } from 'vue';

    let Person = reactive({
        name: '张三',
        age: 25,
        car: {
            c1: 'Tesla Model S',
            c2: 'BMW X5'
        }
    });
    watch(() => Person, (newValue, oldValue) => {
        console.log('Person对象发生变化:', newValue, oldValue);
    }, { deep: true });

    watch([
        () => Person.name,
        () => Person.car.c2
    ], (newValues, oldValues) => {
        console.log('Person.name 或 Person.car.c2 发生变化:', newValues, oldValues);
    }, { deep: true }
    )
</script>

<style scoped></style>
