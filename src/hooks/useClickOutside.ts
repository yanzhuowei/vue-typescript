import { ref, onMounted, onUnmounted, Ref } from 'vue'

/**
 * @Author: [yanzhuowei]
 * @description: 该函数判断是否点击在某个元素外面
 * @param {Ref} elementRef
 * @return {Ref} boolean
 */

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

export default useClickOutside
