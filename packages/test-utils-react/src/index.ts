import * as React from 'react'
import ReactDOMClient from 'react-dom/client'
import { join } from 'path'

import { createRouter } from '@tarojs/router'
import { AppInstance, Current, PageInstance } from '@tarojs/runtime'
import { createReactApp } from '@tarojs/plugin-framework-react/dist/runtime'
import { prettyDOM, Queries } from '@tarojs/test-utils-dom'
import { app as AppLifecycle, page as PageLifecycle, proxyAppLifeCycle } from '@tarojs/test-utils-shared'

import type { FunctionComponent, ComponentClass } from 'react'
import type { FireEvent } from '@tarojs/test-utils-dom'
import { act, render, fireEvent } from './pure'

type TRenderParams<T> = {
  props?: T
  // 挂载上去的节点
  container?: HTMLElement
  // 打印出来的节点
  baseElement?: HTMLElement
}

const waitRAF = () => new Promise(resolve => requestAnimationFrame(resolve))

window.React = React

class ReactTestUtil {

  private _inst: ReturnType<typeof render>

  async mount<T extends Record<any, any>>(ui: FunctionComponent<T> | ComponentClass<T>, params: TRenderParams<T> = {}) {
    const {
      props,
      container,
      baseElement
    } = params
    this._inst = render(React.createElement(ui, props), {
      container,
      baseElement
    })

    // 等待web component渲染完成
    await waitRAF()
  }

  unmout(): void {
    this._inst.unmount()
  }

  fireEvent = fireEvent as unknown as FireEvent

  queries: Queries = new Queries()

  act = act

  AppLifecycle: typeof AppLifecycle = AppLifecycle

  PageLifecycle: typeof PageLifecycle = PageLifecycle

  async createApp(): Promise<{
    app: AppInstance,
    page: PageInstance
  }> {
    // @ts-ignore
    global.defineAppConfig = c => c   // 删除宏

    const appPath = process.cwd() // 入口目录

    // 自动引入
    const app = require(join(appPath, 'src', 'app')).default
    const config = require(join(appPath, 'src', 'app.config')).default

    if (!app || !config) {
      throw new Error('找不到app/app.config路径')
    }

    config.routes = config.pages!.map(path => ({
      path,
      load: async function (context, params) {
        const page = require(join(appPath, 'src', context.route.path)).default
        return [page, context, params]
      }
    }))
    config.router = { mode: 'hash' }

    const appInst = createReactApp(app, React, ReactDOMClient, config)
    proxyAppLifeCycle(appInst)

    // TODO 
    Current.page = {
      path: '/pages/index/index'
    }
    document.body.innerHTML = `<div id="app"><div id="${Current.page.path}" class="taro_page" /></div>`

    // @ts-ignore
    createRouter(appInst, config, 'React')

    await waitRAF()

    return {
      app: appInst,
      page: Current.page
    }
  }

  html() {
    if (this._inst) {
      if (!document.contains(this._inst.container)) {
        throw new Error('container 节点没有挂载到document上！这将导致WebComponent无法触发生命周期导致无法正常渲染')
      }
      return prettyDOM(this._inst.baseElement)
    }
    return prettyDOM(document.body)
  }


}

export default ReactTestUtil
