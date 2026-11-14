import { LiveLineChart } from 'ioiti-ui'

// What the page already had: a reading every two seconds, the last one now.
const KNOWN = [58, 61, 66, 63, 59, 64, 70, 67, 62, 65]

/** The load of a server, from 0 to 100, every two seconds. */
function load(push: (value: number) => void) {
  let value = KNOWN[KNOWN.length - 1]
  const timer = window.setInterval(() => {
    value = Math.min(100, Math.max(0, value + (Math.random() - 0.5) * 14))
    push(Math.round(value))
  }, 2000)
  return () => window.clearInterval(timer)
}

export default function LiveLineChartUnitAndDomain() {
  return (
    <LiveLineChart
      ariaLabel="Load of the build server"
      source={load}
      initial={KNOWN}
      intervalMs={2000}
      windowSeconds={120}
      height={180}
      unit="%"
      domain={[0, 100]}
      formatValue={(value) => value.toFixed(0)}
      formatChange={(change) => `${change > 0 ? '+' : change < 0 ? '−' : ''}${Math.abs(change).toFixed(0)} points`}
    />
  )
}
