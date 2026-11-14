import { AttachmentChip, Button } from 'ioiti-ui'
import { FileImage, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

interface Attached {
  id: number
  name: string
  ready: boolean
}

export default function AttachmentChipUploading() {
  const [files, setFiles] = useState<Attached[]>([{ id: 1, name: 'screenshot-1.png', ready: true }])
  const next = useRef(2)
  const attach = () => {
    const id = next.current++
    setFiles((was) => [...was, { id, name: `screenshot-${id}.png`, ready: false }])
    // The upload, done after a moment.
    window.setTimeout(() => setFiles((was) => was.map((file) => (file.id === id ? { ...file, ready: true } : file))), 1500)
  }
  return (
    <div className="space-y-3">
      <Button size="sm" variant="outline" leftIcon={<Upload />} onClick={attach}>
        Attach a screenshot
      </Button>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <AttachmentChip
              key={file.id}
              label={file.name}
              detail={file.ready ? '240 kB' : 'Uploading…'}
              icon={<FileImage />}
              busy={!file.ready}
              onRemove={() => setFiles((was) => was.filter((other) => other.id !== file.id))}
            />
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {files.length === 0 ? 'Nothing attached.' : `${files.filter((file) => file.ready).length} of ${files.length} ready.`}
      </p>
    </div>
  )
}
