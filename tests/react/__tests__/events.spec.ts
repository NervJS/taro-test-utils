import TestUtils from '@tarojs/test-utils-react'
import ReactDOMClient from 'react-dom/client'
import Events from './fixtures/components/Events/index'


const wait = (time: number) => new Promise(resolve => setTimeout(() => { resolve(null) }, time))

describe('Events', () => {

  let testUtils: TestUtils
  beforeAll(async () => {
    testUtils = new TestUtils()
    await testUtils.mount(Events)
  })

  test('ClipboardEvent', async () => {
    await testUtils.act(async () => {
      testUtils.fireEvent.copy(document.body)
    })
    expect(testUtils.queries.queryAllByText('copy!!')).toBeDefined()
  })

  test('KeyboardEvent', async () => {
    await testUtils.act(async () => {
      testUtils.fireEvent.keyPress(document.body, {
        key: 'A', code: 'A'
      })
    })
    expect(testUtils.queries.queryAllByText('keyPress!!A,A')).toBeDefined()
  })

  test('FocusEvent', async () => {
    const input = await testUtils.queries.waitForQuerySelector('.input')
    await testUtils.act(async () => {
      testUtils.fireEvent.focus(input)
    })
    expect(testUtils.queries.queryByPlaceholder(`focus!`)).toBeTruthy()
    await testUtils.act(async () => {
      testUtils.fireEvent.blur(input)
    })
    expect(testUtils.queries.queryByPlaceholder(`focus!`)).toBeFalsy()
  })

})