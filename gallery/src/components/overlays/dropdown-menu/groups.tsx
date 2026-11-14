import { Button, DropdownMenu, useToast } from 'ioiti-ui'
import { ChevronDown, FileText, Mail, Printer, Send, Truck, Undo2 } from 'lucide-react'

export default function DropdownMenuGroups() {
  const toast = useToast()
  return (
    <DropdownMenu
      label="Send order IT-1042"
      trigger={
        <Button size="sm" rightIcon={<ChevronDown />}>
          Send
        </Button>
      }
      items={[
        {
          type: 'group',
          label: 'To the customer',
          items: [
            { label: 'The invoice by email', icon: <Mail />, description: 'To billing@acme.example', onSelect: () => toast({ title: 'Invoice sent' }) },
            { label: 'A payment reminder', icon: <Send />, description: 'Only once the invoice is due', disabled: true },
          ],
        },
        {
          type: 'group',
          label: 'To the warehouse',
          items: [
            { label: 'The packing slip', icon: <FileText />, onSelect: () => toast({ title: 'Packing slip sent' }) },
            { label: 'Print the labels', icon: <Printer />, shortcut: 'mod+p', onSelect: () => toast({ title: 'Labels printed' }) },
            { label: 'Book a carrier', icon: <Truck />, description: 'Collected tomorrow morning', onSelect: () => toast({ title: 'Carrier booked' }) },
          ],
        },
        { type: 'separator' },
        { label: 'Take the order back', icon: <Undo2 />, tone: 'danger', onSelect: () => toast({ title: 'Order taken back' }) },
      ]}
    />
  )
}
