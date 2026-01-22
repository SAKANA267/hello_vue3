import {createRouter, createWebHashHistory} from 'vue-router';


const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path:'/home',
        name: 'Home',
        component:() => import('@/views/Home.vue'),
        children:[
            {
                path: '/dashboard',
                name: 'dashboard',
                component:() => import('@/views/Dashboard.vue')
            },
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
                component:() => import('@/views/ObjectAudit.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component:() => import('@/views/Login.vue')
    },
]

const router = createRouter({
    //设置路由模式
    history: createWebHashHistory(),
    routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token');

    // 已登录状态下访问登录页，重定向到首页
    if (to.path === '/login' && token) {
        next('/home');
        return;
    }

    // 未登录状态下访问受保护页面，重定向到登录页
    if (to.path !== '/login' && !token) {
        next('/login');
        return;
    }

    next();
});

export default router;