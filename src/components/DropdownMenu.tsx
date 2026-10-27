import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent, PointerEvent, ReactElement, ReactNode, Ref, RefObject } from 'react'
import { createPortal } from 'react-dom'

import { useAnchoredLayer } from '../lib/anchor.js'
import type { AnchorAlign, AnchorSide } from '../lib/anchor.js'
import { useControllableState } from '../lib/controllable.js'
import { isPlainClick } from '../lib/links.js'
import { motionTransitions } from '../lib/motion-tokens.js'
import { assignRef } from '../lib/refs.js'
import { cn } from '../lib/utils.js'
import { Kbd } from './Kbd.js'
import { useLinkComponent } from './link-context.js'

interface ItemBase {
  label: ReactNode
  /** An icon of lucide-react, before the label. */
  icon?: ReactNode
  /** A second line, under the label. */
  description?: ReactNode
  disabled?: boolean
  /** The words type-ahead finds it by, where the label is not text. */
  textValue?: string
}

/** Does something, and closes the menu: the focus is back on the menu's trigger before `onSelect` runs. */
export interface DropdownMenuAction extends ItemBase {
  type?: 'action'
  onSelect?: () => void
  /** Its keys, shown beside it (`mod+d`): the menu does not listen for them. */
  shortcut?: string
  /** What removes, in the negative colour. */
  tone?: 'danger'
}

/** Leads somewhere: a link, opened elsewhere with ⌘ or Ctrl. */
export interface DropdownMenuLink extends ItemBase {
  type: 'link'
  href: string
  shortcut?: string
}

/** On or off: the menu stays open. */
export interface DropdownMenuCheckbox extends ItemBase {
  type: 'checkbox'
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

/** One of a few: choosing closes the menu. */
export interface DropdownMenuRadioGroup {
  type: 'radio'
  label?: ReactNode
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean; textValue?: string }[]
}

export interface DropdownMenuSeparator {
  type: 'separator'
}

export interface DropdownMenuGroup {
  type: 'group'
  label: ReactNode
  items: DropdownMenuItem[]
}

/** More items, in a panel of their own that takes the menu's place, a row at its top going back. */
export interface DropdownMenuSubmenu extends ItemBase {
  type: 'submenu'
  items: DropdownMenuItem[]
}

export type DropdownMenuItem =
  | DropdownMenuAction
  | DropdownMenuLink
  | DropdownMenuCheckbox
  | DropdownMenuRadioGroup
  | DropdownMenuSeparator
  | DropdownMenuGroup
  | DropdownMenuSubmenu

const ROW =
  'flex w-full cursor-default select-none items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm text-text-primary outline-none ' +
  'hover:bg-surface-hover focus:bg-surface-hover accent:focus:bg-brand-soft accent:focus:text-brand-text ' +
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0'

const textOf = (item: { label?: ReactNode; textValue?: string }) =>
  (item.textValue ?? (typeof item.label === 'string' ? item.label : '')).toLowerCase()

interface Panel {
  label: ReactNode
  items: DropdownMenuItem[]
  /** The row that opened it, focused again once back. */
  from: string
}

interface MenuLayerProps {
  id: string
  open: boolean
  onClose: () => void
  items: DropdownMenuItem[]
  label: string
  triggerRef: RefObject<HTMLElement | null>
  point?: { x: number; y: number } | null
  side?: AnchorSide
  align?: AnchorAlign
  /** Opened with the up arrow: the focus on its last item. */
  fromEnd?: boolean
}

