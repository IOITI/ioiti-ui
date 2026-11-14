import { Button, Panel, TextLink } from 'ioiti-ui'

export default function PanelParts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel title="Latest orders" description="The five sent last." action={<Button size="sm" variant="outline">View all</Button>}>
        <p className="text-sm text-muted-foreground">A panel with a title, a description and an action.</p>
      </Panel>
      <Panel title="Delivery" action={<TextLink to="/components/layout" variant="quiet">All of the layout</TextLink>}>
        <p className="text-sm text-muted-foreground">A title alone, its way further a quiet link.</p>
      </Panel>
      <Panel className="md:col-span-2">
        <p className="text-sm text-muted-foreground">
          No title at all: a block of the page whose content says what it is, as a figure or a chart that names itself.
        </p>
      </Panel>
    </div>
  )
}
