import { fireEvent, render, screen } from '@testing-library/react'
import { FileText } from 'lucide-react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { AttachmentChip } from './AttachmentChip.js'

describe('AttachmentChip', () => {
  it('names what is attached, says its detail, and is taken away by its own button', () => {
    const removed = vi.fn()
    render(<AttachmentChip label="export.csv" detail="12 kB" icon={<FileText />} onRemove={removed} />)

    expect(screen.getByText('export.csv')).toBeInTheDocument()
    expect(screen.getByText('12 kB')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Remove export.csv' }))
    expect(removed).toHaveBeenCalledOnce()
  })

  it('leads where it is kept, and has no button when it cannot be taken away', () => {
    render(<AttachmentChip label="Cross R60" href="/runs/20261030" />)

    expect(screen.getByRole('link', { name: 'Cross R60' })).toHaveAttribute('href', '/runs/20261030')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('draws its link with what it is given: a file the browser opens itself', () => {
    function FileLink(props: { href: string; className?: string; children?: ReactNode }) {
      return <a {...props} target="_blank" rel="noreferrer" data-file />
    }
    render(<AttachmentChip label="report.pdf" href="/files/f1" linkComponent={FileLink} />)

    const link = screen.getByRole('link', { name: 'report.pdf' })
    expect(link).toHaveAttribute('data-file')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows an image small, says while it is made ready, and says why it could not be taken', () => {
    const { container, rerender } = render(<AttachmentChip label="chart.png" thumbnail="data:image/png;base64,AAAA" busy />)

    expect(container.querySelector('img')).toBeNull()
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText(', being made ready')).toHaveClass('sr-only')

    rerender(<AttachmentChip label="chart.png" thumbnail="data:image/png;base64,AAAA" tone="danger" detail="Too large" />)
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
    expect(screen.getByText('Too large')).toHaveClass('text-negative')
    expect(container.firstElementChild).not.toHaveAttribute('aria-busy')
  })
})