/** The menu itself, beside its trigger or at a point: shared by DropdownMenu and ContextMenu. */
function MenuLayer({ id, open, onClose, items, label, triggerRef, point, side, align, fromEnd = false }: MenuLayerProps) {
  const layerRef = useRef<HTMLDivElement | null>(null)
  const [panels, setPanels] = useState<Panel[]>([])
  // Opened again, it starts from its first panel.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setPanels([])
  }
  // The row to focus once back on its panel.
  const back = useRef<string | null>(null)
  const typed = useRef({ text: '', at: 0 })
  const Link = useLinkComponent()
  const depth = panels.length

  // The rows of the panel shown, which the keyboard moves between (not those of a panel leaving).
  const rows = useCallback(
    () =>
      Array.from(
        layerRef.current?.querySelectorAll<HTMLElement>(`[data-menu-panel="${depth}"] [data-menu-row]:not([aria-disabled="true"])`) ?? [],
      ),
    [depth],
  )
  const layer = useAnchoredLayer({
    open,
    onClose,
    triggerRef,
    layerRef,
    point,
    side,
    align,
    initialFocus: () => {
      const all = rows()
      return (fromEnd ? all[all.length - 1] : all[0]) ?? null
    },
  })

  // A new panel: placed again (it may be taller), the focus on its first row, or, back, on the row that
  // opened the panel left. The first panel's focus is the layer's (its first row, or its last).
  const measure = layer.measure
  useEffect(() => {
    if (!open) return
    measure()
    const target = back.current
    back.current = null
    if (depth === 0 && target === null) return
    const all = rows()
    // Into a panel, its first item, not the row going back.
    ;(all.find((row) => row.dataset.menuKey === target) ?? all.find((row) => row.dataset.menuBack === undefined) ?? all[0])?.focus()
  }, [depth, open, measure, rows])


  const close = (focusTrigger: boolean) => {
    onClose()
    if (focusTrigger) triggerRef.current?.focus()
  }
  const select = (run?: () => void) => {
    // The focus is back on the trigger first: a dialog `run` opens gives it back there when it closes.
    close(true)
    run?.()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const all = rows()
    const at = all.indexOf(document.activeElement as HTMLElement)
    const focus = (index: number) => all[(index + all.length) % all.length]?.focus()
    const row = all[at]
    switch (event.key) {
      case 'ArrowDown':
        focus(at + 1)
        break
      case 'ArrowUp':
        focus(at < 0 ? all.length - 1 : at - 1)
        break
      case 'Home':
        focus(0)
        break
      case 'End':
        focus(all.length - 1)
        break
      case 'ArrowRight':
        if (row?.getAttribute('aria-haspopup') === 'menu') row.click()
        else return
        break
      case 'ArrowLeft':
        if (depth > 0) layerRef.current?.querySelector<HTMLElement>(`[data-menu-panel="${depth}"] [data-menu-back]`)?.click()
        else return
        break
      case 'Tab':
        // A menu is not a stop on the way: Tab closes it, back on its trigger.
        event.preventDefault()
        event.stopPropagation()
        close(true)
        return
      case ' ':
        // A link takes no Space of its own.
        if (row?.tagName === 'A') row.click()
        else return
        break
      default: {
        if (event.key === 'Escape') {
          layer.onLayerKeyDown(event)
          return
        }
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
        // Type-ahead: the next row whose words start with what was typed, within a moment.
        const now = event.timeStamp
        typed.current = { text: (now - typed.current.at < 600 ? typed.current.text : '') + event.key.toLowerCase(), at: now }
        const text = typed.current.text
        const order = [...all.slice(at + 1), ...all.slice(0, at + 1)]
        const found = order.find((each) => (each.dataset.menuText ?? '').startsWith(text)) ?? order.find((each) => (each.dataset.menuText ?? '').startsWith(text[0]))
        found?.focus()
      }
    }
    event.preventDefault()
    event.stopPropagation()
  }

  const panel = panels[depth - 1]
  const list = panel ? panel.items : items
  let key = 0

  const render = (list: DropdownMenuItem[]): ReactNode[] =>
    list.map((item) => {
      const k = `${depth}-${key++}`
      if (item.type === 'separator') return <div key={k} role="separator" className="-mx-1 my-1 h-px bg-border" />
      if (item.type === 'group') {
        const labelId = `${id}-${k}`
        return (
          <div key={k} role="group" aria-labelledby={labelId}>
            <div id={labelId} className="px-2.5 pb-1 pt-2 text-xs font-medium text-text-muted">
              {item.label}
            </div>
            {render(item.items)}
          </div>
        )
      }
      if (item.type === 'radio') {
        const labelId = `${id}-${k}`
        return (
          <div key={k} role="group" aria-labelledby={item.label ? labelId : undefined}>
            {item.label && (
              <div id={labelId} className="px-2.5 pb-1 pt-2 text-xs font-medium text-text-muted">
                {item.label}
              </div>
            )}
            {item.options.map((option) => {
              const on = option.value === item.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={on}
                  aria-disabled={option.disabled || undefined}
                  tabIndex={-1}
                  data-menu-row=""
                  data-menu-text={textOf(option)}
                  onClick={() => !option.disabled && select(() => item.onValueChange(option.value))}
                  className={ROW}
                >
                  <span className="grid size-4 place-items-center">{on && <span className="size-1.5 rounded-full bg-current" />}</span>
                  <Content label={option.label} description={option.description} />
                </button>
              )
            })}
          </div>
        )
      }
      if (item.type === 'checkbox') {
        return (
          <button
            key={k}
            type="button"
            role="menuitemcheckbox"
            aria-checked={item.checked}
            aria-disabled={item.disabled || undefined}
            tabIndex={-1}
            data-menu-row=""
            data-menu-text={textOf(item)}
            onClick={() => !item.disabled && item.onCheckedChange(!item.checked)}
            className={ROW}
          >
            <span className="grid size-4 place-items-center">{item.checked && <Check aria-hidden />}</span>
            <Content label={item.label} description={item.description} />
          </button>
        )
      }
      if (item.type === 'submenu') {
        return (
          <button
            key={k}
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={false}
            aria-disabled={item.disabled || undefined}
            tabIndex={-1}
            data-menu-row=""
            data-menu-key={k}
            data-menu-text={textOf(item)}
            onClick={() => {
              if (item.disabled) return
              setPanels((now) => [...now, { label: item.label, items: item.items, from: k }])
            }}
            className={ROW}
          >
            {item.icon}
            <Content label={item.label} description={item.description} />
            <ChevronRight aria-hidden className="ml-auto text-text-muted" />
          </button>
        )
      }
      if (item.type === 'link') {
        return (
          // The application's link, held in context (LinkProvider): the same component at every render.
          // oxlint-disable-next-line react/static-components
          <Link
            key={k}
            href={item.disabled ? undefined : item.href}
            role="menuitem"
            aria-disabled={item.disabled || undefined}
            tabIndex={-1}
            data-menu-row=""
            data-menu-text={textOf(item)}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              if (item.disabled) {
                event.preventDefault()
                return
              }
              // A plain click is the router's, a click with a modifier the browser's: the menu closes either way.
              close(isPlainClick(event) ? false : true)
            }}
            className={ROW}
          >
            {item.icon}
            <Content label={item.label} description={item.description} />
            {item.shortcut && <Kbd keys={item.shortcut} className="ml-auto pl-3" />}
          </Link>
        )
      }
      return (
        <button
          key={k}
          type="button"
          role="menuitem"
          aria-disabled={item.disabled || undefined}
          tabIndex={-1}
          data-menu-row=""
          data-menu-text={textOf(item)}
          onClick={() => !item.disabled && select(item.onSelect)}
          className={cn(ROW, item.tone === 'danger' && 'text-negative accent:focus:text-negative')}
        >
          {item.icon}
          <Content label={item.label} description={item.description} />
          {item.shortcut && <Kbd keys={item.shortcut} className="ml-auto pl-3" />}
        </button>
      )
    })

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={layerRef}
          id={id}
          role="menu"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          onContextMenu={(event) => event.preventDefault()}
          style={layer.style}
          initial={{ opacity: 0, scale: 0.97, y: layer.side === 'top' ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, transition: motionTransitions.easeExit }}
          transition={motionTransitions.springSnappy}
          className="z-50 min-w-48 max-w-xs overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg outline-none glass-float"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={depth}
              data-menu-panel={depth}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8, transition: motionTransitions.easeExit }}
              transition={motionTransitions.springSnappy}
            >
              {panel && (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    data-menu-row=""
                    data-menu-back=""
                    data-menu-text=""
                    onClick={() => {
                      back.current = panel.from
                      setPanels((now) => now.slice(0, -1))
                    }}
                    className={cn(ROW, 'text-text-secondary')}
                  >
                    <ChevronLeft aria-hidden />
                    <span className="truncate font-medium">{panel.label}</span>
                  </button>
                  <div role="separator" className="-mx-1 my-1 h-px bg-border" />
                </>
              )}
              {render(list)}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Content({ label, description }: { label: ReactNode; description?: ReactNode }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="truncate">{label}</span>
      {description && <span className="text-xs text-muted-foreground">{description}</span>}
    </span>
  )
}

