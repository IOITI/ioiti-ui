import { SmoothAccordion } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="w-full p-5">
    <SmoothAccordion
      defaultOpen={['returns']}
      items={[
        { id: 'returns', title: 'Can an order be returned?', content: 'Within 30 days, in its box.' },
        { id: 'invoice', title: 'Where is the invoice?', subtitle: "In every order's page", content: 'Under Documents, as a PDF.' },
        { id: 'delivery', title: 'How long is a delivery?', content: 'Three to five working days.' },
      ]}
    />
  </div>,
)
