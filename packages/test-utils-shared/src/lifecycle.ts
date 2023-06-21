
import type { AppInstance, PageInstance } from '@tarojs/runtime'
import type { PageResizeObject, PageScrollObject, ShareAppMessageObject, TabItemTapObject } from '@tarojs/taro'
import stacks from '@tarojs/router/dist/router/stack'

const appProxies: Record<string, Promise<any>> = {}
export function proxyAppLifeCycle(app: AppInstance) {
  const lifeCyclies = ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound', 'onUnhandledRejection']
  lifeCyclies.forEach((lifecycle) => {
    const originLifeCycle = app[lifecycle]
    appProxies[lifecycle] = new Promise<void>((resolve) => {
      app[lifecycle] = (...args) => {
        if (typeof originLifeCycle === 'function') {
          originLifeCycle.apply(app, args)
        }
        // 触发生命周期
        resolve(...args)
      }
    })
  })
}

// 入口级别
export const app = {
  onLaunch() {
    return appProxies['onLaunch']
  },
  onShow() {
    return appProxies['onShow']
  },
  onHide() {
    return appProxies['onHide']
  },
  onError(): Promise<Error> {
    return appProxies['onError']
  },
  onPageNotFound(): Promise<{ path: string, query: object, isEntryPage: boolean}> {
    return appProxies['onPageNotFound']
  },
  onUnhandledRejection(): Promise<{ reason: string, promise: Promise<unknown>}>  {
    return appProxies['onUnhandledRejection']
  }
}

const pages: PageInstance[] = []
// 劫持stack.push
const oldStrackPush = stacks.push
stacks.push = (page: PageInstance) => {
  pages.push(page)
  const oldOnLoad = page.onLoad
  page.onLoad = (params, cb) => {
    const callback = () => {
      proxyPageLifeCycle(page)
      cb?.()
    }
    return oldOnLoad?.call(page, params, callback)
  }
  return oldStrackPush.call(stacks, page)
}

const PAGE_LIFECYCLE = ['onLoad', 'onUnload', 'onShow', 'onHide', 'onReady', 'onOptionMenuClick', 'onPopMenuClick', 'onPullDownRefresh', 'onPullIntercept', 'onReachBottom', 'onResize', 'onShareAppMessage', 'onTabItemTap', 'onTitleClick']
function proxyPageLifeCycle(page: PageInstance) {
  // 拿到path
  const pagePath = page.path?.split('?')[0] || ''
  getPageLifeCyclies(pagePath)
  const resolves = pageResolves.get(pagePath)!
  PAGE_LIFECYCLE.forEach((lifecycle) => {
    // onLoad特殊处理
    if (lifecycle === 'onLoad') {
      resolves[lifecycle]()
      return
    }
    const originLifeCycle = page[lifecycle]
    page[lifecycle] = (...args) => {
      if (typeof originLifeCycle === 'function') {
        originLifeCycle.apply(page, args)
      }
      // 触发promise
      resolves[lifecycle]()
    }
  })
}

const pageLifeCyclies: Map<string, Record<string, Promise<void>>> = new Map()
const pageResolves: Map<string, Record<string, (value?: unknown) => void>> = new Map()

function createPageLifeCycle(path: string) {
  const lifeCyclies = {}
  PAGE_LIFECYCLE.forEach((lifecycle) => {
    lifeCyclies[lifecycle] = new Promise((resolve) => {
      const resolies = getPageResolves(path)
      resolies[lifecycle] = resolve
      pageResolves.set(path, resolies)
    })
  })
  return lifeCyclies
}

function getPageResolves(path: string) {
  if (!pageResolves.has(path)) {
    pageResolves.set(path, {})
  }
  return pageResolves.get(path)!
}

function getPageLifeCyclies(path: string) {
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  if (!pageLifeCyclies.has(path)) {
    // 创建一个新的
    pageLifeCyclies.set(path, createPageLifeCycle(path))
  }
  return pageLifeCyclies.get(path)!
}

function getPage(path: string) {
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  const pagePath = path.split('?')[0]
  return pages.find((page) => page.path?.startsWith(pagePath))
}

// page级别
export const page = {
  onLoad(path: string) {
    return getPageLifeCyclies(path)['onLoad']
  },
  onUnload(path: string) {
    return getPageLifeCyclies(path)['onUnload']
  },
  onShow(path: string) {
    return getPageLifeCyclies(path)['onShow']
  },
  onHide(path: string) {
    return getPageLifeCyclies(path)['onHide']
  },
  onReady(path: string) {
    return getPageLifeCyclies(path)['onReady']
  },
  onPullDownRefresh(path: string) {
    return getPageLifeCyclies(path)['onPullDownRefresh']
  },
  triggerPullDownRefresh(path: string) {
    getPage(path)?.onPullDownRefresh?.()
  },
  onReachBottom(path: string) {
    return getPageLifeCyclies(path)['onReachBottom']
  },
  triggerReachBottom(path: string) {
    getPage(path)?.onReachBottom?.()
  },
  onPageScroll(path: string) {
    return getPageLifeCyclies(path)['onPageScroll']
  },
  triggerPageScroll(path: string, opt: PageScrollObject) {
    getPage(path)?.onPageScroll?.(opt)
  },
  onAddToFavorites(path: string) {
    return getPageLifeCyclies(path)['onAddToFavorites']
  },
  triggerAddToFavorites(path: string) {
    getPage(path)?.onAddToFavorites?.()
  },
  onShareAppMessage(path: string) {
    return getPageLifeCyclies(path)['onShareAppMessage']
  },
  triggerShareAppMessage(path: string, opt: ShareAppMessageObject) {
    // @ts-ignore
    getPage(path)?.onShareAppMessage?.(opt)
  },
  onShareTimeline(path: string) {
    return getPageLifeCyclies(path)['onShareTimeline']
  },
  triggerShareTimeline(path: string) {
    getPage(path)?.onShareTimeline?.()
  },
  onResize(path: string) {
    return getPageLifeCyclies(path)['onResize']
  },
  triggerResize(path: string, opt: PageResizeObject) {
    getPage(path)?.onResize?.(opt)
  },
  onTabItemTap(path: string) {
    return getPageLifeCyclies(path)['onTabItemTap']
  },
  triggerTabItemTap(path: string, opt: TabItemTapObject) {
    getPage(path)?.onTabItemTap?.(opt)
  },
  onSaveExitState(path: string) {
    return getPageLifeCyclies(path)['onSaveExitState']
  },
  triggerSaveExitState(path: string) {
    getPage(path)?.onSaveExitState?.()
  },
  onTitleClick(path: string) {
    return getPageLifeCyclies(path)['onTitleClick']
  },
  triggerTitleClick(path: string) {
    getPage(path)?.onTitleClick?.()
  },
  onOptionMenuClick(path: string) {
    return getPageLifeCyclies(path)['onOptionMenuClick']
  },
  triggerOptionMenuClick(path: string) {
    getPage(path)?.onOptionMenuClick?.()
  },
  onPopMenuClick(path: string) {
    return getPageLifeCyclies(path)['onPopMenuClick']
  },
  triggerPopMenuClick(path: string) {
    getPage(path)?.onPopMenuClick?.()
  },
  onPullIntercept(path: string) {
    return getPageLifeCyclies(path)['onPullIntercept']
  },
  triggerPullIntercept(path: string) {
    getPage(path)?.onPullIntercept?.()
  }
}
