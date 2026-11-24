import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatMoney } from '../lib/format.js'
import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { KpiGrid, KpiTile } from './KpiTile.js'

describe('a tile with its change', () => {
  it('signs it, colours it by what it means, and says it in words', () => {
    render(
      <>
        <KpiTile label="Revenue" value="€12,400" change={2.5} />
        <KpiTile label="Latency" value="182 ms" change={2.5} goodWhen="down" />
        <KpiTile label="Errors" value="0.3%" change={-1.24} goodWhen="down" />
        <KpiTile label="Orders" value="38" change={0} />
      </>,
    )
    const [revenue, latency] = screen.getAllByText('+2.5%')
    expect(revenue.parentElement).toHaveClass('text-positive')
    expect(latency.parentElement).toHaveClass('text-negative')
    expect(revenue).toHaveAttribute('aria-hidden')
    expect(screen.getAllByText('up 2.5%')[0]).toHaveClass('sr-only')

    expect(screen.getByText('−1.2%').parentElement).toHaveClass('text-positive')
    expect(screen.getByText('down 1.2%')).toBeInTheDocument()
    expect(screen.getByText('0.0%').parentElement).toHaveClass('text-muted-foreground')
    expect(screen.getByText('unchanged')).toBeInTheDocument()
  })

  it('writes it as asked, beside its hint', () => {
    render(<KpiTile label="Profit" value="€1,025.00" change={-12} changeFormat={(n) => formatMoney(n, 'EUR', true)} hint="since the open" />)
    expect(screen.getByText('−€12.00')).toBeInTheDocument()
    expect(screen.getByText('down €12.00')).toBeInTheDocument()
    expect(screen.getByText('since the open')).toBeInTheDocument()
  })

  it('has no change where none is given, its hint as before', () => {
    render(<KpiTile label="Open positions" value="3" hint="of 5 allowed" />)
    expect(screen.getByText('of 5 allowed')).toHaveClass('mt-1', 'text-xs', 'text-muted-foreground')
    expect(screen.queryByText(/^(up|down|unchanged)/)).toBeNull()
  })
})

describe('a tile that needs attention', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('says why in a word, its tone faint behind it, and has no glow', () => {
    const { container } = render(<KpiTile label="Disk" value="91%" tone="warning" toneLabel="Near the limit" />)
    const tile = container.firstElementChild!
    expect(screen.getByText('Near the limit')).toHaveClass('text-warning')
    expect(tile).toHaveClass('border-warning/40', '[--glass-tile-glow:transparent]')
    expect(tile.querySelector('[aria-hidden].bg-warning\\/5')).not.toBeNull()
  })

  it('is drawn in the negative colour where it is in danger', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(<KpiTile label="Failed payments" value="12" tone="danger" toneLabel="Failing" />)
    const tile = container.firstElementChild!
    expect(screen.getByText('Failing')).toHaveClass('text-negative')
    expect(tile).toHaveClass('border-negative/40', '[--glass-tile-glow:transparent]')
    expect(tile.querySelector('[aria-hidden].bg-negative\\/5')).not.toBeNull()
    expect(warn).not.toHaveBeenCalled()
  })

  it('reads negative, its former name, as danger, and says once in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container, rerender } = render(<KpiTile label="Refunds" value="7" tone="negative" toneLabel="Above usual" />)
    expect(screen.getByText('Above usual')).toHaveClass('text-negative')
    expect(container.firstElementChild).toHaveClass('border-negative/40')
    rerender(<KpiTile label="Refunds" value="8" tone="negative" toneLabel="Above usual" />)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toMatch(/^ioiti-ui: a name or a value the package deprecated/)
    expect(String(warn.mock.calls[0][0])).toContain(`(KpiTile's tone="negative": danger)`)
  })
})

describe('the tile that leads', () => {
  it('takes two columns, its chart beside its figure from a tablet up', () => {
    const { container } = render(
      <KpiTile lead label="Revenue" value="€12,400">
        <span>chart</span>
      </KpiTile>,
    )
    expect(container.firstElementChild).toHaveClass('col-span-2', 'sm:flex-row', 'glass-tile', 'glass-edge')
    expect(screen.getByText('chart').parentElement).toHaveClass('sm:flex-1')
  })
})

describe('a row of tiles with its period', () => {
  it('says what they are compared with once, and a screen reader hears it with them', () => {
    render(
      <KpiGrid period="Compared with yesterday">
        <KpiTile label="Revenue" value="€12,400" change={2.5} />
      </KpiGrid>,
    )
    const group = screen.getByRole('group')
    expect(group).toHaveAccessibleDescription('Compared with yesterday')
    expect(group).toHaveClass('grid', 'grid-cols-2')
  })

  it('is the grid alone without one', () => {
    render(<KpiGrid>tiles</KpiGrid>)
    expect(screen.queryByRole('group')).toBeNull()
    expect(screen.getByText('tiles')).toHaveClass('grid')
  })
})

describe('a tile\'s change in a locale', () => {
  it('is written as the locale writes a percentage, and said in its words', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <KpiTile label="Chiffre d’affaires" value="12 400 €" change={2.5} />
        <KpiTile label="Erreurs" value="0,3 %" change={-1.24} goodWhen="down" />
        <KpiTile label="Commandes" value="38" change={0} />
      </IoitiProvider>,
    )
    expect(screen.getByText('+2,5 %').parentElement).toHaveClass('text-positive')
    expect(screen.getByText('en hausse de 2,5 %')).toHaveClass('sr-only')
    expect(screen.getByText('−1,2 %').parentElement).toHaveClass('text-positive')
    expect(screen.getByText('en baisse de 1,2 %')).toBeInTheDocument()
    expect(screen.getByText('stable')).toBeInTheDocument()
  })

  it('is said in an application\'s own words, given over English\'s, its figure as it asks', () => {
    render(
      <IoitiProvider messages={{ numberInput: { changeDown: (figure: string) => `fell by ${figure}` } }}>
        <KpiTile label="Profit" value="€1,025.00" change={-12} changeFormat={(n) => formatMoney(n, 'EUR', true)} />
      </IoitiProvider>,
    )
    expect(screen.getByText('fell by €12.00')).toHaveClass('sr-only')
  })
})
