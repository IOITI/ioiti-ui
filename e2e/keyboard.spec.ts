// The keyboard's journeys through the gallery's own pages, in a real browser: what jsdom cannot hold. It has no
// layout (a link shown once it has the focus, a thumb dragged along its track), no order of the focus through what is
// drawn in document.body (a list, a menu, a dialog, the drawer), no pointer that crosses from a control onto its hint.
// Each journey is a component's, on its page, in one of its examples (`[data-example]`), by real keys and a real mouse.
// The pages and journeys tagged @smoke run in Firefox and WebKit too.
import type { Locator, Page } from '@playwright/test'

import { arrived, expect, test } from './fixtures'

/** A page of the gallery, once it has arrived. */
async function visit(page: Page, path: string): Promise<void> {
  await page.goto(path)
  await arrived(page)
}

/** One of the examples of a component's page, as the gallery draws it. */
function example(page: Page, id: string): Locator {
  return page.locator(`[data-example="${id}"]`)
}

/**
 * The key a shortcut's `mod` is in the page: ⌘ where it reads an Apple computer, Ctrl elsewhere. Read as the package
 * reads it (lib/keys.ts: the browser's platform, not the system's): a device's user agent sets it, and Chrome's
 * desktop device says Windows, on a Mac too.
 */
async function mod(page: Page): Promise<'Meta' | 'Control'> {
  const apple = await page.evaluate(() => {
    const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform
    return /mac|iphone|ipad|ipod/i.test(platform)
  })
  return apple ? 'Meta' : 'Control'
}

/**
 * Tab and Shift+Tab as a keyboard's user presses them, to reach every control and link: in WebKit on a Mac, Tab goes
 * from text field to text field only (Safari's default), and Option+Tab reaches the rest.
 */
function tabKeys(browserName: string): { next: string; back: string } {
  const option = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+' : ''
  return { next: `${option}Tab`, back: `${option}Shift+Tab` }
}

/** The words of the option a combobox's keys are on (its aria-activedescendant), the focus staying where it is. */
function activeOption(control: Locator): Promise<string> {
  return control.evaluate((element) => {
    const id = element.getAttribute('aria-activedescendant')
    return (id ? element.ownerDocument.getElementById(id)?.textContent : null) ?? ''
  })
}

/** Whether the focus is in a layer (on it, or on what it holds). */
function holdsFocus(layer: Locator): Promise<boolean> {
  return layer.evaluate((element) => element.contains(element.ownerDocument.activeElement))
}

/** The stops of the keyboard in a layer: what Tab reaches there. */
function stopsIn(layer: Locator): Promise<number> {
  return layer.evaluate(
    (element) =>
      Array.from(element.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]')).filter(
        (each) => each.tabIndex >= 0 && !each.matches(':disabled') && each.getClientRects().length > 0,
      ).length,
  )
}

/** Tab (or Shift+Tab: `key`) pressed round the layer and once more: the focus never leaves it. */
async function tabsStayIn(page: Page, layer: Locator, key: string): Promise<void> {
  const presses = (await stopsIn(layer)) + 1
  for (let press = 1; press <= presses; press++) {
    await page.keyboard.press(key)
    await expect.poll(() => holdsFocus(layer), { message: `the focus in the layer, ${key} pressed ${press} times` }).toBe(true)
  }
}

/**
 * Where a layer is once it has come to rest: the same box two frames running. Its entrance is drawn by a script
 * (framer-motion's springs), which the page's animations do not list.
 */
async function restingBox(locator: Locator): Promise<{ x: number; y: number; width: number; height: number }> {
  await expect
    .poll(() =>
      locator.evaluate(
        (element) =>
          new Promise<boolean>((resolve) => {
            const before = element.getBoundingClientRect()
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                const after = element.getBoundingClientRect()
                resolve(before.x === after.x && before.y === after.y && before.width === after.width && before.height === after.height)
              }),
            )
          }),
      ),
    )
    .toBe(true)
  const box = await locator.boundingBox()
  if (!box) throw new Error(`${locator} is not drawn`)
  return box
}

/**
 * Whether what is shown stays so, frame after frame, for `ms`: not taken away, not fading out. A hint that should
 * close would have done so well within it (its grace is 120 ms).
 */
