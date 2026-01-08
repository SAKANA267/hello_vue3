import {createRouter, createWebHashHistory} from 'vue-router';


const routes = [
    {
        path:'/',
        name: 'Home',
        component:() => import('@/views/Home.vue'),
        children:[
            {
                path: '/profile',
                name: 'profile',
                component:() => import('@/views/Profile.vue')
            },
            {
                path: '/objectManagement',
                name: 'objectManagement',
                component:() => import('@/views/ObjectManagement.vue')
            },
            {
                path:'/userManagement',
                name:'userManagement',
                component:() => import('@/views/UserManagement.vue')
            },
            {
                path:'/test',
                name:'test',
                component:() => import('@/views/Test.vue')
            },
        ]
    }
]

const router = createRouter({
    //设置路由模式
    history: createWebHashHistory(),
    routes,
});

export default router;