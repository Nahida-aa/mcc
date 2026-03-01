import manifestData from '@/data/minecraft-manifest.json' // 静态导入，构建时打包

// 将 非 release 视为 snapshot
export const mcVersions = (
  filter: 'release' | 'all' = 'release',
): Record<string, string[]> => {
  // 1. Filter versions (保持原序)
  const versions = manifestData.versions.filter(
    v => v.type === 'release' || filter === 'all',
  )

  // 2. 分离 release 和 non-release
  const releaseVersions = versions.filter(v => v.type === 'release')
  const nonReleaseVersions = versions.filter(v => v.type !== 'release')

  // 3. Group releases by major.minor
  const releaseGroups: Record<string, string[]> = {}
  releaseVersions.forEach(v => {
    const majorMinor = v.id.split('.').slice(0, 2).join('.')
    if (!releaseGroups[majorMinor]) releaseGroups[majorMinor] = []
    releaseGroups[majorMinor].push(v.id)
  })

  // 4. Group non-releases by major.minor + '_snapshot'
  const snapshotGroups: Record<string, string[]> = {}
  nonReleaseVersions.forEach(v => {
    const majorMinor = v.id.split('.').slice(0, 2).join('.')
    const snapshotKey = `${majorMinor} snapshot`
    if (!snapshotGroups[snapshotKey]) snapshotGroups[snapshotKey] = []
    snapshotGroups[snapshotKey].push(v.id)
  })

  // 5. 获取所有 unique majors (release keys)
  const allMajors = Object.keys(releaseGroups)

  // 6. 构建最终 Record：按 major 降序，release 先，snapshot 后
  const groups: Record<string, string[]> = {}
  allMajors
    // .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach(major => {
      groups[major] = releaseGroups[major] // release 组

      // 如果有对应 snapshot，插入后
      const snapshotKey = `${major} snapshot`
      if (snapshotGroups[snapshotKey] && snapshotGroups[snapshotKey].length > 0) {
        groups[snapshotKey] = snapshotGroups[snapshotKey]
      }
    })
  // 加 pre-1.0 组（放最后或 1.0 前，根据需要调整位置）
  // 6. pre-1.0 组：直接 slice '1.0' 后（有序利用）
  const oneIndex = versions.findIndex(v => v.id === '1.0')
  if (oneIndex !== -1) {
    const pre10Slice = versions.slice(oneIndex + 1) // 1.0 后所有
    if (pre10Slice.length > 0) {
      groups['1.0 pre'] = pre10Slice.map(v => v.id) // 只取 id
    }
  }
  return groups
}

// import 'dotenv/config'
// import assert from "node:assert";



/**
 * client_server_optional, server_client_optional, client_optional_server_optional 转换为 client_or_server 进行 tag 显示
 */
export const environment = [
  'client',
  'server',
  'client_and_server', // 客户端和服务端 都必须
  'client_server_optional', // 客户端必选，服务端可选
  'server_client_optional', // 服务端必选，客户端可选
  'client_optional_server_optional', // 客户端可选，服务端可选
  'dedicated_server', // 专用服务器
] as const

/**
 * - unlisted: 已批准,不在列表中显示,但可通过URL访问
 * - private: 不需要批准,仅限成员
 */
export const projectVisibility = ['public', 'unlisted', 'private'] as const
export type ProjectVisibility = (typeof projectVisibility)[number]

export const projectType = [
  'mod', // 模组
  'resourcepack', // 资源包,由旧版的材质包(Texture Pack)扩展. 贴图、模型、声音、语言、字体、GUI 等
  'datapack', // // 数据包,由旧版的行为包(Behavior Pack)扩展. 修改游戏规则、函数、合成、掉落等逻辑
  'shader',
  'world',
  'modpack', // 整合包
  'plugin',
  'server',
  'project',
  'community',
  'user',
  'other',
] as const
export type ProjectType = (typeof projectType)[number]

export const modLoaders = [
  'fabric', // Fabric
  'neoforge', // NeoForge
  'forge', // Forge
  'quilt', // Quilt
  'liteloader', // LiteLoader
  'rift', // Rift
  'ornithe', // Ornithe
  'nilloader', // NilLoader
  'legacy_fabric', // Legacy Fabric
  'btababric', // BTA(Babric)
  'babric', // Babric
  'risugami_s_modloader', // Risugami's ModLoader
  'javaagent', // Java Agent 一个 mod加载器类别，指使用Java Agent机制的mod加载器。它允许mod在Minecraft启动的非常早期阶段（甚至在主mod加载器如Fabric/Forge加载前）注入代码，常用于轻量级客户端工具、优化mod或特殊注入（如Weave-Loader、Unsup、Mod Loading Screen等）。它不依赖传统mod框架，适合高级自定义，但使用较少，主要针对开发者或特定场景。
] as const

