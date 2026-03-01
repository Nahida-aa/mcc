import z from 'zod'

export const metaZ = z.looseObject({})

export type Meta = z.infer<typeof metaZ>

export const statuses = ['pending', 'success', 'failed'] as const
