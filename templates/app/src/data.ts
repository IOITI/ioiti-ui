// Example records, to replace with the application's own (an API, a database).
export type ItemStatus = 'open' | 'review' | 'done'

export interface Item {
  id: string
  name: string
  owner: string
  amount: number
  status: ItemStatus
  updated: string
}

export const ITEMS: Item[] = [
  { id: 'IT-1042', name: 'Spring catalogue print run', owner: 'Ana', amount: 1840, status: 'open', updated: '2026-10-24' },
  { id: 'IT-1041', name: 'Warehouse shelving, aisle 4', owner: 'Malik', amount: 960.5, status: 'review', updated: '2026-10-23' },
  { id: 'IT-1039', name: 'Annual software licences', owner: 'Ana', amount: 4320, status: 'done', updated: '2026-10-21' },
  { id: 'IT-1038', name: 'Delivery van service', owner: 'Jo', amount: 415, status: 'open', updated: '2026-10-20' },
  { id: 'IT-1035', name: 'Trade fair stand', owner: 'Malik', amount: 2750, status: 'done', updated: '2026-10-17' },
]

export const STATUS_LABEL: Record<ItemStatus, string> = { open: 'Open', review: 'In review', done: 'Done' }
