import { SegmentedControl } from 'ioiti-ui'
import { CodeEditor } from 'ioiti-ui/code'
import type { CodeDiagnostic } from 'ioiti-ui/code'
import { useState } from 'react'

import { RULE } from '../../../samples/code'

export default function CodeEditorDiagnostics() {
  const [code, setCode] = useState(RULE.replace('risk_score = 47', 'risk_score = '))
  const [saved, setSaved] = useState<string | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  // What a server would answer: a parse error, its line and column.
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
