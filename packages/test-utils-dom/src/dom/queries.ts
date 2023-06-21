import { getNodeText } from "./helpers"
import { TWaitforParams, waitFor } from "./waitFor"


export class Queries {

  private _container = document

  setContainer(container) {
    this._container = container
  }

  querySelector(selectors: string) {
    return this._container.querySelector(selectors)
  }
  querySelectorAll(selectors: string) {
    return this._container.querySelectorAll(selectors)
  }
  waitForQuerySelector(selectors: string, params?: TWaitforParams) {
    return buildWaitFor((resolve, reject) => {
      const dom = this._container.querySelector(selectors)
      dom ? resolve(dom) : reject(`waitForQuerySelector: ${selectors} not found!!`)
    }, params)
  }
  waitForQuerySelectorAll(selectors: string, params?: TWaitforParams) {
    return buildWaitFor((resolve, reject) => {
      const doms = this._container.querySelectorAll(selectors)
      doms.length ? resolve(doms) : reject(`waitForQuerySelectorAll: ${selectors} not found!!`)
    }, params)
  }

  // text
  queryByText(text: string, selector = '*') {
    return this.queryAllByText(text, selector)[0] || null
  }
  queryAllByText(text: string, selector = '*') {
    return [...Array.from(this._container.querySelectorAll(selector))].filter(node => {
      return getNodeText(node).indexOf(text) >= 0
    })
  }
  waitForQueryByText(text: string, selector = '*', params?: TWaitforParams) {
    return buildWaitFor((resolve, reject) => {
      const dom = this.queryByText(text, selector)
      dom ? resolve(dom) : reject(`waitForQueryByText: ${text} not found!!`)
    }, params)
  }
  waitForQueryAllByText(text: string, selector = '*', params?: TWaitforParams) {
    return buildWaitFor((resolve, reject) => {
      const doms = this.queryAllByText(text, selector)
      doms.length ? resolve(doms) : reject(`waitForQueryAllByText: ${text} not found!!`)
    }, params)
  }

  // attributes
  queryByAttribute(attr: string, value: any) {
    return this.querySelector(`[${attr}='${value}']`)
  }
  queryAllByAttribute(attr: string, value: any) {
    return this.querySelectorAll(`['${attr}='${value}']`)
  }
  waitForQueryByAttribute(attr: string, value: any, params?: TWaitforParams) {
    return buildWaitFor((resolve, reject) => {
      const dom = this.queryByAttribute(attr, value)
      dom ? resolve(dom) : reject(`waitForQueryByAttribute: ${attr} not found!!`)
    }, params)
  }
  waitForQueryAllByAttribute(attr: string, value: any, params?: TWaitforParams) {
    return buildWaitFor((resolve, reject) => {
      const doms = this.queryAllByAttribute(attr, value)
      doms.length ? resolve(doms) : reject(`waitForQueryByAttribute: ${attr} not found!!`)
    }, params)
  }

  // placeholder
  queryByPlaceholder(text: string) {
    return this.queryByAttribute('placeholder', text)
  }
  queryAllByPlaceholder(text: string) {
    return this.queryAllByAttribute('placeholder', text)
  }
  waitForQueryByPlaceholder(text: string, params?: TWaitforParams) {
    return buildWaitFor((resolve, reject) => {
      const dom = this.queryByPlaceholder(text)
      dom ? resolve(dom) : reject(`waitForQueryByPlaceholder: ${text} not found!!`)
    }, params)
  }
  waitForQueryAllByPlaceholder(text: string, params?: TWaitforParams) {
    return buildWaitFor((resolve, reject) => {
      const doms = this.queryAllByPlaceholder(text)
      doms.length ? resolve(doms) : reject(`waitForQueryByPlaceholder: ${text} not found!!`)
    }, params)
  }

}

export const queries = new Queries()

function buildWaitFor(cb, params?: TWaitforParams) {
  return waitFor(() => {
    return new Promise((resolve, reject) => {
      cb(resolve, reject)
    })
  }, params)
}