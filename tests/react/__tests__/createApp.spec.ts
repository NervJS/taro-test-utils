import TestUtils from '@tarojs/test-utils-react'
import { navigateTo } from '@tarojs/router'

const wait = (time: number) => new Promise(resolve => setTimeout(() => { resolve(null) }, time))

describe('CreateApp', () => {

  let testUtils: TestUtils

  beforeAll(async () => {
    testUtils = new TestUtils()
    await testUtils.createApp()
  })

  test('app lifecycle', async () => {
    await testUtils.AppLifecycle.onLaunch()
    expect(testUtils.queries.queryByAttribute('launch', '1')).toBeTruthy()
    await testUtils.AppLifecycle.onShow()
    expect(testUtils.queries.queryByAttribute('show', '1')).toBeTruthy()
  })

  test('page lifecycle', async () => {
    await testUtils.PageLifecycle.onShow('pages/index/index')
    await wait(10)
    expect(testUtils.html()).toMatchSnapshot()
  })

  test('router change', async () => {
    navigateTo({
      url: '/pages/second/index'
    })
    await testUtils.PageLifecycle.onShow('pages/second/index')
    await wait(10)
    expect(testUtils.queries.waitForQueryByText('seoncd page show')).toBeTruthy()
  })


  test('trigger lifecycle', async () => {
    await testUtils.PageLifecycle.triggerReachBottom('pages/second/index')
    await wait(10)
    expect(testUtils.queries.waitForQueryByText('seoncd page reachBottom')).toBeTruthy()
  })
})