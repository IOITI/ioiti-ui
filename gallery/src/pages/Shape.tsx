import { Button, PageHeader, Panel } from 'ioiti-ui'

import { Demo, Rule } from '../parts'

const RADII = ['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full']

export function Shape() {
  return (
    <>
      <PageHeader title="Surfaces and shape" description="One surface for every card, soft corners, shadows only for what floats over the page." />

      <Demo
        id="panel"
        title="The panel"
        description="Every section of a page sits in one: a hairline border, the surface at half its strength over the page, 16 px corners. Its title is a section's, its body padded 20 px."
        names={['Panel']}
        className="grid gap-4 md:grid-cols-2"
      >
        <Panel title="Latest orders" description="The five sent last." action={<Button size="sm" variant="outline">View all</Button>}>
          <p className="text-sm text-muted-foreground">A panel with a title, a description and an action.</p>
        </Panel>
        <Panel title="Dense" description="Its body close under the title, for a list." dense>
          <ul className="divide-y divide-border/40 text-xs">
            <li className="py-2.5">First row</li>
            <li className="py-2.5">Second row</li>
          </ul>
        </Panel>
      </Demo>

      <Panel title="Corners" description="From one radius (--radius, 14 px): rounded-lg. A panel is rounded-2xl, a button rounded-lg, a badge rounded-full.">
        <div className="flex flex-wrap gap-4">
          {RADII.map((radius) => (
            <div key={radius} className="flex flex-col items-center gap-2">
              <div className={`size-16 border border-border bg-surface-raised ${radius}`} />
              <code className="font-mono text-[11px] text-muted-foreground">{radius}</code>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Shadows" description="A shadow says that something floats over the page: a dialog, a menu, a toast. What sits in the page has a border.">
        <div className="flex flex-wrap gap-6">
          <div className="grid size-28 place-items-center rounded-xl border border-border bg-surface text-xs text-muted-foreground">border</div>
          <div className="grid size-28 place-items-center rounded-xl bg-surface text-xs text-muted-foreground shadow-subtle">shadow-subtle</div>
          <div className="grid size-28 place-items-center rounded-xl bg-surface text-xs text-muted-foreground shadow-elevated">shadow-elevated</div>
        </div>
      </Panel>

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="A frame by role">
            A panel holds a section; what is inside it has no second card around it. A nested box (an example, a code
            line) is lighter: rounded-lg, a fainter border, the raised surface.
          </Rule>
          <Rule title="Lines inside, borders outside">
            Rows of a list or a table are apart by a line of the border colour at 40 %; a panel's border is at 70 %.
          </Rule>
          <Rule title="Width">
            A page's column stops at 80rem (max-w-7xl) and is padded 16 px on a phone, 24 px from 640 px up; a page that
            needs the whole width (an editor, a chart) says so to the shell (isWide).
          </Rule>
          <Rule title="Space between sections">
            The shell puts 24 px between the blocks of a page (gap-6): a page returns them side by side, without margins of
            its own.
          </Rule>
        </ul>
      </Panel>
    </>
  )
}
