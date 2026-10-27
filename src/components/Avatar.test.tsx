import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Avatar, AvatarGroup } from './Avatar.js'

describe('Avatar', () => {
  it('is a person named for a screen reader, drawn with their initials', () => {
    render(<Avatar name="Ana María Ortiz" />)
    expect(screen.getByRole('img', { name: 'Ana María Ortiz' })).toHaveTextContent('AM')
  })

  it('shows their picture, and their initials where it fails', () => {
    const { container } = render(<Avatar name="Léa Brun" src="/avatars/lea.png" />)
    const picture = container.querySelector('img') as HTMLImageElement
    expect(picture).toHaveAttribute('src', '/avatars/lea.png')
    fireEvent.error(picture)
    expect(screen.getByRole('img', { name: 'Léa Brun' })).toHaveTextContent('LB')
  })
})

describe('AvatarGroup', () => {
  it('shows some, then how many more, each named', async () => {
    const user = userEvent.setup()
    render(
      <AvatarGroup
        label="Who works on it"
        max={2}
        people={[{ name: 'Ana Ortiz' }, { name: 'Léa Brun' }, { name: 'Omar Haddad' }, { name: 'Yuki Sato' }]}
      />,
    )
    const group = screen.getByRole('group', { name: 'Who works on it' })
    expect(group).toContainElement(screen.getByRole('img', { name: 'Ana Ortiz' }))
    const more = screen.getByRole('img', { name: '2 more: Omar Haddad, Yuki Sato' })
    expect(more).toHaveTextContent('+2')

    await user.tab()
    expect(screen.getByRole('img', { name: 'Ana Ortiz' })).toHaveFocus()
  })
})
