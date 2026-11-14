import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppShell } from '../shell/AppShell.js'
import { AuthLayout } from '../shell/AuthLayout.js'
import { MENU } from '../test/menu.js'
import { IoitiProvider } from './IoitiProvider.js'
import { PageHeader } from './Panel.js'
import { Sparkline } from './Sparkline.js'
import { DependencyTrace } from './ui/dependency-trace.js'
import { LiveLineChart } from './ui/live-line-chart.js'

describe('a chart in a box narrower than it', () => {
  it('is a sparkline that shrinks with its box, its height with it, never past it', () => {
    render(
      <>
        <Sparkline values={[1, 3, 2, 5]} label="Orders" />
        <Sparkline values={[1, -3, 2, 5]} variant="bars" label="Result" />
      </>,
    )
    for (const chart of screen.getAllByRole('img')) expect(chart).toHaveClass('block', 'h-auto', 'max-w-full')
  })

  it('is a trace never wider than its canvas, its words never larger than drawn', () => {
    const { container } = render(
      <DependencyTrace nodes={[{ id: 'a', label: 'Web', x: 50, y: 50 }]} connections={[]} width={300} height={100} label="Services" />,
    )
    const svg = container.querySelector('svg')!
    expect(svg).toHaveStyle({ maxWidth: '300px' })
  })
})

describe('a live chart with a scale of its own', () => {
  it('says its scale before its first readings', async () => {
    const { container } = render(<LiveLineChart domain={[0, 100]} />)
    await waitFor(() => {
      const ticks = [...container.querySelectorAll('text')].map((text) => text.textContent).filter(Boolean)
      expect(ticks).toEqual(expect.arrayContaining(['100', '50', '0']))
    })
  })
})

describe('a sign-in page drawn in a box', () => {
  it('fills its box, not the window', () => {
    render(
      <AuthLayout title="My App" className="min-h-full" themeToggle={false}>
        <p>Form</p>
      </AuthLayout>,
    )
    const page = screen.getByRole('main')
    expect(page).toHaveClass('min-h-full')
    expect(page).not.toHaveClass('min-h-dvh')
  })
})

describe('a shell drawn in a page', () => {
  it('leaves the tab to the page around it, which names it', async () => {
    document.title = 'Before'
    render(
      <IoitiProvider appName="My App">
        <AppShell menu={MENU} pathname="/orders" shortcutsDialog={false}>
          <PageHeader title="The gallery's page" />
          <AppShell menu={MENU} pathname="/customers" className="h-full" shortcutsDialog={false}>
            <PageHeader title="A page of the demo" />
          </AppShell>
        </AppShell>
      </IoitiProvider>,
    )
    await waitFor(() => expect(document.title).toBe("The gallery's page · My App"))
  })
})
