// Example records for the tables' examples: orders of a shop, fictional.

export interface Order {
  id: string
  customer: string
  status: 'open' | 'sent' | 'late'
  amount: number
  placed: string
  channel: 'web' | 'shop'
}

export const ORDERS: Order[] = [
  { id: '2026-0042', customer: 'Acme', status: 'open', amount: 1840, placed: '26 Oct', channel: 'web' },
  { id: '2026-0041', customer: 'Globex', status: 'sent', amount: 960.5, placed: '25 Oct', channel: 'shop' },
  { id: '2026-0040', customer: 'Initech', status: 'late', amount: 4320, placed: '21 Oct', channel: 'web' },
  { id: '2026-0039', customer: 'Umbrella', status: 'sent', amount: 415, placed: '20 Oct', channel: 'web' },
  { id: '2026-0038', customer: 'Acme', status: 'sent', amount: 2750, placed: '17 Oct', channel: 'shop' },
  { id: '2026-0037', customer: 'Hooli', status: 'open', amount: 128.9, placed: '16 Oct', channel: 'web' },
  { id: '2026-0036', customer: 'Stark', status: 'sent', amount: 5200, placed: '14 Oct', channel: 'shop' },
  { id: '2026-0035', customer: 'Wayne', status: 'late', amount: 890, placed: '12 Oct', channel: 'web' },
  { id: '2026-0034', customer: 'Wonka', status: 'sent', amount: 74.2, placed: '10 Oct', channel: 'shop' },
  { id: '2026-0033', customer: 'Tyrell', status: 'open', amount: 1260, placed: '9 Oct', channel: 'web' },
]

/** Each state, in words and in the tone of its badge. */
export const STATUS = {
  open: { label: 'Open', tone: 'neutral' },
  sent: { label: 'Sent', tone: 'success' },
  late: { label: 'Late', tone: 'danger' },
} as const

/** The channels, in labels that say themselves (an on/off pair of filters). */
export const CHANNEL = { web: 'Online', shop: 'In shop' } as const
