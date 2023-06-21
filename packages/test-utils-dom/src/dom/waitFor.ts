/* eslint-disable no-async-promise-executor */
import { jestFakeTimersAreEnabled } from "./helpers"
import config from '../config'

export type TWaitforParams = {
  container?: HTMLElement | Document
  timeout?: number
  interval?: number
  mutationObserverOptions?: MutationObserverInit
}

function waitFor(callback, params: TWaitforParams = {}) {
  const {
    container = window.document,
    timeout = 1000,
    interval = 50,
    mutationObserverOptions = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    }
  } = params

  if (typeof callback !== 'function') {
    throw new TypeError('`callback` must be a function')
  }

  return new Promise(async (resolve, reject) => {
    let observer: MutationObserver, lastError, intervalId
    let finished = false
    let promiseStatus = 'idle'

    const overallTimeoutTimer = setTimeout(handleTimeout, timeout)

    const usingJestFakeTimers = jestFakeTimersAreEnabled()

    if (usingJestFakeTimers) {
      checkCallback()

      while (!finished) {
        if (!jestFakeTimersAreEnabled()) {
          const error = new Error(`在使用waitFor时，不需要从使用假计时器更改为使用真计时器`)
          reject(error)
          return
        }

        await config.advanceTimersWrapper(async () => {
          jest.advanceTimersByTime(interval)
        })

        checkCallback()

        if (finished) break
      }
    } else {
      intervalId = setInterval(checkRealTimersCallback, interval)
      const { MutationObserver } = window
      observer = new MutationObserver(checkRealTimersCallback)
      observer.observe(container, mutationObserverOptions)
      checkCallback()
    }


    function checkCallback() {
      if (promiseStatus === 'pending') return
      try {
        promiseStatus = 'pending'
        const result = callback()
        if (typeof result?.then === 'function') {
          result.then(
            resolvedValue => {
              promiseStatus = 'resolved'
              onDone(null, resolvedValue)
            },
            rejectedValue => {
              promiseStatus = 'rejected'
              lastError = rejectedValue
            }
          )
        } else {
          onDone(null, result)
        }
      } catch (error) {
        lastError = error
      }
    }


    function checkRealTimersCallback() {
      if (jestFakeTimersAreEnabled()) {
        const error = (`在使用waitFor时，不需要从使用假计时器更改为使用真计时器`)
        return reject(error)
      } else {
        return checkCallback()
      }
    }


    function onDone(error, result) {
      finished = true
      clearTimeout(overallTimeoutTimer)


      if (!usingJestFakeTimers) {
        clearInterval(intervalId)
        observer.disconnect()
      }

      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }

    function handleTimeout() {
      let error
      if (lastError) {
        error = lastError
      } else {
        error = new Error('Timed out in waitFor.')
      }
      onDone(error, null)
    }
  })
}

function waitForWrapper(callback, options: TWaitforParams = {}) {
  return config.asyncWrapper(() =>
    waitFor(callback, options),
  )
}

export { waitForWrapper as waitFor }