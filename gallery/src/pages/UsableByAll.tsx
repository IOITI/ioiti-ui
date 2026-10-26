import { Button, ButtonLink, Field, Hint, IconButton, Input, PageHeader, Panel } from 'ioiti-ui'
import { Trash2 } from 'lucide-react'

import { Demo, Rule } from '../parts'

export function UsableByAll() {
  return (
    <>
      <PageHeader title="Usable by all" description="With a keyboard, a screen reader, a phone, in light and in dark: the components do their part, and the pages keep these rules." />

      <Demo
        id="focus"
        title="The keyboard's focus"
        description="Press Tab: one ring, the same on every control and visible on every surface (2 px, the focus colour, 2 px away). It is a rule of the stylesheet outside any layer, so that no component's outline-none hides it."
        names={['Button', 'ButtonLink', 'Input']}
      >
        <Button size="sm">A button</Button>
        <ButtonLink to="/foundations/colours" size="sm" variant="outline">
          A link drawn as a button
        </ButtonLink>
        <div className="w-56">
          <Input placeholder="A field" aria-label="A field" />
        </div>
      </Demo>

      <Demo
        id="hint"
        title="Hints, not titles"
        description="What says why a control is disabled, or what a state means, is a Hint: shown on hover, on keyboard focus and on a tap, and read by screen readers as the control's description. A title shows on none of a phone, a keyboard or a disabled control."
        names={['Hint']}
      >
        <Hint content="Remove the three files chosen">
          <IconButton label="Remove" icon={<Trash2 />} />
        </Hint>
        <Hint content="Choose two to four runs to compare them" wrap>
          <Button size="sm" disabled>
            Compare
          </Button>
        </Hint>
        <Field label="Amount">
          <Hint content="In euros, cents after a point" wrap className="flex w-full">
            <Input defaultValue="120.00" />
          </Hint>
        </Field>
      </Demo>

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="What leads somewhere is a link">
            A page, an item, a tab whose view has an address: a link, which can be opened in another tab (ButtonLink, href
            on a menu entry, a tab, an action of a basket). Only actions are buttons.
          </Rule>
          <Rule title="Colour is never alone">
            A status is a word beside its colour (StatusBadge), a change has its sign, a check its icon, named for screen
            readers.
          </Rule>
          <Rule title="Every control is named">
            An icon alone has its name (IconButton's label); a field its label (Field); a table its name (aria-label).
          </Rule>
          <Rule title="One dialog at a time">
            A dialog is drawn in the document's body, takes the focus, keeps it, and gives it back to what opened it.
            A review step goes inside the dialog it reviews, never in a second one over it.
          </Rule>
          <Rule title="A phone is not a small desktop">
            Hints and previews open on a tap; a table scrolls sideways in its own frame or becomes cards; the trail of the
            top bar keeps its step back; the sidebar is a drawer.
          </Rule>
          <Rule title="⌘K goes somewhere, ⌘B folds">
            A palette of pages may be opened with ⌘K (Ctrl+K): it only leads somewhere, it never acts. ⌘B folds the
            sidebar.
          </Rule>
        </ul>
      </Panel>
    </>
  )
}
