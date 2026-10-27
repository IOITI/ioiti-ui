import { motion } from 'framer-motion'
import {
  ACCENTS,
  Button,
  cn,
  CodeBlock,
  IconButton,
  Meter,
  motionTransitions,
  PageHeader,
  Panel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextLink,
  ThemeToggle,
  useTheme,
  useToast,
} from 'ioiti-ui'
import { MousePointerClick } from 'lucide-react'
import { useState } from 'react'

import { Demo, Rule } from '../parts'

const USES: Record<keyof typeof motionTransitions, string> = {
  springGentle: 'Tabs, an accordion, a dialog growing in: about 400 ms, no overshoot.',
  springSmooth: 'Cards: the slightest organic settle.',
  springSnappy: 'A button pressed, a hover indicator, whatever floats arriving (a popover, a tooltip, a toast): about 200 ms.',
  springMorph: 'A shared layout (layoutId): an island growing from its pill.',
  springResponsive: 'A pull returning, at the end of a gesture: the one tiny overshoot.',
  springSoft: 'A value following another (useSpring).',
  easeSoft: 'Colour and opacity: 320 ms, Apple\'s emphasised curve.',
  easeFast: 'Quick property changes: 200 ms. Every CSS transition takes its curve, at 150 ms.',
  springSheet: 'A sheet or the drawer sliding in and out, the sidebar folding: about 270 ms, no overshoot.',
  easeExit: 'Whatever leaves: 150 ms, quicker than it came, accelerating away.',
}

function Mover({ name }: { name: keyof typeof motionTransitions }) {
  const [far, setFar] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="outline" onClick={() => setFar((value) => !value)} className="w-40 shrink-0 justify-start">
        {name}
      </Button>
      <div className="relative h-8 flex-1 rounded-lg bg-surface-raised/50">
        <motion.div
          className="absolute top-1 left-1 size-6 rounded-md bg-foreground"
          animate={{ left: far ? 'calc(100% - 1.75rem)' : '0.25rem' }}
          transition={motionTransitions[name]}
        />
      </div>
      <p className="hidden w-80 shrink-0 text-xs text-muted-foreground lg:block">{USES[name]}</p>
    </div>
  )
}

// The same curves in the stylesheets (ioiti-ui/motion.css), as Tailwind utilities.
const CURVES = [
  { name: 'ease-soft', use: 'easeSoft\'s: a fade, what arrives (a page, content after its skeleton).' },
  { name: 'ease-fast', use: 'easeFast\'s: every transition-* class takes it, a hover, a colour.' },
  { name: 'ease-exit', use: 'easeExit\'s: what leaves.' },
] as const

function CssMover({ name, use }: (typeof CURVES)[number]) {
  const [far, setFar] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="outline" onClick={() => setFar((value) => !value)} className="w-40 shrink-0 justify-start font-mono">
        {name}
      </Button>
      <div className="relative h-8 flex-1 rounded-lg bg-surface-raised/50">
        <div
          className={cn(
            'absolute top-1 size-6 rounded-md bg-foreground motion-safe:transition-[left] motion-safe:duration-300',
            name,
            far ? 'left-[calc(100%-1.75rem)]' : 'left-1',
          )}
        />
      </div>
      <p className="hidden w-80 shrink-0 text-xs text-muted-foreground lg:block">{use}</p>
    </div>
  )
}

/** The theme and the accent, chosen here: the whole page changes in one cross-fade. */
function LookTrial() {
  const { accent, setAccent } = useTheme()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ThemeToggle />
      {ACCENTS.map((value) => (
        <Button key={value} size="sm" variant={value === accent ? 'primary' : 'outline'} aria-pressed={value === accent} onClick={() => setAccent(value)}>
          {value[0].toUpperCase() + value.slice(1)}
        </Button>
      ))}
    </div>
  )
}

const RATIOS = [0.2, 0.55, 0.9]

/** What moves within a page: a value, a toast, a control pressed. */
function Moments() {
  const toast = useToast()
  const [step, setStep] = useState(0)
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-3">
        <Meter ratio={RATIOS[step]} label="A share of the limit" scale={['0', '100 %']} />
        <Button size="sm" variant="outline" onClick={() => setStep((value) => (value + 1) % RATIOS.length)}>
          Another share
        </Button>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            toast({ title: 'Export requested' })
            toast({ title: 'Export ready', variant: 'info' })
          }}
        >
          Two toasts in a row
        </Button>
        <IconButton label="An icon button, which gives when pressed" hint="Pressed, it gives" icon={<MousePointerClick />} />
      </div>
      <p className="text-sm text-muted-foreground sm:col-span-2">
        What arrives where a skeleton was fades in; what was there already is shown as it is:{' '}
        <TextLink to="/patterns/states">Empty, loading, failed</TextLink> shows both.
      </p>
    </div>
  )
}

