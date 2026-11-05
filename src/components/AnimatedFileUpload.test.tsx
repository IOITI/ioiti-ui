import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AnimatedFileUpload } from './ui/animated-file-upload.js'

const EXPORT = { id: 'f1', name: 'rules.ndjson', size: 2048, type: 'application/x-ndjson', progress: 100, status: 'complete' as const }

describe('AnimatedFileUpload', () => {
  it('names its file input as it is told, "Upload files" by default', () => {
    const { unmount } = render(<AnimatedFileUpload />)
    expect(screen.getByLabelText('Upload files')).toHaveAttribute('type', 'file')
    unmount()

    render(<AnimatedFileUpload label="Kibana export" />)
    expect(screen.getByLabelText('Kibana export')).toHaveAttribute('type', 'file')
  })

  it('tells the application of a file taken off the list', async () => {
    const user = userEvent.setup()
    const removed = vi.fn()
    render(<AnimatedFileUpload initialFiles={[EXPORT]} onRemove={removed} />)

    await user.click(screen.getByRole('button', { name: 'Remove rules.ndjson' }))
    expect(removed).toHaveBeenCalledWith(expect.objectContaining({ id: 'f1', name: 'rules.ndjson' }))
    // Its row leaves, its exit played.
    await waitFor(() => expect(screen.queryByText('rules.ndjson')).not.toBeInTheDocument())
  })
})
