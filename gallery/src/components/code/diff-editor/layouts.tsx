import { SegmentedControl, useFormat } from 'ioiti-ui'
import { DiffEditor } from 'ioiti-ui/code'
import type { CodeDiagnostic } from 'ioiti-ui/code'
import { useState } from 'react'

import { RULE, RULE_EDITED } from '../../../samples/code'

// The person's own clock: this browser's time zone.
const ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function DiffEditorLayouts() {
  const { formatTime } = useFormat()
  const [layout, setLayout] = useState<'split' | 'unified'>('split')
  const [mine, setMine] = useState(RULE_EDITED)
  const [saved, setSaved] = useState<string | null>(null)
  const score = mine.split('\n').findIndex((line) => line.startsWith('risk_score'))
  // A score past 100 is marked in the changed version, as the editor marks a problem.
  const problems: CodeDiagnostic[] =
    score >= 0 && !/^risk_score = (?:100|\d{1,2})\s*$/.test(mine.split('\n')[score])
      ? [{ line: score + 1, column: 14, message: 'A number between 0 and 100' }]
      : []
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
        diagnostics={problems}
        onSave={() => setSaved(new Date().toISOString())}
      />
      <span className="text-xs text-muted-foreground">
        {saved ? `Saved with ⌘S at ${formatTime(saved, ZONE)}` : 'A risk score past 100 is marked; ⌘S / Ctrl+S saves yours.'}
      </span>
    </div>
  )
}
