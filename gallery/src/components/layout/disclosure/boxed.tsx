import { DescriptionList, Disclosure } from 'ioiti-ui'

export default function DisclosureBoxed() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
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
      <Disclosure variant="boxed" summary="The request sent">
        <pre className="overflow-x-auto font-mono text-xs text-text-secondary">{`POST /api/v1/orders/2026-0042/refund
{ "amount": 120.00, "reason": "damaged" }`}</pre>
      </Disclosure>
    </div>
  )
}
