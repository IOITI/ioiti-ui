import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { fr } from '../locales/fr.js'
import { FanChart } from './FanChart.js'
import { IoitiProvider } from './IoitiProvider.js'
import { LineChart } from './LineChart.js'
import type { MessagesOverride } from './locale-context.js'
import { Sparkline } from './Sparkline.js'
import { AnimatedNumber } from './ui/animated-number.js'
import { BarChart } from './ui/bar-chart.js'
import { DonutChart } from './ui/donut-chart.js'
import { FunnelChart } from './ui/funnel-chart.js'
import { LiveLineChart } from './ui/live-line-chart.js'
import { StatCard } from './ui/stat-card.js'

/** French's no-break spaces (before a colon and "%", between groups of digits, before "k") read as spaces. */
const spaced = (text: string | null | undefined) => (text ?? '').replace(/\s/g, ' ')
const nameOf = (element: Element) => spaced(element.getAttribute('aria-label')).trim()
/** A role's name, its no-break spaces read as spaces. */
const named = (expected: string) => (name: string) => spaced(name) === expected
const texts = (container: HTMLElement) => Array.from(container.querySelectorAll('svg text')).map((text) => spaced(text.textContent))
const tooltip = () => spaced(document.querySelector('.glass-float')?.textContent)

function French({ children }: { children: ReactNode }) {
  return (
    <IoitiProvider locale="fr-FR" messages={fr}>
      {children}
    </IoitiProvider>
  )
}

const DAY = 86_400_000
const RUNS = Array.from({ length: 10 }, (_, index) => ({
  t: Date.UTC(2026, 9, 1) + index * DAY,
  a: 1000 + index * 12,
  b: index === 4 ? null : 1000 + index * 7,
}))
const RUN_SERIES = [
  { key: 'a', label: 'Essai 41' },
  { key: 'b', label: 'Essai 42' },
]

const DAYS = [
  { label: 'lun.', profit: 1200, fees: 120 },
  { label: 'mar.', profit: -800, fees: 90 },
  { label: 'mer.', profit: 450, fees: 110 },
]
const DAY_SERIES = [
  { key: 'profit', label: 'Résultat' },
  { key: 'fees', label: 'Frais' },
]

const CHANNELS = [
  { label: 'Boutique', value: 420 },
  { label: 'Téléphone', value: 180 },
  { label: 'Partenaires', value: 90 },
  { label: 'Salons', value: 60 },
  { label: 'Courrier', value: 30 },
  { label: 'Autres sites', value: 20 },
]

const STAGES = [
  { label: 'Visites', value: 12480 },
  { label: 'Produit vu', value: 5210 },
  { label: 'Panier', value: 1380 },
  { label: 'Achats', value: 642 },
]

