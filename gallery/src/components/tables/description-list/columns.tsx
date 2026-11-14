import { DescriptionList } from 'ioiti-ui'

export default function DescriptionListColumns() {
  return (
    <DescriptionList
      className="max-w-2xl"
      layout="columns"
      termWidth="9rem"
      items={[
        { term: 'Reference', details: <span className="font-mono">IT-1042</span> },
        { term: 'Customer', details: 'Atelier Brun, Lyon' },
        { term: 'Delivery', details: 'By courier, before noon' },
        { term: 'Notes', details: 'Leave the parcel at the reception desk; the door code changes on Mondays, ask for it at the café next door if no one answers.' },
      ]}
    />
  )
}
