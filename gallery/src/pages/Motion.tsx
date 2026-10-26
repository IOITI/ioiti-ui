import { motion } from 'framer-motion'
import { Button, motionTransitions, PageHeader, Panel } from 'ioiti-ui'
import { useState } from 'react'

import { Demo, Rule } from '../parts'

const USES: Record<keyof typeof motionTransitions, string> = {
  springGentle: 'Tabs, an accordion, a dialog fading in: about 400 ms, no overshoot.',
  springSmooth: 'Cards: the slightest organic settle.',
  springSnappy: 'A button pressed, a hover indicator: about 200 ms.',
  springMorph: 'A shared layout (layoutId): an island growing from its pill.',
  springResponsive: 'A toast arriving, a pull returning: a tiny overshoot.',
  springSoft: 'A value following another (useSpring).',
  easeSoft: 'Colour and opacity: 320 ms, Apple\'s emphasised curve.',
  easeFast: 'Quick property changes: 200 ms.',
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

export function Motion() {
  return (
    <>
      <PageHeader title="Motion" description="Soft, physical, immediate, controlled: springs that settle without bouncing, and only where they say something." />

      <Demo
        id="transitions"
        title="The transitions"
        description="Press one: the square moves with it. The components use these and nothing else."
        names={['motionTransitions']}
        className="flex flex-col items-stretch gap-3"
      >
        {(Object.keys(motionTransitions) as (keyof typeof motionTransitions)[]).map((name) => (
          <Mover key={name} name={name} />
        ))}
      </Demo>

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="Reduced when the system asks">
            IoitiProvider sets framer-motion's reducedMotion to the user's setting: movements become fades or nothing, and
            the rolling numbers plain text.
          </Rule>
          <Rule title="Motion says what changed">
            A tab's background slides to the tab chosen, a dialog grows from where it was opened, a toast comes from where
            it will leave. Nothing moves for decoration.
          </Rule>
          <Rule title="Never in the way">
            A click is answered at once; an animation never delays what was asked, and a list never waits for its
            entrance to be read.
          </Rule>
          <Rule title="Tests wait for exits">
            An element leaving animates out: a test waits for it to be gone (waitFor), as a reader does.
          </Rule>
        </ul>
      </Panel>
    </>
  )
}
