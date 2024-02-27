import routes from './modules'

import layoutHeaderAside from '@/layout'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const homeMenus = [
    // 首页
    {
        path: '/home',
        name: 'home',
        meta: {
            auth: true,
            title: '首页',
            isMenu:true,
            icon: '01'
        },
        component: _import('pages/home/index.vue')
    },
    ...routes,
]
const frameIn = [{
    path: '/',
    redirect: {
        auth: true,
        //默认页面显示配置
        name: 'login',
    },
    component: layoutHeaderAside,
    children: homeMenus
}]
const frameUtil = [
    // 刷新页面 必须保留
    {
        path: '/refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
    },
    // 页面重定向 必须保留
    {
        path: '/redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
    },
    {
        path: '*',
        name: '404',
        component: _import('system/error/404')
    }
]
/**
 * 在主框架之外显示
 */
const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: _import('system/login')
    },
]
export const homeMenuRoutes = homeMenus
export const permissionsMenu = frameIn
// 重新组织后导出
export default [
    ...frameIn,
    ...frameUtil,
    ...frameOut,
]