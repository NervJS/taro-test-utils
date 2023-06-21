<template>
  <view class="seoncd">
    <text>Second Page</text>
    <text>{{ state.load ? 'seoncd page load': '' }}</text>
    <text>{{ state.show ? 'seoncd page show': '' }}</text>
    <text>{{ state.reachBottom ? 'seoncd page reachBottom': '' }}</text>
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
  onReachBottom() {
    this.state.reachBottom = true
  },
  setup () {
    const state = reactive({
      load: false,
      show: false,
      reachBottom: false
    })

    return {
      state
    }
  }
}
</script>
