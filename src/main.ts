import { createApp } from "vue";
import '@/assets/main.css';
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import '@/api/mock.js'
import api from '@/api/api.js';

const pinia = createPinia();
const app = createApp(App);

app.config.globalProperties.$api = api;
app.use(pinia);
app.use(router).mount("#app");