<template>
  <view>
    Child A
  </view>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'ChilA',
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