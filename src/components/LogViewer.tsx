import { ArrowDownToLine, ChevronDown, ChevronUp, Download, Search, WrapText } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { blocksInSight, findInLog, LOG_BLOCK, logLevel, matchParts, splitLog } from '../lib/log.js'
import type { LogLevel } from '../lib/log.js'
import { cn } from '../lib/utils.js'
import { CopyButton } from './CopyButton.js'
import { IconButton } from './IconButton.js'
import { Input } from './ui/form.js'

/** A line's height unwrapped: text-[12.5px] on leading-5. */
const LINE = 20
/** The height assumed for the view while it has none to measure (before layout, in a test). */
const UNMEASURED_VIEW = 600

const LEVEL_TEXT: Record<LogLevel, string> = {
  error: 'text-(--negative)',
  warning: 'text-(--warning)',
  info: '',
}
// The level is also a mark at the line's edge: its colour is not the only sign of it.
const LEVEL_EDGE: Record<LogLevel, string> = {
  error: 'shadow-[inset_2px_0_0_var(--negative)]',
  warning: 'shadow-[inset_2px_0_0_var(--warning)]',
  info: 'shadow-[inset_2px_0_0_var(--info)]',
}

interface LogViewerProps {
  /** The lines, oldest first; a job's output grows by lines appended. */
  lines?: readonly string[]
  /** Or the whole text, cut at its line breaks. */
  text?: string
  /** What the log is: its header, and its name for a screen reader ("Build log"). */
  label: string
  /** Keeps the newest line in sight as lines arrive; scrolling up stops it, and "Jump to the end" starts it again. */
  follow?: boolean
  /** The most lines kept: the earlier ones are dropped, and said to be above the first. */
  maxLines?: number
  /** Lines already dropped before these (a server that sent only the end): counted in the numbers. */
  droppedLines?: number
  /** Long lines wrapped at first; the reader can change it. */
  defaultWrap?: boolean
  /** The view's height; the log scrolls inside it. */
  height?: number | string
  /** The name of the file "Download" saves. */
  downloadName?: string
  /** Shown while nothing is logged. */
  emptyText?: ReactNode
  className?: string
}

/**
 * A process's output as it is written (a build, a deploy, a job): numbered lines, errors and warnings
 * in their tones and marked at their edge, the newest kept in sight, a search that goes from one line found
 * to the next, wrapping, copying and downloading. Only the lines in sight are drawn: a log of a hundred
 * thousand lines scrolls as one of a hundred. Not read aloud line by line: a screen reader reads it when
 * asked.
 */
