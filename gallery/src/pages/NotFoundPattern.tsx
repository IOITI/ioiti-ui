import { NotFoundState } from 'ioiti-ui'

/** What a page shows when the record its address names does not exist (its API answered 404). */
export function NotFoundPattern() {
  return (
    <div data-names="NotFoundState" className="contents">
      <NotFoundState
        title="This invoice does not exist."
        description="Invoice 2026-9999 was never made, or it was removed."
        name="Invoice not found"
        suggestions={[
          { label: 'Data display', href: '/components/data', description: 'Tables and figures' },
          { label: 'Shell', href: '/components/shell', description: 'The frame of the pages' },
        ]}
        home={{ href: '/', label: 'Back to the gallery' }}
      />
    </div>
  )
}
