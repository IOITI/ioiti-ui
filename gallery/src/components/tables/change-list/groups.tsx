import { ChangeList } from 'ioiti-ui'

export default function ChangeListGroups() {
  return (
    <ChangeList
      className="max-w-xl"
      label="Changes by part"
      groups={[
        {
          title: 'Shipping',
          changes: [
            { label: 'Carrier', before: 'Post', after: 'Courier' },
            { label: 'Leaves on', before: 'The next day', after: 'The same day, before noon' },
          ],
        },
        { title: 'Mail', changes: [{ label: 'Sender', before: 'shop@example.com', after: 'orders@example.com' }] },
        { title: 'Invoices', changes: [{ label: 'Footer', after: 'Payable within 30 days' }] },
      ]}
    />
  )
}
