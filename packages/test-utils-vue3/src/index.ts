import { Queries, prettyDOM } from '@tarojs/test-utils-dom'
import { app as AppLifecycle, page as PageLifecycle, proxyAppLifeCycle } from '@tarojs/test-utils-shared'
import { render } from './render'
import { fireEvent } from './fire-event'
import { Current } from '@tarojs/runtime'
import { join } from 'path'
import { createRouter } from '@tarojs/router'
import { createVue3App } from '@tarojs/plugin-framework-vue3/dist/runtime'
import * as components from '@tarojs/components/lib/vue3'
import { initVue3Components } from '@tarojs/components/lib/vue3/components-loader'
import { h, nextTick } from 'vue'

import type { AppInstance, PageInstance } from '@tarojs/runtime'
import type { FireEvent } from '@tarojs/test-utils-dom'


type TRenderParams = {
  props?: Record<string, any>
  slots?: Record<string, any>
  // 挂载上去的节点
  container?: HTMLElement
  // 打印出来的节点
  baseElement?: HTMLElement
}


const waitRAF = () => new Promise(resolve => requestAnimationFrame(resolve))

class VueTestUtil {

  private _inst: ReturnType<typeof render>

  async mount(ui: any, params: TRenderParams = {}) {
    const {
      props = {},
      slots = {},
      container,
      baseElement
    } = params
    this._inst = render(ui, {
      props,
      slots,
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

  async act(cb: () => void) {
    await cb()
    await nextTick(() => { })
  }

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
        const appPath = process.cwd() // 入口目录
        const page = require(join(appPath, 'src', context.route.path)).default
        return [page, context, params]
      }
    }))


    config.router = { mode: 'hash' }

    initVue3Components(app, (() => {
      const componentsMapping = {}
      Object.entries(components).forEach(([name, component]) => {
        const tagName = component?.displayName
        if (typeof tagName === 'string' && tagName) {
          component.name = name
          componentsMapping[tagName.replace(/-core$/, '')] = component
        }
      })
      return componentsMapping
    })())

    const appInst = createVue3App(app, h, config)
    proxyAppLifeCycle(appInst)

    Current.page = {
      path: '/pages/index/index'
    }
    document.body.innerHTML = `<div id="app"><div id="${Current.page.path}" class="taro_page" /></div>`

    createRouter(appInst, config)

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

export default VueTestUtil