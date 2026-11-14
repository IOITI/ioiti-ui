import { CopyChip, DescriptionList } from 'ioiti-ui'

export default function CopyChipInDetails() {
  return (
    <DescriptionList
      className="max-w-lg"
      items={[
        { term: 'Order', details: <CopyChip value="IT-1042" label="the order's reference" /> },
        {
          term: 'Payment',
          details: <CopyChip value="pay_3Nf8q2Lk9Zx7Wc4Vb1Rt6Yh0" label="the payment's ID" truncate="middle" keep={{ start: 6, end: 4 }} />,
        },
        {
          term: 'API key',
          details: <CopyChip value="demo-key-7Hc8f2a7e9b0d4d93a6ff21c8e5b7" label="the API key" truncate="middle" />,
        },
        {
          term: 'Receipt',
          details: (
            <CopyChip
              value="https://example.com/receipts/2026/10/IT-1042.pdf?token=8a1f0c"
              label="the receipt's address"
              truncate="end"
              className="w-56"
            />
          ),
        },
      ]}
    />
  )
}