interface TriggerProps {
  ref?: Ref<HTMLElement>
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void
  hint?: ReactNode
}

interface DropdownMenuProps {
  /** What opens it: a button that takes a ref (`Button`, `IconButton`), given the menu's props. */
  trigger: ReactElement<TriggerProps>
  items: DropdownMenuItem[]
  /** The menu's name for a screen reader: "Actions on the order". */
  label: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: AnchorSide
  align?: AnchorAlign
}

/**
 * The actions on a thing, behind a button: each does something, leads somewhere, or is ticked; more in a
 * sub-menu, which takes the menu's place (a row at its top goes back), on a phone as on a computer. The
 * arrow keys move, a letter jumps to the next item that starts with it, Escape closes, Tab leaves.
 * For one action and its variants, `SplitButton`.
 */
export function DropdownMenu({ trigger, items, label, open, onOpenChange, side = 'bottom', align = 'start' }: DropdownMenuProps) {
  const [shown, setShown] = useControllableState(open, false, onOpenChange)
  const [fromEnd, setFromEnd] = useState(false)
  const id = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const props = trigger.props
  const ownRef = props.ref
  const setRef = useCallback(
    (element: HTMLElement | null) => {
      triggerRef.current = element
      assignRef(ownRef, element)
    },
    [ownRef],
  )
  const openAt = (end: boolean) => {
    setFromEnd(end)
    setShown(true)
  }

  // A ref callback, which React calls once the trigger is drawn, not while it draws it.
  // oxlint-disable-next-line react/refs
  const opener = cloneElement(trigger, {
    ref: setRef,
    'aria-haspopup': 'menu',
    'aria-expanded': shown,
    'aria-controls': shown ? id : undefined,
    onClick: (event: MouseEvent<HTMLElement>) => {
      props.onClick?.(event)
      if (event.defaultPrevented) return
      if (shown) setShown(false)
      else openAt(false)
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      props.onKeyDown?.(event)
      if (event.defaultPrevented || shown) return
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        openAt(event.key === 'ArrowUp')
      }
    },
    ...('hint' in props && shown ? { hint: '' } : {}),
  } as TriggerProps)

  return (
    <>
      {opener}
      {typeof document !== 'undefined' && (
        <MenuLayer
          id={id}
          open={shown}
          onClose={() => setShown(false)}
          items={items}
          label={label}
          triggerRef={triggerRef}
          side={side}
          align={align}
          fromEnd={fromEnd}
        />
      )}
    </>
  )
}

