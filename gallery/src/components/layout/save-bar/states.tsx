import { Button, SaveBar, SegmentedControl } from 'ioiti-ui'
import { useState } from 'react'

type State = 'saving' | 'invalid' | 'more'

export default function SaveBarStates() {
  const [state, setState] = useState<State>('saving')
  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl<State>
        className="self-start"
        label="The bar’s state"
        size="sm"
        value={state}
        onChange={setState}
        options={[
          { value: 'saving', label: 'Saving' },
          { value: 'invalid', label: 'Not valid yet' },
          { value: 'more', label: 'Another action' },
        ]}
      />
      <SaveBar
        open
        message={state === 'invalid' ? '2 unsaved changes' : '3 unsaved changes'}
        saving={state === 'saving'}
        saveDisabled={state === 'invalid'}
        error={state === 'invalid' && 'A delivery window ends before it starts: change it to save.'}
        // Its state is chosen above: here its buttons do nothing.
        onDiscard={() => {}}
        onSave={() => {}}
        saveLabel={state === 'more' ? 'Publish' : 'Save'}
        discardLabel={state === 'more' ? 'Throw away' : 'Discard'}
      >
        {state === 'more' && (
          <Button variant="outline" size="sm">
            Preview
          </Button>
        )}
      </SaveBar>
    </div>
  )
}