describe('the charts in French', () => {
  it('name a line chart, write its moments and numbers, and head its table', async () => {
    const user = userEvent.setup()
    const { container } = render(<LineChart data={RUNS} series={RUN_SERIES} animated={false} />, { wrapper: French })

    expect(nameOf(screen.getByRole('img'))).toBe('Graphique en courbes : Essai 41 et Essai 42')
    expect(screen.getByRole('list', { name: 'Séries' })).toBeInTheDocument()
    // The axis: its days as French writes them, its values compact.
    expect(texts(container).filter((text) => /^\d\d oct\.$/.test(text)).length).toBeGreaterThan(1)
    expect(texts(container)).toEqual(expect.arrayContaining(['1 k', '1,1 k']))

    const table = screen.getByRole('table', { name: 'Données du graphique' })
    expect(within(table).getByRole('columnheader', { name: 'Date' })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: named('05 oct. 2026 1 048 —') })).toBeInTheDocument()

    await user.tab()
    await user.keyboard('{End}')
    expect(tooltip()).toContain('10 oct. 2026')
    expect(tooltip()).toContain('1 108')
  })

  it('name a fan chart and write its bands as ranges', () => {
    const cone = [1, 2, 3, 4].map((x) => ({
      x,
      p5: -2 * Math.sqrt(x),
      p95: 2 * Math.sqrt(x) + 0.3 * x,
      median: 0.3 * x,
      actual: -0.5 * x,
    }))
    render(
      <FanChart
        data={cone}
        bands={[{ lower: 'p5', upper: 'p95', label: '90 % des trajectoires' }]}
        lines={[
          { key: 'median', label: 'Attendu', dashed: true },
          { key: 'actual', label: 'Réel' },
        ]}
        animated={false}
      />,
      { wrapper: French },
    )
    expect(nameOf(screen.getByRole('img'))).toBe('Graphique en éventail : Attendu et Réel')
    const table = screen.getByRole('table', { name: 'Données du graphique' })
    expect(within(table).getByRole('columnheader', { name: 'Position' })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: named('4 1,2 −2 de −4 à 5,2') })).toBeInTheDocument()
  })

  it('name a bar chart, its categories counted, and write its ticks, values and total', async () => {
    const user = userEvent.setup()
    const { container, rerender } = render(<BarChart data={DAYS} series={DAY_SERIES} animated={false} />, { wrapper: French })

    expect(nameOf(screen.getByRole('img'))).toBe('Graphique à barres : Résultat et Frais, sur 3 catégories')
    expect(texts(container)).toEqual(expect.arrayContaining(['−1 k', '−500', '0', '1 k', '1,5 k']))
    const table = screen.getByRole('table', { name: 'Données du graphique' })
    expect(within(table).getByRole('columnheader', { name: 'Catégorie' })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: named('lun. 1 200 120') })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: named('mar. −800 90') })).toBeInTheDocument()

    rerender(<BarChart data={DAYS.slice(0, 1)} series={DAY_SERIES} variant="stacked" animated={false} />)
    expect(nameOf(screen.getByRole('img'))).toBe('Graphique à barres : Résultat et Frais, sur 1 catégorie')
    await user.tab()
    await user.keyboard('{Home}')
    expect(tooltip()).toContain('Total1 320')
  })

  it('name a donut and a gauge, and write their shares and the rest', () => {
    const { unmount } = render(<DonutChart data={CHANNELS} animated={false} />, { wrapper: French })

    expect(nameOf(screen.getByRole('img'))).toBe('Graphique en anneau. Total : 800')
    expect(screen.getByText('Total')).toBeInTheDocument()
    const legend = screen.getByRole('list', { name: 'Légende' })
    // 420 of 800 is 52.5 %, 50 of 800 (the fifth and sixth together) 6.25 %.
    expect(within(within(legend).getByRole('button', { name: /^Boutique/ })).getByText('53 %')).toBeInTheDocument()
    expect(within(within(legend).getByRole('button', { name: /^Autres/ })).getByText('6 %')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Données du graphique' })
    for (const head of ['Secteur', 'Valeur', 'Part']) expect(within(table).getByRole('columnheader', { name: head })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: named('Courrier 30 4 %') })).toBeInTheDocument()
    unmount()

    render(
      <DonutChart variant="semi" showLegend={false} animated={false} data={[{ label: 'Occupées', value: 1046.5 }, { label: 'Libres', value: 4 }]} />,
      { wrapper: French },
    )
    expect(nameOf(screen.getByRole('img'))).toBe('Graphique en jauge. Total : 1 050,5')
  })

  it('name a funnel, and write its conversion, its losses and its table', async () => {
    const user = userEvent.setup()
    const { container } = render(<FunnelChart stages={STAGES} animated={false} />, { wrapper: French })

    expect(nameOf(screen.getByRole('img'))).toBe('Entonnoir de 4 étapes, de « Visites » à « Achats »')
    // 642 of 12,480 is 5.14 %; the first loss 58.25 %, the second 73.5 %, the third 53.5 %.
    expect(spaced(container.textContent)).toContain('5,1 % de conversion globale')
    expect(spaced(container.textContent)).toContain('Plus forte perte : Produit vu → Panier −74 %')
    expect(texts(container)).toEqual(expect.arrayContaining(['−58 %', '−74 %', '−53 %', '12 480 · 100 %', '642 · 5,1 %']))

    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(tooltip()).toContain('Utilisateurs12 480')
    expect(tooltip()).toContain('De la première étape100 %')
    expect(tooltip()).toContain('Perte à l’étape suivante−7 270 (58 %)')

    const table = screen.getByRole('table', { name: 'Données de l’entonnoir' })
    for (const head of ['Étape', 'Utilisateurs', '% de la première étape']) {
      expect(within(table).getByRole('columnheader', { name: head })).toBeInTheDocument()
    }
    expect(within(table).getByRole('row', { name: named('Produit vu 5 210 42 %') })).toBeInTheDocument()
  })

  it('say a funnel without a stage, and one that loses nothing', () => {
    const { unmount } = render(<FunnelChart stages={[]} />, { wrapper: French })
    expect(screen.getByText('Aucune donnée')).toBeInTheDocument()
    unmount()
    const { container } = render(<FunnelChart stages={[{ label: 'Inscrits', value: 40 }, { label: 'Actifs', value: 40 }]} animated={false} />, {
      wrapper: French,
    })
    expect(texts(container)).toContain('0 %')
  })

  it('name a tile with its change, and say its points', async () => {
    const user = userEvent.setup()
    render(<StatCard label="Valeur du compte" value={1025} trend={[1000, 1010, 1025]} previous={1000} animated={false} />, {
      wrapper: French,
    })
    const tile = screen.getByRole('group', { name: named('Valeur du compte : 1 025, en hausse de 2,5 %') })
    expect(screen.getByText('2,5 %', { normalizer: spaced })).toBeInTheDocument()
    expect(screen.getByText('vs période précédente')).toBeInTheDocument()
    expect(nameOf(screen.getByRole('img'))).toBe('Valeur du compte : évolution de 1 000 à 1 025')

    await user.tab()
    expect(tile).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(spaced(screen.getByRole('status').textContent)).toBe('Point 2 : 1 010')
  })

  it('name a tile that did not change', () => {
    render(<StatCard label="Commandes" value={42} trend={[40, 42]} delta={0} animated={false} />, { wrapper: French })
    expect(screen.getByRole('group', { name: named('Commandes : 42, sans changement') })).toBeInTheDocument()
  })

  it('name a sparkline and write its values', () => {
    render(<Sparkline label="Commandes par jour" values={[1200.5, 90, 2000, 1800]} />, { wrapper: French })
    expect(nameOf(screen.getByRole('img'))).toBe('Commandes par jour : de 1 200,50 à 1 800, maximum 2 000, minimum 90')
  })

  it('write a live chart’s window, change and axis, and say its pause', async () => {
    const user = userEvent.setup()
    const { container } = render(<LiveLineChart initial={[100, 102]} windowSeconds={900} domain={[0, 1500]} />, { wrapper: French })

    expect(nameOf(container.querySelector('svg[role="img"]')!)).toBe('Graphique en direct sur les dernières 15 min, actuellement 102')
    expect(spaced(container.textContent)).toContain('▲ 2,0 % sur les dernières 15 min')
    expect(texts(container)).toEqual(expect.arrayContaining(['−15 min', '−7,5 min', 'maintenant']))
    await waitFor(() => expect(texts(container)).toEqual(expect.arrayContaining(['1,5 k', '750', '0'])))

    const pause = screen.getByRole('button', { name: 'Mettre en pause les mises à jour en direct' })
    expect(pause).toHaveTextContent('En direct')
    await user.click(pause)
    expect(screen.getByRole('button', { name: 'Reprendre les mises à jour en direct' })).toHaveTextContent('En pause')
    expect(screen.getByRole('status')).toHaveTextContent('Mises à jour en direct en pause')
  })

  it('say how long ago a live chart’s point was, in French', async () => {
    const { container } = render(<LiveLineChart initial={[100, 102, 101]} windowSeconds={60} />, { wrapper: French })
    fireEvent.pointerMove(container.querySelector('svg rect[fill="transparent"]')!, { clientX: 200 })
    await waitFor(() => expect(tooltip()).toMatch(/il y a (\d+,\d s|\d+ min \d\d s)$/))
  })

  it('write an animated number as French writes it, its digits rolling', () => {
    const { unmount } = render(<AnimatedNumber value={-1234.5} decimals={2} />, { wrapper: French })
    expect(screen.getByText('−1 234,50')).toBeInTheDocument()
    unmount()
    render(<AnimatedNumber value={2_188_860} compact decimals={1} />, { wrapper: French })
    expect(screen.getByText('2,2 M')).toBeInTheDocument()
  })
})

