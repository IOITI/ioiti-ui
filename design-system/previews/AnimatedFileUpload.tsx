import { AnimatedFileUpload, LinkProvider } from 'ioiti-ui'
import { forwardRef } from 'react'
import type { AnchorHTMLAttributes } from 'react'
import { createRoot } from 'react-dom/client'

/** An upload made up for the preview: it counts to 100 and answers with a link. */
async function pretendUpload(_file: unknown, onProgress: (progress: number) => void) {
  for (let progress = 10; progress <= 100; progress += 15) {
    await new Promise((resolve) => window.setTimeout(resolve, 120))
    onProgress(Math.min(progress, 100))
  }
  return { href: '/components/tables', label: 'Open' }
}

// The frame has no router: the link a done file gets stays here.
const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function Link({ onClick, ...props }, ref) {
  return (
    <a
      ref={ref}
      onClick={(event) => {
        onClick?.(event)
        event.preventDefault()
      }}
      {...props}
    />
  )
})

createRoot(document.getElementById('root')!).render(
  <LinkProvider component={Link}>
    <div className="flex flex-col gap-3 p-5">
      <AnimatedFileUpload
        multiple
        sequential
        uploadHandler={pretendUpload}
        label="Invoices to import"
        dropSubtitle="or choose files (made up: nothing leaves the page)"
      />
    </div>
  </LinkProvider>,
)
