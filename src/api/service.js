import axios from 'axios'
import { get } from 'lodash'
import { errorCreate, errorLog } from './tools'
import { Loading } from 'element-ui'
import router from '@/router'
import store from '@/store/index'

let needLoadingRequestCount = 0
let loading
function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}
function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {
    loading.close()
}

/**
 * @description 创建请求实例
 */
function createService () {
  // 创建一个 axios 实例
  const service = axios.create()
  service.defaults.withCredentials = true
  // 请求拦截
  service.interceptors.request.use(
    config => {
        showFullScreenLoading()
        return config
    },
    error => {
      // 发送失败
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
        tryHideFullScreenLoading()
      // dataAxios 是 axios 返回数据中的 data
      const dataAxios = response.data
      // 这个状态码是和后端约定的
      const { code,status } = dataAxios
      // 根据 code 进行判断
      if (code === undefined) {
        // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
        return dataAxios
      } else {
        // 有 code 代表这是一个后端接口 可以进行进一步的判断
        switch (code) {
            case 200:
                // [ 示例 ] code === '200' 代表没有错误
                return dataAxios
            case 201:
                // [ 示例 ] 其它和后台约定的 code
                errorCreate(`[ code: xxx ] ${dataAxios.msg}: ${response.config.url}`)
                break
            case -1:
                // [ 示例 ] 其它和后台约定的 code
                router.push('/login')
                setTimeout(()=>{
                    window.location.reload()
                },300)
                store.dispatch('allstore/user/setExpired', false)
                errorLog({message:dataAxios.msg})
                return Promise.reject(dataAxios)
                break
            case -2:
                store.dispatch('allstore/user/setExpired', true)
                errorCreate(`${dataAxios.msg}`)
                return Promise.reject(dataAxios)
                break
            case -3:
                store.dispatch('allstore/user/setExpired', true)
                errorCreate(`${dataAxios.msg}`)
                return Promise.reject(dataAxios)
                break
            default:
                // 不是正确的 code
                store.dispatch('allstore/user/setExpired', false)
                errorCreate(`${dataAxios.msg}`)
                errorLog({message:dataAxios.msg})
                return Promise.reject(dataAxios)
                break
        }
      }
    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
      tryHideFullScreenLoading()
      return Promise.reject(error)
    }
  )
  return service
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction (service) {
  return function (method,url,params) {
    var config = {
        method: method,
        url: url,
        data: method === 'post' || method === 'put' ? params : null,
        params: method === 'get' || method === 'delete' ? params : null,
    }
    
    const configDefault = {
      headers: {
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      timeout: 30000,
      baseURL: process.env.VUE_APP_APR,
      data: {}
    }
    return service(Object.assign(configDefault, config))
  }
}



const service = createService()
export default {
    get: function(url, params) {
        return createRequestFunction(service)('get', url, params)
    },
    post: function(url, params) {
        return createRequestFunction(service)('post', url, params)
    },
    put: function(url, params) {
        return createRequestFunction(service)('put', url, params)
    },
    del: function(url, params) {
        return createRequestFunction(service)('delete', url, params)
    }
}



