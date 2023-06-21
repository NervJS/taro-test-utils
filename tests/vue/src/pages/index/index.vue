<template>
  <view class="index">
    <text>First Page</text>
    <text>{{ state.load ? 'first page load': '' }}</text>
    <text>{{ state.show ? 'first page show': '' }}</text>
    <text>{{ state.hide ? 'first page hide': '' }}</text>
  </view>
</template>

<script>
import { reactive } from 'vue'
import './index.scss'

export default {
  onLoad() {
    this.state.load = true
  },
  onShow() {
    this.state.show = true
  },
  onHide() {
    this.state.hide = true
  },
  setup () {
    const state = reactive({
      load: false,
      show: false,
      hide: false
    })

    return {
      state
    }
  }
}
</script>
