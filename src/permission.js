import router from '@/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store'

const whiteList = ['/login', '/404']
// 前置守卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  nProgress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/')
      // next(地址) 并没有执行后置守卫
      nProgress.done()
    } else {
      next()
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nProgress.done()
    }
  }
})

// 后置守卫
router.afterEach((to, from) => {
  // 关闭进度条
  nProgress.done()
})
