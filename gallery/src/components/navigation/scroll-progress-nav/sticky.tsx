import { ScrollProgressNav } from 'ioiti-ui'
import { useRef } from 'react'

// Each part's id is its element's: unique in the page, a word that is a CSS selector.
const PARTS = [
  {
    id: 'returns-time',
    label: 'Returns',
    href: '#returns-time',
    text: [
      'An order can be returned within 30 days of its delivery, in its box, with the slip that came with it.',
      'Opened boxes are taken back too, as long as what is in them was not used.',
    ],
  },
  {
    id: 'returns-refund',
    label: 'Refunds',
    href: '#returns-refund',
    text: [
      'The refund is made to the card the order was paid with, within five working days of the parcel’s arrival.',
      'Delivery is refunded when the whole order comes back.',
    ],
  },
  {
    id: 'returns-exchange',
    label: 'Exchanges',
    href: '#returns-exchange',
    text: [
      'An item can be exchanged for another of the same price: the new one leaves when the old one arrives.',
      'For another price, the difference is paid or refunded on the day.',
    ],
  },
  {
    id: 'returns-damaged',
    label: 'Damaged parcels',
    href: '#returns-damaged',
    text: [
      'A parcel that arrives damaged is refused at the door, or photographed and reported within two days.',
      'A new one is sent at once, without waiting for the first to come back.',
    ],
  },
]

export default function ScrollProgressNavSticky() {
  const frame = useRef<HTMLDivElement>(null)
  return (
    <div ref={frame} className="h-80 overflow-y-auto rounded-xl border border-border/70 px-4 pt-3 pb-4">
      <ScrollProgressNav label="The return policy" mode="sticky" containerRef={frame} sections={PARTS} />
      {PARTS.map((part) => (
        // Its scroll-margin lands it clear of the bar; the last one is tall enough to reach the top of the frame.
        <section key={part.id} id={part.id} className="scroll-mt-16 pt-6 pb-2 last:min-h-52">
          <h3 className="text-sm font-semibold">{part.label}</h3>
          {part.text.map((line) => (
            <p key={line} className="mt-2 max-w-prose text-sm text-muted-foreground">
              {line}
            </p>
          ))}
        </section>
      ))}
    </div>
  )
}