interface ContextMenuProps {
  items: DropdownMenuItem[]
  /** The menu's name for a screen reader. */
  label: string
  /** What it is the menu of: a right click, a long press, Shift+F10 or the menu key on it opens the menu. */
  children: ReactNode
  disabled?: boolean
  className?: string
}

const LONG_PRESS = 500

/**
 * The actions on what is under the pointer, at the pointer: a right click, a long press on a touch screen,
 * Shift+F10 or the menu key on what has the focus. The same menu as `DropdownMenu`; what it offers should
 * be reachable another way too, as a context menu is found by few.
 */
export function ContextMenu({ items, label, children, disabled = false, className }: ContextMenuProps) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
  const id = useId()
  const returnTo = useRef<HTMLElement | null>(null)
  const press = useRef<{ timer: ReturnType<typeof setTimeout>; x: number; y: number } | null>(null)

  const openAt = (x: number, y: number) => {
    returnTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setPoint({ x, y })
  }
  const cancelPress = () => {
    if (press.current) clearTimeout(press.current.timer)
    press.current = null
  }

  return (
    <>
      <div
        className={className}
        onContextMenu={(event) => {
          if (disabled) return
          event.preventDefault()
          cancelPress()
          openAt(event.clientX, event.clientY)
        }}
        onKeyDown={(event) => {
          if (disabled) return
          if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
            event.preventDefault()
            const box = (event.target as HTMLElement).getBoundingClientRect()
            openAt(box.left + 8, box.bottom)
          }
        }}
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          if (disabled || event.pointerType !== 'touch') return
          const { clientX: x, clientY: y } = event
          cancelPress()
          press.current = { x, y, timer: setTimeout(() => openAt(x, y), LONG_PRESS) }
        }}
        onPointerMove={(event) => {
          if (press.current && Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) > 8) cancelPress()
        }}
        onPointerUp={cancelPress}
        onPointerCancel={cancelPress}
      >
        {children}
      </div>
      {typeof document !== 'undefined' && (
        <MenuLayer
          id={id}
          open={point !== null}
          onClose={() => setPoint(null)}
          items={items}
          label={label}
          triggerRef={returnTo}
          point={point}
        />
      )}
    </>
  )
}
