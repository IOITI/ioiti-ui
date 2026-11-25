import { createContext, useContext, useRef } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import { useScrollRegion } from '../lib/scroll-region.js'
import { cn } from '../lib/utils.js'
import { useMessages } from './locale-context.js'

/**
 * How tight a table is. `regular`: body-size text under a small head, rows apart by a line, for lists of
 * records in a panel. `compact`: the same in small text, for a screen of data that asks for it. `dense`:
 * body-size text in narrow cells, a line above each row, for figures side by side.
 */
export type TableDensity = 'regular' | 'compact' | 'dense'

const DensityContext = createContext<TableDensity>('regular')
const PartContext = createContext<'head' | 'body'>('body')

/** The props of `Table`. */
export interface TableProps extends ComponentProps<'table'> {
  density?: TableDensity
  /** The classes of the frame that scrolls sideways (`hidden sm:block`). */
  wrapperClassName?: string
}

const TABLE = { regular: 'w-full text-left text-sm', compact: 'w-full text-left text-xs', dense: 'w-full whitespace-nowrap text-sm' }

/**
 * A plain table of records or figures, as the pages write them: it scrolls sideways inside its own
 * frame when the screen is narrower than it (give it a `min-w-[40rem]` then). The frame holds all it
 * scrolls, the text of its cells for screen readers too (`sr-only`, placed absolutely): out of a frame
 * that is not positioned, that text stood beyond the page, which then scrolled sideways onto nothing.
 * While it scrolls and its cells hold no control, the frame is a stop of the keyboard, a region named
 * as the table is ("Table" in the provider's language, where it has no name).
 */
export function Table({ density = 'regular', wrapperClassName, className, children, ...props }: TableProps) {
  const frame = useRef<HTMLDivElement>(null)
  const unnamed = useMessages().table.region
  const region = useScrollRegion(frame, { label: props['aria-label'] ?? unnamed, labelledBy: props['aria-labelledby'] })
  return (
    <div ref={frame} {...region} className={cn('relative min-w-0 overflow-x-auto', wrapperClassName)}>
      <table
        className={cn(TABLE[density], className)}
        {...props}
      >
        <DensityContext.Provider value={density}>{children}</DensityContext.Provider>
      </table>
    </div>
  )
}

/** The props of `TableHead`: a `<thead>`'s. */
export type TableHeadProps = ComponentProps<'thead'>

export function TableHead({ className, children, ...props }: TableHeadProps) {
  const density = useContext(DensityContext)
  return (
    <thead className={cn(density !== 'dense' && 'text-muted-foreground', density === 'regular' && 'text-xs', className)} {...props}>
      <PartContext.Provider value="head">{children}</PartContext.Provider>
    </thead>
  )
}

/** The props of `TableBody`: a `<tbody>`'s. */
export type TableBodyProps = ComponentProps<'tbody'>

export function TableBody({ className, children, ...props }: TableBodyProps) {
  const density = useContext(DensityContext)
  return (
    <tbody className={cn(density !== 'dense' ? 'divide-y divide-border/40' : 'tabular-nums', className)} {...props}>
      <PartContext.Provider value="body">{children}</PartContext.Provider>
    </tbody>
  )
}

/** The props of `TableRow`: a `<tr>`'s. */
export type TableRowProps = ComponentProps<'tr'>

export function TableRow({ className, ...props }: TableRowProps) {
  const density = useContext(DensityContext)
  const part = useContext(PartContext)
  const dense = density === 'dense' && (part === 'head' ? 'text-xs text-muted-foreground' : 'border-t border-border/40')
  return <tr className={cn(dense, className)} {...props} />
}

interface CellProps {
  /** A figure: on the right, in digits of one width, so that a column of them lines up. */
  numeric?: boolean
  children?: ReactNode
}

/** The props of `TableHeaderCell`: a `<th>`'s, and whether it heads figures. */
export type TableHeaderCellProps = CellProps & ComponentProps<'th'>

/** A column's heading in the head; a row's own heading (its first cell) in the body. */
export function TableHeaderCell({ numeric = false, className, scope, ...props }: TableHeaderCellProps) {
  const density = useContext(DensityContext)
  const part = useContext(PartContext)
  return (
    <th
      scope={scope ?? (part === 'head' ? 'col' : 'row')}
      className={cn(
        density !== 'dense' ? 'py-2 pr-4 font-medium last:pr-0' : 'p-2 font-medium',
        numeric ? 'text-right' : density === 'dense' && 'text-left',
        className,
      )}
      {...props}
    />
  )
}

/** The props of `TableCell`: a `<td>`'s, and whether it holds a figure. */
export type TableCellProps = CellProps & ComponentProps<'td'>

export function TableCell({ numeric = false, className, ...props }: TableCellProps) {
  const density = useContext(DensityContext)
  return (
    <td
      className={cn(
        density !== 'dense' ? 'py-2.5 pr-4 last:pr-0' : 'p-2',
        numeric && (density !== 'dense' ? 'text-right tabular-nums' : 'text-right'),
        className,
      )}
      {...props}
    />
  )
}
