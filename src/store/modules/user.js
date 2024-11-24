import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

const state = {
  // token: null
  // 持久化：应该从缓存中读取初始值
  token: getToken(),
  userInfo: {}
}

const mutations = {
  setToken(state, token) {
    state.token = token
    // token同步到缓存
    setToken(token)
  },
  removeToken(state) {
    // 删除vuex中的token
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  // 第一个参数是context，第二个才是传入的参数
  async login(context, data) {
    console.log(data)
    // 调用登陆接口,返回一个token
    const res = await login(data)
    context.commit('setToken', res)
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    context.commit('setUserInfo', res)
  }
}

export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
