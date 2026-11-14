import { AnimatedFileUpload } from 'ioiti-ui'
import type { UploadFileItem } from 'ioiti-ui'
import { useState } from 'react'

const MB = 1024 * 1024

// A file refused for its size, as the zone lists it.
const REFUSED: UploadFileItem[] = [
  {
    id: 'scan',
    name: 'signed-contract-scan.pdf',
    size: 7.4 * MB,
    type: 'application/pdf',
    progress: 0,
    status: 'error',
    errorMessage: 'File exceeds maximum allowed size (2 MB)',
  },
]

export default function AnimatedFileUploadLimits() {
  const [chosen, setChosen] = useState<string[]>([])
  return (
    <div className="flex w-full flex-col gap-3">
      <AnimatedFileUpload
        accept={['.pdf', '.csv']}
        maxSize={2 * MB}
        maxFiles={3}
        initialFiles={REFUSED}
        onFilesSelected={(files) => setChosen(files.map((file) => file.name))}
        label="Supporting documents"
        dropTitle="Drop up to 3 documents"
        dropSubtitle="PDF or CSV files"
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {chosen.length ? `Last chosen: ${chosen.join(', ')}.` : 'Nothing chosen yet.'}
      </p>
    </div>
  )
}
