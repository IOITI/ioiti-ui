import { CheckList } from 'ioiti-ui'
import type { Check } from 'ioiti-ui'

const CHECKS: Check[] = [
  { id: 'tests', label: 'Tests', state: 'pass', detail: '142 passed in 6 s.' },
  { id: 'contrast', label: 'Contrast', state: 'fail', detail: 'One text colour is 4.44:1 on a hovered row.' },
  { id: 'review', label: 'Review', state: 'open', detail: 'Not asked yet.' },
]

export default function CheckListStates() {
  return <CheckList checks={CHECKS} label="Before releasing" className="sm:grid-cols-3" />
}
