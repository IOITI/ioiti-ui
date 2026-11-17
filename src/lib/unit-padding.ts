import { useLayoutEffect, useState } from 'react'
import type { DependencyList, RefObject } from 'react'

/**
 * The room a field keeps for what sits inside it at either end (a unit, its buttons): the width of each, measured,
 * and measured again whenever it changes. A field's text is 16px on a phone and 14px from 640px, its units with it,
 * so a unit is wider on one side of that width than on the other; and a web font that arrives after the first
 * measure widens it too. Measured once, the text ran under the unit.
 */
export function useUnitPadding(
  before: RefObject<HTMLElement | null>,
  after: RefObject<HTMLElement | null>,
  deps: DependencyList,
) {
  const [pad, setPad] = useState({ left: 0, right: 0 })
  useLayoutEffect(() => {
    const measure = () => {
      const left = before.current?.offsetWidth ?? 0
      const right = after.current?.offsetWidth ?? 0
      setPad((was) => (was.left === left && was.right === right ? was : { left, right }))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    if (before.current) observer.observe(before.current)
    if (after.current) observer.observe(after.current)
    return () => observer.disconnect()
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- the caller says what changes its units
  }, deps)
  return pad
}
