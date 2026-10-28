import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IoitiProvider } from 'ioiti-ui'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { routes } from '../router'

describe('the Motion page', () => {
  it('moves a square along its way and back, never jumping nor coming from beyond it', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider appName="ioiti-ui">
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/foundations/motion'] })} />
      </IoitiProvider>,
    )
    const button = await screen.findByRole('button', { name: 'springGentle' })
    const square = button.parentElement?.querySelector<HTMLElement>('.bg-foreground')
    if (!square) throw new Error('no square beside springGentle')
    const steps: string[] = []
    const observer = new MutationObserver(() => steps.push(square.style.left))
    observer.observe(square, { attributeFilter: ['style'] })

    await user.click(button)
    await waitFor(() => expect(square.style.left).toBe('100%'), { timeout: 3000 })
    const there = steps.length
    await user.click(button)
    await waitFor(() => expect(square.style.left).toBe('0%'), { timeout: 3000 })
    observer.disconnect()

    // Each step a share of its way (no overshoot: springGentle), and steps between its ends both ways.
    const shares = steps.map((left) => (/^\d+(\.\d+)?%$/.test(left) ? Number.parseFloat(left) : Number.NaN))
    expect(shares.filter((share) => !(share >= 0 && share <= 100)), steps.join(' ')).toEqual([])
    const between = (from: number, to?: number) => shares.slice(from, to).filter((share) => share > 5 && share < 95)
    expect(between(0, there).length).toBeGreaterThan(2)
    expect(between(there).length).toBeGreaterThan(2)
  })
})