describe('a chart in American English', () => {
  it('writes a moment on the locale’s clock of 12 hours where its axis is in hours', () => {
    const hours = [0, 1, 2, 3].map((index) => ({ t: Date.UTC(2026, 9, 1, 13 + index), a: index }))
    render(
      <IoitiProvider locale="en-US">
        <LineChart aria-label="Orders" data={hours} series={[{ key: 'a', label: 'Orders' }]} animated={false} />
      </IoitiProvider>,
    )
    const table = screen.getByRole('table', { name: 'Orders' })
    expect(within(table).getByRole('row', { name: named('Oct 01, 2026, 01:00 PM 0') })).toBeInTheDocument()
  })
})

// An application's own words, given over English's: a constant, as IoitiProvider asks.
const OWN_WORDS: MessagesOverride = {
  chart: {
    noData: 'Nothing yet',
    lineChartName: (series: readonly string[]) => `Lines: ${series.join(' / ')}`,
  },
}

describe('a chart given an application’s own words', () => {
  it('says them, and English’s for the others', () => {
    const { unmount } = render(
      <IoitiProvider messages={OWN_WORDS}>
        <LineChart data={[]} series={RUN_SERIES} />
      </IoitiProvider>,
    )
    expect(screen.getByText('Nothing yet')).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider messages={OWN_WORDS}>
        <LineChart data={RUNS} series={RUN_SERIES} animated={false} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('img', { name: 'Lines: Essai 41 / Essai 42' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Chart data' })).toBeInTheDocument()
  })

  it('takes the name it is given over the catalogue’s, a live chart’s too', () => {
    render(
      <IoitiProvider messages={OWN_WORDS}>
        <LiveLineChart initial={[1, 2, 3]} aria-label="Response time" />
      </IoitiProvider>,
    )
    expect(screen.getByRole('img', { name: 'Response time' })).toBeInTheDocument()
  })
})

describe('a chart in English, as it changed', () => {
  it('writes its compact ticks as Britain does: 1.5k, where it wrote 1.5K', () => {
    const { container } = render(<BarChart data={DAYS} series={DAY_SERIES} animated={false} />)
    expect(texts(container)).toEqual(expect.arrayContaining(['−1k', '1k', '1.5k']))
  })

  it('counts one category, and one stage, as one', () => {
    const { unmount } = render(<BarChart data={DAYS.slice(0, 1)} series={DAY_SERIES} animated={false} />)
    expect(screen.getByRole('img', { name: 'Bar chart of Résultat, Frais across 1 category' })).toBeInTheDocument()
    unmount()
    render(<FunnelChart stages={STAGES.slice(0, 1)} animated={false} />)
    expect(screen.getByRole('img', { name: 'Funnel with 1 stage from Visites to Visites' })).toBeInTheDocument()
  })

  it('writes an animated number as it did, its compact form as Britain does', () => {
    const { unmount } = render(<AnimatedNumber value={-1234.5} decimals={2} />)
    expect(screen.getByText('−1,234.50')).toBeInTheDocument()
    unmount()
    render(<AnimatedNumber value={2_188_860} compact decimals={1} />)
    expect(screen.getByText('2.2m')).toBeInTheDocument()
  })
})
