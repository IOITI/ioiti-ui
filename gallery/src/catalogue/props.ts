import PROPS from '../props.json'

/** A prop, as scripts/props.mjs reads it from the package's types. */
export interface Prop {
  name: string
  type: string
  values?: string[]
  required?: boolean
  default?: string
  description?: string
}

/** What a component takes from elsewhere: an element's attributes, framer-motion's, another component's. */
export interface Inherits {
  count: number
  element?: string
  component?: string
  motion?: boolean
  omit?: string[]
}

export interface ComponentProps {
  entry: string
  file: string
  props: Prop[]
  inherits?: Inherits
}

export const COMPONENT_PROPS = PROPS as Record<string, ComponentProps>
