import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { formatMoney } from '../lib/format.js'
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
  it('says why in a word, its tone faint behind it, and has no glow', () => {
    const { container } = render(<KpiTile label="Disk" value="91%" tone="warning" toneLabel="Near the limit" />)
    const tile = container.firstElementChild!
    expect(screen.getByText('Near the limit')).toHaveClass('text-warning')
    expect(tile).toHaveClass('border-warning/40', '[--glass-tile-glow:transparent]')
    expect(tile.querySelector('[aria-hidden].bg-warning\\/5')).not.toBeNull()
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
