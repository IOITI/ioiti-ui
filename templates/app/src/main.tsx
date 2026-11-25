import { IoitiProvider } from 'ioiti-ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { reportError } from './errors'
import './index.css'
import { routes } from './router'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* The theme (kept under the key given to ioiti() in vite.config.ts), the animations, the name in every tab, and
        where the errors of a page go (src/errors.ts). The language too: English as Britain writes it by default; in
        French, locale="fr-FR" messages={fr} (import { fr } from 'ioiti-ui/locales/fr'), and <html lang="fr"> in
        index.html (README, Languages). */}
    <IoitiProvider appName="My App" onError={reportError}>
      <RouterProvider router={router} />
    </IoitiProvider>
  </StrictMode>,
)
