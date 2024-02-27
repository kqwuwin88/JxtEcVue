import Vue from 'vue'
import VueRouter from 'vue-router'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import util from '@/libs/util.js'
// 路由数据
import routes from './routes'
import store from '@/store/index'
import { cloneDeep } from 'lodash'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)


const createRouter = () => new VueRouter({
    routes,
    //RUL地址中去掉#号配置history,带#配置hash
    mode:'history',
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

let hasMenus = false
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if (to.path === '/login') {
        hasMenus = false
        next()
    }else if(to.path === '/'){
        next('/login')
    } else {
        const userInfo = await store.dispatch('allstore/db/get',{
            dbName: 'sys',
            path: 'user.userInfo',
            defaultValue: {},
            user: true
        })
        if(Object.keys(userInfo).length === 0 && userInfo.constructor === Object){
            next('/login')
        }else if(to.name === '404'){
            next('/login')
        }else{
            const {query,params,name,path,fullPath,meta} = to
            if (hasMenus){
                next()
                store.commit('allstore/menu/tabsSet', {query,params,name,path,fullPath,meta:cloneDeep(meta)});
            } else {
                hasMenus = true
                next('/home')
                if(to.path === '/home'){
                    store.commit('allstore/menu/tabsSet', {query,params,name,path,fullPath,meta:cloneDeep(meta)});
                }
            }
        }
        
    }
    
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 更改标题
  util.title(to.meta.title)
})

export default router
