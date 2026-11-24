import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { RequestStatus } from './ui/request-status.js'

const sent = <RequestStatus status="success" title="Payment sent" reference={{ label: 'Payment', value: 'PY-55102' }} onDismiss={() => {}} />

describe('RequestStatus', () => {
  it('names its buttons by what they do, the reference by its name and value', () => {
    render(sent)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy payment PY-55102' })).toHaveTextContent('PY-55102')
  })

  it("names them in the language given, or in an application's own words", () => {
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <RequestStatus status="success" title="Paiement envoyé" reference={{ label: 'Paiement', value: 'PY-55102' }} onDismiss={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copier paiement PY-55102' })).toBeInTheDocument()
    unmount()

    render(<IoitiProvider messages={{ toast: { dismiss: 'Put away' } }}>{sent}</IoitiProvider>)
    expect(screen.getByRole('button', { name: 'Put away' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy payment PY-55102' })).toBeInTheDocument()
  })
})
