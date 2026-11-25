import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IoitiProvider } from 'ioiti-ui'
import { describe, expect, it } from 'vitest'

import packageJson from '../../../package.json'
import { A_PAGE, renderAt } from '../gallery-pages'
import PROPS from '../props.json'
import SINCE from '../since.json'
import { FamilyStatus } from './FamilyStatus'
import { COMPONENT_PROPS } from './props'
import { PropsTable } from './PropsTables'
import { isNew, sourceOf } from './shipped'
import type { FamilyInfo } from './types'

const VERSION = packageJson.version
const SHIPPED: Record<string, string> = SINCE

/** A family as a category writes it, for what its page says of it. */
const family = (name: string, more: Partial<FamilyInfo> = {}): FamilyInfo => ({ slug: name.toLowerCase(), name, names: [name], examples: [], ...more })

/** Whether what holds an element is open: a `<details>` folds it away until its summary is pressed. */
const shown = (element: Element) => element.closest('details')?.open ?? true

describe('a family’s page', () => {
  it('says since when its component shipped, and links to its source at the tag', async () => {
    renderAt('/components/actions/button')
    const title = await screen.findByRole('heading', { level: 1, name: 'Button' }, { timeout: 10_000 })
    const header = within(title.parentElement!)

    const tag = SHIPPED.Button ? `v${VERSION}` : 'main'
    expect(screen.getByRole('link', { name: 'Its source' }).getAttribute('href')).toBe(`https://github.com/IOITI/ioiti-ui/blob/${tag}/${PROPS.Button.file}`)
    expect(header.queryByText(`Since ${SHIPPED.Button}`)).not.toBeNull()
    expect(header.queryByText('New')).toBeNull()
    expect(header.queryByText('Deprecated')).toBeNull()
  }, A_PAGE)

  it('marks a component no release has had as new, beside its former names', () => {
    render(
      <IoitiProvider appName="ioiti-ui">
        <FamilyStatus family={family('Brandnew', { formerly: ['OldBrand'] })} />
      </IoitiProvider>,
    )
    const line = within(screen.getByText('Formerly OldBrand').parentElement!)
    expect(line.queryByText('New')).not.toBeNull()
    expect(line.queryByText(/^Since /)).toBeNull()
  })

  it('is new until a release after the one that shipped it, its source on main until one has', () => {
    expect(isNew('Dialog', {}, '0.32.0')).toBe(true)
    expect(isNew('Dialog', { Dialog: '0.32.0' }, '0.32.0')).toBe(true)
    expect(isNew('Dialog', { Dialog: '0.31.0' }, '0.32.0')).toBe(false)
    expect(sourceOf('Button', { Button: '0.1.0' }, '0.32.0')).toBe(`https://github.com/IOITI/ioiti-ui/blob/v0.32.0/${PROPS.Button.file}`)
    expect(sourceOf('Button', {}, '0.32.0')).toBe(`https://github.com/IOITI/ioiti-ui/blob/main/${PROPS.Button.file}`)
    expect(sourceOf('NoSuchComponent', { NoSuchComponent: '0.1.0' }, '0.32.0')).toBeUndefined()
  })

  it('says how many deprecated props a component has, and shows them on demand, apart from those of today', async () => {
    const user = userEvent.setup()
    // 1.0 removed every deprecated prop: two given here, as a version that deprecates one draws it.
    const deprecated = ['activeTab', 'defaultTab']
    const tabs = COMPONENT_PROPS.Tabs
    render(
      <PropsTable
        name="Tabs"
        component={{ ...tabs, props: [...tabs.props, ...deprecated.map((name) => ({ name, type: 'string', deprecated: 'Use `value`.' }))] }}
      />,
    )
    expect(within(screen.getByRole('table', { name: 'The props of Tabs' })).queryByText('activeTab')).toBeNull()
    for (const name of deprecated) expect(shown(screen.getByText(name))).toBe(false)
    await user.click(screen.getByText('2 deprecated props'))
    for (const name of deprecated) expect(shown(screen.getByText(name))).toBe(true)
    expect(screen.getByText('activeTab').closest('table')?.getAttribute('aria-label')).toBe('The deprecated props of Tabs')
  })
})
