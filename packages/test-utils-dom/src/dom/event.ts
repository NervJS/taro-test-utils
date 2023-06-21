import { eventMap, eventAliasMap } from "./event-map"
import config from '../config'


export interface FireEvent {
  // Clipboard Events
  copy(ele: Element, params?: ClipboardEventInit): void
  cut(ele: Element, params?: ClipboardEventInit): void
  paste(ele: Element, params?: ClipboardEventInit): void
  // Composition Events
  compositionEnd(ele: Element, params?: CompositionEventInit): void
  compositionStart(ele: Element, params?: CompositionEventInit): void
  compositionUpdate(ele: Element, params?: CompositionEventInit): void
  // Keyboard Events
  keyDown(ele: Element, params?: KeyboardEventInit): void
  keyPress(ele: Element, params?: KeyboardEventInit): void
  keyUp(ele: Element, params?: KeyboardEventInit): void
  // Focus Events
  focus(ele: Element, params?: FocusEventInit): void
  blur(ele: Element, params?: FocusEventInit): void
  focusIn(ele: Element, params?: FocusEventInit): void
  focusOut(ele: Element, params?: FocusEventInit): void
  // Form Events
  change(ele: Element, params?: EventInit): void
  input(ele: Element, params?: InputEventInit): void
  invalid(ele: Element, params?: EventInit): void
  submit(ele: Element, params?: EventInit): void
  reset(ele: Element, params?: EventInit): void
  // Mouse Events
  click(ele: Element, params?: MouseEventInit): void
  contextMenu(ele: Element, params?: MouseEventInit): void
  dblClick(ele: Element, params?: MouseEventInit): void
  doubleClick(ele: Element, params?: MouseEventInit): void
  drag(ele: Element, params?: MouseEventInit): void
  dragEnd(ele: Element, params?: MouseEventInit): void
  dragEnter(ele: Element, params?: MouseEventInit): void
  dragExit(ele: Element, params?: MouseEventInit): void
  dragLeave(ele: Element, params?: MouseEventInit): void
  dragOver(ele: Element, params?: MouseEventInit): void
  drop(ele: Element, params?: MouseEventInit): void
  mouseDown(ele: Element, params?: MouseEventInit): void
  mouseEnter(ele: Element, params?: MouseEventInit): void
  mouseLeave(ele: Element, params?: MouseEventInit): void
  mouseMove(ele: Element, params?: MouseEventInit): void
  mouseOut(ele: Element, params?: MouseEventInit): void
  mouseOver(ele: Element, params?: MouseEventInit): void
  mouseUp(ele: Element, params?: MouseEventInit): void
  // Selection Events
  select(ele: Element, params?: EventInit): void
  // Touch Events
  touchCancel(ele: Element, params?: TouchEventInit): void
  touchEnd(ele: Element, params?: TouchEventInit): void
  touchMove(ele: Element, params?: TouchEventInit): void
  touchStart(ele: Element, params?: TouchEventInit): void
  // UI Events
  resize(ele: Element, params?: UIEventInit): void
  scroll(ele: Element, params?: UIEventInit): void
  // Wheel Events
  wheel(ele: Element, params?: WheelEventInit): void
  // Media Events
  abort(ele: Element, params?: EventInit): void
  canPlay(ele: Element, params?: EventInit): void
  canPlayThrough(ele: Element, params?: EventInit): void
  durationChange(ele: Element, params?: EventInit): void
  emptied(ele: Element, params?: EventInit): void
  encrypted(ele: Element, params?: EventInit): void
  ended(ele: Element, params?: EventInit): void
  loadedData(ele: Element, params?: EventInit): void
  loadedMetadata(ele: Element, params?: EventInit): void
  loadStart(ele: Element, params?: ProgressEventInit): void
  pause(ele: Element, params?: EventInit): void
  play(ele: Element, params?: EventInit): void
  playing(ele: Element, params?: EventInit): void
  progress(ele: Element, params?: ProgressEventInit): void
  rateChange(ele: Element, params?: EventInit): void
  seeked(ele: Element, params?: EventInit): void
  seeking(ele: Element, params?: EventInit): void
  stalled(ele: Element, params?: EventInit): void
  suspend(ele: Element, params?: EventInit): void
  timeUpdate(ele: Element, params?: EventInit): void
  volumeChange(ele: Element, params?: EventInit): void
  waiting(ele: Element, params?: EventInit): void
  // Events
  load(ele: Element, params?: EventInit): void
  error(ele: Element, params?: EventInit): void
  // Animation Events
  animationStart(ele: Element, params?: AnimationEventInit): void
  animationEnd(ele: Element, params?: AnimationEventInit): void
  animationIteration(ele: Element, params?: AnimationEventInit): void
  // Transition Events
  transitionCancel(ele: Element, params?: TransitionEventInit): void
  transitionEnd(ele: Element, params?: TransitionEventInit): void
  transitionRun(ele: Element, params?: TransitionEventInit): void
  transitionStart(ele: Element, params?: TransitionEventInit): void
  // pointer events
  pointerOver(ele: Element, params?: PointerEventInit): void
  pointerEnter(ele: Element, params?: PointerEventInit): void
  pointerDown(ele: Element, params?: PointerEventInit): void
  pointerMove(ele: Element, params?: PointerEventInit): void
  pointerUp(ele: Element, params?: PointerEventInit): void
  pointerCancel(ele: Element, params?: PointerEventInit): void
  pointerOut(ele: Element, params?: PointerEventInit): void
  pointerLeave(ele: Element, params?: PointerEventInit): void
  gotPointerCapture(ele: Element, params?: PointerEventInit): void
  lostPointerCapture(ele: Element, params?: PointerEventInit): void
  // history events
  popState(ele: Element, params?: PopStateEventInit): void
  // window events
  offline(ele: Element, params?: EventInit): void
  online(ele: Element, params?: EventInit): void
}



