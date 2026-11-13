import { ChangeList, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full gap-8 p-5 md:grid-cols-2">
    <ChangeList
      label="Changes to apply"
      numeric
      changes={[
        { label: 'Daily limit', before: formatMoney(500), after: formatMoney(750), note: 'Applies from tomorrow, 00:00' },
        { label: 'Free delivery from', before: formatMoney(60), after: formatMoney(45) },
        { label: 'Weekly summary', after: 'Every Monday, 08:00' },
        { label: 'Fax number', before: '+33 1 23 45 67 89' },
      ]}
    />
    <ChangeList
      label="Changes by part"
      groups={[
        { title: 'Shipping', changes: [{ label: 'Carrier', before: 'La Poste', after: 'Courier' }] },
        { title: 'Mail', changes: [{ label: 'Sender', before: 'shop@example.com', after: 'orders@example.com' }] },
      ]}
    />
  </div>,
)
