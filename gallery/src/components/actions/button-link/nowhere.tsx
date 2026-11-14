import { ButtonLink } from 'ioiti-ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['2026-11-12', '2026-11-13', '2026-11-14']

export default function ButtonLinkNowhere() {
  // The last day has no next one: its "Next day" leads nowhere.
  const day = DAYS.length - 1
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink to={`/components/actions/button-link?day=${DAYS[day - 1]}`} variant="outline" size="sm" leftIcon={<ChevronLeft />}>
        Day before
      </ButtonLink>
      <span className="text-sm tabular-nums">{DAYS[day]}</span>
      <ButtonLink to={null} variant="outline" size="sm" rightIcon={<ChevronRight />}>
        Next day
      </ButtonLink>
    </div>
  )
}
