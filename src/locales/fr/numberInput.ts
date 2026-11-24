import type { Messages } from '../en.js'

export const numberInput: Messages['numberInput'] = {
  decrease: 'Diminuer',
  increase: 'Augmenter',
  rangeFrom: (label: string) => `${label}, de`,
  rangeTo: (label: string) => `${label}, à`,
  rangeValue: ({ from, to }: { from: string; to: string }) => `${from} – ${to}`,
  rangeName: 'Plage',
  changeNone: 'stable',
  changeUp: (figure: string) => `en hausse de ${figure}`,
  changeDown: (figure: string) => `en baisse de ${figure}`,
}
