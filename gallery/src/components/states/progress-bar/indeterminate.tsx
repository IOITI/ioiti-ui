import { ProgressBar } from 'ioiti-ui'

export default function ProgressBarIndeterminate() {
  return (
    <div className="grid max-w-md gap-5">
      {/* No value: its length is not known, the fill breathes. */}
      <ProgressBar label="Connecting to the server" />
      <ProgressBar label="Waiting for the warehouse" size="sm" />
    </div>
  )
}
