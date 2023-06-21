import * as React from "react"
import { View } from "@tarojs/components"
import ChildA from './ChildA'
import ChildB from './ChildB'

export default class CustomA extends React.Component {

  render () {
    return (
      <View>
        <ChildA></ChildA>
        <ChildB></ChildB>
      </View>
    )
  }
}