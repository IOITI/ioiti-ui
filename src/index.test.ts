import { describe, expect, it } from 'vitest'

import * as ioitiUi from './index.js'

describe('the package\'s interface', () => {
  // Every name an application can import. A change here is a change of the interface: make it on
  // purpose (`npx vitest run -u`), and say it in CHANGELOG.md.
  it('is the list of names it was', () => {
    expect(Object.keys(ioitiUi).sort()).toMatchSnapshot()
  })

  it('gives every component a name of its own, not a default export', () => {
    expect(Object.keys(ioitiUi)).not.toContain('default')
  })
})
