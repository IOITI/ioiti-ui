import { Button, ProgressBar } from 'ioiti-ui'
import { useEffect, useState } from 'react'

const FILES = 120

export default function ProgressBarRunning() {
  const [done, setDone] = useState<number | null>(null)
  const running = done !== null && done < FILES

  // The import, a few files at a time.
  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => setDone((count) => Math.min(FILES, (count ?? 0) + 7)), 150)
    return () => window.clearTimeout(timer)
  }, [running, done])

  return (
    <div className="grid max-w-md gap-4">
      <ProgressBar
        label={done === FILES ? 'Files imported' : 'Importing the files'}
        value={done ?? 0}
        max={FILES}
        valueText={done === FILES ? `All ${FILES} files` : `${done ?? 0} of ${FILES} files`}
        tone={done === FILES ? 'positive' : 'neutral'}
      />
      <Button size="sm" variant="outline" className="justify-self-start" isLoading={running} loadingText="Importing" onClick={() => setDone(0)}>
        {done === FILES ? 'Import again' : 'Import'}
      </Button>
    </div>
  )
}
