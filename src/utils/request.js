import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'

// 创建一个新的axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 5000 // 超时时间
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
    console.log(resp.data)
    const { data, message, success } = resp.data
    if (success) {
      return data
    }
    Message({ type: 'error', message: message })
    return Promise.reject(new Error(message))
  },
  error => {
    Message({ type: 'error', message: error.message })
    return Promise.reject(error)
  }
)

export default service
