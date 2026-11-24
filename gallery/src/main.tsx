import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import './gallery.css'
import { GalleryProviders } from './GalleryProviders'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GalleryProviders>
      <RouterProvider router={router} />
    </GalleryProviders>
  </StrictMode>,
)
