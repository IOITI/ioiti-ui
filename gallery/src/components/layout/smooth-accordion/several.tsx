import { SmoothAccordion } from 'ioiti-ui'

export default function SmoothAccordionSeveral() {
  return (
    <SmoothAccordion
      className="max-w-2xl"
      allowMultiple
      defaultOpen={['standard', 'express']}
      items={[
        {
          id: 'standard',
          title: 'Standard delivery',
          subtitle: '3 to 5 working days',
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Free from 50 €, 4.90 € below.</li>
              <li>Left with a neighbour if no one answers.</li>
            </ul>
          ),
        },
        {
          id: 'express',
          title: 'Express delivery',
          subtitle: 'The next working day',
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>12.90 €, for an order placed before 2 pm.</li>
              <li>Signed for: it comes back if no one is there.</li>
            </ul>
          ),
        },
        { id: 'pickup', title: 'Pick-up point', subtitle: '2 to 4 working days', content: 'Free, kept 14 days at the point chosen.' },
      ]}
    />
  )
}
