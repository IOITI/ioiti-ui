import { CheckIcon, CheckList } from 'ioiti-ui'
import type { Check } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

const CHECKS: Check[] = [
  { id: 'tests', label: 'Tests', state: 'pass', detail: '142 passed in 6 s.' },
  { id: 'contrast', label: 'Contrast', state: 'fail', detail: 'One text colour is 4.44:1 on a hovered row.' },
  { id: 'review', label: 'Review', state: 'open', detail: 'Not asked yet.' },
]

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-stretch gap-5 p-5">
    <CheckList checks={CHECKS} label="Before releasing" className="sm:grid-cols-3" />
    <div className="flex flex-wrap items-start gap-6 border-t border-border pt-4 text-sm">
      {/* CheckIcon alone, its word beside it: not named again for a screen reader. */}
      <span className="inline-flex items-start gap-1.5"><CheckIcon state="pass" named={false} />Passed</span>
      <span className="inline-flex items-start gap-1.5"><CheckIcon state="fail" named={false} />Failed</span>
      <span className="inline-flex items-start gap-1.5"><CheckIcon state="open" named={false} />Not checked</span>
    </div>
  </div>,
)
