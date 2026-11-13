import { DescriptionList, Disclosure } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full items-start gap-4 p-5 md:grid-cols-2">
    <Disclosure summary="What the daily limit does">
      <p className="text-muted-foreground">
        No order is accepted once the day's orders reach it: the next ones wait for the morning, and the customer is told when theirs will leave.
      </p>
    </Disclosure>
    <Disclosure variant="boxed" summary="The figures as a table" defaultOpen>
      <DescriptionList
        compressed
        numeric
        items={[
          { term: 'Monday', details: '182 orders' },
          { term: 'Tuesday', details: '164 orders' },
          { term: 'Wednesday', details: '201 orders' },
        ]}
      />
    </Disclosure>
  </div>,
)
