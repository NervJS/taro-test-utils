<template>
  <view>
    {{`count: ${state.count}`}}
  </view>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'

const state = reactive({
  count: 0
})

onMounted(() => {
  setTimeout(() => {
    state.count++
  }, 1000)
})
onUnmounted(() => {
  document.body.setAttribute('class', 'componentWillUnmount')
})
</script>
