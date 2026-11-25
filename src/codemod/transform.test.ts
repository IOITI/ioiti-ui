// @vitest-environment node
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

import { DEPRECATIONS } from '../lib/deprecations.js'
import { rulesOf } from './rules.js'
import { rewrite } from './transform.js'

// The list as it is, and a component renamed, whatever the list holds when the test runs.
const rules = rulesOf({
  ...DEPRECATIONS,
  'test-renamed': { kind: 'export', old: 'SettleModal', new: 'Dialog', since: '0.31.0' },
  'test-renamed-props': { kind: 'export', old: 'SettleModalProps', new: 'DialogProps', since: '0.31.0' },
})
const run = (source: string, fileName = 'page.tsx') => rewrite(ts, fileName, source, rules)

describe('the codemod: a name the package exports', () => {
  it('renames an import, and every use of it: a tag, a type, a value', () => {
    const { output, changes } = run(`import { SettleModal, type SettleModalProps, Button } from 'ioiti-ui'
type P = SettleModalProps & { x: number }
export const A = (p: P) => <SettleModal open title="x"><Button>Go</Button></SettleModal>
export const map = { SettleModal }
export { SettleModal }
`)
    expect(output).toBe(`import { Dialog, type DialogProps, Button } from 'ioiti-ui'
type P = DialogProps & { x: number }
export const A = (p: P) => <Dialog open title="x"><Button>Go</Button></Dialog>
export const map = { SettleModal: Dialog }
export { Dialog as SettleModal }
`)
    expect(changes.map((change) => change.text)).toEqual(['SettleModal → Dialog', 'SettleModalProps → DialogProps'])
  })

  it('keeps a name the file gave it, and renames it through a namespace', () => {
    const { output } = run(`import { SettleModal as Modal } from 'ioiti-ui'
import * as UI from 'ioiti-ui'
const a = <Modal open hideCloseButton={false} />
const b = <UI.SettleModal open hideCloseButton={busy} />
type Q = UI.SettleModalProps
`)
    expect(output).toBe(`import { Dialog as Modal } from 'ioiti-ui'
import * as UI from 'ioiti-ui'
const a = <Modal open showCloseButton />
const b = <UI.Dialog open showCloseButton={!busy} />
type Q = UI.DialogProps
`)
  })

  it('imports today\'s name under the former one where the file has a name of its own so written', () => {
    const { output, notes } = run(`import { Dialog } from '@other/dialogs'\nimport { SettleModal } from 'ioiti-ui'\nconst a = <SettleModal title="t" />\n`)
    expect(output).toBe(`import { Dialog } from '@other/dialogs'\nimport { Dialog as SettleModal } from 'ioiti-ui'\nconst a = <SettleModal title="t" />\n`)
    expect(notes).toEqual([{ line: 2, text: 'Dialog names something else in this file: imported as SettleModal, to rename by hand if you like' }])
  })

  it('drops an old name imported beside its new one', () => {
    const { output } = run(`import { SettleModal, Dialog } from 'ioiti-ui'\nconst a = <SettleModal />\n`)
    expect(output).toBe(`import { Dialog } from 'ioiti-ui'\nconst a = <Dialog />\n`)
  })

  it('renames a type, and says what has no name in its place', () => {
    const { output, notes } = run(`import { HEALTH_STATUS_LABEL, type Tone } from 'ioiti-ui'\nconst t: Tone = 'positive'\n`)
    expect(output).toBe(`import { HEALTH_STATUS_LABEL, type SignTone } from 'ioiti-ui'\nconst t: SignTone = 'positive'\n`)
    expect(notes).toEqual([{ line: 1, text: expect.stringContaining('HEALTH_STATUS_LABEL is deprecated, with no name in its place') }])
  })

  it('leaves a file that does not import the package as it is', () => {
    const source = `import { SettleModal } from './own.js'\nconst a = <SettleModal hideCloseButton />\n`
    expect(run(source)).toEqual({ output: source, changes: [], notes: [] })
  })
})

