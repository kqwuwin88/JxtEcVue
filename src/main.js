// Vue
import Vue from 'vue'
import App from './App'

// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
// 注册组件后即可使用
Vue.component('v-chart', ECharts)
// 核心插件
import plugin from '@/plugin'
// 注册组件后即可使用

Vue.prototype.setBaseUrl = (url)=>{
    Vue.prototype.$baseUrl = url
}
Vue.prototype.closeAndGoback = ()=>{
    const path = router.app._route.fullPath
    const tabs = store.getters['allstore/menu/tabs']
    const index = tabs.findIndex(item=>item.fullPath === path)
    if(index > -1){
        store.commit('allstore/menu/tabRemove', index)
        if(index > 0){
            router.push(tabs[index-1].fullPath)
        }else{
            router.push(tabs[0].fullPath)
        }
    }else{
        router.push(tabs[0].fullPath)
    }
}
// 核心插件
Vue.use(plugin)
new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        // 设置侧边栏菜单
        this.$store.dispatch('allstore/account/load')
    },
    
    watch: {
        
    },
    mounted() {
        // // 用户登录后从数据库加载一系列的设置
        // this.$store.dispatch('allstore/account/load')
    },
}).$mount('#app')