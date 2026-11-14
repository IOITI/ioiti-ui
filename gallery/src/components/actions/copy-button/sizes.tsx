import { CopyButton } from 'ioiti-ui'

export default function CopyButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton value="1Z 999 AA1 01 2345 6784" label="Copy the tracking number" />
      <CopyButton value="https://example.com/orders/IT-1042" label="Copy the link" size="sm" />
      <CopyButton value="IT-1042" label="Copy the reference" showLabel size="sm" />
      <CopyButton value="IT-1042" label="Copy the reference" showLabel />
    </div>
  )
}
