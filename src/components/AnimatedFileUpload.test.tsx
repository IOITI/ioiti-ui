import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
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

describe('AnimatedFileUpload in a locale', () => {
  const SENDING = { ...EXPORT, id: 'f2', name: 'prices.csv', size: 1_250_000, progress: 42.5, status: 'uploading' as const }

  it('writes sizes and a progress as English writes them, a progress with the decimals it is given', () => {
    render(<AnimatedFileUpload initialFiles={[EXPORT, SENDING]} />)
    expect(screen.getByText('2.0 kB')).toBeInTheDocument()
    expect(screen.getByText('1.3 MB')).toBeInTheDocument()
    expect(screen.getByText('Uploading 42.5%')).toBeInTheDocument()
  })

  it('writes them as the locale writes them', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <AnimatedFileUpload initialFiles={[EXPORT, SENDING]} maxSize={10_000_000} />
      </IoitiProvider>,
    )
    expect(screen.getByText('2,0 ko')).toBeInTheDocument()
    expect(screen.getByText('1,3 Mo')).toBeInTheDocument()
    expect(screen.getByText(/10,0 Mo/)).toBeInTheDocument()
    expect(screen.getByText(/42,5 %/).textContent).toContain('42,5\u00a0%')
  })
})
