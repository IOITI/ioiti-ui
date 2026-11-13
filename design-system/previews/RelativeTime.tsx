import { RelativeTime } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

// The moments, said from when the preview was opened.
const OPENED = Date.now()

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-x-8 gap-y-2 p-5 text-sm">
    <span>
      Seen <RelativeTime value={OPENED - 20_000} timeZone="Europe/Paris" />
    </span>
    <span>
      Imported <RelativeTime value={OPENED - 3 * 3_600_000} timeZone="Europe/Paris" />
    </span>
    <span>
      Created <RelativeTime value={OPENED - 9 * 86_400_000} timeZone="Europe/Paris" />
    </span>
    <span>
      Due <RelativeTime value={OPENED + 2 * 3_600_000} timeZone="Europe/Paris" />
    </span>
    <span>
      Received <RelativeTime value={OPENED + 3_000} timeZone="Europe/Paris" past />
    </span>
  </div>,
)
