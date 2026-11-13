import { DescriptionList, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full gap-8 p-5 md:grid-cols-2">
    <DescriptionList
      boxed
      numeric
      items={[
        { term: 'Subtotal', details: formatMoney(1533.33) },
        { term: 'Tax', details: formatMoney(306.67) },
        { term: 'Total', details: formatMoney(1840) },
      ]}
    />
    <DescriptionList
      layout="columns"
      termWidth="9rem"
      items={[
        { term: 'Reference', details: 'IT-1042' },
        { term: 'Customer', details: 'Atelier Brun, Lyon' },
        { term: 'Delivery', details: 'By courier, before noon' },
        { term: 'Notes', details: 'Leave the parcel at the reception desk; the door code changes on Mondays.' },
      ]}
    />
    <DescriptionList
      layout="grid"
      columns={3}
      numeric
      items={[
        { term: 'Orders', details: '1,284' },
        { term: 'Returned', details: '38' },
        { term: 'Median delivery', details: '2.4 days' },
      ]}
    />
    <DescriptionList
      layout="inline"
      compressed
      items={[
        { term: 'Placed', details: '26 Oct' },
        { term: 'Lines', details: '4' },
        { term: 'Paid by', details: 'Card' },
      ]}
    />
  </div>,
)
