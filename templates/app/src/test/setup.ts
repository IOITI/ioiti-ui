import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Each test's page taken down after it: without Vitest's globals, Testing Library does not do it by itself.
afterEach(cleanup)
