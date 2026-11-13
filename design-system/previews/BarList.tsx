import { BarList } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="w-full max-w-md p-5">
    <BarList
      label="Returns by reason"
      items={[
        { label: 'Too small', value: 42, href: '#too-small' },
        { label: 'Not as described', value: 28 },
        { label: 'Damaged on the way', value: 17, tone: 'negative' },
        { label: 'Changed their mind', value: 11 },
      ]}
    />
  </div>,
)
