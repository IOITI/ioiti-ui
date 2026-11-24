import { describe, expect, it } from 'vitest'

import * as adapter from './index.js'

describe('the React Router adapter\'s interface', () => {
  // Every name an application can import from ioiti-ui/react-router. A change here is a change of the interface: make
  // it on purpose (`npx vitest run -u`), and say it in CHANGELOG.md.
  it('is the list of names it was', () => {
    expect(Object.keys(adapter).sort()).toMatchSnapshot()
  })
})
