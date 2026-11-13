import { LiveLineChart } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

/** Numbers that look random and are the same at every load. */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

// The last minute, already read: the line fills the window as the card opens.
const HISTORY = (() => {
  const random = seeded(5)
  let value = 50
  return Array.from({ length: 60 }, () => {
    value = Math.max(0, value + (random() - 0.5) * 6)
    return Math.round(value * 10) / 10
  })
})()

/** A value that wanders, a reading a second. */
function wander(push: (value: number) => void) {
  let value = HISTORY[HISTORY.length - 1]
  const timer = window.setInterval(() => {
    value = Math.max(0, value + (Math.random() - 0.5) * 6)
    push(Math.round(value * 10) / 10)
  }, 1000)
  return () => window.clearInterval(timer)
}

createRoot(document.getElementById('root')!).render(
  <div className="w-full space-y-2 p-5">
    <LiveLineChart
      source={wander}
      initial={HISTORY}
      windowSeconds={60}
      height={180}
      formatValue={(value) => `${value.toFixed(1)} ms`}
      formatChange={(change) => `${change > 0 ? '+' : change < 0 ? '−' : ''}${Math.abs(change).toFixed(1)} ms`}
      ariaLabel="Response time"
    />
    <p className="text-xs text-muted-foreground">A reading a second. The pointer over the line, or Live, pauses it for reading.</p>
  </div>,
)