export function LogViewer({
  lines,
  text,
  label,
  follow = true,
  maxLines = 50_000,
  droppedLines = 0,
  defaultWrap = false,
  height = 384,
  downloadName = 'log.txt',
  emptyText = 'Nothing logged yet.',
  className,
}: LogViewerProps) {
  const all = useMemo(() => lines ?? splitLog(text ?? ''), [lines, text])
  const cut = Math.max(0, all.length - Math.max(1, maxLines))
  const shown = useMemo(() => (cut ? all.slice(cut) : all), [all, cut])
  const dropped = droppedLines + cut

  const [wrap, setWrap] = useState(defaultWrap)
  const [query, setQuery] = useState('')
  const found = useMemo(() => findInLog(shown, query), [shown, query])
  const [current, setCurrent] = useState(0)
  const [following, setFollowing] = useState(follow)
  const [sight, setSight] = useState({ top: 0, view: 0 })
  // The line to bring into sight (a match), by its index among the lines shown.
  const [target, setTarget] = useState<number | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  // Heights of the blocks drawn wrapped, measured; a block not measured yet is as high as its lines unwrapped.
  const measured = useRef(new Map<number, { height: number; count: number }>())
  const [, setMeasures] = useState(0)
  useEffect(() => measured.current.clear(), [wrap])

  const firstLine = dropped
  const firstBlock = Math.floor(firstLine / LOG_BLOCK)
  const blockCount = shown.length ? Math.floor((firstLine + shown.length - 1) / LOG_BLOCK) - firstBlock + 1 : 0
  const range = useCallback(
    (block: number): [number, number] => {
      const id = firstBlock + block
      return [Math.max(id * LOG_BLOCK, firstLine) - firstLine, Math.min((id + 1) * LOG_BLOCK, firstLine + shown.length) - firstLine]
    },
    [firstBlock, firstLine, shown.length],
  )
  const heightOf = (block: number) => {
    const [start, end] = range(block)
    const count = end - start
    const known = wrap ? measured.current.get(firstBlock + block) : undefined
    return known ? (known.height * count) / known.count : count * LINE
  }
  const { first, last, before, after } = blocksInSight(blockCount, heightOf, sight.top, sight.view || UNMEASURED_VIEW)
  const longest = useMemo(() => (wrap ? 0 : shown.reduce((most, line) => Math.max(most, line.length), 0)), [shown, wrap])

  const observer = useRef<ResizeObserver | null>(null)
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    observer.current = new ResizeObserver((entries) => {
      let changed = false
      for (const entry of entries) {
        const element = entry.target as HTMLElement
        const id = Number(element.dataset.block)
        const count = Number(element.dataset.count)
        const size = element.getBoundingClientRect().height
        const known = measured.current.get(id)
        if (size > 0 && (!known || known.height !== size || known.count !== count)) {
          measured.current.set(id, { height: size, count })
          changed = true
        }
      }
      if (changed) setMeasures((version) => version + 1)
    })
    return () => observer.current?.disconnect()
  }, [])
  const watch = useCallback((element: HTMLDivElement | null) => {
    if (element) observer.current?.observe(element)
  }, [])

  const readSight = () => {
    const element = scroller.current
    if (!element) return
    setSight((was) => (was.top === element.scrollTop && was.view === element.clientHeight ? was : { top: element.scrollTop, view: element.clientHeight }))
  }
  const onScroll = () => {
    const element = scroller.current
    if (!element) return
    readSight()
    const atEnd = element.scrollTop + element.clientHeight >= element.scrollHeight - LINE / 2
    if (atEnd !== following) setFollowing(atEnd)
  }

  // Following: the newest line in sight after each change.
  useLayoutEffect(() => {
    const element = scroller.current
    if (!following || !element) return
    element.scrollTop = element.scrollHeight
    readSight()
  })

  // A match brought into sight: first where its block says, then exactly, once it is drawn.
  useLayoutEffect(() => {
    const element = scroller.current
    if (target === null || !element) return
    const block = Math.floor((firstLine + target) / LOG_BLOCK) - firstBlock
    let offset = 0
    for (let index = 0; index < block; index++) offset += heightOf(index)
    offset += (target - range(block)[0]) * LINE
    const view = element.clientHeight || UNMEASURED_VIEW
    element.scrollTop = Math.max(0, offset - view / 2)
    setSight({ top: element.scrollTop, view: element.clientHeight })
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- placed once per target; heights are read as they are
  }, [target])
  useEffect(() => {
    if (target === null) return
    const line = scroller.current?.querySelector(`[data-line="${firstLine + target + 1}"]`)
    line?.scrollIntoView?.({ block: 'nearest' })
  })

  const reveal = (index: number) => {
    setFollowing(false)
    setTarget(index)
  }
  const search = (value: string) => {
    setQuery(value)
    setCurrent(0)
    const matches = findInLog(shown, value)
    if (matches.length) reveal(matches[0])
  }
  const go = (step: 1 | -1) => {
    if (!found.length) return
    const next = (current + step + found.length) % found.length
    setCurrent(next)
    reveal(found[next])
  }
  const download = () => {
    const url = URL.createObjectURL(new Blob([`${shown.join('\n')}\n`], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = downloadName
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const currentLine = found.length ? found[Math.min(current, found.length - 1)] : null
  const view: CSSProperties = { height: typeof height === 'number' ? `${height}px` : height }
  const width: CSSProperties | undefined = wrap ? undefined : { minWidth: `calc(3.5rem + ${longest}ch + 1.5rem)` }

  return (
    <section aria-label={label} className={cn('relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface', className)}>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border py-1.5 pl-3 pr-1.5">
        <span className="mr-auto min-w-0 truncate text-xs font-medium text-text-primary">{label}</span>
        <div className="w-48 max-w-full">
          <Input
            aria-label={`Search ${label}`}
            placeholder="Search"
            leftIcon={<Search className="size-3.5" />}
            value={query}
            className="h-8"
            onChange={(event) => search(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              go(event.shiftKey ? -1 : 1)
            }}
          />
        </div>
        <span role="status" className="min-w-14 text-center text-xs tabular-nums text-text-secondary">
          {query.trim() ? (found.length ? `${Math.min(current, found.length - 1) + 1} of ${found.length}` : 'No match') : ''}
        </span>
        <IconButton label="Previous match" hint="Previous match (Shift+Enter)" icon={<ChevronUp />} disabled={!found.length} onClick={() => go(-1)} className="size-8 disabled:opacity-40" />
        <IconButton label="Next match" hint="Next match (Enter)" icon={<ChevronDown />} disabled={!found.length} onClick={() => go(1)} className="size-8 disabled:opacity-40" />
        <IconButton
          label="Wrap long lines"
          hint={wrap ? 'Long lines wrapped' : 'Long lines scroll sideways'}
          icon={<WrapText />}
          aria-pressed={wrap}
          onClick={() => setWrap((was) => !was)}
          className={cn('size-8', wrap && 'bg-surface-hover text-text-primary')}
        />
        <CopyButton value={() => shown.join('\n')} label="Copy the log" size="sm" />
        <IconButton label="Download the log" hint={`Download as ${downloadName}`} icon={<Download />} onClick={download} disabled={!shown.length} className="size-8 disabled:opacity-40" />
      </div>
      {dropped > 0 && (
        <p className="border-b border-border px-3 py-1 text-xs text-text-muted">
          {dropped.toLocaleString('en')} earlier {dropped === 1 ? 'line' : 'lines'} dropped
        </p>
      )}
      <div
        ref={scroller}
        role="log"
        aria-label={label}
        aria-live="off"
        tabIndex={0}
        style={view}
        onScroll={onScroll}
        className="overflow-auto font-mono text-[12.5px] leading-5 text-text-primary"
      >
        {shown.length === 0 ? (
          <p className="p-4 font-sans text-sm text-text-muted">{emptyText}</p>
        ) : (
          <div style={width} className="py-1.5">
            <div aria-hidden style={{ height: before }} />
            {Array.from({ length: last - first + 1 }, (_, offset) => {
              const block = first + offset
              const [start, end] = range(block)
              return (
                <div key={firstBlock + block} ref={watch} data-block={firstBlock + block} data-count={end - start}>
                  {shown.slice(start, end).map((line, at) => {
                    const index = start + at
                    const level = logLevel(line)
                    const isCurrent = index === currentLine
                    return (
                      <div
                        key={index}
                        data-line={firstLine + index + 1}
                        className={cn('flex', wrap ? 'min-h-5' : 'h-5', level && LEVEL_EDGE[level], isCurrent && 'bg-surface-hover')}
                      >
                        <span aria-hidden className="w-14 shrink-0 select-none pr-3 text-right tabular-nums text-text-muted">
                          {firstLine + index + 1}
                        </span>
                        <span className={cn('min-w-0 flex-1 pr-6', wrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre', level && LEVEL_TEXT[level])}>
                          {line === ''
                            ? '​'
                            : query.trim()
                              ? matchParts(line, query).map((part, at) =>
                                  part.match ? (
                                    <mark key={at} className={cn('rounded-sm text-inherit', isCurrent ? 'bg-(--warning)/40' : 'bg-(--warning)/20')}>
                                      {part.text}
                                    </mark>
                                  ) : (
                                    part.text
                                  ),
                                )
                              : line}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
            <div aria-hidden style={{ height: after }} />
          </div>
        )}
      </div>
      {!following && shown.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setTarget(null)
            setFollowing(true)
          }}
          className="absolute bottom-3 right-4 flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs font-medium text-text-primary shadow-sm transition hover:bg-surface-hover focus-ring"
        >
          <ArrowDownToLine className="size-3.5" aria-hidden />
          Jump to the end
        </button>
      )}
    </section>
  )
}
