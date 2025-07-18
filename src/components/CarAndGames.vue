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
      <button @click="changeCarObject">修改汽车对象</button>
      <hr>
      <p>使用ref解构赋值</p>
      <button @click="checkRefs">查看所有的响应对象</button>
      <button @click="checkSName">查看姓名的响应对象</button>
      <button @click="checkSPrice">检查价格的响应对象</button>
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
    import { reactive, toRef, toRefs, watch } from 'vue';

    let car = reactive({
        name: 'Tesla Model S',
        price: 80
    });
    // 监听 car 对象的变化
    watch(() => car, (newValue, oldValue) => {
        console.log('汽车对象发生变化:', newValue, oldValue);
    }, { deep: true });

    // 使用 toRefs 将响应式对象转换为响应式引用
    let { name, price} = toRefs(car)
    function checkRefs(){console.log(name, price);}

    let sName = toRef(car, 'name');
    function checkSName(){console.log(sName);}

    let sPrice = toRef(car, 'price');
    function checkSPrice(){console.log(sPrice);}

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
    function changeCarObject() {
        let newCar = {
            name: 'xiaomiSU7',
            price: 100
        };
        Object.assign(car, newCar);
    }

    function changeFirstGameName() {
        if (games.length > 0) {
            games[0].name = '新的游戏名';
        }
    }
</script>

<style scoped>
</style>
