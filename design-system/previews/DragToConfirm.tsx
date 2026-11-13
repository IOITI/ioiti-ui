import { DragToConfirm } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex max-w-md flex-col gap-3 p-5">
    <DragToConfirm label="Slide to send" confirmedLabel="Sent" variant="info" autoResetDelay={2500} />
    <p className="text-xs text-muted-foreground">Drag it to the end, or focus it and press Enter. The arrow keys do not confirm.</p>
  </div>,
)
