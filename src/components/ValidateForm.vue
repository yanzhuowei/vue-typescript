<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
// 引入第三方事件监听库
import mitt from 'mitt'
type ValidateFunc = () => boolean
// 创建事件监听器
export const emitter = mitt()
export default defineComponent({
  // emits选项定义组件发出的事件
  emits: ['form-submit'],
  setup (props, context) {
    // 创建检验函数存储列表
    let funcArr: ValidateFunc[] = []
    const submitForm = () => {
      // 循环校验规则是否通过
      const result = funcArr.map((func) => func()).every((result) => result)
      context.emit('form-submit', result)
    }
    const callback = (func?: ValidateFunc) => {
      if (func) {
        funcArr.push(func)
      }
    }
    // 注册事件
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      // 卸载事件监听
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
