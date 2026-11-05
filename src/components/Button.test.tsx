import { render, screen } from '@testing-library/react'
import { ChevronsUpDown, Pencil } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { ButtonLink } from './ButtonLink.js'
import { Button } from './ui/button.js'

describe('Button', () => {
  it('draws its icon as tall as its words, at each size, an icon given its own size keeping it', () => {
    render(
      <>
        <Button size="xs" leftIcon={<Pencil />}>Change</Button>
        <Button size="sm" leftIcon={<Pencil />}>Edit</Button>
        <Button size="md" leftIcon={<Pencil className="size-5" />}>Own size</Button>
      </>,
    )
    const iconBox = (name: string) => screen.getByRole('button', { name }).querySelector('svg')!.parentElement!
    expect(screen.getByRole('button', { name: 'Change' })).toHaveClass('h-6', 'text-xs')
    expect(iconBox('Change')).toHaveClass("[&>svg:not([class*='size-'])]:size-3")
    expect(iconBox('Edit')).toHaveClass("[&>svg:not([class*='size-'])]:size-3.5")
    // Its own size is not one the rule picks.
    expect(screen.getByRole('button', { name: 'Own size' }).querySelector('svg')).toHaveClass('size-5')
  })

  it('cuts words longer than its room short, its icons kept whole', () => {
    render(
      <Button size="sm" className="max-w-40" rightIcon={<ChevronsUpDown />}>
        A workspace with a very long name
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'A workspace with a very long name' })
    const [words, icon] = [...button.children] as HTMLElement[]
    expect(words).toHaveClass('min-w-0', 'truncate')
    expect(icon).toHaveClass('shrink-0')
  })

  it('sizes a ButtonLink\'s icons the same way', () => {
    render(
      <ButtonLink to="/orders" size="sm" leftIcon={<Pencil />}>
        Orders
      </ButtonLink>,
    )
    expect(screen.getByRole('link', { name: 'Orders' }).querySelector('svg')!.parentElement).toHaveClass(
      "[&>svg:not([class*='size-'])]:size-3.5",
    )
  })
})
