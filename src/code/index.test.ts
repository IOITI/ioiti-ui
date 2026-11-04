import { describe, expect, it } from 'vitest'

import * as code from './index.js'

describe("the code editors' interface (ioiti-ui/code)", () => {
  // Every name an application can import from the entry. A change here is a change of the interface: make it on
  // purpose (`npx vitest run -u`), and say it in CHANGELOG.md.
  it('is the list of names it was', () => {
    expect(Object.keys(code).sort()).toMatchSnapshot()
  })
})
