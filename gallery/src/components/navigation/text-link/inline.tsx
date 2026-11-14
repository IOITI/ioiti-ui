import { TextLink } from 'ioiti-ui'

export default function TextLinkInline() {
  return (
    <div className="max-w-prose space-y-3 text-sm">
      <p>
        Read <TextLink to="/foundations/usable-by-all">the rules every page follows</TextLink> before writing one: a
        control says what it does, and a colour is never alone.
      </p>
      <p className="text-muted-foreground">
        A list of records is a <TextLink to="/components/tables/data-table">data table</TextLink> once it can be searched;
        a short one is a <TextLink to="/components/tables/table">plain table</TextLink>.
      </p>
    </div>
  )
}
