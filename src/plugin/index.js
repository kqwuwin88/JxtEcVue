// Element
import ElementUI from 'element-ui'
import '@/assets/style/unit/element-variables.scss'
// flex 布局库
import 'flex.css'
// 组件
import '@/components'
// 国际化

// 功能插件
import pluginApi from '@/plugin/api'
import pluginOpen from '@/plugin/open'

export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.VUE_APP_APR
    // Element
    Vue.use(ElementUI, {
      size: 'medium', zIndex: 3000
    })
    // 插件
    Vue.use(pluginApi)
    Vue.use(pluginOpen)
  }
}
