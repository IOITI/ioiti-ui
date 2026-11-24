import { FanChart, useFormat } from 'ioiti-ui'

// Where 2,000 simulated paths of a strategy's trades stood after each trade (their 5th, 25th, 50th, 75th and 95th
// percentiles), and the real trades over them: the first twenty-four.
const PATHS = Array.from({ length: 60 }, (_, index) => {
  const trade = index + 1
  const spread = 4.2 * Math.sqrt(trade)
  const drift = 0.4 * trade
  const actual = [1.1, -3.2, 0.5, 2.4, -4.1, -1.2, 0.5, -6.3, 0.5, 1.8, -2.2, -3.4, 0.5, -5.1, 0.6, -1.9, -2.8, 0.5, -4.4, 0.5, -3.3, -2.7, 0.5, -4.8]
  const sum = trade <= actual.length ? actual.slice(0, trade).reduce((total, each) => total + each, 0) : null
  return {
    x: trade,
    p5: drift - 1.645 * spread,
    p25: drift - 0.674 * spread,
    median: drift,
    p75: drift + 0.674 * spread,
    p95: drift + 1.645 * spread,
    actual: sum,
  }
})

export default function FanChartExpectedAndActual() {
  // Signed, in the provider's locale: "+1.1%", "−3.3%".
  const { formatPercent } = useFormat()
  const percent = (value: number) => formatPercent(value, true, 1)
  return (
    <FanChart
      ariaLabel="The real trades' result against where the backtest's simulated paths went"
      data={PATHS}
      bands={[
        { lower: 'p5', upper: 'p95', label: '90 % of the paths' },
        { lower: 'p25', upper: 'p75', label: 'Half of the paths' },
      ]}
      lines={[
        { key: 'median', label: 'Expected (median)', dashed: true },
        { key: 'actual', label: 'Real trades' },
      ]}
      references={[{ value: 0, label: 'Even' }]}
      xLabel="Trades"
      formatX={(trade) => `After trade ${trade}`}
      formatXTick={(trade) => String(trade)}
      formatValue={percent}
      formatTick={percent}
    />
  )
}
