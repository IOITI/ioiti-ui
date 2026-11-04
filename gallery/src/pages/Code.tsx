import { Button, CodeBlock, LogViewer, PageHeader, SegmentedControl } from 'ioiti-ui'
import { CodeEditor, DiffEditor } from 'ioiti-ui/code'
import type { CodeDiagnostic } from 'ioiti-ui/code'
import { useEffect, useState } from 'react'

import { Demo } from '../parts'

const RULE = `[metadata]
creation_date = "2026/10/02"
maturity = "production"

[rule]
name = "Admin login from abroad"
risk_score = 47
severity = "medium"
tags = ["Domain: Identity", "Tactic: Initial Access"]
query = '''
event.category:authentication and user.roles:admin
'''
`

const EDITED = RULE.replace('risk_score = 47', 'risk_score = 73').replace('severity = "medium"', 'severity = "high"').replace(
  '"Tactic: Initial Access"]',
  '"Tactic: Initial Access", "Use Case: Threat Detection"]',
)

const YAML = `# The customer's environments
customer: "1024"
name: Alpha Industries
environments:
  - &sandbox sandbox
  - production
spaces:
  sandbox: *sandbox
  production: analyst
note: |
  Deployed by the MSSP team;
  production needs a maintainer.
`

const DIFF = `diff --git a/rules/admin_login.toml b/rules/admin_login.toml
--- a/rules/admin_login.toml
+++ b/rules/admin_login.toml
@@ -6,3 +6,3 @@ [rule]
 name = "Admin login from abroad"
-risk_score = 47
-severity = "medium"
+risk_score = 73
+severity = "high"`

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

function EditorDemo() {
  const [code, setCode] = useState(RULE.replace('risk_score = 47', 'risk_score = '))
  const [saved, setSaved] = useState<string | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const problems: CodeDiagnostic[] = /risk_score = \s*$/m.test(code)
    ? [{ line: code.split('\n').findIndex((line) => line.startsWith('risk_score')) + 1, column: 12, message: 'Expected a value after =' }]
    : []
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          label="Mode"
          size="sm"
          value={readOnly ? 'read' : 'edit'}
          onChange={(mode) => setReadOnly(mode === 'read')}
          options={[
            { value: 'edit', label: 'Edit' },
            { value: 'read', label: 'Read only' },
          ]}
        />
        <span className="text-xs text-muted-foreground">
          {saved ? `Saved with ⌘S at ${saved}` : 'Fix the risk score, then save with ⌘S / Ctrl+S.'}
        </span>
      </div>
      <CodeEditor
        label="Rule file"
        language="toml"
        value={code}
        onChange={setCode}
        readOnly={readOnly}
        diagnostics={problems}
        onSave={() => setSaved(new Date().toLocaleTimeString('en-GB'))}
        maxHeight={320}
      />
    </div>
  )
}

function DiffDemo() {
  const [layout, setLayout] = useState<'split' | 'unified'>('split')
  const [mine, setMine] = useState(EDITED)
  return (
    <div className="flex w-full flex-col gap-3">
      <SegmentedControl
        label="Layout"
        size="sm"
        value={layout}
        onChange={setLayout}
        options={[
          { value: 'split', label: 'Side by side' },
          { value: 'unified', label: 'Unified' },
        ]}
      />
      <DiffEditor
        label="Rule file"
        language="toml"
        original={RULE}
        modified={mine}
        onChange={setMine}
        layout={layout}
        originalLabel="Saved"
        modifiedLabel="Yours"
        maxHeight={360}
      />
    </div>
  )
}

function LogDemo() {
  const [lines, setLines] = useState<string[]>(OUTPUT.slice(0, 3))
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
    <div className="flex w-full flex-col gap-3">
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

export function Code() {
  return (
    <>
      <PageHeader
        title="Code"
        description="Code to read, compare and edit, and the output of what runs. The editors are an entry of their own (ioiti-ui/code, on CodeMirror): an application that never edits code never loads them."
      />

      <Demo
        id="code-languages"
        title="CodeBlock: TOML, YAML and diffs"
        description="A configuration in TOML or YAML, and a unified diff: what was removed in the loss's tone, what was added in the gain's, each line also marked at its edge."
        names={['CodeBlock']}
        className="grid w-full gap-4 lg:grid-cols-2"
      >
        <CodeBlock label="rules/admin_login.toml" language="toml" lineNumbers code={RULE} />
        <div className="flex min-w-0 flex-col gap-4">
          <CodeBlock label="customers_dac/1024/_config.yaml" language="yaml" code={YAML} />
          <CodeBlock label="What changed" language="diff" code={DIFF} />
        </div>
      </Demo>

      <Demo
        id="code-editor"
        title="CodeEditor"
        description="Code to edit, in the design's code colours, its frame showing the focus as a field's does. ⌘S saves, ⌘F searches, Tab moves on; a server's parse errors are marked where they are, with their message on hover."
        names={['CodeEditor']}
        from="ioiti-ui/code"
      >
        <EditorDemo />
      </Demo>

      <Demo
        id="diff-editor"
        title="DiffEditor"
        description="Two versions of a text, side by side or in one column: unchanged stretches folded, the header's arrows going from one change to the next, the second version editable."
        names={['DiffEditor']}
        from="ioiti-ui/code"
      >
        <DiffDemo />
      </Demo>

      <Demo
        id="log"
        title="LogViewer"
        description="A job's output as it is written: errors and warnings in their tones, the newest line in sight until the reader scrolls up, a search going from one line found to the next, wrapping, copying, downloading. Only the lines in sight are drawn."
        names={['LogViewer']}
      >
        <LogDemo />
      </Demo>
    </>
  )
}
