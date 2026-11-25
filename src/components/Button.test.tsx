import { fireEvent, render, screen } from '@testing-library/react'
import { ChevronsUpDown, Pencil } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

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
    // Only an inline button (xs) is small text: from sm up, its words are body-size.
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveClass('h-8', 'text-sm')
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
      <ButtonLink href="/orders" size="sm" leftIcon={<Pencil />}>
        Orders
      </ButtonLink>,
    )
    expect(screen.getByRole('link', { name: 'Orders' }).querySelector('svg')!.parentElement).toHaveClass(
      "[&>svg:not([class*='size-'])]:size-3.5",
    )
  })
})

describe('ButtonLink', () => {
  it('leads where its href says, a button that cannot be pressed with nowhere to go, in the tone of its variant', () => {
    render(
      <>
        <ButtonLink href="/orders/new">New order</ButtonLink>
        <ButtonLink href={null}>Nowhere</ButtonLink>
        <ButtonLink href="/orders/7" variant="danger">
          Cancel order
        </ButtonLink>
        <ButtonLink href={null} variant="danger">
          Nothing to cancel
        </ButtonLink>
      </>,
    )
    expect(screen.getByRole('link', { name: 'New order' })).toHaveAttribute('href', '/orders/new')
    expect(screen.getByRole('button', { name: 'Nowhere' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Cancel order' })).toHaveClass('text-negative')
    expect(screen.getByRole('button', { name: 'Nothing to cancel' })).toHaveClass('text-negative')
  })

  it('is on its way while pending: a spinner, said busy, and a click that does nothing more', () => {
    const clicked = vi.fn()
    render(
      <>
        <ButtonLink href="/sign-in/gitea" reloadDocument pending onClick={clicked}>
          Gitea
        </ButtonLink>
        <ButtonLink href={null} pending>
          Nowhere
        </ButtonLink>
      </>,
    )
    const link = screen.getByRole('link', { name: 'Gitea' })
    expect(link).toHaveAttribute('aria-busy', 'true')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link.querySelector('svg')).toHaveClass('motion-safe:animate-spin')
    // Cancelled: the browser is on its way already.
    expect(fireEvent.click(link)).toBe(false)
    expect(clicked).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Nowhere' })).toHaveAttribute('aria-busy', 'true')
  })
})
