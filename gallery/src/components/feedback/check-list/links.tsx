import { CheckList } from 'ioiti-ui'
import type { Check } from 'ioiti-ui'

const CHECKS: Check[] = [
  { id: 'colours', label: 'Colours', state: 'pass', detail: 'Every text holds 4.5:1 on its surface, in both themes.' },
  { id: 'keyboard', label: 'Keyboard', state: 'pass', detail: 'Every control is reached with Tab, its focus ring shown.' },
  { id: 'motion', label: 'Reduced motion', state: 'fail', detail: 'The chart still slides in when motion is reduced.' },
  { id: 'phone', label: 'On a phone', state: 'open', detail: 'Waiting for a device.' },
]

// Where each check is said more of; a check without a page stays words.
const PAGES: Record<string, string> = {
  colours: '/foundations/colours',
  keyboard: '/foundations/usable-by-all',
  motion: '/foundations/motion',
}

export default function CheckListLinks() {
  return <CheckList checks={CHECKS} label="Usable by all" hrefOf={(check) => PAGES[check.id] ?? null} className="max-w-md" />
}
