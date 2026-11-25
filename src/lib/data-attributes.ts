/** The `data-*` attributes a component takes, as an element does: drawn on its outermost element. */
export interface DataAttributes {
  [attribute: `data-${string}`]: string | number | boolean | undefined
}

/** A component's other props split in two: the `data-*` attributes, for its outermost element, and the rest. */
export function splitDataAttributes<T extends object>(props: T): [DataAttributes, Omit<T, `data-${string}`>] {
  const data: DataAttributes = {}
  const rest: Record<string, unknown> = {}
  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith('data-')) data[name as `data-${string}`] = value as DataAttributes[`data-${string}`]
    else rest[name] = value
  }
  return [data, rest as Omit<T, `data-${string}`>]
}

/** The `data-*` attributes among a component's other props, for its outermost element: nothing else of them. */
export function dataAttributes(props: object): DataAttributes {
  return splitDataAttributes(props)[0]
}
