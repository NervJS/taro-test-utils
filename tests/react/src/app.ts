import React from 'react'
import { useDidShow, useLaunch } from '@tarojs/taro'
import './app.scss'

const App: React.FC<{ children: any }> = ({ children }) => {

  useLaunch(() => {
    document.body.setAttribute('launch', '1')
  })

  useDidShow(() => {
    document.body.setAttribute('show', '1')
  })

  // children 是将要会渲染的页面！
  return children
}

export default App
