import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'
import { cloneDeep } from 'lodash'
export default {
  namespaced: true,
  state: {
    // 用户信息
    userInfo: {},
    corpInfo: {},
    permission:[],
    userType:'',
    themeName:'blue',
    isExpired:false,
  },
  getters:{
    userInfo:state=>state.userInfo,
    corpInfo:state=>state.corpInfo,
    permission:state=>state.permission,
    userType:state=>state.userType,
    themeName:state=>state.themeName,
  },
  mutations: {
    dom (state) {
      const newColor = state.themeName === 'blue' ? '#2a82db' : '#d12926'
      var options = {
        newColors: cloneDeep(forElementUI.getElementUISeries(newColor)),
        changeUrl (cssUrl) {
          return `/${cssUrl}`
        }
      }
      client.changer.changeColor(options)
      document.body.className = `theme-${state.themeName}`
    }
  },
  actions: {
    async setExpired ({ state }, status) {
      state.isExpired = status
    },
    async setTheme ({ state, commit, dispatch }, themeName) {
      state.themeName = themeName
      // 将 vuex 中的主题应用到 dom
      commit('dom')
      await dispatch('allstore/db/set', {
        dbName: 'sys',
        path: 'user.themeName',
        value: state.themeName,
        user: true
      }, { root: true })
    },
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set ({ state, dispatch }, {userInfo, corpInfo}) {
      // store 赋值
      state.userInfo = userInfo
      state.corpInfo = corpInfo
      // 持久化
      await dispatch('allstore/db/set', {
        dbName: 'sys',
        path: 'user.userInfo',
        value: userInfo,
        user: true
      }, { root: true })
      await dispatch('allstore/db/set', {
        dbName: 'sys',
        path: 'user.corpInfo',
        value: corpInfo,
        user: true
      }, { root: true })
    },
    async setCorpInfo({ state, dispatch }, corpInfo){
      state.corpInfo = corpInfo
      await dispatch('allstore/db/set', {
        dbName: 'sys',
        path: 'user.corpInfo',
        value: corpInfo,
        user: true
      }, { root: true })
    },
    async setusertype ({ state, dispatch }, info) {
      // store 赋值
      state.userType = info
    },
    async init ({ state, dispatch }, permission) {
        // store 赋值
        state.permission = permission
        // 持久化
        await dispatch('allstore/db/set', {
          dbName: 'sys',
          path: 'user.permission',
          value: permission,
          user: true
        }, { root: true })
      },
    async outer ({ state, dispatch }) {
        state.permission = await dispatch('allstore/db/get', {
            dbName: 'sys',
            path: 'user.permission',
            defaultValue: [],
            user: true
        }, { root: true })
    },
      
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load ({ state, dispatch, commit }) {
      // store 赋值
      state.userInfo = await dispatch('allstore/db/get', {
        dbName: 'sys',
        path: 'user.userInfo',
        defaultValue: {},
        user: true
      }, { root: true })
      state.corpInfo = await dispatch('allstore/db/get', {
        dbName: 'sys',
        path: 'user.corpInfo',
        defaultValue: {},
        user: true
      }, { root: true })
      state.themeName = await dispatch('allstore/db/get', {
        dbName: 'sys',
        path: 'user.themeName',
        defaultValue: 'blue',
        user: true
      }, { root: true })
      commit('dom')
    }
  }
}
