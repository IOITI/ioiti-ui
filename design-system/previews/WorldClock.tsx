import { WorldClock } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-start gap-4 p-5">
    <WorldClock
      title={null}
      cities={[
        { id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' },
        { id: 'new-york', name: 'New York', timeZone: 'America/New_York' },
        { id: 'tokyo', name: 'Tokyo', timeZone: 'Asia/Tokyo' },
      ]}
    />
    {/* Small, beside a page's title (the dashboard's header). */}
    <WorldClock
      size="sm"
      title={null}
      cities={[
        { id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' },
        { id: 'new-york', name: 'New York', timeZone: 'America/New_York' },
      ]}
    />
  </div>,
)
