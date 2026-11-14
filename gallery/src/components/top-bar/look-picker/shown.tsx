import { ACCENT_LABEL, Button, DescriptionList, LookPicker, MATERIAL_LABEL, TextLink, useTheme } from 'ioiti-ui'

export default function LookPickerShown() {
  // What it sets, held by IoitiProvider: the accent and the material shown.
  const { accent, material } = useTheme()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <LookPicker />
        <Button size="sm">Save</Button>
        <TextLink to="/foundations/themes" className="text-sm">
          The looks, side by side
        </TextLink>
      </div>
      <DescriptionList
        className="max-w-sm"
        compressed
        items={[
          { term: 'Accent', details: ACCENT_LABEL[accent] },
          { term: 'Material', details: MATERIAL_LABEL[material] },
        ]}
      />
    </div>
  )
}
