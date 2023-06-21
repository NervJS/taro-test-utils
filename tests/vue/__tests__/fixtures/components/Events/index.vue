<template>
  <view>
    <view class="copy">{{ state.copy }}</view>
    <view class="keyPress"> {{ state.keyPress }}</view>
    <input class="input" :placeholder="state.focus ? 'focus!': 'no focus'" @focus="handleFocus(true)" @blur="handleFocus(false)" />
  </view>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const state = reactive({
  copy: '',
  keyPress: '',
  focus: false,
})

const handleFocus = (val) => { 
  state.focus = val
}


onMounted(() => {

  const handleCopy = () => { state.copy = 'copy!!' }

  const handleKeypress = (e) => {
    state.keyPress = 'keyPress!!' + e.code + ',' + e.key
  }
 

  document.addEventListener('copy', handleCopy)
  document.addEventListener('keypress', handleKeypress)
})
</script>
