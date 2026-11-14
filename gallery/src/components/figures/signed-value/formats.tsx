import { DescriptionList, SignedValue } from 'ioiti-ui'

export default function SignedValueFormats() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <DescriptionList
        divided
        numeric
        items={[
          { term: 'A gain', details: <SignedValue value={12.4} kind="percent" /> },
          { term: 'A loss', details: <SignedValue value={-3.75} kind="percent" /> },
          { term: 'No change', details: <SignedValue value={0} kind="percent" /> },
        ]}
      />
      <DescriptionList
        divided
        numeric
        items={[
          { term: 'In euros', details: <SignedValue value={1840.5} kind="money" /> },
          { term: 'In dollars', details: <SignedValue value={-212} kind="money" currency="USD" /> },
          { term: 'Not known yet', details: <SignedValue value={null} kind="money" /> },
        ]}
      />
    </div>
  )
}
