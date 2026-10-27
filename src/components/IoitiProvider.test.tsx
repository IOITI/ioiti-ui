import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { REDUCED_MOTION_ATTRIBUTE } from '../lib/motion.js'

import { IoitiProvider } from './IoitiProvider.js'

const html = document.documentElement

describe('the motion IoitiProvider reduces', () => {
  it('is left to the system by default: nothing is written on the page', () => {
    render(<IoitiProvider>A page</IoitiProvider>)

    expect(html.hasAttribute(REDUCED_MOTION_ATTRIBUTE)).toBe(false)
  })

  it('is told to the stylesheets when reduced always, or never, and forgotten when the provider goes', () => {
    const { rerender, unmount } = render(<IoitiProvider reducedMotion="always">A page</IoitiProvider>)
    expect(html.getAttribute(REDUCED_MOTION_ATTRIBUTE)).toBe('always')

    rerender(<IoitiProvider reducedMotion="never">A page</IoitiProvider>)
    expect(html.getAttribute(REDUCED_MOTION_ATTRIBUTE)).toBe('never')

    unmount()
    expect(html.hasAttribute(REDUCED_MOTION_ATTRIBUTE)).toBe(false)
  })
})
