import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A value its caller may hold (`value` given, told of each change by `onChange`) or leave to the component
 * (`defaultValue` to start from): the two ways a control is used, and the one way a component holds a state
 * (docs/conventions.md). `onChange` is told of every change either way, with what goes with it (why a sheet closed:
 * `set(false, { reason })`).
 */
export function useControllableState<T, A extends unknown[] = []>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T, ...details: A) => void,
): [T, (next: T, ...details: A) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : internal

  // The latest onChange, without making a new setter each time the caller draws a new function.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })

  const set = useCallback(
    (next: T, ...details: A) => {
      if (!controlled) setInternal(next)
      onChangeRef.current?.(next, ...details)
    },
    [controlled],
  )
  return [current, set]
}
