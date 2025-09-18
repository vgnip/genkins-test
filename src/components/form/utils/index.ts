import type { Slots } from 'vue'
import type { Options } from '../types'
import { defineAsyncComponent } from 'vue'
import { isFunction, isObject } from './is'

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key]) && isObject(target[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

export function getSlot(slots: Slots, slot = 'default', data?: any) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) {
    return null
  }
  return slotFn(data)
}

export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { delay = 100, timeout = 30000, retry = true } = options
  return defineAsyncComponent({
    loader,
    loadingComponent: undefined,
    timeout,
    delay,
    onError: !retry
      ? () => {}
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            retry()
          } else {
            fail()
          }
        },
  })
}
