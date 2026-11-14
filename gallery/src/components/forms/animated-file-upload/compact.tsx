import { AnimatedFileUpload } from 'ioiti-ui'

export default function AnimatedFileUploadCompact() {
  // Not in a Field: a label around the zone would open the file chooser a second time.
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-text-primary">Proof of delivery</span>
        <AnimatedFileUpload
          variant="compact"
          multiple={false}
          accept="image/*,application/pdf"
          maxSize={10 * 1024 * 1024}
          label="Proof of delivery"
          dropTitle="Drop a photo or a scan"
          dropSubtitle="or choose one"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-text-primary">Customs documents</span>
        <AnimatedFileUpload variant="compact" disabled label="Customs documents" dropTitle="Drop files" dropSubtitle="once a country outside the EU is chosen" />
      </div>
    </div>
  )
}
