import * as React from 'react'
import ReactDOMClient from 'react-dom/client'
import { configure } from '@tarojs/test-utils-dom'
import act, {
  getIsReactActEnvironment,
  setReactActEnvironment,
} from './act-compat'
import { fireEvent } from './fire-event'


const mountedContainers = new Set()
const mountedRootEntries: { container: Element, root }[] = []

function jestFakeTimersAreEnabled() {
  /* istanbul ignore else */
  if (typeof jest !== 'undefined' && jest !== null) {
    return (
      // legacy timers
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setTimeout._isMockFunction === true || // modern timers
      Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
    )
  }

  return false
}

configure({
  advanceTimersWrapper: cb => {
    return act(cb)
  },
  asyncWrapper: async cb => {
    const previousActEnvironment = getIsReactActEnvironment()
    setReactActEnvironment(false)
    try {
      const result = await cb()
      // Drain microtask queue.
      // Otherwise we'll restore the previous act() environment, before we resolve the `waitFor` call.
      // The caller would have no chance to wrap the in-flight Promises in `act()`
      await new Promise(resolve => {
        setTimeout(() => { resolve(null) }, 0)
        if (jestFakeTimersAreEnabled()) {
          jest.advanceTimersByTime(0)
        }
      })
      return result
    } finally {
      setReactActEnvironment(previousActEnvironment)
    }
  },
  eventWrapper: cb => {
    let result
    act(() => {
      result = cb()
    })
    return result
  }
})


function createConcurrentRoot(container: Element) {
  const root = ReactDOMClient.createRoot(container)
  return {
    render(element: React.ReactNode) {
      root.render(element)
    },
    unmount() {
      root.unmount()
    }
  }
}

function renderRoot(ui: React.ReactNode, params: {
  container: Element
  baseElement: Element
  root: ReturnType<typeof createConcurrentRoot>
}) {
  const { root, container, baseElement } = params

  act(() => {
    root.render(ui)
  })

  return {
    container,
    baseElement,
    unmount: () => {
      act(() => {
        root.unmount()
      })
    },
    rerender: (rerenderUi) => {
      renderRoot(rerenderUi, {
        container,
        baseElement,
        root
      })
    }
  }

}

function render(ui, params: {
  container?: Element
  baseElement?: Element
}) {
  let { container, baseElement = container } = params
  if (!baseElement) {
    baseElement = document.body
  }
  if (!container) {
    container = document.body.appendChild(document.createElement('div'))
  }

  let root: ReturnType<typeof createConcurrentRoot>

  if (!mountedContainers.has(container)) {
    root = createConcurrentRoot(container)
    mountedContainers.add(container)
    mountedRootEntries.push({ container, root })
  } else {
    mountedRootEntries.forEach(rootEntry => {
      if (rootEntry.container === container) {
        root = rootEntry.root
      }
    })
  }

  return renderRoot(ui, {
    container,
    baseElement,
    root: root!,
  })
}

export * from '@tarojs/test-utils-dom'

export { render, act, fireEvent }