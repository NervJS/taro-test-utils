import { View, Input } from '@tarojs/components'
import { useEffect, useState } from 'react'

const Index: React.FC = () => {

  const [copy, setCopy] = useState('')
  const [keyPress, setkeyPress] = useState('')
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    document.addEventListener('copy', handleCopy)
    document.addEventListener('keypress', handleKeypress)
  }, [])

  const handleCopy = () => { setCopy('copy!!') }

  const handleKeypress = (e: KeyboardEvent) => {
    setkeyPress('keyPress!!' + e.code + ',' + e.key)
  }

  const handleFocus = (val) => { 
    setFocus(val)
  }

  return (
    <View>
      <View className='copy'>{copy}</View>
      <View className='keyPress'>{keyPress}</View>
      <Input className='input' placeholder={focus ? 'focus!': 'no focus'} onFocus={handleFocus.bind(this, true)} onBlur={handleFocus.bind(this, false)} />
    </View>
  )
}

export default Index