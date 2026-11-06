import { language as languageFacet } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CodeEditor } from './CodeEditor.js'

/** The CodeMirror view of the editor named `label`. */
function editorOf(label: string): EditorView {
  const content = screen.getByRole('textbox', { name: label })
  const view = EditorView.findFromDOM(content)
  if (!view) throw new Error(`no editor for ${label}`)
  return view
}

describe('CodeEditor', () => {
  it('shows the code, named for a screen reader, and reports what the user changes', () => {
    const onChange = vi.fn()
    render(<CodeEditor label="Rule file" value={'name = "a"\n'} onChange={onChange} />)
    const view = editorOf('Rule file')
    expect(view.state.doc.toString()).toBe('name = "a"\n')
    view.dispatch({ changes: { from: 8, to: 9, insert: 'b' } })
    expect(onChange).toHaveBeenLastCalledWith('name = "b"\n')
  })

  it('takes a new value given without reporting it as a change of the user', () => {
    const onChange = vi.fn()
    const { rerender } = render(<CodeEditor label="Rule file" value="a = 1" onChange={onChange} />)
    rerender(<CodeEditor label="Rule file" value="a = 2" onChange={onChange} />)
    expect(editorOf('Rule file').state.doc.toString()).toBe('a = 2')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('saves on ⌘S / Ctrl+S with the code as it is', () => {
    const onSave = vi.fn()
    render(<CodeEditor label="Rule file" value="a = 1" onSave={onSave} />)
    const content = screen.getByRole('textbox', { name: 'Rule file' })
    fireEvent.keyDown(content, { key: 's', code: 'KeyS', ctrlKey: true })
    fireEvent.keyDown(content, { key: 's', code: 'KeyS', metaKey: true })
    expect(onSave).toHaveBeenCalledWith('a = 1')
  })

  it('is read-only when asked, and says so', () => {
    const { rerender } = render(<CodeEditor label="Rule file" value="a = 1" readOnly />)
    expect(editorOf('Rule file').state.readOnly).toBe(true)
    expect(screen.getByRole('textbox', { name: 'Rule file' })).toHaveAttribute('aria-readonly', 'true')
    rerender(<CodeEditor label="Rule file" value="a = 1" />)
    expect(editorOf('Rule file').state.readOnly).toBe(false)
  })

  it('loads the language asked for', async () => {
    render(<CodeEditor label="Rule file" value={'[rule]\nname = "a"\n'} language="toml" />)
    await waitFor(() => expect(editorOf('Rule file').state.facet(languageFacet)?.name).toBe('toml'))
  })

  it('colours Python, loaded when first asked for', async () => {
    render(<CodeEditor label="An RTA of ours" value={'def main():\n    return None\n'} language="python" />)
    await waitFor(() => expect(editorOf('An RTA of ours').state.facet(languageFacet)?.name).toBe('python'))
  })

  it('marks the problems a server found, where they are', async () => {
    const { container, rerender } = render(<CodeEditor label="Rule file" value={'a = 1\nb = \n'} />)
    rerender(
      <CodeEditor
        label="Rule file"
        value={'a = 1\nb = \n'}
        diagnostics={[{ line: 2, column: 3, message: 'Expected a value', severity: 'error' }]}
      />,
    )
    await waitFor(() => expect(container.querySelector('.cm-lintRange-error')).not.toBeNull())
    expect(container.querySelector('.cm-lintRange-error')?.textContent).toBe('= ')
  })
})
