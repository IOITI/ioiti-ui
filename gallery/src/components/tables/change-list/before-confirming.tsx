import { Button, ChangeList, formatMoney, SettleModal, useToast } from 'ioiti-ui'
import { useState } from 'react'

const CHANGES = [
  { label: 'Daily limit', before: formatMoney(500), after: formatMoney(750) },
  { label: 'Free delivery over', before: formatMoney(60), after: formatMoney(45) },
  { label: 'Weekly summary', after: 'Every Monday, 08:00' },
]

export default function ChangeListBeforeConfirming() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [applying, setApplying] = useState(false)
  const apply = () => {
    setApplying(true)
    window.setTimeout(() => {
      setApplying(false)
      setOpen(false)
      toast({ title: '3 settings changed', variant: 'success' })
    }, 700)
  }
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Review the changes
      </Button>
      <SettleModal
        open={open}
        onClose={() => setOpen(false)}
        title="Apply 3 changes"
        description="They apply to every order placed from tomorrow."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" isLoading={applying} loadingText="Applying" onClick={apply}>
              Apply the changes
            </Button>
          </>
        }
      >
        <ChangeList label="Changes to apply" numeric changes={CHANGES} />
      </SettleModal>
    </>
  )
}
