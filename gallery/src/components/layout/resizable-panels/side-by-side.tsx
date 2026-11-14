import { CodeBlock, ResizableHandle, ResizablePanel, ResizablePanels } from 'ioiti-ui'

const FILES = ['order.ts', 'customer.ts', 'invoice.ts', 'shipping.ts']

export default function ResizablePanelsSideBySide() {
  return (
    <ResizablePanels stackBelow={640} className="h-72 rounded-xl border border-border">
      <ResizablePanel defaultSize={22} minSize={15} maxSize={40} label="the list">
        <ul className="flex flex-col gap-1 p-3 text-sm">
          {FILES.map((file) => (
            <li key={file} className="rounded-md px-2 py-1 text-text-secondary hover:bg-surface-hover">
              {file}
            </li>
          ))}
        </ul>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={48} minSize={25} label="the editor">
        <CodeBlock
          className="m-3"
          language="ts"
          lineNumbers
          code={`export function total(order: Order) {
  const rate = 1.2
  return Math.round(order.amount * rate)
}`}
        />
      </ResizablePanel>
      <ResizableHandle />
      {/* Enter on the handle beside it folds it away, and back. */}
      <ResizablePanel defaultSize={30} minSize={20} collapsible label="the preview">
        <div className="p-4 text-sm text-muted-foreground">The preview of the order: 1,840.00 € with its tax.</div>
      </ResizablePanel>
    </ResizablePanels>
  )
}
