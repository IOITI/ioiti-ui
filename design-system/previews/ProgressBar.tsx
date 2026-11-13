import { ProgressBar } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full max-w-md gap-4 p-5">
    <ProgressBar label="Importing the files" value={42} max={120} valueText="42 of 120 files" />
    <ProgressBar label="Computing the run" value={0.8} max={1} />
    <ProgressBar label="Retrying the upload" value={3} max={5} valueText="Attempt 3 of 5" tone="warning" size="sm" />
    <ProgressBar label="Connecting to the server" />
  </div>,
)
