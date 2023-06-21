import TestUtils from '@tarojs/test-utils-react'
import ReactDOMClient from 'react-dom/client'
import Queries from './fixtures/components/Queries'


const wait = (time: number) => new Promise(resolve => setTimeout(() => { resolve(null) }, time))

describe('Queries', () => {

  let testUtils: TestUtils

  beforeAll(async () => {
    testUtils = new TestUtils()
  })

  afterEach(() => {
    testUtils.unmout()
  })

  test('querySelector', async () => {
    await testUtils.mount(Queries)
    expect(testUtils.queries.querySelector('.view')).toBeTruthy()
    expect(testUtils.queries.querySelectorAll('.list').length).toEqual(2)
    expect(testUtils.queries.querySelector('.async-view')).toBeNull()
    expect(await testUtils.queries.waitForQuerySelector('.async-view')).toBeTruthy()
    expect((await testUtils.queries.waitForQuerySelectorAll('.async-list')).length).toEqual(2)
  })

  test('queryByText', async () => {
    await testUtils.mount(Queries)
    expect(testUtils.queries.queryByText('text value sync')).toBeTruthy()
    expect(testUtils.queries.queryAllByText('list values sync').length).toEqual(2)
    expect(testUtils.queries.queryByText('text value async')).toBeNull()
    expect(await testUtils.queries.waitForQueryByText('text value async')).toBeTruthy()
    expect((await testUtils.queries.waitForQueryAllByText('list values async')).length).toEqual(2)
  })

  test('queryByAttribute', async () => {
    await testUtils.mount(Queries)
    expect(testUtils.queries.queryByAttribute('class', 'attr')).toBeTruthy()
    expect(testUtils.queries.queryByAttribute('placeholder', 'placeholder sync')).toBeTruthy()
    expect(await testUtils.queries.waitForQueryByAttribute('class', 'async-attr')).toBeTruthy()
  })

  test('queryByPlaceholder', async () => {
    await testUtils.mount(Queries)
    expect(testUtils.queries.queryByPlaceholder('placeholder sync')).toBeTruthy()
    expect(await testUtils.queries.waitForQueryByPlaceholder('placeholder async')).toBeTruthy()
  })

})