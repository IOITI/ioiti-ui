import { Panel, TextLink } from 'ioiti-ui'

const EVENTS = [
  { what: 'Order 2026-0042 paid', when: '09:13' },
  { what: 'Price list imported', when: '08:47' },
  { what: 'Order 2026-0039 refused by the bank', when: '08:05' },
]

export default function TextLinkPanelAction() {
  return (
    <Panel
      className="max-w-md"
      title="Latest events"
      action={
        <TextLink to="/components/tables/interactive-timeline" variant="quiet">
          View all
        </TextLink>
      }
      dense
    >
      <ul className="divide-y divide-border/40 text-xs">
        {EVENTS.map((event) => (
          <li key={event.what} className="flex items-center justify-between gap-3 py-2.5">
            <span className="truncate">{event.what}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{event.when}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
