import { ProgressBar } from 'ioiti-ui'

export default function ProgressBarValues() {
  return (
    <div className="grid max-w-md gap-5">
      <ProgressBar label="Importing the files" value={42} max={120} valueText="42 of 120 files" />
      {/* Without valueText, the percentage. */}
      <ProgressBar label="Computing the run" value={0.8} max={1} />
      <ProgressBar label="Sending the newsletter to every customer who asked for it this year" value={3120} max={4800} valueText="3,120 of 4,800" />
    </div>
  )
}
