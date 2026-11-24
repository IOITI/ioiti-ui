import { IoitiProvider } from 'ioiti-ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { reportError } from './errors'
import './index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* The theme (kept under the key given to ioiti() in vite.config.ts), the animations, the name in every tab, and
        where the errors of a page go (src/errors.ts). */}
    <IoitiProvider appName="My App" onError={reportError}>
      <RouterProvider router={router} />
    </IoitiProvider>
  </StrictMode>,
)