const FAMILIES = [
  { family: 'A dialog', what: 'SettleModal, ConfirmAction', arriving: 'springGentle, from what opened it', leaving: 'easeExit' },
  { family: 'A sheet, the drawer', what: 'Flysheet, the sidebar on a phone', arriving: 'springSheet, from its side', leaving: 'springSheet, back to its side' },
  { family: 'A scrim', what: 'Behind a dialog, a sheet, the drawer, the palette', arriving: 'easeFast', leaving: 'easeExit' },
  { family: 'What floats', what: 'Popovers, menus, the palette, tooltips, peek cards', arriving: 'springSnappy', leaving: 'easeExit' },
  { family: 'A toast, a bar', what: 'The toasts, the selection basket', arriving: 'springSnappy, from the edge it leaves by', leaving: 'easeExit' },
]

export function Motion() {
  return (
    <>
      <PageHeader title="Motion" description="Soft, physical, immediate, controlled: springs that settle without bouncing, and only where they say something." />

      <Demo
        id="transitions"
        title="The transitions"
        description="Press one: the square moves with it. Everything that floats, slides or fades in front of the page uses these; what a component does of its own (a box drawing its mark) may keep its own."
        names={['motionTransitions']}
        className="flex flex-col items-stretch gap-3"
      >
        {(Object.keys(motionTransitions) as (keyof typeof motionTransitions)[]).map((name) => (
          <Mover key={name} name={name} />
        ))}
      </Demo>

      <Panel title="In CSS" description="The same curves, for the stylesheets: a utility each, a test holding them to framer-motion's.">
        <div className="flex flex-col gap-3">
          {CURVES.map((curve) => (
            <CssMover key={curve.name} {...curve} />
          ))}
        </div>
        <div className="mt-5">
          <CodeBlock language="tsx" code={`<div className="transition-colors">       {/* easeFast's curve, 150 ms: every transition-* class */}
<div className="transition-opacity duration-300 ease-soft">
<div className="motion-safe:transition-[width] motion-safe:ease-soft">  {/* not where motion is reduced */}`} />
        </div>
      </Panel>

      <Panel
        title="Changing page"
        description="The page left fades out in 150 ms as the new one fades in and rises 6 px in 240 ms; the sidebar and the top bar stay as they are, and in use."
      >
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            A change of the query alone, a page's own updates, Back and Forward, and a browser without view transitions
            change the page at once. What is fixed over the page stays above it while it changes: a dialog, a sheet, the
            drawer, the toasts. Where motion is reduced, the new page fades in without rising.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="text-muted-foreground">Try it:</span>
            <TextLink to="/foundations/type">Type</TextLink>
            <TextLink to="/foundations/colours">Colours</TextLink>
            <TextLink to="/components/overlays">Overlays</TextLink>
            <TextLink to="?query=another">This page, another query (nothing moves)</TextLink>
          </p>
          <CodeBlock language="tsx" code={`// React Router: nothing to do, its changes of page are React transitions.
<RouterAppShell menu={MENU} />

// Another router: give AppShell the new address in a transition.
startTransition(() => setPathname(next))`} />
        </div>
      </Panel>

      <Panel title="Changing look" description="A theme, an accent or a material chosen changes the whole page in one cross-fade, the components' own transitions held still meanwhile.">
        <LookTrial />
      </Panel>

      <Panel title="Within a page" description="Motion says what changed: a value slides to its place, a toast leaves before the next one comes, a control gives when pressed.">
        <Moments />
      </Panel>

      <Panel title="What floats" description="One motion for each kind of thing in front of the page." dense>
        <Table aria-label="The motion of what floats">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Kind</TableHeaderCell>
              <TableHeaderCell>Where</TableHeaderCell>
              <TableHeaderCell>Arriving</TableHeaderCell>
              <TableHeaderCell>Leaving</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {FAMILIES.map((row) => (
              <TableRow key={row.family}>
                <TableCell className="font-medium">{row.family}</TableCell>
                <TableCell>{row.what}</TableCell>
                <TableCell className="font-mono text-xs">{row.arriving}</TableCell>
                <TableCell className="font-mono text-xs">{row.leaving}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="Reduced when asked">
            Where the system asks, or IoitiProvider's reducedMotion says so, movement goes and fades stay:
            framer-motion's (MotionConfig) and the stylesheets' (motion-safe:, motion-reduce:), the loops of
            spinners stopped, a page arriving without rising, the rolling numbers plain text.
          </Rule>
          <Rule title="Motion says what changed">
            A tab's background slides to the tab chosen, a dialog grows from what opened it, a toast comes from where
            it will leave. Nothing moves for decoration.
          </Rule>
          <Rule title="Never in the way">
            A click is answered at once; an animation never delays what was asked, the shell stays in use while a page
            arrives, and a list never waits for its entrance to be read.
          </Rule>
          <Rule title="Quicker to leave">
            What leaves takes 150 ms, what arrives up to about 300: the eye is on what comes, not on what goes.
          </Rule>
          <Rule title="The look changes as one">
            A theme, an accent or a material is one cross-fade of the whole page, never colours arriving one after the
            other.
          </Rule>
          <Rule title="Tests wait for exits">
            An element leaving animates out: a test waits for it to be gone (waitFor), as a reader does. jsdom has no
            view transitions: pages and looks change there at once.
          </Rule>
        </ul>
      </Panel>
    </>
  )
}
