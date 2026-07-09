import { FirstAidKit, Pointer, Service } from '@element-plus/icons-vue'
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'Index',
        meta: { titleKey: 'route.pack',icon:Pointer },
        component: () => import('@/views/index/Index.vue'),
    },
    {
        path: '/static',
        name: 'Static',
        meta: { titleKey: 'route.static',icon:Service },
        component: () => import('@/views/static/Index.vue'),
    },
    {
        path: '/static-view',
        name: 'StaticView',
        component: () => import('@/views/static/View.vue'),
    },
    // {
    //     path: '/logger',
    //     name: 'Logger',
    //     meta: { titleKey: 'route.logger',icon:FirstAidKit },
    //     component: () => import('@/views/logger/Index.vue'),
    // }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
