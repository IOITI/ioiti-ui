import { CopyButton, DescriptionList } from 'ioiti-ui'

export default function CopyButtonInARow() {
  return (
    <DescriptionList
      className="max-w-lg"
      items={[
        {
          term: 'Reference',
          detail: (
            <span className="inline-flex items-center gap-2">
              <span className="font-mono">IT-1042</span>
              <CopyButton value="IT-1042" label="Copy the reference" size="sm" />
            </span>
          ),
        },
        {
          term: 'Tracking',
          detail: (
            <span className="inline-flex items-center gap-2">
              <span className="font-mono">1Z 999 AA1 01 2345 6784</span>
              <CopyButton value="1Z 999 AA1 01 2345 6784" label="Copy the tracking number" size="sm" />
            </span>
          ),
        },
      ]}
    />
  )
}