function staysShown(locator: Locator, ms: number): Promise<boolean> {
  return locator.evaluate(
    (element, duration) =>
      new Promise<boolean>((resolve) => {
        const end = performance.now() + duration
        const frame = () => {
          if (!element.isConnected || Number(getComputedStyle(element).opacity) < 0.9) return resolve(false)
          if (performance.now() >= end) return resolve(true)
          requestAnimationFrame(frame)
        }
        frame()
      }),
    ms,
  )
}

test.describe('the shell', () => {
  test('Tab from the top of a page reaches "Skip to the page" first, shown; Enter moves the focus to the page', { tag: ['@smoke'] }, async ({ page, browserName }) => {
    const { next } = tabKeys(browserName)
    await visit(page, '/components/choices/spring-select')
    await page.keyboard.press(next)
    const skip = page.getByRole('link', { name: 'Skip to the page' })
    await expect(skip).toBeFocused()
    // Out of sight until it has the focus (sr-only), then drawn over the page.
    expect((await skip.boundingBox())?.width ?? 0).toBeGreaterThan(40)

    await page.keyboard.press('Enter')
    const main = page.getByRole('main')
    await expect(main).toBeFocused()
    // The address takes no fragment: a router's guard has nothing to judge.
    expect(new URL(page.url()).hash).toBe('')
    // The next stop is in the page, past the menu.
    await page.keyboard.press(next)
    await expect.poll(() => main.evaluate((element) => element.contains(document.activeElement) && element !== document.activeElement)).toBe(true)
  })

  test('⌘K (Ctrl+K elsewhere) opens the search: a component’s name and Enter go to its page', async ({ page }) => {
    await visit(page, '/')
    await page.keyboard.press(`${await mod(page)}+k`)
    const search = page.getByRole('dialog', { name: 'Go to a page' })
    await expect(search).toBeVisible()
    const field = search.getByRole('combobox', { name: 'Search' })
    await expect(field).toBeFocused()

    await page.keyboard.type('SpringSelect')
    await expect.poll(() => activeOption(field)).toMatch(/^SpringSelect/)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/components\/choices\/spring-select$/)
    await expect(page.getByRole('heading', { level: 1, name: 'SpringSelect' })).toBeVisible()
    await expect(search).toBeHidden()
  })

  test('Escape closes the search, and gives the focus back to what had it', async ({ page, browserName }) => {
    const { next, back } = tabKeys(browserName)
    await visit(page, '/')
    const button = page.getByRole('button', { name: 'Go to a page' })
    await button.focus()
    await page.keyboard.press(`${await mod(page)}+k`)
    const search = page.getByRole('dialog', { name: 'Go to a page' })
    await expect(search.getByRole('combobox', { name: 'Search' })).toBeFocused()
    await page.keyboard.type('slider')
    // A dialog over the page: Tab goes round what it holds.
    await tabsStayIn(page, search, next)
    await tabsStayIn(page, search, back)

    await page.keyboard.press('Escape')
    await expect(search).toBeHidden()
    await expect(button).toBeFocused()
    expect(new URL(page.url()).pathname).toBe('/')
  })

  test('the sidebar’s drawer at a phone’s width: its button opens it, the focus on the page shown, Tab stays in, Escape gives it back', { tag: ['@smoke'] }, async ({ page, browserName }) => {
    const { next, back } = tabKeys(browserName)
    await page.setViewportSize({ width: 375, height: 800 })
    await visit(page, '/components')
    const button = page.getByRole('button', { name: 'Open navigation' })
    await button.focus()
    await page.keyboard.press('Enter')
    const drawer = page.getByRole('dialog', { name: 'Navigation' })
    await expect(drawer).toBeVisible()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    // Where the reader is: the page shown, in the menu.
    await expect(drawer.getByRole('link', { name: 'All components' })).toBeFocused()

    await tabsStayIn(page, drawer, next)
    await tabsStayIn(page, drawer, back)

    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(button).toBeFocused()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})

test.describe('choosing from a list', () => {
  test('SpringSelect: the focus stays on its button; ArrowDown opens, the arrows and a letter move, Enter chooses, Escape changes nothing', { tag: ['@smoke'] }, async ({ page }) => {
    await visit(page, '/components/choices/spring-select')
    const plan = example(page, 'plan')
    const select = plan.getByRole('combobox', { name: 'Plan' })
    const list = page.getByRole('listbox', { name: 'Plan' })
    await select.focus()

    await page.keyboard.press('ArrowDown')
    await expect(list).toBeVisible()
    await expect(select).toHaveAttribute('aria-expanded', 'true')
    // Opened on the value it has.
    await expect.poll(() => activeOption(select)).toMatch(/^Team/)
    await expect(select).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect.poll(() => activeOption(select)).toMatch(/^Solo/)
    // The last option it can choose: Company cannot be.
    await page.keyboard.press('End')
    await expect.poll(() => activeOption(select)).toMatch(/^Team/)
    await page.keyboard.press('s')
    await expect.poll(() => activeOption(select)).toMatch(/^Solo/)
    await expect(select).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(list).toBeHidden()
    await expect(select).toHaveText('Solo')
    await expect(plan.getByText('Plan: Solo.')).toBeVisible()
    await expect(select).toBeFocused()

    await page.keyboard.press('ArrowDown')
    await expect.poll(() => activeOption(select)).toMatch(/^Solo/)
    await page.keyboard.press('ArrowDown')
    await expect.poll(() => activeOption(select)).toMatch(/^Team/)
    await page.keyboard.press('Escape')
    await expect(list).toBeHidden()
    await expect(select).toHaveText('Solo')
    await expect(select).toBeFocused()
  })

  test('Combobox: opened from its button, typed into, chosen with the keys; the focus back on its button', async ({ page }) => {
    await visit(page, '/components/forms/combobox')
    const countries = example(page, 'countries')
    const trigger = countries.getByRole('combobox', { name: 'Country of delivery' })
    const list = page.getByRole('listbox', { name: 'Country of delivery' })
    // Its own field, in the list's layer: the button is a combobox of that name too.
    const search = page.getByPlaceholder('Search…', { exact: true })
    await trigger.focus()

    await page.keyboard.press('ArrowDown')
    await expect(list).toBeVisible()
    await expect(search).toBeFocused()
    await page.keyboard.type('an')
    await expect(list.getByRole('option')).toHaveText([/^France/, /^Germany/, /^Ireland/, /^Netherlands/])
    await expect.poll(() => activeOption(search)).toMatch(/^France/)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await expect.poll(() => activeOption(search)).toMatch(/^Ireland/)
    await page.keyboard.press('End')
    await expect.poll(() => activeOption(search)).toMatch(/^Netherlands/)
    await page.keyboard.press('ArrowUp')
    await expect.poll(() => activeOption(search)).toMatch(/^Ireland/)

    await page.keyboard.press('Enter')
    await expect(list).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveText('Ireland')
    await expect(countries.getByText('Chosen: Ireland (ie).')).toBeVisible()

    // Escape: closed, nothing chosen, the focus back on the button.
    await page.keyboard.press('ArrowDown')
    await expect(search).toBeFocused()
    await page.keyboard.type('spa')
    await page.keyboard.press('Escape')
    await expect(list).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveText('Ireland')
  })

  test('MultiSelect: typed into, ticked with the keys, the focus kept in its field; Escape closes, Backspace removes the last', async ({ page }) => {
    await visit(page, '/components/choices/multi-select')
    const customers = example(page, 'customers')
    const field = customers.getByRole('combobox', { name: 'Customers' })
    await field.focus()
    await expect(field).toHaveAttribute('aria-expanded', 'true')
    const list = page.locator(`[id="${await field.getAttribute('aria-controls')}"]`)

    await page.keyboard.type('o')
    await expect(list.getByRole('option')).toHaveText([/^Atelier Brun/, /^Nord Logistique/, /^Vega Studio/, /^Lumen & Co/, /^Maison Ancienne/])
    await expect.poll(() => activeOption(field)).toMatch(/^Atelier Brun/)
    for (let step = 0; step < 3; step++) await page.keyboard.press('ArrowDown')
    await expect.poll(() => activeOption(field)).toMatch(/^Lumen & Co/)
    await page.keyboard.press('Enter')
    await expect(list.getByRole('option', { name: /^Lumen & Co/ })).toHaveAttribute('aria-selected', 'true')
    await expect(customers.getByText('Chosen: Atelier Brun, Acme, Vega Studio, Lumen & Co.')).toBeVisible()
    await expect(field).toBeFocused()

    // Escape closes the list, then clears what was typed; the focus stays.
    await page.keyboard.press('Escape')
    await expect(field).toHaveAttribute('aria-expanded', 'false')
    await expect(field).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(field).toHaveValue('')
    await page.keyboard.press('Backspace')
    await expect(customers.getByText('Chosen: Atelier Brun, Acme, Vega Studio.')).toBeVisible()
    await expect(field).toBeFocused()
  })

  test('DropdownMenu: the arrows round it, Home and End, letters typed, a sub-menu; Escape back on its button', async ({ page }) => {
    await visit(page, '/components/overlays/dropdown-menu')
    const trigger = example(page, 'actions').getByRole('button', { name: 'Actions', exact: true })
    const menu = page.getByRole('menu', { name: 'Actions on order IT-1042' })
    const item = (name: string) => menu.getByRole('menuitem', { name })
    await trigger.focus()

    await page.keyboard.press('ArrowDown')
    await expect(menu).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(item('Edit')).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(item('Duplicate')).toBeFocused()
    await page.keyboard.press('End')
    await expect(item('Delete')).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(item('Edit')).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(item('Delete')).toBeFocused()
    await page.keyboard.press('Home')
    await expect(item('Edit')).toBeFocused()
    await page.keyboard.type('ex')
    await expect(item('Export')).toBeFocused()

    // Its sub-menu takes the menu's place, its first item focused; back (its first row, named as the menu it is,
    // gone), on the item that opened it.
    await page.keyboard.press('ArrowRight')
    await expect(item('As CSV')).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(item('Export')).toHaveCount(1)
    await expect(item('Export')).toHaveAttribute('aria-haspopup', 'menu')
    await expect(item('Export')).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('DatePicker: its calendar moved by the arrows, a day and a week; Enter chooses; Escape closes', async ({ page }) => {
    await visit(page, '/components/dates/date-picker')
    const day = example(page, 'day')
    const due = day.getByRole('button', { name: /^Due on/ })
    const calendar = page.getByRole('dialog', { name: 'Choose date' })
    // A day of the calendar, by the date it says (data-date: year-month-day, unpadded).
    const date = (iso: string) => calendar.locator(`[data-date="${iso}"]`)
    await due.focus()

    await page.keyboard.press('Enter')
    await expect(calendar).toBeVisible()
    // The focus on the day chosen.
    await expect(date('2026-11-20')).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(date('2026-11-21')).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(date('2026-11-28')).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(date('2026-11-27')).toBeFocused()
    // A week on, into the next month: the grid turns to it.
    await page.keyboard.press('ArrowDown')
    await expect(date('2026-12-4')).toBeFocused()
    await expect(calendar.getByRole('grid')).toHaveAccessibleName('December 2026')

    await page.keyboard.press('Enter')
    await expect(calendar).toBeHidden()
    await expect(due).toBeFocused()
    await expect(due).toContainText('4 Dec 2026')
    await expect(day.getByText(/Due on 2026-12-04/)).toBeVisible()

    // Escape: closed, nothing chosen, the focus back on its button.
    await page.keyboard.press('Enter')
    await expect(date('2026-12-4')).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(date('2026-11-27')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(calendar).toBeHidden()
    await expect(due).toBeFocused()
    await expect(due).toContainText('4 Dec 2026')
  })
})

test.describe('values along a scale', () => {
  test('Slider: the arrows, Home and End change the value it says', async ({ page }) => {
    await visit(page, '/components/choices/slider')
    const risk = example(page, 'levels').getByRole('slider', { name: 'Risk per order' })
    await risk.focus()
    await expect(risk).toHaveAttribute('aria-valuetext', '1.5%')

    await page.keyboard.press('ArrowRight')
    await expect(risk).toHaveAttribute('aria-valuetext', '2.0%')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(risk).toHaveAttribute('aria-valuetext', '1.0%')
    await page.keyboard.press('End')
    await expect(risk).toHaveAttribute('aria-valuetext', '5.0%')
    await page.keyboard.press('ArrowUp')
    await expect(risk).toHaveAttribute('aria-valuetext', '5.0%')
    await page.keyboard.press('Home')
    await expect(risk).toHaveAttribute('aria-valuetext', '0.0%')
  })

  test('RangeSlider: each thumb its keys, neither past the other', async ({ page, browserName }) => {
    const { next } = tabKeys(browserName)
    await visit(page, '/components/choices/slider')
    const range = example(page, 'range')
    const from = range.getByRole('slider', { name: 'Price, from' })
    const to = range.getByRole('slider', { name: 'Price, to' })
    await from.focus()

    await page.keyboard.press('ArrowRight')
    await expect(from).toHaveAttribute('aria-valuetext', '25 €')
    // Stopped by the other thumb.
    await page.keyboard.press('End')
    await expect(from).toHaveAttribute('aria-valuetext', '80 €')
    await page.keyboard.press('ArrowLeft')
    await expect(from).toHaveAttribute('aria-valuetext', '75 €')

    await page.keyboard.press(next)
    await expect(to).toBeFocused()
    await page.keyboard.press('Home')
    await expect(to).toHaveAttribute('aria-valuetext', '75 €')
    await page.keyboard.press('End')
    await expect(to).toHaveAttribute('aria-valuetext', '150 €')
    await expect(range.getByText('Items from 75 € to 150 €.')).toBeVisible()
  })

  test('DragToConfirm: dragged with the mouse, its value said as it goes; let go early it goes back, at the end it confirms', async ({ page }) => {
    await visit(page, '/components/actions/drag-to-confirm')
    const sizes = example(page, 'sizes')
    const thumb = sizes.getByRole('slider', { name: 'Slide to unlock' })
    const track = thumb.locator('..')
    await expect(thumb).toHaveAttribute('aria-valuenow', '0')
    // In the window, where the mouse is: the page scrolls in its own frame (main), not the window.
    await thumb.scrollIntoViewIfNeeded()
    await expect(track).toBeInViewport({ ratio: 1 })
    const knob = await thumb.boundingBox()
    const rail = await track.boundingBox()
    if (!knob || !rail) throw new Error('DragToConfirm is not drawn')
    const y = knob.y + knob.height / 2
    const start = knob.x + knob.width / 2
    const end = rail.x + rail.width - knob.width / 2
    const value = async () => Number(await thumb.getAttribute('aria-valuenow'))

    // Halfway, then let go: it goes back, nothing confirmed.
    await page.mouse.move(start, y)
    await page.mouse.down()
    await page.mouse.move((start + end) / 2, y, { steps: 12 })
    await expect.poll(value).toBeGreaterThanOrEqual(30)
    const halfway = await value()
    expect(halfway).toBeLessThanOrEqual(70)
    await expect(thumb).toHaveAttribute('aria-valuetext', `${halfway}%`)
    await page.mouse.up()
    await expect(thumb).toHaveAttribute('aria-valuenow', '0')
    await expect(sizes.getByText('Nothing confirmed yet.')).toBeVisible()

    // All the way along its track: confirmed as it is let go.
    await page.mouse.move(start, y)
    await page.mouse.down()
    await page.mouse.move((start + end) / 2, y, { steps: 12 })
    await expect.poll(value).toBeGreaterThanOrEqual(30)
    await page.mouse.move(end, y, { steps: 12 })
    await expect(thumb).toHaveAttribute('aria-valuenow', '100')
    await page.mouse.up()
    await expect(thumb).toHaveAttribute('aria-valuetext', 'Unlocked')
    await expect(sizes.getByText('Done: unlocked.')).toBeVisible()
  })
})

test.describe('layers over the page', () => {
  test('SettleModal: the focus moves in, Tab and Shift+Tab go round it, Escape closes it, the focus back on what opened it', { tag: ['@smoke'] }, async ({ page, browserName }) => {
    const { next, back } = tabKeys(browserName)
    await visit(page, '/components/overlays/settle-modal')
    const opener = example(page, 'form').getByRole('button', { name: 'Rename' })
    await opener.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Rename the project' })
    await expect(dialog).toBeVisible()
    // The dialog itself: Enter does nothing until a control is chosen.
    await expect(dialog).toBeFocused()

    const close = dialog.getByRole('button', { name: 'Close' })
    const rename = dialog.getByRole('button', { name: 'Rename' })
    await page.keyboard.press(next)
    await expect(close).toBeFocused()
    await page.keyboard.press(next)
    await expect(dialog.getByRole('textbox', { name: 'Name' })).toBeFocused()
    await page.keyboard.press(next)
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused()
    await page.keyboard.press(next)
    await expect(rename).toBeFocused()
    // Past its last control, round to its first; and back.
    await page.keyboard.press(next)
    await expect(close).toBeFocused()
    await page.keyboard.press(back)
    await expect(rename).toBeFocused()
    await tabsStayIn(page, dialog, back)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(opener).toBeFocused()
  })

  test('Flysheet: the focus moves into the sheet, Tab and Shift+Tab go round it, Escape closes it, the focus back on its trigger', async ({ page, browserName }) => {
    const { next, back } = tabKeys(browserName)
    await visit(page, '/components/overlays/flysheet')
    const trigger = example(page, 'record').getByRole('button', { name: 'Order 2026-0042' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    const sheet = page.getByRole('dialog', { name: 'Order 2026-0042' })
    await expect(sheet).toBeVisible()
    await expect(sheet).toBeFocused()

    await page.keyboard.press(next)
    await expect(sheet.getByRole('button', { name: 'Acme, the customer' })).toBeFocused()
    // Before its first control, round to its last: the close button.
    await page.keyboard.press(back)
    await expect(sheet.getByRole('button', { name: 'Close' })).toBeFocused()
    await tabsStayIn(page, sheet, next)
    await tabsStayIn(page, sheet, back)

    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('Hint: hovered, its tooltip stays while the pointer moves onto it; Escape hides it', async ({ page }) => {
    await visit(page, '/components/overlays/hint')
    const refresh = example(page, 'controls').getByRole('button', { name: 'Refresh' })
    // Shown to the eye (the description is the screen reader's): a tooltip hidden from the accessibility tree.
    const tip = page.locator('[role="tooltip"]').filter({ hasText: 'Last refreshed 4 minutes ago' })

    await refresh.hover()
    await expect(tip).toBeVisible()
    const box = await restingBox(tip)
    // From the button across the gap onto the hint, which it reads: it stays past its grace (120 ms).
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 })
    expect(await staysShown(tip, 600)).toBe(true)

    await page.keyboard.press('Escape')
    await expect(tip).toBeHidden()
  })

  test('DataTable: its list of columns, opened from its button; a Tab out of it closes it, the focus back on its button', async ({ page, browserName }) => {
    const { next, back } = tabKeys(browserName)
    await visit(page, '/components/tables/data-table')
    const button = example(page, 'orders').getByRole('button', { name: 'Columns shown' })
    const list = page.getByRole('dialog', { name: 'Columns shown' })
    const boxes = list.getByRole('checkbox')
    await button.focus()

    await page.keyboard.press('Enter')
    await expect(list).toBeVisible()
    await expect(boxes.first()).toBeFocused()
    const count = await boxes.count()
    for (let at = 1; at < count; at++) {
      await page.keyboard.press(next)
      await expect(boxes.nth(at)).toBeFocused()
    }
    await page.keyboard.press(next)
    await expect(list).toBeHidden()
    await expect(button).toBeFocused()

    // Shift+Tab out of its first, the same.
    await page.keyboard.press('Enter')
    await expect(boxes.first()).toBeFocused()
    await page.keyboard.press(back)
    await expect(list).toBeHidden()
    await expect(button).toBeFocused()
  })

  test('DataTable: a filter’s list, searched, ticked with Space; a Tab out of it closes it, the focus back on its button', async ({ page, browserName }) => {
    const { next } = tabKeys(browserName)
    await visit(page, '/components/tables/data-table')
    const orders = example(page, 'orders')
    const filter = orders.getByRole('group', { name: 'Filters' }).getByRole('button', { name: /^Customer/ })
    const list = page.getByRole('group', { name: 'Filter by Customer' })
    await filter.focus()

    await page.keyboard.press('Enter')
    await expect(list).toBeVisible()
    await expect(list.getByRole('searchbox', { name: 'Search the options of Customer' })).toBeFocused()
    await page.keyboard.type('w')
    await expect(list.getByRole('checkbox')).toHaveCount(2)
    await page.keyboard.press(next)
    const wayne = list.getByRole('checkbox', { name: /^Wayne/ })
    await expect(wayne).toBeFocused()
    await page.keyboard.press('Space')
    await expect(wayne).toBeChecked()
    await expect(orders.getByRole('cell', { name: 'Wayne' })).toHaveCount(1)
    await expect(orders.getByRole('cell', { name: 'Acme' })).toHaveCount(0)

    await page.keyboard.press(next)
    await expect(list.getByRole('checkbox', { name: /^Wonka/ })).toBeFocused()
    await page.keyboard.press(next)
    await expect(list.getByRole('button', { name: 'Clear' })).toBeFocused()
    await page.keyboard.press(next)
    await expect(list).toBeHidden()
    await expect(filter).toBeFocused()
    await expect(filter).toHaveAccessibleName(/1 of 9 chosen/)
  })
})
