import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  uniqueIndex,
  varchar,
  unique,
} from 'drizzle-orm/pg-core'
import { nanoidWithTimestamps, pgNanoid, textUuidWithTimestamps } from '../helpers'
import { organization, user } from '../../../modules/auth/schema/tables'
import { relations } from 'drizzle-orm'
import { file } from '@/modules/upload/schema/file'
import { versionStatuses, versionTypes } from '@/modules/project/schema/constants'

export type ExternalLinks = {
  source?: string
  issue?: string
  wiki?: string
  discord?: string
}
export type ProjectVisibility =
  | 'public'
  | 'unlisted' // 已批准,不在列表中显示,但可通过URL访问
  | 'private' // 不需要批准,仅限成员
export const projectStatuses = [
  'draft', // 不需要批准,草稿, 仅自己可见
  'community', // 默认
  'processing', // 审核中
  'rejected', // 被驳回
  'preparing', // 已批准,筹备中,可通过参数 status=['preparing'] 搜索
  'published', // 已批准,可搜索
  'archived', // 不需要另外批准,仅允许:published->archived,已归档,可搜索
  'withheld', // 违规, 已扣留, 被隐藏
] as const
// 项目主表
export const project = pgTable(
  'project',
  {
    ...nanoidWithTimestamps,
    status: text('status', { enum: projectStatuses }).default('draft').notNull(),
    visibility: text('visibility').default('public').notNull(),

    slug: varchar('slug', { length: 255 }).notNull().unique(), // URL友好的标识符
    name: varchar('name', { length: 255 }).notNull(),
    summary: varchar('summary', { length: 500 }).notNull(), // 项目简介
    description: text('description'), // 详细描述 (Markdown)

    // 项目类型和分类
    type: text('type').default('project').notNull(), // mod, resource_pack, data_pack, shader, world, modpack, plugin, project, server
    tags: text('tags').array().default([]).notNull(),

    // 游戏版本和环境
    gameVersions: text('game_versions').array().default([]).notNull(),
    loaders: text('loaders').array().default([]).notNull(), // forge, fabric, quilt, neoforge, bukkit, spigot, paper, etc.

    // 环境要求 - 指定项目需要在哪些环境中安装
    // mod: 根据代码判断(让用户自己填) | resource_pack/shader: 客户端 | data_pack: 服务端 | plugin: 通常服务端
    environment: text('environment', {
      enum: ['client', 'server', 'client_optional', 'server_optional'],
    })
      .array()
      .default([])
      .notNull(), // [], ["client"], ["server"], ["client", "server"], ['client_optional', 'server], ['client_optional', 'server_optional'], ['client', 'server_optional']

    // 许可证和法律信息
    isOpenSource: boolean('is_open_source').default(true).notNull(),
    // isOriginal: boolean("is_original").default(true).notNull(), //原创|搬运
    license: text('license'), // 可空，用户可能不指定许可证
    // https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
    // languages: text("languages").array().default([]).notNull(),

    // 所有者信息 (用户或组织)
    ownerType: text('owner_type'), // user, organization
    ownerId: text('owner_id'), // 引用 user.id 或 organization.id

    // 外部链接
    externalLinks: jsonb('external_links').$type<ExternalLinks>().default({}).notNull(), // 外部链接

    // 统计信息
    downloads: integer('downloads').default(0).notNull(),
    likes: integer('likes').default(0).notNull(), // 喜欢, 点赞
    stars: integer('stars').default(0).notNull(), // 收藏
    // viewCount: integer("view_count").default(0).notNull(),

    // 项目图标和图片
    icon: text('icon'),
    cover: text('cover'),
    // gallery: text("gallery").array().default([]).notNull(), // 仅 list 页, 详情页则 需要 name, summary, image, upload_at 字段

    publishedAt: timestamp('published_at', { mode: 'string' }),
    // 最新版本信息
    latestVersionId: text('latest_version_id'),
  },
  table => [
    // 索引优化
    index('project_owner_idx').on(table.ownerType, table.ownerId),
    index('project_type_idx').on(table.type),
    index('project_status_idx').on(table.status),
    index('project_published_at_idx').on(table.publishedAt),
    uniqueIndex('project_slug_idx').on(table.slug),
  ],
)

