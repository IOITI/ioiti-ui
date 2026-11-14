import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Without vitest globals, Testing Library does not unmount between tests by itself.
afterEach(cleanup)

// CodeMirror measures text through a Range, which jsdom lays out nowhere and cannot measure: none of its boxes,
// as none of jsdom's elements has one (it logged "getClientRects is not a function" on every editor).
if (typeof Range !== 'undefined') {
  Range.prototype.getClientRects ??= function () {
    return Object.assign([], { item: () => null }) as unknown as DOMRectList
  }
  Range.prototype.getBoundingClientRect ??= () => new DOMRect()
}
