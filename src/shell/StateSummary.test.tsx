import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KeyRound, RotateCw } from 'lucide-react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'

import { TextLink } from '../components/TextLink.js'
import { RouterRoot } from '../react-router/RouterRoot.js'
import { byGravity, gravestTone, stateSentence } from './state-summary.js'
import type { StateItem } from './state-summary.js'
import { StateSummary } from './StateSummary.js'

const SIGN_IN: StateItem = {
  id: 'sign-in',
  tone: 'danger',
  icon: <KeyRound />,
  label: 'Sign in again',
  detail: 'The connection to the bank expired.',
  href: '/bank',
}
const RESTART: StateItem = { id: 'restart', tone: 'warning', icon: <RotateCw />, label: 'Restart needed', href: '/services' }
const SERVICES: StateItem = { id: 'services', tone: 'ok', label: 'All services up', href: '/services' }
const POLLING: StateItem = { id: 'live', tone: 'neutral', label: 'Polling', detail: 'The page refreshes on a timer.' }

function Address() {
  return <output aria-label="address">{useLocation().pathname}</output>
}

function renderSummary(items: StateItem[], footer?: string) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<RouterRoot />}>
          <Route path="*" element={<StateSummary items={items} footer={footer} />} />
        </Route>
      </Routes>
      <Address />
    </MemoryRouter>,
  )
}

describe('the gravity of states', () => {
  it('goes from what to fix to what is well, and is well for none', () => {
    expect(gravestTone([])).toBe('ok')
    expect(gravestTone([SERVICES, POLLING])).toBe('neutral')
    expect(gravestTone([POLLING, { ...RESTART, tone: 'success' }])).toBe('success')
    expect(gravestTone([RESTART, SIGN_IN, SERVICES])).toBe('danger')
    expect(byGravity([SERVICES, RESTART, POLLING, SIGN_IN]).map((item) => item.id)).toEqual(['sign-in', 'restart', 'live', 'services'])
  })

  it('says one state by its words, several by how many, none by the quiet one or that all is well', () => {
    expect(stateSentence([SIGN_IN, SERVICES], 'All good')).toBe('Sign in again')
    expect(stateSentence([SIGN_IN, RESTART, { ...RESTART, id: 'deploy' }], 'All good')).toBe('1 to fix, 2 to watch')
    expect(stateSentence([SERVICES, POLLING], 'All good')).toBe('Polling')
    expect(stateSentence([SERVICES], 'All good')).toBe('All good')
  })
})

describe('the summary of states', () => {
  it('says that all is well, and lists the quiet states once opened', async () => {
    renderSummary([SERVICES])
    const button = screen.getByRole('button', { name: 'State: All good' })
    await userEvent.click(button)
    const panel = await screen.findByRole('dialog', { name: 'State' })
    expect(within(panel).getByRole('link', { name: /All services up/ })).toHaveAttribute('href', '/services')
  })

  it('shows the gravest state in its words, and how many more', async () => {
    renderSummary([RESTART, SERVICES, SIGN_IN])
    const button = screen.getByRole('button', { name: 'State: Sign in again (1 to fix, 1 to watch)' })
    expect(button).toHaveTextContent('Sign in again')
    expect(button).toHaveTextContent('+1')
    expect(button.className).toContain('text-negative')

    await userEvent.click(button)
    const panel = await screen.findByRole('dialog', { name: 'State' })
    const links = within(panel).getAllByRole('link')
    // The gravest first, then what to watch, then what is well.
    expect(links.map((link) => link.textContent)).toEqual([
      'Sign in againThe connection to the bank expired.',
      'Restart needed',
      'All services up',
    ])
  })

  it('says a quiet state that asks nothing in grey, in its own words', () => {
    renderSummary([SERVICES, POLLING])
    const button = screen.getByRole('button', { name: 'State: Polling' })
    expect(button).toHaveTextContent('Polling')
    expect(button.className).not.toContain('text-warning')
  })

  it('follows a state to its page and closes', async () => {
    renderSummary([RESTART, SERVICES])
    await userEvent.click(screen.getByRole('button', { name: 'State: Restart needed' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('link', { name: /Restart needed/ }))
    expect(screen.getByRole('status', { name: 'address' })).toHaveTextContent('/services')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes as a link of its footer is followed', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<RouterRoot />}>
            <Route path="*" element={<StateSummary items={[SERVICES]} footer={<TextLink to="/services">Every service</TextLink>} />} />
          </Route>
        </Routes>
        <Address />
      </MemoryRouter>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'State: All good' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('link', { name: 'Every service' }))
    expect(screen.getByRole('status', { name: 'address' })).toHaveTextContent('/services')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes on Escape and gives the focus back to its button', async () => {
    renderSummary([SIGN_IN], 'Every service')
    const button = screen.getByRole('button', { name: 'State: Sign in again' })
    await userEvent.click(button)
    const panel = await screen.findByRole('dialog')
    expect(panel).toHaveTextContent('Every service')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(button).toHaveFocus()
  })
})
