'use client'

import { useState, useCallback } from 'react'
import { getSignedUrls } from './actions'
import { buildFileUrl } from './utils'
import { uploadFileWithProgress } from '@/modules/upload/client'
import type { FileGroup } from '@/modules/upload/schema/constants'
interface PerFileProgress {
  [fileName: string]: { percent: number; loaded: number; total: number }
}

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number // 总进度 (0-100)
  perFileProgress: PerFileProgress // 分文件进度
  urls?: string[] // 成功 URL 数组
  error?: string
}

export const useFileUpload = (group?: FileGroup) => {
  const [status, setStatus] = useState<UploadStatus>({
    status: 'idle',
    progress: 0,
    perFileProgress: {},
  })
  // const [toastId, setToastId] = useState<string | number | null>(null) // 新增：跟踪 toast ID

  const abortUpload = useCallback(() => {
    // 如果需取消，需改你的函数加 AbortController（xhr.abort()）
    setStatus(prev => ({ ...prev, status: 'error', error: 'Upload aborted' }))
  }, [])
  /**
   * @returns 文件下载 URL 数组
   */
  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return

      setStatus(prev => ({ ...prev, status: 'uploading', perFileProgress: {} }))

      const perFileProgress: PerFileProgress = {}
      let totalLoaded = 0
      const totalSize = files.reduce((sum, f) => sum + f.size, 0)

      try {
        // getSignedUrls: 1. get signed url 2. insert db
        const signedUrlsWithMeta = await getSignedUrls({
          files: files.map(f => ({ name: f.name, type: f.type, size: f.size })),
          group,
        })

        const uploadPromises = files.map(async (file, index) => {
          const { url, storageKey } = signedUrlsWithMeta[index]
          if (!url) throw new Error(`No URL for ${file.name}`)

          // 用你的函数 + 自定义 onProgress（更新分文件 + 总进度）
          await uploadFileWithProgress(url, file, (percent, loaded, total) => {
            perFileProgress[file.name] = { percent, loaded, total }
            totalLoaded += loaded // 累加总 loaded
            const overallPercent = Math.round((totalLoaded / totalSize) * 100)
            setStatus(prev => ({
              ...prev,
              progress: overallPercent,
              perFileProgress: { ...perFileProgress },
            }))
          })

          return {
            ...signedUrlsWithMeta[index],
            downloadUrl: buildFileUrl(storageKey),
          }
        })

        const results = await Promise.allSettled(uploadPromises)
        const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value)

        if (successful.length === files.length) {
          setStatus({
            status: 'success',
            progress: 100,
            perFileProgress: {},
            urls: successful.map(f => f.downloadUrl),
          })
          return successful
        } else {
          const failed = results.filter(r => r.status === 'rejected')
          throw new Error(
            `失败文件: ${failed.map(r => (r as PromiseRejectedResult).reason).join(', ')}`,
          )
        }
      } catch (error) {
        const err = error as Error
        setStatus({
          status: 'error',
          progress: 0,
          perFileProgress: {},
          error: err.message,
        })
        console.log('uploadFiles error', err)
        throw err
      }
    },
    [group],
  )

  return { uploadFiles, abortUpload, status } // status 有总 progress + perFileProgress
}
