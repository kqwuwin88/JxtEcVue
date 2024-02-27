import { Message, MessageBox } from 'element-ui'
import router from '@/router'
import api from '@/api'

export default {
    namespaced: true,
    actions: {
        async login ({ dispatch }, formQuery) {
            const res = await api.loginExec(formQuery)
            await dispatch('allstore/user/set', {userInfo: {webUrl:res.webUrl,...res.userInfo}, corpInfo: res.corpInfo}, { root: true })
            await dispatch('load')
            return res
        },
        async loginMobile ({ dispatch }, formQuery) {
            const res = await api.loginByMobile(formQuery)
            await dispatch('allstore/user/set', {userInfo: {webUrl:res.webUrl,...res.userInfo}, corpInfo: res.corpInfo}, { root: true })
            await dispatch('load')
            return res
        },
        async logout ({ commit, dispatch }, { confirm = false } = {}) {
            /**
             * @description 注销
             */
            function logout () {
                api.loginOut().then(res=>{
                    dispatch('allstore/user/set', {}, { root: true })
                    // router.push({ name: 'login' })
                    dispatch('allstore/user/init', [], { root: true })
                    setTimeout(()=>{
                        window.location.reload()
                    },300)
                }).catch(res=>{
                    // router.push({ name: 'login' })
                    // dispatch('allstore/user/init', [], { root: true })
                    setTimeout(()=>{
                        window.location.reload()
                    },300)

                })
            }
            // 判断是否需要确认
            if (confirm) {
              MessageBox.confirm('确认退出当前账户？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				iconClass: 'el-icon-warning-outline',
				customClass: 'custom-message-confirm',
				center: 'true'
			})
                .then(() => {
                    logout()
                })
                .catch(() => {
                    Message({ message: '取消注销操作' })
                })
            } else {
                logout()
            }
        },
        async roles ({ dispatch }) {
            // 加载用户名
            await dispatch('allstore/user/outer', null, { root: true })
        },
        async load ({ dispatch }) {
            // 加载用户名
            await dispatch('allstore/user/load', null, { root: true })
        }
    }
}
