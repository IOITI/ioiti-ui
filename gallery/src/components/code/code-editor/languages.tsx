import { Field, Select } from 'ioiti-ui'
import { CodeEditor } from 'ioiti-ui/code'
import type { CodeEditorLanguage } from 'ioiti-ui/code'
import { useState } from 'react'

const FILES: Record<CodeEditorLanguage, string> = {
  toml: '[delivery]\nfree_from = 60\ncarriers = ["post", "courier"]\n',
  yaml: 'delivery:\n  free_from: 60\n  carriers:\n    - post\n    - courier\n',
  json: '{\n  "delivery": {\n    "free_from": 60,\n    "carriers": ["post", "courier"]\n  }\n}\n',
  markdown: '# Delivery\n\nFree from **60 €**, by post or by courier.\n\n- Post: 3 days\n- Courier: next day\n',
  python: 'def delivery_cost(total: float) -> float:\n    """Free from 60, 4.90 under it."""\n    return 0 if total >= 60 else 4.90\n',
  text: 'Delivery is free from 60 €, by post or by courier.\n',
}

export default function CodeEditorLanguages() {
  const [language, setLanguage] = useState<CodeEditorLanguage>('toml')
  const [files, setFiles] = useState(FILES)
  const code = files[language]
  return (
    <div className="flex w-full flex-col gap-3">
      <Field label="Language" className="max-w-48">
        <Select
          value={language}
          onChange={(event) => setLanguage(event.target.value as CodeEditorLanguage)}
          options={[
            { value: 'toml', label: 'TOML' },
            { value: 'yaml', label: 'YAML' },
            { value: 'json', label: 'JSON' },
            { value: 'markdown', label: 'Markdown' },
            { value: 'python', label: 'Python' },
            { value: 'text', label: 'Text' },
          ]}
        />
      </Field>
      <CodeEditor
        label={`Delivery settings, in ${language}`}
        language={language}
        value={code}
        onChange={(value) => setFiles({ ...files, [language]: value })}
        minHeight={180}
      />
      <span className="text-xs text-muted-foreground tabular-nums">
        {code.split('\n').length} lines, {code.length} characters
      </span>
    </div>
  )
}
