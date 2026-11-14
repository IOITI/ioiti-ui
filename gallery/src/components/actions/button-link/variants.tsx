import { ButtonLink } from 'ioiti-ui'
import { ArrowRight, Plus } from 'lucide-react'

export default function ButtonLinkVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink to="/components/forms" leftIcon={<Plus />}>
        New form
      </ButtonLink>
      <ButtonLink to="/components/tables" variant="outline" size="sm">
        The tables
      </ButtonLink>
      <ButtonLink to="/components/charts" variant="ghost" size="sm" rightIcon={<ArrowRight />}>
        The charts
      </ButtonLink>
      <ButtonLink to="/components/actions/button" variant="link">
        Buttons
      </ButtonLink>
    </div>
  )
}
