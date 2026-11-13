import { Button, LogViewer } from 'ioiti-ui'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const OUTPUT = [
  'INFO  Loading rules and configurations …',
  'INFO  Parsed 4133 TOML files in 3.17s',
  'step  build customer 1024 (sandbox)',
  'WARN  rule 7f2c… is deprecated: kept out of the package',
  'step  writing dist/1024-sandbox/rules.ndjson',
  'step  upload to https://kibana.example.test/s/sandbox',
  'ERROR the API answered 409: rule 0b9e… exists with another version',
  'step  retrying with overwrite',
  'INFO  Uploaded 214 rules, 3 exception lists',
  'done  in 41 s',
]

function LogDemo() {
  // The job's first run, whole: its warning and its error in their tones.
  const [lines, setLines] = useState<string[]>(OUTPUT)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      setLines((was) => {
        const next = [...was, OUTPUT[was.length % OUTPUT.length]]
        if (next.length >= 400) setRunning(false)
        return next
      })
    }, 120)
    return () => clearInterval(timer)
  }, [running])
  return (
    <div className="flex w-full flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setRunning((was) => !was)}>
          {running ? 'Pause the job' : 'Run the job'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setLines([])}>
          Clear
        </Button>
      </div>
      <LogViewer label="Deploy to sandbox" lines={lines} height={280} downloadName="deploy-1024-sandbox.log" />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<LogDemo />)
