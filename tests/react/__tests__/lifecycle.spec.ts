import TestUtils from '@tarojs/test-utils-react'
import { View, Image } from '@tarojs/components'
import LifeCycle from './fixtures/components/LifeCycle'


const wait = (time: number) => new Promise(resolve => setTimeout(() => { resolve(null) }, time))

describe('LifeCycle', () => {

  let testUtls: TestUtils
  beforeAll(() => {
    testUtls = new TestUtils()
  })

  test('LifeCycle Mount ', async () => {
    await testUtls.mount(LifeCycle)
    expect(testUtls.queries.queryByText(`count: 0`)).toBeTruthy()
  })

  test('LifeCycle setState', async () => {
    await wait(1000)
    expect(testUtls.queries.queryByText(`count: 1`)).toBeTruthy()
  })

  test('LifeCycle Unmound', async () => {
    await testUtls.unmout()
    expect(document.body.className).toEqual('componentWillUnmount')
  })

})