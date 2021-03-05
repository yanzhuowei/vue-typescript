<template>
  <div class="container">
    <GlobalHeader :user="currentUser"></GlobalHeader>
    <loader v-if="isLoading"></loader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import GlobalHeader from '@/components/GlobalHeader.vue'
import Loader from './components/Loader.vue'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const isLoading = computed(() => store.state.loading)
    const currentUser = computed(() => store.state.user)
    return {
      isLoading,
      currentUser
    }
  }
})
</script>
