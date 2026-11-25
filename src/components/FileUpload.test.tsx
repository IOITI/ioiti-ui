import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { FileUpload } from './ui/animated-file-upload.js'

const EXPORT = { id: 'f1', name: 'rules.ndjson', size: 2048, type: 'application/x-ndjson', progress: 100, status: 'complete' as const }

describe('FileUpload', () => {
  it('names its file input as it is told, "Upload files" by default', () => {
    const { unmount } = render(<FileUpload />)
    expect(screen.getByLabelText('Upload files')).toHaveAttribute('type', 'file')
    unmount()

    render(<FileUpload label="Kibana export" />)
    expect(screen.getByLabelText('Kibana export')).toHaveAttribute('type', 'file')
  })

  it('draws the inline zone where its density is compact, the full-size one by default', () => {
    const { unmount } = render(<FileUpload density="compact" />)
    expect(screen.getByRole('button', { name: /Drop files here/ })).toHaveClass('min-h-[120px]')
    unmount()

    render(<FileUpload />)
    expect(screen.getByRole('button', { name: /Drop files here/ })).toHaveClass('min-h-[180px]')
  })

  it('tells the application of a file taken off the list', async () => {
    const user = userEvent.setup()
    const removed = vi.fn()
    render(<FileUpload initialFiles={[EXPORT]} onRemove={removed} />)

    await user.click(screen.getByRole('button', { name: 'Remove rules.ndjson' }))
    expect(removed).toHaveBeenCalledWith(expect.objectContaining({ id: 'f1', name: 'rules.ndjson' }))
    // Its row leaves, its exit played.
    await waitFor(() => expect(screen.queryByText('rules.ndjson')).not.toBeInTheDocument())
  })
})

describe('FileUpload in a locale', () => {
  const SENDING = { ...EXPORT, id: 'f2', name: 'prices.csv', size: 1_250_000, progress: 42.5, status: 'uploading' as const }

  it('writes sizes and a progress as English writes them, a progress with the decimals it is given', () => {
    render(<FileUpload initialFiles={[EXPORT, SENDING]} />)
    expect(screen.getByText('2.0 kB')).toBeInTheDocument()
    expect(screen.getByText('1.3 MB')).toBeInTheDocument()
    expect(screen.getByText('Uploading 42.5%')).toBeInTheDocument()
  })

  it('writes them as the locale writes them', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <FileUpload initialFiles={[EXPORT, SENDING]} maxSize={10_000_000} />
      </IoitiProvider>,
    )
    expect(screen.getByText('2,0 ko')).toBeInTheDocument()
    expect(screen.getByText('1,3 Mo')).toBeInTheDocument()
    expect(screen.getByText(/10,0 Mo/)).toBeInTheDocument()
    expect(screen.getByText(/42,5 %/).textContent).toContain('42,5\u00a0%')
  })

  it('says its words in the language given: its zone, its input, its list, a file\'s states and buttons', () => {
    const FAILED = { ...EXPORT, id: 'f3', name: 'notes.txt', size: 10, progress: 0, status: 'error' as const }
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <FileUpload initialFiles={[EXPORT, SENDING, FAILED]} maxSize={10_000_000} />
      </IoitiProvider>,
    )
    expect(screen.getByLabelText('Importer des fichiers')).toHaveAttribute('type', 'file')
    expect(screen.getByText('Déposez des fichiers ici')).toBeInTheDocument()
    expect(screen.getByText(/ou parcourez votre appareil/)).toBeInTheDocument()
    expect(screen.getByText('(jusqu’à 10,0 Mo)')).toBeInTheDocument()
    expect(screen.getByText('Fichiers (3)')).toBeInTheDocument()
    expect(screen.getByText('Prêt')).toBeInTheDocument()
    expect(screen.getByText('Importation 42,5 %').textContent).toBe('Importation 42,5\u00a0%')
    expect(screen.getByText('Échec de l’importation')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Réessayer d’importer notes.txt' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retirer rules.ndjson' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retirer les fichiers importés' })).toBeInTheDocument()
  })

  it('says a file too large in its words, the largest taken as the locale writes it; an application\'s own words over English\'s', async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <FileUpload maxSize={10} />
      </IoitiProvider>,
    )
    await user.upload(screen.getByLabelText('Importer des fichiers'), new File(['x'.repeat(64)], 'big.csv', { type: 'text/csv' }))
    expect(await screen.findByText('Le fichier dépasse la taille maximale autorisée (10 o)')).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider messages={{ upload: { dropTitle: 'Drop a price list' } }}>
        <FileUpload />
      </IoitiProvider>,
    )
    expect(screen.getByText('Drop a price list')).toBeInTheDocument()
    expect(screen.getByText(/or browse from your device/)).toBeInTheDocument()
    expect(screen.getByLabelText('Upload files')).toHaveAttribute('type', 'file')
  })
})
