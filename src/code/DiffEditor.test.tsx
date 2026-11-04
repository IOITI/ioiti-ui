import { EditorView } from '@codemirror/view'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DiffEditor } from './DiffEditor.js'

const ORIGINAL = ['[rule]', 'name = "Admin login"', 'risk_score = 47', 'severity = "medium"', '', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'tags = ["x"]'].join('\n')
const MODIFIED = ['[rule]', 'name = "Admin login"', 'risk_score = 73', 'severity = "high"', '', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'tags = ["x", "y"]'].join('\n')

function viewNamed(name: string): EditorView {
  const view = EditorView.findFromDOM(screen.getByRole('textbox', { name }))
  if (!view) throw new Error(`no editor named ${name}`)
  return view
}

describe('DiffEditor', () => {
  it('shows both versions side by side and counts the changes', async () => {
    render(<DiffEditor label="Rule file" original={ORIGINAL} modified={MODIFIED} originalLabel="Saved" modifiedLabel="Yours" />)
    expect(screen.getByRole('region', { name: 'Rule file' })).toBeInTheDocument()
    expect(viewNamed('Rule file: Saved').state.doc.toString()).toBe(ORIGINAL)
    expect(viewNamed('Rule file: Saved').state.readOnly).toBe(true)
    expect(viewNamed('Rule file: Yours').state.doc.toString()).toBe(MODIFIED)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('2 changes'))
  })

  it('reports the edits of the changed version, and keeps them when the original changes', async () => {
    const onChange = vi.fn()
    const { rerender } = render(<DiffEditor label="Rule file" original={ORIGINAL} modified={MODIFIED} onChange={onChange} />)
    const yours = viewNamed('Rule file: Modified')
    yours.dispatch({ changes: { from: 0, to: 6, insert: '[rules]' } })
    expect(onChange).toHaveBeenLastCalledWith(MODIFIED.replace('[rule]', '[rules]'))
    rerender(<DiffEditor label="Rule file" original={`${ORIGINAL}\n`} modified={MODIFIED} onChange={onChange} />)
    expect(viewNamed('Rule file: Modified').state.doc.toString()).toBe(MODIFIED.replace('[rule]', '[rules]'))
  })

  it('moves from one change to the next', async () => {
    const user = userEvent.setup()
    render(<DiffEditor label="Rule file" original={ORIGINAL} modified={MODIFIED} collapseUnchanged={false} />)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('2 changes'))
    await user.click(screen.getByRole('button', { name: 'Next change' }))
    const yours = viewNamed('Rule file: Modified')
    const line = yours.state.doc.lineAt(yours.state.selection.main.head).number
    expect([3, 14]).toContain(line)
  })

  it('shows one column in the unified layout, the changed version editable unless read-only', async () => {
    const { container, rerender } = render(<DiffEditor label="Rule file" original={ORIGINAL} modified={MODIFIED} layout="unified" />)
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    await waitFor(() => expect(container.querySelector('.cm-deletedChunk')).not.toBeNull())
    expect(viewNamed('Rule file: Modified').state.readOnly).toBe(false)
    rerender(<DiffEditor label="Rule file" original={ORIGINAL} modified={MODIFIED} layout="unified" readOnly />)
    expect(viewNamed('Rule file: Modified').state.readOnly).toBe(true)
  })

  it('says when there is no change', async () => {
    render(<DiffEditor label="Rule file" original={ORIGINAL} modified={ORIGINAL} />)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('No change'))
    expect(screen.getByRole('button', { name: 'Next change' })).toBeDisabled()
  })
})
