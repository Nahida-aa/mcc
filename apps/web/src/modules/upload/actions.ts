'use server'

import { genSignedUploadUrl } from './s3-storage'
import type { GenSignedUrlJson, InsertFile } from './types'
import { sanitizeFilename } from './utils'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/func/auth'
import { file } from './schema/file'

export const _insertFile = async (data: InsertFile[]) => {
  await db.insert(file).values(data)
}

export const _getSignedUrls = async (authId: string, data: GenSignedUrlJson) => {
  const { files, group = 'other' } = data
  const basePath = `user/${authId}/${group}`

  const signedUrls = await Promise.all(
    files.map(async file => {
      // const id = crypto.randomUUID();
      const id = nanoid()
      const name = sanitizeFilename(file.name)
      const storageKey = `${basePath}/${id}/${name}`
      const url = await genSignedUploadUrl(storageKey, file.type, file.size)
      return {
        id,
        name: file.name,
        storageKey,
        url,
        type: file.type,
        size: file.size,
        uploaderId: authId,
        group,
      }
    }),
  )
  await _insertFile(signedUrls)
  return signedUrls
}

export const getSignedUrls = withAuth(_getSignedUrls)
