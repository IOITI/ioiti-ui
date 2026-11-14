import { DescriptionList, InlineEdit } from 'ioiti-ui'
import { useState } from 'react'

export default function InlineEditDetails() {
  const [contact, setContact] = useState('Ana Martins')
  const [po, setPo] = useState('')
  return (
    <DescriptionList
      className="max-w-lg"
      layout="columns"
      termWidth="9rem"
      items={[
        { term: 'Reference', details: <InlineEdit label="Reference" value="IT-1042" onSave={() => {}} readOnly /> },
        { term: 'Contact', details: <InlineEdit label="Contact" value={contact} onSave={setContact} /> },
        { term: 'Purchase order', details: <InlineEdit label="Purchase order" value={po} onSave={setPo} placeholder="Add the customer's number" /> },
      ]}
    />
  )
}
