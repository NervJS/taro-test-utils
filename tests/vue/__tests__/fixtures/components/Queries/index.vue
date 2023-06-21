<template>
  <view>
    <view>
      <view className='view'></view>
      <text className='text'>text value sync</text>
      <input className='input' placeholder='placeholder sync'  />
      <view className='attr'></view>
      <view className='list'>list values sync</view>
      <view className='list'>list values sync </view>
    </view>
    <view v-if="state.show">
      <view className='async-view'></view>
      <text className='async-text'>text value async</text>
      <input className='async-input' placeholder='placeholder async'/>
      <view className='async-attr'></view>
      <view className='async-list'>list values async</view>
      <view className='async-list'>list values async</view>
    </view>
  </view>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const state = reactive({
  show: false
})

onMounted(() => {
  setTimeout(() => {
    state.show = true
  }, 1000)
})
</script>
