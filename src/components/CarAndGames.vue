<!--
 * new page
 * @author: zhaoyahui
 * @since: 2025-07-17
 * CarAndGames.vue
-->
<template>
  <div class="container">
    <h1>Car and Games</h1>

    <div class="car">
      <h2>Car</h2>
      <p>一辆 {{ car.name }} 价值 {{ car.price }} 万元</p>
      <button @click="changeCarPrice">修改汽车价格</button>
    </div>

    <div class="games">
      <h2>Games</h2>
      <ul>
        <li v-for="game in games" :key="game.id">{{game.name}}</li>
      </ul>
      <button @click="changeFirstGameName">修改第一个游戏名</button>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';

    let car = reactive({
        name: 'Tesla Model S',
        price: 80
    });
    let games = reactive([
            {id: 1,name: '原神'},
            {id: 2,name: '英雄联盟'},
            {id: 3,name: '绝地求生'}
    ])

    function changeCarPrice(){
        car.price += 10;
        if(car.price > 200){
            car.price = 20;
        }
    }

    function changeFirstGameName() {
        if (games.length > 0) {
            games[0].name = '新的游戏名';
        }
    }
</script>

<style scoped>
</style>
