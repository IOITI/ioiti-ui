import { SegmentedControl } from 'ioiti-ui'
import { DiffEditor } from 'ioiti-ui/code'
import { useState } from 'react'

// Forty settings, two of them changed: the stretches between the changes are folded.
const SETTINGS = Array.from({ length: 40 }, (_, index) => `setting_${String(index + 1).padStart(2, '0')} = ${index * 5}`).join('\n')
const CHANGED = SETTINGS.replace('setting_08 = 35', 'setting_08 = 40').replace('setting_31 = 150', 'setting_31 = 120')

export default function DiffEditorFolded() {
  const [folded, setFolded] = useState(true)
  return (
    <div className="flex w-full flex-col gap-3">
      <SegmentedControl
        label="Unchanged lines"
        size="sm"
        value={folded ? 'folded' : 'whole'}
        onChange={(value) => setFolded(value === 'folded')}
        options={[
          { value: 'folded', label: 'Folded' },
          { value: 'whole', label: 'All shown' },
        ]}
      />
      <DiffEditor
        label="Shop settings"
        language="toml"
        original={SETTINGS}
        modified={CHANGED}
        readOnly
        // One line kept around each change, and a stretch folded from four lines.
        collapseUnchanged={folded ? { margin: 1, minSize: 4 } : false}
        originalLabel="Saved"
        modifiedLabel="Imported"
        maxHeight={320}
      />
    </div>
  )
}
