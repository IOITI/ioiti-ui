import { Loader } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

const VARIANTS = ['arc', 'dots', 'line', 'rings'] as const

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-end gap-10 p-5">
    {VARIANTS.map((variant) => (
      <div key={variant} className="flex flex-col items-center gap-3">
        <div className="grid h-10 place-items-center">
          <Loader variant={variant} label="Loading" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{variant}</span>
      </div>
    ))}
  </div>,
)
