import { ChangeList, formatMoney } from 'ioiti-ui'

export default function ChangeListChanges() {
  return (
    <ChangeList
      className="max-w-xl"
      label="Changes to apply"
      numeric
      changes={[
        { label: 'Daily limit', before: formatMoney(500), after: formatMoney(750), note: 'Applies from tomorrow, 00:00' },
        { label: 'Free delivery over', before: formatMoney(60), after: formatMoney(45) },
        { label: 'Weekly summary', after: 'Every Monday, 08:00' },
        { label: 'Fax number', before: '+33 1 23 45 67 89' },
      ]}
    />
  )
}
