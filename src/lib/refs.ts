import type { Ref, RefObject } from 'react'

/** Gives an element to a ref of either kind: a function, or an object to hold it. */
export function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value)
  else if (ref) (ref as RefObject<T | null>).current = value
}
