// The charts' sample data: numbers that look random and are the same at every load (no Math.random, no clock).

import type { HeatDay, LinePoint } from 'ioiti-ui'

const DAY = 86_400_000
const HOUR = 3_600_000

/** A sequence of numbers between 0 and 1 that looks random, the same for a seed. */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

/** The revenue of three shops each week since May, and a shop's on average over the same weeks last year. */
export const REVENUE_BY_SHOP: LinePoint[] = (() => {
  const random = seeded(23)
  const start = Date.UTC(2026, 4, 4)
  return Array.from({ length: 26 }, (_, week) => {
    const summer = Math.sin((week / 25) * Math.PI)
    const noise = () => (random() - 0.5) * 600
    return {
      t: start + week * 7 * DAY,
      north: Math.round(4200 + week * 90 + noise()),
      harbour: Math.round(2600 + summer * 3200 + noise()),
      station: Math.round(3900 - week * 40 + noise()),
      lastYear: Math.round(3600 + summer * 900 + noise()),
    }
  })
})()

/** The delay of the orders through a day, a reading every ten minutes: two readings lost, a restart at half past noon. */
export const DELAY_READINGS: LinePoint[] = (() => {
  const random = seeded(31)
  const start = Date.UTC(2026, 9, 27, 6)
  return Array.from({ length: 72 }, (_, index) => {
    const lost = index === 40 || index === 41
    return {
      t: start + index * (HOUR / 6),
      delay: lost ? null : Math.round(120 + Math.sin(index / 7) * 40 + random() * 60 + (index > 50 ? 60 : 0)),
      orders: lost ? null : 20 + Math.round(random() * 30),
    }
  })
})()

/** Deliveries made each day over 20 weeks, fewer at weekends, none on two days the depot was shut. */
export const DELIVERIES_BY_DAY: HeatDay[] = (() => {
  const random = seeded(5)
  const end = Date.UTC(2026, 9, 23)
  return Array.from({ length: 140 }, (_, index) => {
    const date = new Date(end - (139 - index) * DAY)
    const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6
    const value = index === 61 || index === 62 ? 0 : Math.round((weekend ? 4 : 18) + random() * (weekend ? 8 : 30))
    return { date: date.toISOString().slice(0, 10), value }
  })
})()

/** The margin of each working day over 20 weeks, in euros: a gain or a loss, and the sales it came from. */
export const MARGIN_BY_DAY: HeatDay[] = (() => {
  const random = seeded(7)
  const end = Date.UTC(2026, 9, 23)
  const days: HeatDay[] = []
  for (let back = 140; back >= 0; back -= 1) {
    const date = new Date(end - back * DAY)
    if (date.getUTCDay() === 0 || date.getUTCDay() === 6) continue
    days.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round((random() - 0.45) * 800) / 10,
      detail: `${1 + Math.floor(random() * 6)} sales`,
    })
  }
  return days
})()

/** Orders by weekday (a row each, Monday first) and hour (9:00 to 17:00): the shop is shut from 13:00 to 14:00. */
export const ORDERS_BY_HOUR: (number | null)[][] = (() => {
  const random = seeded(11)
  return Array.from({ length: 5 }, () => Array.from({ length: 9 }, (_, hour) => (hour === 4 ? null : Math.round(random() * 40))))
})()
