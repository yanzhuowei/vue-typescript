import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
// 描述首页列表columnlist的形状
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}

// 专栏详情文章列表的形状描述
export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
}

// 描述user的形状
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}

// 全局 state 的形状描述
export interface GlobalDataProps {
  token: string;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
  loading: boolean;
}

const asyncAndCommit = async (url: string, mutationName: string,
  commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

export default createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: {
      isLogin: false
    }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'viking' }
    // },
    // 创建文章
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    // 改变首页列表
    fetchColumns(state, rewData) {
      state.columns = rewData.data.list
      // console.log(rewData.data.list)
    },
    // 添加到专栏列表中
    fetchColumn(state, rewData) {
      state.columns = [rewData.data]
    },
    // 改变属于专栏的文章列表
    fetchPost(state, rewData) {
      state.posts = rewData.data.list
    },
    // 改变loading状态
    setLoading(state, status) {
      state.loading = status
    },
    // 设置token
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    // 设置获取用户信息
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    logout(state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.remove('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    // 获取首页列表
    async fetchColumns({ commit },) {
      // const { data } = await axios.get('/columns')
      // commit('fetchColumns', data)

      // 抽离成公共函数优化


      return asyncAndCommit(`/columns`, 'fetchColumns', commit)
    },
    // 获取专栏详情
    async fetchColumn({ commit }, cid) {
      // const { data } = await axios.get(`/columns/${cid}`)
      // commit('fetchColumn', data)

      // 抽离成公共函数优化

      return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    // 获得属于专栏的文章列表
    async fetchPost({ commit }, cid) {
      // axios.get(`/columns/${cid}/posts`).then(res => {
      //   commit('fetchPost', res.data)
      // })

      // 优化

      // const { data } = await axios.get(`/columns/${cid}/posts`)
      // commit('fetchPost', data)

      // 抽离成公共函数优化

      return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPost', commit)

    },
    // 登陆
    login({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload })
    },
    // 获取用户信息
    fetchCurrentUser({ commit }) {
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    // 组合两个actions
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find((c) => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter((post) => post.column === cid)
    }
  },
  modules: {
  }
})
