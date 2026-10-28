import { createContext, useContext } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '../lib/utils.js'

/**
 * How tight a table is. `compact`: small text, rows apart by a line, for lists of records in a
 * panel. `dense`: body-size text in narrow cells, a line above each row, for figures side by side.
 */
export type TableDensity = 'compact' | 'dense'

const DensityContext = createContext<TableDensity>('compact')
const PartContext = createContext<'head' | 'body'>('body')

interface TableProps extends ComponentProps<'table'> {
  density?: TableDensity
  /** The classes of the frame that scrolls sideways (`hidden sm:block`). */
  wrapperClassName?: string
}

/**
 * A plain table of records or figures, as the pages write them: it scrolls sideways inside its own
 * frame when the screen is narrower than it (give it a `min-w-[40rem]` then). The frame holds all it
 * scrolls, the text of its cells for screen readers too (`sr-only`, placed absolutely): out of a frame
 * that is not positioned, that text stood beyond the page, which then scrolled sideways onto nothing.
 */
export function Table({ density = 'compact', wrapperClassName, className, children, ...props }: TableProps) {
  return (
    <div className={cn('relative min-w-0 overflow-x-auto', wrapperClassName)}>
      <table
        className={cn(density === 'compact' ? 'w-full text-left text-xs' : 'w-full whitespace-nowrap text-sm', className)}
        {...props}
      >
        <DensityContext.Provider value={density}>{children}</DensityContext.Provider>
      </table>
    </div>
  )
}

export function TableHead({ className, children, ...props }: ComponentProps<'thead'>) {
  const density = useContext(DensityContext)
  return (
    <thead className={cn(density === 'compact' && 'text-muted-foreground', className)} {...props}>
      <PartContext.Provider value="head">{children}</PartContext.Provider>
    </thead>
  )
}

export function TableBody({ className, children, ...props }: ComponentProps<'tbody'>) {
  const density = useContext(DensityContext)
  return (
    <tbody className={cn(density === 'compact' ? 'divide-y divide-border/40' : 'tabular-nums', className)} {...props}>
      <PartContext.Provider value="body">{children}</PartContext.Provider>
    </tbody>
  )
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  const density = useContext(DensityContext)
  const part = useContext(PartContext)
  const dense = density === 'dense' && (part === 'head' ? 'text-xs text-muted-foreground' : 'border-t border-border/50')
  return <tr className={cn(dense, className)} {...props} />
}

interface CellProps {
  /** A figure: on the right, in digits of one width, so that a column of them lines up. */
  numeric?: boolean
  children?: ReactNode
}

/** A column's heading in the head; a row's own heading (its first cell) in the body. */
export function TableHeaderCell({ numeric = false, className, scope, ...props }: CellProps & ComponentProps<'th'>) {
  const density = useContext(DensityContext)
  const part = useContext(PartContext)
  return (
    <th
      scope={scope ?? (part === 'head' ? 'col' : 'row')}
      className={cn(
        density === 'compact' ? 'py-2 pr-4 font-medium last:pr-0' : 'p-2 font-medium',
        numeric ? 'text-right' : density === 'dense' && 'text-left',
        className,
      )}
      {...props}
    />
  )
}

export function TableCell({ numeric = false, className, ...props }: CellProps & ComponentProps<'td'>) {
  const density = useContext(DensityContext)
  return (
    <td
      className={cn(
        density === 'compact' ? 'py-2.5 pr-4 last:pr-0' : 'p-2',
        numeric && (density === 'compact' ? 'text-right tabular-nums' : 'text-right'),
        className,
      )}
      {...props}
    />
  )
}
