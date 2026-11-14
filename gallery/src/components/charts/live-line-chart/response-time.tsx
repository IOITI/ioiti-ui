import { LiveLineChart } from 'ioiti-ui'

/** A response time that wanders, a reading a second: in an application, a socket's messages. */
function responseTimes(push: (value: number) => void) {
  let value = 50
  const timer = window.setInterval(() => {
    value = Math.max(0, value + (Math.random() - 0.5) * 6)
    push(Math.round(value * 10) / 10)
  }, 1000)
  return () => window.clearInterval(timer)
}

export default function LiveLineChartResponseTime() {
  return (
    <LiveLineChart
      ariaLabel="Response time"
      source={responseTimes}
      initial={[48.2, 49.1, 50.4, 49.8, 51.2, 50.6, 49.9, 50.1]}
      windowSeconds={60}
      height={180}
      formatValue={(value) => `${value.toFixed(1)} ms`}
      formatChange={(change) => `${change > 0 ? '+' : change < 0 ? '−' : ''}${Math.abs(change).toFixed(1)} ms`}
    />
  )
}
