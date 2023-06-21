import { View, Text } from '@tarojs/components'
import { useLoad, useDidShow, useDidHide } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function Index() {

  const [load, setOnload] = useState(false)
  const [show, setDidShow] = useState(false)
  const [hide, setDidHide] = useState(false)

  useLoad(() => {
    setOnload(true)
  })

  useDidShow(() => {
    setDidShow(true)
  })

  useDidHide(() => {
    setDidHide(true)
  })
  
  return (
    <View className='index'>
      <Text>First Page</Text>
      <Text>{load ? 'first page load': ''}</Text>
      <Text>{show ? 'first page show': ''}</Text>
      <Text>{hide ? 'first page hide': ''}</Text>
    </View>
  )
}
