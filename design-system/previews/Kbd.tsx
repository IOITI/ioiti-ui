import { Kbd } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5 text-sm text-muted-foreground">
    <span className="inline-flex items-center gap-2">Search <Kbd keys="mod+k" /></span>
    <span className="inline-flex items-center gap-2">Command palette <Kbd keys="mod+shift+p" /></span>
    <span className="inline-flex items-center gap-2">Go to the orders <Kbd keys="g o" /></span>
    <span className="inline-flex items-center gap-2">Close <Kbd>Esc</Kbd></span>
  </div>,
)