type ModLoader = (typeof modLoaders)[number]
export const pluginLoaders = [
  'paper', // Paper PaperMC（高性能 Bukkit 分支，优化 TPS/FPS，插件友好）
  'purpur', // Purpur （Paper 增强版，加自定义功能如骑乘控制）
  'spigot', // Spigot （Bukkit 优化版，支持异步插件）。
  'bukkit', // Bukkit 官方基础框架
  'sponge', // Sponge 模块化框架，支持 Forge/Fabric 混合
  'folia', // Folia (Paper 多线程版)，优化大服务器并发
] as const
// 这些是插件平台（plugin platforms），指代理服务器（proxy servers），用于连接多个后端服务器（如大厅 + 生存服），管理跨服传输/认证。它们是“网络层”，不直接跑插件，但支持插件集成（如 BungeeCord 的插件系统）
export const pluginPlatforms = [
  'bungeecord', // BungeeCord 经典代理，支持插件桥接多服
  'velocity', // Velocity 现代代理，高性能，支持现代认证
  'waterfall', // Waterfall (BungeeCord 优化版)，异步传输
  'geyser_extension', // Geyser Extension Bedrock-Java 桥接扩展
] as const
type PluginPlatform = (typeof pluginPlatforms)[number]
export const pluginLoadersAndPlatforms = [...pluginLoaders, ...pluginPlatforms] as const
type PluginLoader = (typeof pluginLoaders)[number]
export const packLoaders = [
  'datapack', // Data Pack
  'resourcepack', // Resource Pack
] as const
type PackLoader = (typeof packLoaders)[number]
export const shaderLoaders = [
  'optifine', // OptiFine
  'iris', // Iris
  'canvas', // Canvas
  'vanilla', // Vanilla Shader
] as const
type ShaderLoader = (typeof shaderLoaders)[number]
export const modpackLoaders = [
  'fabric', // Fabric
  'neoforge', // NeoForge
  'forge', // Forge
  'quilt', // Quilt
] as const
export type McLoader =
  | ModLoader
  | PluginLoader
  | PluginPlatform
  | PackLoader
  | ShaderLoader
export const allLoaders = [
  ...modLoaders,
  ...pluginLoaders,
  ...pluginPlatforms,
  ...packLoaders,
  ...shaderLoaders,
] as const

export const loaderOptions = {
  mod: modLoaders,
  plugin: pluginLoadersAndPlatforms,
  pack: packLoaders,
  shader: shaderLoaders,
}

// 多选 分类
export const modTags = [
  // categories:
  'adventure', // 冒险 mod\modpack
  'cursed', // 不常规 mod\resourcepack\datapack\shader\plugin
  'decoration', // 装饰
  'economy', // 经济 mod\datapack\plugin "trade"（交易）或 "shop"（商店）
  'equipment', // 装备 mod\resourcepack\datapack\plugin
  'food', // 食物
  'game-mechanics', // 游戏机制 mod\datapack\plugin
  'library', // 库 mod\datapack\plugin
  'magic', // 魔法 mod\datapack\modpack\plugin
  'management', // 管理
  'minigame', // 小游戏
  'mobs', // 生物
  'optimization', // 优化 mod\datapack\modpack\plugin
  'social', // 社交
  'storage', // 存储 mod\datapack\plugin
  'technology', // 科技, 技术 mod\datapack\modpack\plugin
  'transportation', // 交通, 运输, 输送, 交通车辆 mod\datapack\plugin
  'utility', // 实用
  'world-gen', // 世界生成
] as const

