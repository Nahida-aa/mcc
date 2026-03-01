'use client'

import React, { useRef, useState, type ChangeEventHandler } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircleIcon, UploadIcon, XIcon, FileIcon } from 'lucide-react'

export interface FileInputProps {
  id?: string
  className?: string
  name?: string
  disabled?: boolean
  accept?: string
  multiple?: boolean
  // 是否去重
  dedupe?: boolean
  maxSize?: number
  maxFiles?: number
  value?: File[]
  // onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (files: File[]) => void
  onError?: (error: string) => void
  showPreview?: boolean
  previewSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'minimal'
  dragActiveClassName?: string
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const validateFileType = (file: File, accept?: string): boolean => {
  if (!accept) return true

  const accepted = accept.split(',').map(t => t.trim())

  return accepted.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', ''))
    }
    return file.type === type || file.name.endsWith(type)
  })
}

const validateFiles = ({
  files,
  newFiles,
  dedupe,
  accept,
  maxFiles,
  maxSize,
}: {
  files: File[]
  newFiles: File[]
  dedupe: boolean
  accept?: string
  maxFiles?: number
  maxSize?: number
}) => {
  const valid: File[] = []
  const errors: string[] = []
  // 辅助函数：检查文件是否重复（基于 name 和 size）
  const isDuplicate = (file: File): boolean => {
    return files.some(
      existingFile => existingFile.name === file.name && existingFile.size === file.size,
    )
  }
  for (const file of newFiles) {
    if (maxSize && file.size > maxSize) {
      errors.push(`${file.name} exceeds ${formatFileSize(maxSize)} maximum size`)
      continue
    }

    if (!validateFileType(file, accept)) {
      errors.push(`${file.name} is not an accepted file type (${accept})`)
      continue
    }
    // 去重逻辑：如果启用且文件重复，跳过并添加错误
    if (dedupe && isDuplicate(file)) {
      // errors.push(`${file.name} is a duplicate file`);
      errors.push(`${file.name} 已经存在`)
      continue
    }
    valid.push(file)
  }

  if (maxFiles && files.length + valid.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`)
    return { valid: [], errors }
  }

  return { valid, errors }
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      id,
      className,
      name,
      disabled = false,
      accept,
      multiple = true,
      dedupe = true,
      maxSize,
      maxFiles,
      value = [],
      onChange,
      onError,
      showPreview = true,
      previewSize = 'md',
      variant = 'default',
      dragActiveClassName,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [files, setFiles] = useState<File[]>(value)
    const [isDragActive, setDragActive] = useState(false)
    const [errors, setErrors] = useState<string[]>([])

    const triggerInput = () => !disabled && inputRef.current?.click()

    const handleChange = (incoming: File[]) => {
      const { valid, errors } = validateFiles({
        files,
        newFiles: incoming,
        dedupe,
        accept,
        maxSize,
        maxFiles,
      })

      setErrors(errors)
      if (errors.length) onError?.(errors.join('; '))

      if (valid.length) {
        const updated = multiple ? [...files, ...valid] : valid
        setFiles(updated)
        onChange?.(updated)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      if (!disabled) handleChange(Array.from(e.dataTransfer.files))
    }

    const removeFile = (index: number) => {
      const updated = files.filter((_, i) => i !== index)
      setFiles(updated)
      onChange?.(updated)
    }

    const previewSizeClass = {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-20 h-20',
    }[previewSize]

    const containerStyles = {
      default: 'border-2 border-dashed border-border p-8',
      compact: 'border border-border rounded-lg p-4',
      minimal: 'border-0 bg-secondary/50 p-4',
    }[variant]

    return (
      <div className={cn('w-full', className)}>
        {/* drag-and-drop functionality */}
        <div
          ref={ref}
          role="button" // 加 role，让屏幕阅读器知道这是按钮
          tabIndex={0} // 加 tabIndex，让它可聚焦/Tab 导航
          onDragOver={e => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={triggerInput}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              triggerInput()
            }
          }}
          className={cn(
            'relative rounded-lg transition-all cursor-pointer',
            containerStyles,
            disabled && 'opacity-50 cursor-not-allowed',
            isDragActive &&
              (dragActiveClassName || 'scale-[1.02] border-primary bg-primary/5'),
            !disabled && !isDragActive && 'hover:border-primary/50 hover:bg-secondary/30',
          )}
        >
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            onChange={e => {
              console.log('onChange')
              console.log('rhf.value onChange 前:', value)
              handleChange(Array.from(e.target.files || []))
              e.target.value = ''
              console.log(e.target.files)
              // onChange?.(Array.from(e.target.files || []));
            }}
            className="hidden"
            {...props}
          />
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <UploadIcon
              className={cn(
                'w-6 h-6 text-muted-foreground transition',
                isDragActive && 'text-primary w-8 h-8',
              )}
            />
            <p className={cn('font-semibold text-sm', isDragActive && 'text-primary')}>
              {/* Drag and drop your files here */}
              拖动并放入你的文件到这里
            </p>
            <p className="text-xs text-muted-foreground">
              {/* or click to browse */}
              或者点击
            </p>

            <div className="flex items-center space-x-2">
              {maxSize && (
                <p className="text-xs text-muted-foreground">
                  Max size: {formatFileSize(maxSize)}
                </p>
              )}
              {maxFiles && (
                <p className="text-xs text-muted-foreground">Max files: {maxFiles}</p>
              )}
            </div>
          </div>
        </div>
        {errors.length > 0 && (
          <div className="mt-4 space-y-2">
            {errors.map((err, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <AlertCircleIcon className="w-4 h-4 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">{err}</p>
              </div>
            ))}
          </div>
        )}
        {showPreview && files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </h3>

            <div
              className={cn(
                'space-y-2',
                previewSize === 'lg' &&
                  'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 space-y-0',
              )}
            >
              {files.map((file, index) => {
                const isImage = file.type.startsWith('image/')

                return (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center space-x-4 justify-between p-3 bg-secondary/50 border border-border rounded-lg',
                      previewSize === 'lg' && 'flex-col items-start gap-2',
                    )}
                  >
                    {isImage ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className={cn('rounded object-cover', previewSizeClass)}
                      />
                    ) : (
                      <div
                        className={cn(
                          'rounded bg-primary/10 flex items-center justify-center',
                          previewSizeClass,
                        )}
                      >
                        <FileIcon className="w-6 h-6 text-primary" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                      disabled={disabled}
                      className="ml-2 p-1 hover:bg-destructive/10 rounded transition disabled:opacity-50"
                    >
                      <XIcon className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  },
)

FileInput.displayName = 'FileInput' // 可选：调试用
