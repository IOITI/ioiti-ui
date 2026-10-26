import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IoitiProvider } from './IoitiProvider.js'
import { PageHeader, Panel } from './Panel.js'

describe('the header of a page', () => {
  it('names the page in its heading and in the tab, and leaves the trail to the top bar', () => {
    render(
      <IoitiProvider appName="My App">
        <PageHeader title="Invoice 2026-0042" parents={[{ label: 'Somewhere', href: '/somewhere' }]} />
      </IoitiProvider>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Invoice 2026-0042' })).toBeInTheDocument()
    expect(document.title).toBe('Invoice 2026-0042 · My App')
    // Outside the shell, its name goes nowhere, and nothing fails.
    expect(screen.queryByRole('navigation', { name: 'Breadcrumb' })).not.toBeInTheDocument()
  })

  it('names the application once in the tab of a page named as the application', () => {
    render(
      <IoitiProvider appName="My App">
        <PageHeader title="My App" />
      </IoitiProvider>,
    )

    expect(document.title).toBe('My App')
  })

  it('names the tab after the page alone when the application gave no name', () => {
    render(<PageHeader title="Settings" />)

    expect(document.title).toBe('Settings')
  })
})

describe('a panel', () => {
  it('is a section named by its title, its body close under it when dense', () => {
    render(
      <Panel title="Latest" dense>
        <p>first row</p>
      </Panel>,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Latest' })).toBeInTheDocument()
    expect(screen.getByText('first row').parentElement).toHaveClass('p-5', 'pt-2')
  })
})
