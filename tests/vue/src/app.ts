import { createApp } from 'vue'

const App = createApp({
  onLaunch() {
    document.body.setAttribute('launch', '1')
  },
  onShow() {
    document.body.setAttribute('show', '1')
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

export default App
