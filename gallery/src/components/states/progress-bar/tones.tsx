import { ProgressBar } from 'ioiti-ui'

export default function ProgressBarTones() {
  return (
    <div className="grid max-w-md gap-5">
      <ProgressBar label="Uploading the catalogue" value={64} />
      <ProgressBar label="Imported" value={1204} max={1204} valueText="1,204 products, done" tone="positive" />
      <ProgressBar label="Retrying the upload" value={3} max={5} valueText="Attempt 3 of 5" tone="warning" size="sm" />
      <ProgressBar label="Import stopped" value={312} max={1204} valueText="Stopped at 312: the file is cut short" tone="negative" size="sm" />
    </div>
  )
}
