import {
  environment,
  projectStatuses,
  projectType,
  queryStatus,
  sorts,
  type ProjectType,
} from '@/modules/project/schema/constants'
import z from 'zod'

type Rule<T> = { condition: string[]; value: T }
const typeRules: Rule<ProjectType>[] = [
  {
    condition: ['mod', '模组', 'module'],
    value: 'mod',
  },
  {
    condition: [
      'resource_pack',
      '资源包',
      'texture',
      'texturepack',
      'texture pack',
      '材质包',
      '材质',
      'texture resource',
      'resource',
    ],
    value: 'resourcepack',
  },
  {
    condition: ['data_pack', '数据包', 'data', 'pack', 'datapack', 'data pack', '行为包'],
    value: 'datapack',
  },
  {
    condition: ['shader', '光影', '着色器', 'effect'],
    value: 'shader',
  },
] as const
const openSourceRules = [
  {
    condition: ['开源', '免费', 'open', 'source', 'opensource', 'free'],
    value: true,
  },
] as const
// 解析函数
export function autoFilterArray<T extends Array<any>>(
  q: string,
  rules: Rule<T>[],
): T | undefined {
  const ret = [] as any[] as T
  rules.forEach(rule => {
    if (rule.condition.some(kw => q.includes(kw.toLowerCase()))) {
      if (Array.isArray(rule.value) && rule.value.length > 0) {
        ret.push(...rule.value)
      }
    }
  })
  return ret
}
export function autoFilter<T>(q: string, rules: Rule<T>[]): T | undefined {
  for (const rule of rules) {
    if (rule.condition.some(kw => q.includes(kw.toLowerCase()))) {
      return rule.value
    }
  }
}

export const searchParamsToArrayZ = z
  .union([z.string().optional(), z.array(z.string()).optional(), z.undefined()])
  .transform(val => {
    // console.log("searchParamsToArrayZ:", val)
    if (val === undefined || val === '' || val === 'all' || val.includes('all')) return [] // 默认空数组
    return Array.isArray(val) ? val : [val] // string → [string]
  })
export const listProjectSearchParamsParseZ = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  s: z.enum(sorts).optional(),
  type: z.enum(projectType).optional(),
  v: searchParamsToArrayZ.pipe(z.string().array()),
  tags: searchParamsToArrayZ.pipe(z.string().array()),
  e: searchParamsToArrayZ.pipe(z.string().array()),
  openSource: z.coerce.boolean().optional(),
})
export type ListProjectSearchParamsIn = z.input<typeof listProjectSearchParamsParseZ>
export type ListProjectSearchParams = z.infer<typeof listProjectSearchParamsParseZ>
// 关键字（query） + 过滤字段（filters）
export const listProjectQueryZ = z
  .object({
    q: z.string().optional(), // 关键字(query)
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    offset: z.coerce.number().int().min(0).default(0).optional(),
    s: z.enum(sorts).default('relevance').optional(),
    type: z.enum(projectType).optional(),
    v: z.string().array().optional(),
    tags: z.string().array().optional(),
    e: z.enum(environment).array().optional(),
    openSource: z.boolean().optional(),
    status: z
      .enum(queryStatus)
      .array()
      .transform(arr =>
        arr.filter(v => queryStatus.includes(v as (typeof queryStatus)[number])),
      )
      .optional()
      .default(['published']),
  })
  .transform(input => {
    if (!input.q?.trim()) return input
    const qLower = input.q.toLowerCase()
    return {
      ...input,
      type: input.type || autoFilter(qLower, typeRules),
    }
  })
export type ListProjectQueryIn = z.input<typeof listProjectQueryZ>
export type ListProjectQueryOut = z.output<typeof listProjectQueryZ>

export const listUserProjectSearchParamsParseZ = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  status: z.enum(projectStatuses).optional(),
  s: z.enum(sorts).optional(),
  type: z.enum(projectType).optional(),
  v: searchParamsToArrayZ.pipe(z.string().array()),
  tags: searchParamsToArrayZ.pipe(z.string().array()),
  e: searchParamsToArrayZ.pipe(z.string().array()),
  openSource: z.coerce.boolean().optional(),
})
export const listUserSelfProjectQuery = z.object({
  offset: z.coerce.number().int().min(0).default(0).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
  type: z
    .enum(projectType)
    .optional(),
  status: z
    // .enum(["draft", "processing", "rejected", "approved", "archived", "private"])
    .enum(projectStatuses)
    .optional(),
  q: z.string().optional(),
})
export type ListUserSelfProjectQuery = z.infer<typeof listUserSelfProjectQuery>
