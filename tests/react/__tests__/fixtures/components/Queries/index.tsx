import { View, Input, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'

const Index: React.FC = () => {

  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 1000)
  })

  return (
    <View>
      <View className='view'></View>
      <Text className='text'>text value sync</Text>
      <Input className='input' placeholder='placeholder sync'  />
      <View className='attr'></View>
      <View className='list'>list values sync</View>
      <View className='list'>list values sync </View>

      {
        show && (
          <>
            <View className='async-view'></View>
            <Text className='async-text'>text value async</Text>
            <Input className='async-input' placeholder='placeholder async'  />
            <View className='async-attr'></View>
            <View className='async-list'>list values async</View>
            <View className='async-list'>list values async</View>
          </>
        )
      }
    </View>
  )
}

export default Index