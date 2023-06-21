import { Component } from "react"
import { View } from "@tarojs/components"

export default class LifeCycle extends Component {

  state = {
    count: 0
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        count: this.state.count + 1
      })
    }, 1000)
  }

  componentWillUnmount(): void {
    document.body.setAttribute('class', 'componentWillUnmount')
  }

  render() {
    return (
      <View>
        {`count: ${this.state.count}`}
      </View>
    )
  }
}