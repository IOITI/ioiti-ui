import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IoitiProvider } from 'ioiti-ui'
import { describe, expect, it } from 'vitest'

import packageJson from '../../../package.json'
import { A_PAGE, renderAt } from '../gallery-pages'
import PROPS from '../props.json'
import SINCE from '../since.json'
import { FamilyStatus } from './FamilyStatus'
import { PropsTables } from './PropsTables'
import { isNew, sourceOf } from './shipped'
import type { FamilyInfo } from './types'

const VERSION = packageJson.version
const SHIPPED: Record<string, string> = SINCE

/** A family as a category writes it, for what its page says of it. */
const family = (name: string, more: Partial<FamilyInfo> = {}): FamilyInfo => ({ slug: name.toLowerCase(), name, names: [name], examples: [], ...more })

/** Whether what holds an element is open: a `<details>` folds it away until its summary is pressed. */
const shown = (element: Element) => element.closest('details')?.open ?? true

describe('a family’s page', () => {
  it('says since when its component shipped, links to its source at the tag, and folds its deprecated props', async () => {
    const user = userEvent.setup()
    renderAt('/components/actions/button')
    const title = await screen.findByRole('heading', { level: 1, name: 'Button' }, { timeout: 10_000 })
    const header = within(title.parentElement!)

    const tag = SHIPPED.Button ? `v${VERSION}` : 'main'
    expect(screen.getByRole('link', { name: 'Its source' }).getAttribute('href')).toBe(`https://github.com/IOITI/ioiti-ui/blob/${tag}/${PROPS.Button.file}`)
    expect(header.queryByText(`Since ${SHIPPED.Button}`)).not.toBeNull()
    expect(header.queryByText('New')).toBeNull()
    expect(header.queryByText('Deprecated')).toBeNull()

    // Its deprecated prop (isLoading) is not among those of today, but folded under how many there are.
    const props = within(document.getElementById('props')!)
    expect(within(props.getByRole('table', { name: 'The props of Button' })).queryByText('isLoading')).toBeNull()
    const folded = props.getByText('isLoading')
    expect(shown(folded)).toBe(false)
    await user.click(props.getByText('1 deprecated prop'))
    expect(shown(folded)).toBe(true)
    expect(folded.closest('table')?.getAttribute('aria-label')).toBe('The deprecated props of Button')
  }, A_PAGE)

  it('marks a component no release has had as new, and one deprecated, beside its former names', () => {
    const { unmount } = render(
      <IoitiProvider appName="ioiti-ui">
        <FamilyStatus family={family('Brandnew', { formerly: ['OldBrand'] })} />
      </IoitiProvider>,
    )
    const line = within(screen.getByText('Formerly OldBrand').parentElement!)
    expect(line.queryByText('New')).not.toBeNull()
    expect(line.queryByText(/^Since /)).toBeNull()
    unmount()

    render(
      <IoitiProvider appName="ioiti-ui">
        <FamilyStatus family={family('StretchSwitch', { deprecated: 'Switch' })} />
      </IoitiProvider>,
    )
    expect(screen.queryByText('Deprecated')).not.toBeNull()
    expect(screen.queryByText('New')).toBeNull()
    expect(screen.queryByText(`Since ${SHIPPED.StretchSwitch}`)).not.toBeNull()
    const replacement = screen.getByRole('link', { name: 'Switch' })
    expect(replacement.getAttribute('href')).toBe('/components/choices/switch')
    expect(replacement.parentElement?.textContent).toBe('Use Switch, which takes the same props; removed in 1.0.')
  })

  it('is new until a release after the one that shipped it, its source on main until one has', () => {
    expect(isNew('Dialog', {}, '0.32.0')).toBe(true)
    expect(isNew('Dialog', { Dialog: '0.32.0' }, '0.32.0')).toBe(true)
    expect(isNew('Dialog', { Dialog: '0.31.0' }, '0.32.0')).toBe(false)
    expect(sourceOf('Button', { Button: '0.1.0' }, '0.32.0')).toBe(`https://github.com/IOITI/ioiti-ui/blob/v0.32.0/${PROPS.Button.file}`)
    expect(sourceOf('Button', {}, '0.32.0')).toBe(`https://github.com/IOITI/ioiti-ui/blob/main/${PROPS.Button.file}`)
    expect(sourceOf('NoSuchComponent', { NoSuchComponent: '0.1.0' }, '0.32.0')).toBeUndefined()
  })

  it('says how many deprecated props a component has, and shows them on demand', async () => {
    const user = userEvent.setup()
    render(<PropsTables names={['Tabs']} />)
    const deprecated = PROPS.Tabs.props.filter((prop) => 'deprecated' in prop).map((prop) => prop.name)
    expect(deprecated).toHaveLength(2)
    for (const name of deprecated) expect(shown(screen.getByText(name))).toBe(false)
    await user.click(screen.getByText('2 deprecated props'))
    for (const name of deprecated) expect(shown(screen.getByText(name))).toBe(true)
  })
})
