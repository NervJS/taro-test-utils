import { View, Text } from '@tarojs/components'
import { useLoad, useDidShow, useReachBottom } from '@tarojs/taro'
import { useState } from 'react'

export default function Index() {

  const [load, setOnload] = useState(false)
  const [show, setDidShow] = useState(false)
  const [reachBottom, setReachBottom] = useState(false)

  useLoad(() => {
    setOnload(true)
  })

  useDidShow(() => {
    setDidShow(true)
  })

  useReachBottom(() => {
    setReachBottom(true)
  })

  return (
    <View className='seoncd'>
      <Text>Second Page</Text>
      <Text>{load ? 'seoncd page load': ''}</Text>
      <Text>{show ? 'seoncd page show': ''}</Text>
      <Text>{reachBottom ? 'seoncd page reachBottom': ''}</Text>
    </View>
  )
}
