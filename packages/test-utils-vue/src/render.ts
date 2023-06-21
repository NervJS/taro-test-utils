import { mount } from '@vue/test-utils'
import * as components from '@tarojs/components/lib/vue3'
import Vue from 'vue'

const mountedWrappers = new Set()

function render(
  Component,
  params: {
    // TODO，支持@vue/test-utils 所有入参
    props: any,
    slots: any,
    container?: HTMLElement
    baseElement?: HTMLElement
  }
) {
  const { props, slots } = params
  let { container, baseElement = container } = params
  if (!baseElement) {
    baseElement = document.body
  }
  if (!container) {
    container = document.body.appendChild(document.createElement('div'))
  }

  const wrapper = mount(Component, {
    props: props || {},
    slots: slots || {},
    attachTo: container,
    components: (() => {
      const componentsMapping = {}
      Object.entries(components).forEach(([name, definition]) => {
        if (typeof definition?.render === 'function') {
          const tagName = 'taro' + name.replace(new RegExp('([A-Z])', 'g'), '-$1').toLowerCase()
          const comp = Vue.extend(definition)
          componentsMapping[tagName] = comp
        }
      })
      return componentsMapping
    })()
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  unwrapNode(wrapper.parentElement)

  mountedWrappers.add(wrapper)

  return {
    container,
    baseElement,
    unmount: () => wrapper.destroy(),
    rerender: props => wrapper.setProps(props),
  }
}

function unwrapNode(node) {
  node.replaceWith(...node.childNodes)
}

function cleanup() {
  mountedWrappers.forEach(cleanupAtWrapper)
}

function cleanupAtWrapper(wrapper) {
  if (
    wrapper.element.parentNode &&
    wrapper.element.parentNode.parentNode === document.body
  ) {
    document.body.removeChild(wrapper.element.parentNode)
  }

  wrapper.unmount()
  mountedWrappers.delete(wrapper)
}

export { render, cleanup }