export const resourcepackTags = [
  // categories: 分类
  'combat', // 战斗  resourcepack\modpack
  'cursed', // 不常规
  'decoration', // 装饰
  'modded', // 模组支持 resourcepack
  'realistic', // 写实 resourcepack\shader
  'simplistic', // 简约 resourcepack
  'themed', // 主题 resourcepack
  'tweaks', // 微调, 调整 resourcepack
  'utility', // 实用
  'vanilla-like', // 类原版 resourcepack\shader
] as const
export const resourcepackFeaturesTags = [
  // features: 特性支持, 功能
  'audio', // 声音 资源包可以定义assets/minecraft/sounds.json以修改原版的声音，也可以在assets/<命名空间>/sounds内修改声音文件
  'blocks', // 方块 assets/<命名空间>/textures 包括 方块、物品、实体、GUI
  'core-shaders', // 指自定义了 Core-Shaders (mc vanilla shaders) 位于assets/minecraft/shaders
  'entities', // 实体
  'environment', // 环境
  'equipment', // 装备 位于assets/<命名空间>/equipment
  'fonts', // 字体 位于assets/<命名空间>/font
  'gui', // GUI
  'items', // 物品
  // "locale", // 本地化
  'language', // 语言
] as const
export const resourcepackResolutionsTags = [
  // resolutions: 分辨率
  '8x-', // 8x 或更低
  '16x', // 16x
  '32x', // 32x
  '64x', // 64x
  '128x', // 128x
  '256x', // 256x
  '512x+', // 512x 或更高
] as const
const datapackTags = [
  // categories: 分类
  'adventure', // 冒险
  'cursed', // 诅咒
  'decoration', // 装饰
  'equipment', // 装备
  'food', // 食物
  'game-mechanics', // 游戏机制
  'library', // 库
  'magic', // 魔法
  'management', // 管理
  'minigame', // 小游戏
  'mobs', // 怪物
  'optimization', // 优化
  'social', // 社交
  'storage', // 存储
  'technology', // 技术
  'transportation', // 运输, 输送, 交通车辆
  'utility', // 实用工具
  'world-gen', // 世界生成
] as const
const shaderTags = [
  // categories: 分类
  'cartoon', // 漫画
  'cursed', // 不常规
  'fantasy', // 奇幻
  'realistic', // 写实
  'semi-realistic', // 半写实
  'vanilla-like', // 类原版
] as const
export const shaderFeaturesTags = [
  // features: 特色, 功能
  'atmosphere', // 天气 大气, 空气, 天气
  'bloom', // 辉光 光泽 光晕
  'colored-lighting', // 彩色光照 shader
  'foliage', // 植物
  'path-tracing', // 路径追踪
  'pbr', // PBR Physically Based Rendering 基于物理渲染 shader
  'reflections', // 反射 shader
  'shadows', // 阴影
] as const
export const shaderPerformanceImpactTags = [
  // performance-impact: 性能影响
  'high', // 高
  'medium', // 中
  'low', // 低
  'potato', // 土豆机
  'screenshot', // 截图模式
] as const
const modpackTags = [
  // categories: 分类
  'adventure', // 冒险
  'challenging', // 挑战
  'combat', // 战斗
  'kitchen-sink', // 厨房水槽, 杂烩, 啥都有 modpack
  'lightweight', // 轻量 modpack
  'magic', // 魔法
  'multiplayer', // 多人 modpack
  'optimization', // 优化
  'quests', // 任务 modpack
  'technology', // 科技
] as const
const pluginTags = [
  // categories: 分类
  'adventure', // 冒险
  'cursed', // 诅咒
  'decoration', // 装饰
  'economy', // 经济
  'equipment', // 装备
  'food', // 食物
  'game-mechanics', // 游戏机制
  'library', // 库
  'magic', // 法术
  'management', // 管理
  'minigame', // 小游戏
  'mobs', // 怪物
  'optimization', // 优化
  'social', // 社交
  'storage', // 存储
  'technology', // 技术
  'transportation', // 运输, 输送, 交通车辆
  'utility', // 实用
  'world-gen', // 世界生成
] as const

export const categoriesTags = [
  ...new Set([
    ...modTags,
    ...resourcepackTags,
    ...datapackTags,
    ...shaderTags,
    ...modpackTags,
    ...pluginTags,
  ]),
]
export const tagsMap = {
  mod: modTags,
  resourcepack: resourcepackTags,
  datapack: datapackTags,
  shader: shaderTags,
  modpack: modpackTags,
  plugin: pluginTags,
}
// 单选
export const sorts = [
  'relevance',
  'downloads',
  'likes',
  'publishedAt',
  'updatedAt',
] as const
export type SortType = (typeof sorts)[number]
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
export type ProjectStatus = (typeof projectStatuses)[number]
export const queryStatus = ['published', 'community', 'preparing'] as const // 查询可用状态

// version
export const versionStatuses = [
  // "uploading",
  'processing',
  'rejected',
  'approved',
  'published',
  'archived',
] as const
export const versionTypes = ['release', 'beta', 'alpha'] as const
export type VersionType = (typeof versionTypes)[number]
export const versionTypeMap = {
  release: 'Release',
  beta: 'Beta',
  alpha: 'Alpha',
}
// versionFile
export const versionFileRoles = [
  'primary', // Primary file  default
  'other', // Supplementary files  default
  'required_rp', // Required RP
  'optional_rp', // Optional RP
  'source', // Source JAR
  'dev', // Dev JAR
  'javadoc', // Javadoc JAR
  'signature',
] as const
