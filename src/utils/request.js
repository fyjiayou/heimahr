import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

// 创建一个新的axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 20000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 注入token
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // 失败执行promise
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  resp => {
    // resp.data 默认json格式
    if (resp.data instanceof Blob) {
      return resp.data
    }
    const { data, message, success } = resp.data
    if (success) {
      return data
    }
    Message({ type: 'error', message: message })
    return Promise.reject(new Error(message))
  },
  async error => {
    console.log('错误响应：', error.response)
    if (error.response.status === 401) {
      Message({ type: 'warning', message: 'token超时' })
      // token超时 或 不正确
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(error)
    }
    Message({ type: 'error', message: error.message })
    return Promise.reject(error)
  }
)

export default service
