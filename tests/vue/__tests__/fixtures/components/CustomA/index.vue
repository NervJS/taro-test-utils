<template>
  <view>
    <child-a-vue />
    <child-b-vue />
  </view>
</template>

<script>
import ChildAVue from './ChildA.vue'
import ChildBVue from './ChildB.vue'
import { ref } from 'vue'
export default {
  name: 'Index',
  components: {
    ChildAVue,
    ChildBVue
  },
  setup () {
    const msg = ref('Hello world!')
    return {
      msg
    }
  }
}
</script>

<style>

</style>