import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A value its caller may hold (`value` given, told of each change by `onChange`) or leave to the
 * component (`defaultValue` to start from): the two ways a control is used.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : internal

  // The latest onChange, without making a new setter each time the caller draws a new function.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next)
      onChangeRef.current?.(next)
    },
    [controlled],
  )
  return [current, set]
}