// 项目版本表
export const version = pgTable(
  'version',
  {
    ...nanoidWithTimestamps, // createdAt // 等同于 published_at
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),

    // 版本信息
    versionNumber: text('version_number').notNull(), // 1.0.0, 1.2.3, 1.0.0-beta.1
    versionType: text('version_type', { enum: versionTypes })
      .default('release')
      .notNull(), // release, alpha, beta
    name: text('name'), // 版本名称
    changelog: text('changelog'), // 更新日志 (Markdown)

    // 兼容性信息 - 从所有文件聚合而来，用于版本列表页显示
    gameVersions: text('game_versions').array().default([]).notNull(),
    loaders: text('loaders').array().default([]).notNull(),

    // 版本状态
    status: text('status', { enum: versionStatuses }).default('processing').notNull(), // processing, rejected, approved, published, archived
    featured: boolean('featured').default(false).notNull(), // 是否为推荐版本

    // 统计信息
    downloads: integer('downloads').default(0).notNull(), // 缓存

    // 发布者信息
    publisherId: text('publisher_id')
      .notNull()
      .references(() => user.id),
  },
  table => [
    index('version_project_idx').on(table.projectId),
    uniqueIndex('version_number_unique_idx').on(table.projectId, table.versionNumber),
  ],
)

// 版本 和 文件 的 中间 表
// 一个版本可以有多个主要文件，例如：
// displayName=${project.slug}_${version.versionNumber}_${loader}_${gameVersion}.${ext}
// mod_25.2.12_Fabric_1.21.8.jar (primary, fabric, 1.20.1-1.20.6)
// mod_forge_1.20.1-1.20.6.jar (primary, forge, 1.20.1-1.20.6)
// mod-sources_fabric_1.20.1-1.20.6 (non-primary)
export const versionFile = pgTable(
  'version_file',
  {
    id: pgNanoid(),
    versionId: text('version_id')
      .notNull()
      .references(() => version.id, { onDelete: 'cascade' }), // cascade: 删除版本时删除所有文件记录
    fileId: text('file_id')
      .references(() => file.id, { onDelete: 'cascade' })
      .notNull(), // cascade: 删除文件时删除所有版本记录
    fileRole: text('file_role').default('primary').notNull(), // primary, non-primary, source, etc.
    // 文件信息
    // name: varchar("name", { length: 1024 }).notNull(),
    // type: varchar("type", { length: 100 }).notNull(), // mime_type
    // size: integer("size").notNull(), // 客户端File对象大小 - 用于预签名URL限制和进度计算
    // // 理论上这两个值应该相同，但在以下情况下可能出现差异：1.网络传输问题：文件损坏或传输不完整;2.客户端篡改：恶意用户可能伪造 expected_size;3.浏览器兼容性：某些老版本浏览器的 File.size 可能不准确;4.多部分上传：分片上传时的边界情况
    // actualSize: integer("actual_Size"), // 文件 actual_Size (字节) - 上传完成后从存储服务获取
    // isPrimary: boolean("is_primary").default(true).notNull(), // 是否为主要文件
    // // 兼容性信息 - 与主要文件直接关联
    // gameVersions: text("game_versions").array().default([]).notNull(),
    // loaders: text("loaders").array().default([]).notNull(),

    // // 上传状态 - 简化为三种状态
    // uploadStatus: varchar("upload_status").default("pending").notNull(), // pending:等待客户端向s3<oss,r2>上传, completed, failed

    // // 文件存储信息
    // storageKey: varchar("storage_key", { length: 1004 }).notNull(), // 存储服务的key projects/{project_id}/versions/{version_id}/mod_fabric_1.20.1-1.20.6.jar

    // // 文件哈希(用于完整性检查) - 上传完成后填入
    // // sha1: varchar('sha1', { length: 40 }),
    // // sha256: varchar('sha256', { length: 64 }),

    // 统计信息
    // downloads: integer("downloads").default(0).notNull(),
  },
  table => [index().on(table.versionId)],
)

// 版本依赖表
export const dependency = pgTable(
  'dependency',
  {
    id: pgNanoid(),
    versionId: text('version_id')
      .notNull()
      .references(() => version.id, { onDelete: 'cascade' }), // 父母版本
    targetProjectId: text('target_project_id').references(() => project.id), // 依赖的目标
    targetVersionId: text('target_version_id').references(() => version.id), // 依赖的目标版本
    // 依赖信息
    requirement: text('requirement'), // 版本要求 SemVer 2.0
    type: text('type').notNull(), // required, optional, incompatible, embedded
  },
  t => [index('dependency_version_idx').on(t.versionId)],
)

// 项目喜欢表 likes
export const projectLike = pgTable(
  'project_like',
  {
    id: pgNanoid(),
    projectId: text('project_id')
      .references(() => project.id, { onDelete: 'cascade' })
      .notNull(),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => [
    uniqueIndex('project_like_project_user_idx').on(table.projectId, table.userId),
  ],
)

// 项目收藏表 stars
export const projectCollection = pgTable(
  'project_collection',
  {
    id: pgNanoid(),
    projectId: text('project_id')
      .references(() => project.id, { onDelete: 'cascade' })
      .notNull(),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),

    // 收藏分类
    collectionName: text('collection_name').default('default').notNull(),
    note: text('note'), // 用户备注
  },
  table => [
    uniqueIndex('project_collection_project_user_idx').on(table.projectId, table.userId),
  ],
)

