import { Badge, Code, Disclosure, EmptyText, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

import { COMPONENT_PROPS, type ComponentProps, type Inherits } from './props'

/** "…and the attributes of `<button>`": what a component takes from elsewhere, in a line. */
function InheritedLine({ inherits }: { inherits: Inherits }) {
  const of = inherits.component ? (
    <>
      the props of <Code>{inherits.component}</Code>
    </>
  ) : inherits.element && inherits.element !== 'element' ? (
    <>
      the attributes of <Code>{`<${inherits.element}>`}</Code>
    </>
  ) : (
    <>an HTML element&apos;s attributes</>
  )
  return (
    <p className="text-sm text-muted-foreground">
      {inherits.count > 0 ? 'And ' : 'All its props are '}
      {of}
      {inherits.motion ? <> and framer-motion&apos;s</> : null}
      {inherits.omit?.length ? (
        <>
          , but{' '}
          {inherits.omit.map((key, index) => (
            <span key={key}>
              {index > 0 ? ', ' : ''}
              <Code>{key}</Code>
            </span>
          ))}
        </>
      ) : null}
      .
    </p>
  )
}

function PropsTable({ name, component }: { name: string; component: ComponentProps }) {
  if (!component.props.length) {
    return component.inherits ? (
      <InheritedLine inherits={{ ...component.inherits, count: 0 }} />
    ) : (
      <EmptyText>{name} takes no props.</EmptyText>
    )
  }
  return (
    <div className="space-y-3">
      <Table density="dense" aria-label={`The props of ${name}`}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Prop</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Default</TableHeaderCell>
            <TableHeaderCell>What it does</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {component.props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell className="align-top whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <Code>{prop.name}</Code>
                  {prop.required && (
                    <Badge tone="warning" variant="outline">
                      required
                    </Badge>
                  )}
                </span>
              </TableCell>
              <TableCell className="align-top">
                <div className="flex max-w-xs flex-wrap gap-1">
                  {prop.values ? prop.values.map((value) => <Code key={value}>{`'${value}'`}</Code>) : <Code>{prop.type}</Code>}
                </div>
              </TableCell>
              <TableCell className="align-top">{prop.default !== undefined ? <Code>{prop.default}</Code> : <span className="text-muted-foreground">–</span>}</TableCell>
              <TableCell className="min-w-56 align-top text-muted-foreground">{prop.description ?? ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {component.inherits && <InheritedLine inherits={component.inherits} />}
    </div>
  )
}

/** The props of a family's parts: its main part's in the open, the others' each folded under its name. */
export function PropsTables({ names }: { names: string[] }) {
  const [main, ...parts] = names.filter((name) => COMPONENT_PROPS[name])
  if (!main) return <EmptyText>No component of its own: its props are those of what it is used with.</EmptyText>
  return (
    <div className="space-y-4">
      {parts.length > 0 && <h3 className="text-sm font-medium">{main}</h3>}
      <PropsTable name={main} component={COMPONENT_PROPS[main]} />
      {parts.map((name) => (
        <div key={name} id={`props-${name}`}>
          <Disclosure variant="boxed" summary={<span className="font-medium">{name}</span>}>
            <PropsTable name={name} component={COMPONENT_PROPS[name]} />
          </Disclosure>
        </div>
      ))}
    </div>
  )
}