function fireEvent(element: Element, event: Event) {
  return config.eventWrapper(() => {
    return element.dispatchEvent(event)
  })
}

function createEvent(
  eventName: string,
  node: Element,
  init,
  { EventType = 'Event', defaultInit = {} } = {}
) {

  const eventInit = { ...defaultInit, ...init }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { target: { value, files, ...targetProperties } = {} } = eventInit
  if (value !== undefined) {
    setNativeValue(node, value)
  }
  if (files !== undefined) {
    Object.defineProperty(node, 'files', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: files,
    })
  }
  Object.assign(node, targetProperties)
  const EventConstructor = window[EventType] || window.Event

  let event
  if (typeof EventConstructor === 'function') {
    event = new EventConstructor(eventName, eventInit)
  } else {
    // IE11 polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    event = window.document.createEvent(EventType)
    const { bubbles, cancelable, detail, ...otherInit } = eventInit
    event.initEvent(eventName, bubbles, cancelable, detail)
    Object.keys(otherInit).forEach(eventKey => {
      event[eventKey] = otherInit[eventKey]
    })
  }

  // DataTransfer is not supported in jsdom: https://github.com/jsdom/jsdom/issues/1568
  const dataTransferProperties = ['dataTransfer', 'clipboardData']
  dataTransferProperties.forEach(dataTransferKey => {
    const dataTransferValue = eventInit[dataTransferKey]

    if (typeof dataTransferValue === 'object') {
      if (typeof window.DataTransfer === 'function') {
        Object.defineProperty(event, dataTransferKey, {
          value: Object.getOwnPropertyNames(dataTransferValue).reduce(
            (acc, propName) => {
              Object.defineProperty(acc, propName, {
                value: dataTransferValue[propName],
              })
              return acc
            },
            new window.DataTransfer(),
          ),
        })
      } else {
        Object.defineProperty(event, dataTransferKey, {
          value: dataTransferValue,
        })
      }
    }
  })

  return event
}

Object.keys(eventMap).forEach(key => {
  const { EventType, defaultInit } = eventMap[key]
  const eventName = key.toLowerCase()
  createEvent[key] = (node, init) =>
    createEvent(eventName, node, init, { EventType, defaultInit })
  fireEvent[key] = (node, init) => fireEvent(node, createEvent[key](node, init))
})

// function written after some investigation here:
// https://github.com/facebook/react/issues/10135#issuecomment-401496776
function setNativeValue(element, value) {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {}
  const prototype = Object.getPrototypeOf(element)
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {}
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value)
  } else {
    if (valueSetter) {
      valueSetter.call(element, value)
    } else {
      throw new Error('The given element does not have a value setter')
    }
  }
}

Object.keys(eventAliasMap).forEach(aliasKey => {
  const key = eventAliasMap[aliasKey]
  fireEvent[aliasKey] = (...args) => fireEvent[key](...args)
})

export { fireEvent, createEvent }