// 项目评论表： channel.type = 'discussion'

// 项目评分表
// export const projectRating = pgTable(
//   "project_rating",
//   {
//     id: uuid("id").primaryKey().defaultRandom(),
//     project_id: uuid("project_id")
//       .notNull()
//       .references(() => project.id, { onDelete: "cascade" }),
//     user_id: varchar("user_id", { length: 255 })
//       .notNull()
//       .references(() => user.id, { onDelete: "cascade" }),

//     // 评分
//     rating: integer("rating").notNull(), // 1-5 星
//     review: text("review"), // 评价内容

//     createdAt: timestamp("created_at")
//       .$defaultFn(() => new Date())
//       .notNull(),
//     updatedAt: timestamp("updated_at")
//       .$defaultFn(() => new Date())
//       .notNull(),
//   },
//   (table) => [
//     uniqueIndex("project_rating_project_user_idx").on(table.project_id, table.user_id),
//   ],
// );

// // 项目下载统计表
// export const projectDownload = pgTable(
//   "project_download",
//   {
//     id: pgNanoid(),
//     projectId: text("project_id")
//       .references(() => project.id, { onDelete: "cascade" })
//       .notNull(),
//     versionId: text("version_id").references(() => version.id, {
//       onDelete: "cascade",
//     }),
//     file_id: text("file_id").references(() => versionFile.id, {
//       onDelete: "cascade",
//     }),

//     // 下载者信息
//     userId: varchar("user_id", { length: 255 }).references(() => user.id), // 可能是匿名下载
//     ipAddress: varchar("ip_address", { length: 45 }), // IPv6 最长45字符
//     userAgent: text("user_agent"),

//     // 地理位置(可选)
//     country: varchar("country", { length: 50 }),
//     city: varchar("city", { length: 100 }),

//     createdAt: timestamp("created_at")
//       .$defaultFn(() => new Date())
//       .notNull(),
//   },
//   table => [
//     index("project_download_project_idx").on(table.projectId),
//     index("project_download_date_idx").on(table.createdAt),
//   ],
// )

// 项目成员表 (目前不等于社区成员) (协作者) contributor,collaborator, creator
export const projectMember = pgTable(
  'project_member',
  {
    ...nanoidWithTimestamps,
    projectId: text('project_id')
      .references(() => project.id, { onDelete: 'cascade' })
      .notNull(),

    // 成员信息 - 支持用户和组织
    entityType: text('entity_type', {
      enum: ['user', 'organization'],
    }).notNull(), // 'user', 'organization'
    // entityId: text("entity_id").notNull(), // 引用 user.id 或 organization.id, 此常见且仅双态, 不建议 多态'外键'
    userId: text('user_id').references(() => user.id), // 冗余字段, 方便查询
    organizationId: text('organization_id').references(() => organization.id), // 冗余字段, 方便查询

    // 角色权限
    role: text('role').default('member').notNull(), // member, owner, maintainer, contributor, viewer // 可以自定义, 具体权限根据 permissions 决定
    isOwner: boolean('is_owner').default(false).notNull(), // 冗余字段, 也是实际拥有者,
    permissions: text('permissions')
      .array()
      // .$type<ProjectMemberPermissions[]>()
      .default([])
      .notNull(), // upload_version, delete_version, edit_metadata, edit_body, manage_invite, manage_member, delete_project, view_analytics, view_revenue

    // 状态
    status: text('status').default('pending').notNull(), // active, inactive, pending: 邀请中

    // 加入方式/方法
    joinMethod: text('join_method').default('invite').notNull(), // invite, manual_review(先不实现,因为可以通过社区联系到有权限的人,来邀请我加入), system, 不同于社区成员这里没有 discover
    inviterId: text('inviter_id').references(() => user.id), // 邀请者ID（如果通过邀请加入）
  },
  t => [
    // 复合索引确保唯一性
    uniqueIndex('project_member_user_unique_idx').on(
      t.projectId,
      // t.entityType,
      t.userId,

      t.organizationId,
    ),
    // .nullsNotDistinct(), // pgsql15+，drizzle 暂时不支持 uniqueIndex 的 nullsNotDistinct 选项
    // 查询优化索引
    index('project_member_project_idx').on(t.projectId),
  ],
)
