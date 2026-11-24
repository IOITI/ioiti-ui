// What the gallery's pages never show axe: what floats once opened. Every example of the groups that open layers is
// drawn, as an application would (its router, its toasts), and the first control that says it opens one
// (aria-haspopup) is pressed: the layer that comes is held to axe with the page under it (test/a11y.ts), then Escape
// closes it and the focus goes back to that control.
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IoitiProvider } from 'ioiti-ui'
import { RouterRoot } from 'ioiti-ui/react-router'
import type { ComponentType } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../test/a11y'

// The groups whose examples open layers: menus, popovers, sheets, dialogs, lists of options, pickers.
const modules = import.meta.glob<{ default: ComponentType }>(
  ['./components/{overlays,choices,forms,dates,top-bar,actions,tables,feedback}/*/*.tsx'],
  { eager: true },
)

const LAYERS = ['dialog', 'alertdialog', 'menu', 'listbox', 'tree', 'grid'] as const

function draw(Example: ComponentType) {
  const router = createMemoryRouter([{ element: <RouterRoot />, children: [{ path: '*', element: <Example /> }] }])
  return render(
    <IoitiProvider appName="Open states">
      <RouterProvider router={router} />
    </IoitiProvider>,
  )
}

// Each role asked for by its name: a role given as a pattern matches nothing.
const layers = () => LAYERS.flatMap((role) => screen.queryAllByRole(role))

describe('every layer an example opens', () => {
  for (const [path, module] of Object.entries(modules)) {
    const name = path.replace(/^\.\/components\//, '').replace(/\.tsx$/, '')
    it(`${name}: held to axe once opened, closed by Escape, the focus back on what opened it`, async () => {
      const user = userEvent.setup()
      const { container } = draw(module.default)
      const trigger = container.querySelector<HTMLElement>('[aria-haspopup]:not([aria-haspopup="false"]):not([disabled])')
      // An example with nothing that opens a layer: nothing to hold here.
      if (!trigger) return
      const before = layers().length
      await user.click(trigger)
      await waitFor(() => expect(layers().length, `${name}: what its control opens`).toBeGreaterThan(before), { timeout: 3000 })
      await expectAccessible(document.body)
      await user.keyboard('{Escape}')
      await waitFor(() => expect(layers().length, `${name}: closed by Escape`).toBe(before), { timeout: 3000 })
      expect(document.activeElement, `${name}: the focus back on what opened it`).toBe(trigger)
    }, 20_000)
  }
})
