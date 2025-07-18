<!--
 * new page
 * @author: SAKANA267
 * @since: 2025-07-19
 * ComputeFullName.vue
-->
<template>
  <div class="ComputeFullName">
    <form>
     <h1>计算全名</h1>
     <label for="lastName">姓：</label>
     <input type="text" id="lastName" v-model="lastName"  placeholder="请输入姓氏"><br>
     <label for="firstName">名：</label>
     <input type="text" id="firstName" v-model="firstName"  placeholder="请输入名字"><br>
     <h2>全名：{{ fullName }}</h2>
     <button type="button" @click="setFullName">设置全名为 "gen-shin"</button>
    </form>
  </div>
</template>

<script setup lang="ts">
    import{ computed, ref } from 'vue';
    let lastName = ref('');
    let firstName = ref('');

    let fullName = computed({
        get: () => `${lastName.value}-${firstName.value}`,
        set: (value: string) => {
            const fullName = value.split('-');
            lastName.value = fullName[0];
            firstName.value = fullName[1];
        }
    });

    function setFullName() {
        fullName.value = 'gen-shin';
    }
</script>

<style scoped>

</style>
