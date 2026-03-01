import { project } from "@/lib/db/schema"
import { createUpdateSchema } from "drizzle-zod"
import z from "zod/v4"
export type ProjectSelect = typeof project.$inferSelect
export type InsertProject = typeof project.$inferInsert
export const _projectUpdateZ = createUpdateSchema(project)
export const projectCreateZ = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[\w\u4e00-\u9fff-]+$/u, "slug 只能包含字母、数字、中文、连字符和下划线"),
  summary: z.string().min(1).max(500),
  visibility: z.enum(["public", "private", "unlisted"]).default("public"),
})
export type ProjectCreate = z.infer<typeof projectCreateZ>
export const versionTypeOptions = [
  { label: "Release", value: "release" },
  { label: "Beta", value: "beta" },
  { label: "Alpha", value: "alpha" },
] as const

const environment = ["client", "server"]

export const queryStatus = ["published", "community", "preparing"] as const // 查询可用状态
export const modLoaders = [
  "Fabric",
  "Forge",
  "NeoForge",
  "Quilt",
  "Babric",
  "BTA(Babric)",
  "Java_Agent",
  "Legacy_Forge",
  "Risugami's_ModLoader",
  "NilLoader",
  "Ornithe",
  "Rift",
].map(s => s.toLowerCase())
export const shaderLoaders = ["Canvas", "Iris", "OptiFine", "vanilla_Shader"].map(s =>
  s.toLowerCase(),
)
export const pluginLoaders = [
  "Bukkit",
  "Folia",
  "Paper",
  "Purpur",
  "Spigot",
  "Sponge",
].map(s => s.toLowerCase())
// 单选
export const sortOptions = [
  "relevance",
  "download_count",
  "follow_count",
  "published_at",
  "updated_at",
] as const
export const projectType = [
  "mod", // 模组
  "resource_pack", // 资源包,由旧版的材质包(Texture Pack)扩展. 贴图、模型、声音、语言、字体、GUI 等
  "data_pack", // // 数据包,由旧版的行为包(Behavior Pack)扩展. 修改游戏规则、函数、合成、掉落等逻辑
  "shader",
  "world",
  "modpack", // 整合包
  "plugin",
  "server",
  "project",
  "community",
  "user",
  "other",
] as const
export const listProjectQuery = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(5).max(100).default(20).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),

  s: z.enum(sortOptions).default("relevance").optional(),
  type: z.enum(projectType),
  v: z.string().array().optional(),
  loaders: z.string().array().optional(),
  tags: z.string().array().optional(),
  e: z.string().array().optional(),
  openSource: z.boolean().optional(),
  status: z.preprocess(
    val => {
      if (val == null) return undefined
      if (Array.isArray(val)) return val
      if (typeof val === "string")
        return val
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      return undefined
    },
    z
      .enum(queryStatus)
      .array()
      .optional()
      .default(["published"])
      .transform(arr =>
        arr.filter(v => queryStatus.includes(v as (typeof queryStatus)[number])),
      ),
  ),
})
export type ListProjectQuery = z.infer<typeof listProjectQuery>
export type ListProjectPageQuery = Omit<ListProjectQuery, "type">
export type ProjectType = (typeof projectType)[number]
export const projectTypeS = z.object({ type: z.enum(projectType) })

export const projectUpdateZ = _projectUpdateZ.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  publishedAt: true,
  status: true, // 特殊处理
  ownerType: true, // 特殊处理
  ownerId: true, // 特殊处理
  downloads: true,
  likes: true,
  latestVersionId: true,
})
export type ProjectUpdate = z.infer<typeof projectUpdateZ>
