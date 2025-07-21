import {createRouter, createWebHashHistory} from 'vue-router';


const routes = [
    {
        path:'/',
        name: 'Home',
        component:() => import('@/views/Home.vue')
    }
]

const router = createRouter({
    //设置路由模式
    history: createWebHashHistory(),
    routes,
});

export default router;