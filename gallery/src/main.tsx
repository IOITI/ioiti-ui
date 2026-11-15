import { IoitiProvider } from 'ioiti-ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import './gallery.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IoitiProvider appName="ioiti-ui">
      <RouterProvider router={router} />
    </IoitiProvider>
  </StrictMode>,
)