describe('the codemod: a prop', () => {
  it('renames it, and takes it away where the new one is given too', () => {
    const { output } = run(`import { Combobox, LineChart } from 'ioiti-ui'
const a = <Combobox options={[]} onValueChange={pick} />
const b = <Combobox options={[]} onChange={pick} onValueChange={tell} />
const c = <LineChart data={d} series={s} ariaLabel="Load" />
`)
    expect(output).toBe(`import { Combobox, LineChart } from 'ioiti-ui'
const a = <Combobox options={[]} onChange={pick} />
const b = <Combobox options={[]} onChange={pick} />
const c = <LineChart data={d} series={s} aria-label="Load" />
`)
  })

  it('turns a boolean the other way round', () => {
    const { output } = run(`import { SettleModal } from 'ioiti-ui'
const a = <SettleModal hideCloseButton />
const b = <SettleModal hideCloseButton={true} />
const c = <SettleModal hideCloseButton={false} />
const d = <SettleModal hideCloseButton={saving || locked} />
`)
    expect(output).toBe(`import { Dialog } from 'ioiti-ui'
const a = <Dialog showCloseButton={false} />
const b = <Dialog showCloseButton={false} />
const c = <Dialog showCloseButton />
const d = <Dialog showCloseButton={!(saving || locked)} />
`)
  })

  it('turns a boolean into a value of another prop', () => {
    const { output } = run(`import { Panel, EmptyState } from 'ioiti-ui'
const a = <Panel title="t" dense>x</Panel>
const b = <Panel title="t" dense={false}>x</Panel>
const c = <Panel title="t" dense={narrow}>x</Panel>
const d = <EmptyState title="t" compact />
`)
    expect(output).toBe(`import { Panel, EmptyState } from 'ioiti-ui'
const a = <Panel title="t" density="compact">x</Panel>
const b = <Panel title="t">x</Panel>
const c = <Panel title="t" density={narrow ? 'compact' : undefined}>x</Panel>
const d = <EmptyState title="t" density="compact" />
`)
  })

  it('says where a spread may hold an old name', () => {
    const { output, notes } = run(`import { Button } from 'ioiti-ui'\nconst a = <Button {...props}>Go</Button>\n`)
    expect(output).toBe(`import { Button } from 'ioiti-ui'\nconst a = <Button {...props}>Go</Button>\n`)
    expect(notes[0]).toEqual({ line: 2, text: expect.stringContaining('Button is given a spread: isLoading') })
  })
})

describe('the codemod: a value', () => {
  it('renames a word, and makes one another prop', () => {
    const { output, notes } = run(`import { Button, KpiTile, ProgressBar, AnimatedFileUpload } from 'ioiti-ui'
const a = <Button variant="destructive" isLoading>Delete</Button>
const b = <KpiTile label="l" value="1" tone="negative" toneLabel="Failing" />
const c = <ProgressBar label="l" value={3} tone={'positive'} />
const d = <AnimatedFileUpload label="l" variant="compact" uploadHandler={h} />
const e = <ProgressBar label="l" value={3} tone={t} />
`)
    expect(output).toBe(`import { Button, KpiTile, ProgressBar, FileUpload } from 'ioiti-ui'
const a = <Button variant="danger" pending>Delete</Button>
const b = <KpiTile label="l" value="1" tone="danger" toneLabel="Failing" />
const c = <ProgressBar label="l" value={3} tone={'success'} />
const d = <FileUpload label="l" density="compact" uploadHandler={h} />
const e = <ProgressBar label="l" value={3} tone={t} />
`)
    expect(notes).toEqual([{ line: 6, text: `ProgressBar's tone is computed: "positive" is "success" and "negative" is "danger" now` }])
  })

  it('renames it in the objects a prop is given, and where they are declared in the file', () => {
    const { output, notes } = run(`import { Slider, LineChart, BarList } from 'ioiti-ui'
const levels = [{ from: 0, to: 50, tone: 'positive' }, { from: 50, to: 100, tone: 'negative' as const }]
const a = <Slider label="l" levels={levels} />
const b = <LineChart data={d} series={s} references={[{ value: 3, tone: 'negative', label: 'Limit' }]} />
const c = <BarList items={rows} />
`)
    expect(output).toBe(`import { Slider, LineChart, BarList } from 'ioiti-ui'
const levels = [{ from: 0, to: 50, tone: 'success' }, { from: 50, to: 100, tone: 'danger' as const }]
const a = <Slider label="l" levels={levels} />
const b = <LineChart data={d} series={s} references={[{ value: 3, tone: 'danger', label: 'Limit' }]} />
const c = <BarList items={rows} />
`)
    expect(notes).toEqual([{ line: 5, text: expect.stringContaining(`BarList's items are made elsewhere`) }])
  })

  it('renames a sidebar badge\'s tone wherever its sections are written', () => {
    const { output } = run(`import type { SidebarSection } from 'ioiti-ui'
export const sections: SidebarSection[] = [{ title: 'Ops', items: [{ label: 'Jobs', href: '/jobs', badge: 'Down', badgeTone: 'negative' }] }]
`, 'menu.ts')
    expect(output).toContain(`badgeTone: 'danger'`)
  })

  it('renames what a toast is given, as a prop and as useToast() is called', () => {
    const { output, notes } = run(`import { useToast, VelocityToast, DragToConfirm } from 'ioiti-ui'
export function Page() {
  const toast = useToast()
  const saved = () => toast({ title: 'Saved', variant: 'error' })
  const other = () => toast(message)
  return <><VelocityToast title="t" variant="default" /><DragToConfirm variant="default" onConfirm={go} /></>
}
`)
    expect(output).toBe(`import { useToast, Toast, DragToConfirm } from 'ioiti-ui'
export function Page() {
  const toast = useToast()
  const saved = () => toast({ title: 'Saved', tone: 'danger' })
  const other = () => toast(message)
  return <><Toast title="t" tone="neutral" /><DragToConfirm tone="neutral" onConfirm={go} /></>
}
`)
    expect(notes).toEqual([{ line: 5, text: expect.stringContaining('toast() is given a message made elsewhere') }])
  })
})
