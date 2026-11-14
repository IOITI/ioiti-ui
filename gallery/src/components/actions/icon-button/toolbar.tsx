import { IconButton } from 'ioiti-ui'
import { Archive, Copy, Download, Share2, Star } from 'lucide-react'

export default function IconButtonToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <IconButton label="Copy the link" icon={<Copy />} />
      <IconButton label="Share" icon={<Share2 />} />
      <IconButton label="Download" icon={<Download />} />
      <IconButton label="Add to favourites" icon={<Star />} />
      <IconButton label="Archive" icon={<Archive />} hint="Archive the project (it stays readable)" />
    </div>
  )
}
