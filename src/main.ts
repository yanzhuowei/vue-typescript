import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
axios.defaults.baseURL = 'http://api.vikingship.xyz/api/'

// 请求和响应拦截器设置loading状态
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 1000)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setLoading', false)
  return Promise.reject(e.response.data)
})

createApp(App).use(router).use(store).mount('#app')
