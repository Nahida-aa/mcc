import { cn } from '@/lib/utils'
import { UploadIcon } from 'lucide-react'
import { useState } from 'react'

export const XFileInput = ({
  name,
  value = [],
  onChange,
  multiple = true,
  accept = 'image/*',
  disabled = false,
}: {
  name?: string
  value?: File[]
  onChange?: (files: File[]) => void
  multiple?: boolean
  accept?: string
  disabled?: boolean
}) => {
  const [isDragging, setDragging] = useState(false)
  const handleChange = (incoming: File[]) => {
    const updated = multiple ? [...value, ...incoming] : incoming
    onChange?.(updated)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (!disabled) handleChange(Array.from(e.dataTransfer.files))
  }
  return (
    <div className="group bg-input relative rounded-lg transition-all h-45 flex items-center justify-center">
      <input
        type="file"
        className="opacity-0 absolute inset-0 size-full   cursor-pointer"
        name={name}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={e => {
          handleChange(Array.from(e.target.files || []))
        }}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
      />
      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
        <UploadIcon
          className={cn(
            'w-6 h-6 text-muted-foreground transition group-hover:text-accent-foreground',
            isDragging && 'text-primary w-8 h-8',
          )}
        />
        <p
          className={cn(
            'text-sm text-muted-foreground group-hover:text-accent-foreground',
            isDragging && 'text-primary',
          )}
        >
          上传文件
        </p>
      </div>
    </div>
  )
}
