import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Alert, AlertDescription, AlertTitle } from './ui/alert.js'

describe('Alert', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('takes a list, paragraphs and more in its description, as valid HTML', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <Alert tone="warning">
        <AlertTitle>2 rules not in this environment</AlertTitle>
        <AlertDescription>
          <p>Deploy them there first.</p>
          <ul>
            <li>Suspicious Outlook Access</li>
            <li>Cron Job Created</li>
          </ul>
        </AlertDescription>
      </Alert>,
    )

    expect(screen.getByRole('list').parentElement?.tagName).toBe('DIV')
    expect(screen.getByText('Deploy them there first.').parentElement?.tagName).toBe('DIV')
    // React reports a list or a paragraph inside a paragraph (invalid nesting) on the console.
    expect(errors).not.toHaveBeenCalled()
  })
})
