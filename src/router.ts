import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import PostDetail from './views/PostDetail.vue'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // 登陆注册 未登录才能访问
    {
      path: '/login',
      name: 'login',
      component: Login,
      // 路由元信息 可以在路由上添加额外的信息
      meta: { redirectAlreadyLogin: true }
    },
    // 登陆注册 未登录才能访问
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { redirectAlreadyLogin: true }
    },
    // 新建文章页面 登陆才能访问
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(store.state)
  // console.log(to.meta.requiredLogin,!store.state.user.isLogin)
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    // 有requiredLogin并且没有登陆 调转到登陆
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin){
    next('/')
  }else {
    next()
  }
})

export default router
