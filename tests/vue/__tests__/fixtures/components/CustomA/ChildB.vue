<template>
  <view>
    Child B
  </view>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'ChilB',
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
}
</script>

<style>

</style>