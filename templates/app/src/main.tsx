import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from 'ioiti-ui'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Button>Hello</Button>
  </StrictMode>,
)
