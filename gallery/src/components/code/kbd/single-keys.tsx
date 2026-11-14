import { Kbd } from 'ioiti-ui'

export default function KbdSingleKeys() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        Close <Kbd>Esc</Kbd>
      </span>
      <span className="inline-flex items-center gap-2">
        Open <Kbd keys="enter" />
      </span>
      <span className="inline-flex items-center gap-2">
        Next field <Kbd keys="tab" />
      </span>
      <span className="inline-flex items-center gap-2">
        Move <Kbd keys="up" /> <Kbd keys="down" />
      </span>
      <span className="inline-flex items-center gap-2">
        Every shortcut <Kbd keys="?" />
      </span>
    </div>
  )
}
