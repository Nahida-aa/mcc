// import releaseVersions from '@/constants/releaseVersions.json'
import JSZip from 'jszip' // bun add jszip js-yaml toml semver 
import yaml from 'js-yaml' // bun add -D @types/js-yaml @types/semver
import toml from 'toml'
import { satisfies } from 'semver' // 使用 semver.satisfies 函数检查版本号
import type { McLoader } from '@/modules/project/schema/constants'

const versionType = (version_number?: string): VersionType => {
  if (!version_number) return 'release'
  if (version_number.includes('alpha')) {
    return 'alpha'
  } else if (
    version_number.includes('beta') ||
    version_number.match(/[^A-z](rc)[^A-z]/) || // includes `rc`
    version_number.match(/[^A-z](pre)[^A-z]/) // includes `pre`
  ) {
    return 'beta'
  } else {
    return 'release'
  }
}

/**
 * 从文件名推断版本号的通用函数
 * 用于在解析配置文件失败时提供保障
 */
export const inferVersionFromFilename = (
  filename: string,
  releaseVersions: string[],
): {
  versionNumber: string
  versionType: VersionType
  loaders: McLoader[]
  gameVersions: string[]
} => {
  // 移除文件扩展名
  const nameWithoutExt = filename.replace(/\.(jar|zip|mcpack|mcaddon)$/i, '')

  // 版本号匹配模式（按优先级排序）
  const versionPatterns = [
    // 标准语义化版本 (1.2.3, 2.0.0-beta.1)
    /(\d+\.\d+\.\d+(?:-(?:alpha|beta|rc|pre)(?:\.\d+)?)?)/i,
    // 两位版本号 (1.2, 2.0)
    /(\d+\.\d+(?:-(?:alpha|beta|rc|pre)(?:\.\d+)?)?)/i,
    // 单位版本号 (1, 2)
    /(\d+(?:-(?:alpha|beta|rc|pre)(?:\.\d+)?)?)/i,
    // 带v前缀的版本 (v1.2.3, v2.0)
    /v(\d+(?:\.\d+)*(?:-(?:alpha|beta|rc|pre)(?:\.\d+)?)?)/i,
    // 日期版本 (20231215, 2023-12-15)
    /(\d{4}-?\d{2}-?\d{2})/,
    // 快照版本 (23w45a, 24w12b)
    /(\d{2}w\d{2}[a-z])/i,
  ]

  // Loader 推断模式
  const loaderPatterns = [
    { pattern: /fabric/i, loader: 'fabric' },
    { pattern: /forge/i, loader: 'forge' },
    { pattern: /neoforge/i, loader: 'neoforge' },
    { pattern: /quilt/i, loader: 'quilt' },
    { pattern: /paper/i, loader: 'paper' },
    { pattern: /spigot/i, loader: 'spigot' },
    { pattern: /bukkit/i, loader: 'bukkit' },
    { pattern: /velocity/i, loader: 'velocity' },
    { pattern: /bungeecord|bungee/i, loader: 'bungeecord' },
  ] as const

  // Minecraft 版本推断模式
  const mcVersionPatterns = [
    // 标准MC版本 (1.20.1, 1.19.4)
    /(1\.\d+(?:\.\d+)?)/g,
    // 快照版本 (23w45a)
    /(\d{2}w\d{2}[a-z])/gi,
  ]

  let detectedVersion: string = ''
  let detectedVersionType: VersionType | undefined
  const loaders: McLoader[] = []
  const gameVersions: string[] = []
  // 推断版本号
  for (const pattern of versionPatterns) {
    const match = nameWithoutExt.match(pattern)
    if (match) {
      detectedVersion = match[1]
      detectedVersionType = versionType(detectedVersion)
      break
    }
  }

  // 推断 Loaders
  for (const { pattern, loader } of loaderPatterns) {
    if (pattern.test(nameWithoutExt)) {
      loaders.push(loader)
    }
  }

  // 推断 Minecraft 版本
  const mcMatches = nameWithoutExt.matchAll(mcVersionPatterns[0])
  for (const match of mcMatches) {
    const mcVersion = match[1]
    if (releaseVersions.includes(mcVersion)) {
      gameVersions.push(mcVersion)
    }
  }

  // 推断快照版本
  const snapshotMatches = nameWithoutExt.matchAll(mcVersionPatterns[1])
  for (const match of snapshotMatches) {
    const snapshot = match[1]
    if (releaseVersions.includes(snapshot)) {
      gameVersions.push(snapshot)
    }
  }

  // 去重游戏版本
  const uniqueGameVersions = [...new Set(gameVersions)]

  return {
    versionNumber: detectedVersion,
    versionType: detectedVersionType || 'release',
    loaders,
    gameVersions: uniqueGameVersions,
  }
}

type Dependency = {
  modId: string
  versionRange: string
}
type GetGameVersionsPrams = {
  rangeStr: string
  gameVersions: string[]
}
const getGameVersionsMatchingMavenRange = ({
  rangeStr,
  gameVersions,
}: GetGameVersionsPrams) => {
  if (!rangeStr) {
    return []
  }
  const ranges: string[] = []

  while (rangeStr.startsWith('[') || rangeStr.startsWith('(')) {
    let index = rangeStr.indexOf(')')
    const index2 = rangeStr.indexOf(']')
    if (index === -1 || (index2 !== -1 && index2 < index)) {
      index = index2
    }
    if (index === -1) break
    ranges.push(rangeStr.substring(0, index + 1))
    rangeStr = rangeStr.substring(index + 1).trim()
    if (rangeStr.startsWith(',')) {
      rangeStr = rangeStr.substring(1).trim()
    }
  }

  if (rangeStr) {
    ranges.push(rangeStr)
  }

  const LESS_THAN_EQUAL = /^\(,(.*)]$/
  const LESS_THAN = /^\(,(.*)\)$/
  const EQUAL = /^\[(.*)]$/
  const GREATER_THAN_EQUAL = /^\[(.*),\)$/
  const GREATER_THAN = /^\((.*),\)$/
  const BETWEEN = /^\((.*),(.*)\)$/
  const BETWEEN_EQUAL = /^\[(.*),(.*)]$/
  const BETWEEN_LESS_THAN_EQUAL = /^\((.*),(.*)]$/
  const BETWEEN_GREATER_THAN_EQUAL = /^\[(.*),(.*)\)$/

  const semverRanges: string[] = []

  for (const range of ranges) {
    let result: RegExpMatchArray | null

    result = range.match(LESS_THAN_EQUAL)
    if (result) {
      semverRanges.push(`<=${result[1]}`)
      continue
    }

    result = range.match(LESS_THAN)
    if (result) {
      semverRanges.push(`<${result[1]}`)
      continue
    }

    result = range.match(EQUAL)
    if (result) {
      semverRanges.push(`${result[1]}`)
      continue
    }

    result = range.match(GREATER_THAN_EQUAL)
    if (result) {
      semverRanges.push(`>=${result[1]}`)
      continue
    }

    result = range.match(GREATER_THAN)
    if (result) {
      semverRanges.push(`>${result[1]}`)
      continue
    }

    result = range.match(BETWEEN)
    if (result) {
      semverRanges.push(`>${result[1]} <${result[2]}`)
      continue
    }

    result = range.match(BETWEEN_EQUAL)
    if (result) {
      semverRanges.push(`>=${result[1]} <=${result[2]}`)
      continue
    }

    result = range.match(BETWEEN_LESS_THAN_EQUAL)
    if (result) {
      semverRanges.push(`>${result[1]} <=${result[2]}`)
      continue
    }

    result = range.match(BETWEEN_GREATER_THAN_EQUAL)
    if (result) {
      semverRanges.push(`>=${result[1]} <${result[2]}`)
      continue
    }
  }
  return getGameVersionsMatchingSemverRange(semverRanges, gameVersions)
}
const getGameVersionsMatchingSemverRange = (
  range: string[],
  gameReleaseVersions: string[],
) => {
  if (!range) return []

  const ranges = Array.isArray(range) ? range : [range]
  return gameReleaseVersions.filter(version => {
    const semverVersion = version.split('.').length === 2 ? `${version}.0` : version // add patch version if missing (e.g. 1.16 -> 1.16.0)
    return ranges.some(range => satisfies(semverVersion, range))
  })
}
type InferVersionInfoParams = {
  file: File
  project: { name: string; type: string }
  releaseVersions: string[]
}
type Metadata = {
  version: string
  quilt_loader: {
    version: string
    depends: { id: string; versions: string[] }[]
  }
  depends: { minecraft: string[] }
  mods: { version: string }[]
  dependencies: { [key: string]: Dependency[] }
  mcversion: string
  'api-version': string // 添加 api-version 属性
}
export const versionTypes = ['release', 'alpha', 'beta'] as const
export type VersionType = 'release' | 'alpha' | 'beta'
type VersionInfo = {
  name: string
  versionNumber: string
  loaders: McLoader[]
  versionType: VersionType // release
  gameVersions: string[]
  isPrimary?: boolean
}

// const getVersionsRange = (versionA:string, versionB:string, versions:string[]) => {
//   const startingIndex = versions.findIndex((x) => x === versionA);
//   const endingIndex = versions.findIndex((x) => x === versionB);

//   if (startingIndex === -1 || endingIndex === -1) throw new Error("Invalid version range: one or both versions not found in the list.");
//   if (startingIndex < endingIndex) throw new Error("Invalid version range: starting version is lower than ending version.");
//   return versions.slice(endingIndex, startingIndex + 1).reverse();
// }
// const zip = await JSZip.loadAsync(file)
const getZipEntries = async (zip: JSZip) =>
  Object.keys(zip.files).map(f => f.toLowerCase())
const hasFile = (entries: string[], name: string) =>
  entries.some(f => f === name || f.endsWith(`/${name}`))
const hasDir = (entries: string[], dir: string) =>
  entries.some(f => f.startsWith(`${dir}/`))
const inferPack = async (zip: JSZip) => {
  const entries = await getZipEntries(zip)
  if (hasDir(entries, 'assets')) {
    return 'resourcepack'
  } else if (hasDir(entries, 'data')) {
    return 'datapack'
  }
}
// const releaseVersions = gameVersions.filter((it) => it.version_type === "release").map((it) => it.id) // Only keep release versions for simplicity: string[]
//
export const inferVersionInfo = async ({
  file,
  project,
  releaseVersions,
}: InferVersionInfoParams): Promise<VersionInfo> => {
  const inferFunctions = {
    // NeoForge
    'META-INF/neoforge.mods.toml': async (fileText: string) => {
      const metadata = toml.parse(fileText) as {
        mods: { version: string }[]
        dependencies: { modId: string; versionRange: string }[]
      }
      if (!metadata.mods || metadata.mods.length === 0) {
        return {
          name: file.name,
          versionNumber: null,
          loaders: [] as McLoader[],
          gameVersions: [],
        }
      }

      const neoForgeDependency = (Object.values(metadata.dependencies) as Dependency[])
        .flat()
        .find(dependency => dependency.modId === 'neoforge')

      if (!neoForgeDependency) {
        return {
          name: metadata.mods[0]?.version
            ? `${project.name} ${metadata.mods[0].version}`
            : file.name,
          versionNumber: metadata.mods[0]?.version,
          versionType: versionType(metadata.mods[0]?.version),
          loaders: [] as McLoader[],
          gameVersions: [],
        }
      }

      // https://docs.neoforged.net/docs/gettingstarted/versioning/#neoforge
      const mcVersionRange = neoForgeDependency.versionRange
        .replace('-beta', '')
        .replace(/(\d+)(?:\.(\d+))?(?:\.(\d+)?)?/g, (_match, major, minor) => {
          return `1.${major}${minor ? '.' + minor : ''}`
        })
      const gameVersions = getGameVersionsMatchingMavenRange({
        rangeStr: mcVersionRange,
        gameVersions: releaseVersions,
      })

      const versionNum = metadata.mods[0].version
      return {
        name: `${project.name} ${versionNum}`,
        versionNumber: versionNum,
        loaders: ['neoforge'] as McLoader[],
        versionType: versionType(versionNum),
        gameVersions: gameVersions,
        isPrimary: true,
      }
    },
    // Forge 1.13+
    'META-INF/mods.toml': async (fileText: string, zip: JSZip) => {
      const metadata = toml.parse(fileText) as {
        mods: { version: string }[]
        dependencies: { modId: string; versionRange: string }[]
      }

      if (metadata.mods && metadata.mods.length > 0) {
        let versionNum = metadata.mods[0].version

        // ${file.jarVersion} -> Implementation-Version from manifest
        const manifestFile = zip.file('META-INF/MANIFEST.MF')
        const jarVersionPlaceholder = '$' + '{file.jarVersion}'
        if (
          metadata.mods[0].version.includes(jarVersionPlaceholder) &&
          manifestFile !== null
        ) {
          const manifestText = await manifestFile.async('text')
          const regex = /Implementation-Version: (.*)$/m
          const match = manifestText.match(regex)
          if (match) {
            versionNum = versionNum.replace(jarVersionPlaceholder, match[1])
          }
        }

        let gameVersions: string[] = []
        const mcDependencies = (Object.values(metadata.dependencies) as Dependency[])
          .flat()
          .filter(dependency => dependency.modId === 'minecraft')

        if (mcDependencies.length > 0) {
          gameVersions = getGameVersionsMatchingMavenRange({
            rangeStr: mcDependencies[0].versionRange,
            gameVersions: releaseVersions,
          })
        }

        return {
          name: `${project.name} ${versionNum}`,
          versionNumber: versionNum,
          versionType: versionType(versionNum),
          loaders: ['forge'] as McLoader[],
          gameVersions: gameVersions,
          isPrimary: true,
        }
      } else {
        return {
          name: file.name,
          versionNumber: null,
          loaders: [] as McLoader[],
          gameVersions: [],
          isPrimary: true,
        }
      }
    },
    // Old Forge
    'mcmod.info': async (fileText: string): Promise<VersionInfo> => {
      const metadata = JSON.parse(fileText)

      return {
        name: metadata.version ? `${project.name} ${metadata.version}` : file.name,
        versionNumber: metadata.version,
        versionType: versionType(metadata.version),
        loaders: ['forge'],
        gameVersions: metadata.mcversion
          ? releaseVersions.filter(version => version.startsWith(metadata.mcversion))
          : [],
        isPrimary: true,
      }
    },
    // Fabric
    'fabric.mod.json': async (fileText: string) => {
      const metadata = JSON.parse(fileText) as {
        version: string
        depends: { minecraft: string[] }
      }
      // biome-ignore lint/suspicious/noTemplateCurlyInString: 例如.jar是源代码时候会有${version}占位符
      const ok = metadata.version !== '${version}'
      console.log('fabric.mod.json:', metadata)
      return {
        name: metadata.version ? `${project.name} ${metadata.version}` : file.name,

        versionNumber: ok ? metadata.version : null,
        loaders: ['fabric'] as McLoader[],
        versionType: metadata.version ? versionType(metadata.version) : undefined,
        gameVersions: metadata.depends
          ? getGameVersionsMatchingSemverRange(
            metadata.depends.minecraft,
            releaseVersions,
          )
          : [],
        isPrimary: ok,
      }
    },
    // Quilt
    'quilt.mod.json': async (fileText: string): Promise<VersionInfo> => {
      const metadata = JSON.parse(fileText) as Metadata

      const minecraftDep = metadata.quilt_loader?.depends?.find(x => x.id === 'minecraft')

      return {
        name: metadata.quilt_loader?.version
          ? `${project.name} ${metadata.quilt_loader.version}`
          : file.name,
        versionNumber: metadata.quilt_loader?.version,
        loaders: ['quilt'],
        versionType: versionType(metadata.quilt_loader?.version),
        gameVersions:
          metadata.quilt_loader?.depends && minecraftDep
            ? getGameVersionsMatchingSemverRange(minecraftDep.versions, releaseVersions)
            : [],
        isPrimary: true,
      }
    },
    // Bukkit + Other Forks
    'plugin.yml': async (fileText: string): Promise<VersionInfo> => {
      const metadata = yaml.load(fileText) as {
        version: string
        'api-version': string
      }

      return {
        name: metadata.version ? `${project.name} ${metadata.version}` : file.name,
        versionNumber: metadata.version,
        versionType: versionType(metadata.version),
        // We don't know which fork of Bukkit users are using
        loaders: [],
        gameVersions: metadata['api-version']
          ? releaseVersions.filter(x => x.startsWith(metadata['api-version']))
          : [],
        isPrimary: true,
      }
    },
    // Paper 1.19.3+
    'paper-plugin.yml': async (fileText: string): Promise<VersionInfo> => {
      const metadata = yaml.load(fileText) as {
        version: string
        'api-version': string
      }

      return {
        name: metadata.version ? `${project.name} ${metadata.version}` : file.name,
        versionNumber: metadata.version,
        versionType: versionType(metadata.version),
        loaders: ['paper'],
        gameVersions: metadata['api-version']
          ? releaseVersions.filter(x => x.startsWith(metadata['api-version']))
          : [],
        isPrimary: true,
      }
    },
    // Bungeecord + Waterfall
    'bungee.yml': async (fileText: string): Promise<VersionInfo> => {
      const metadata = yaml.load(fileText) as { version: string }

      return {
        name: metadata.version ? `${project.name} ${metadata.version}` : file.name,
        versionNumber: metadata.version,
        versionType: versionType(metadata.version),
        loaders: ['bungeecord'],
        gameVersions: [], // Bungeecord 通常不绑定特定 MC 版本
        isPrimary: true,
      }
    },
    // Velocity
    'velocity-plugin.json': async (fileText: string): Promise<VersionInfo> => {
      const metadata = JSON.parse(fileText) as { version: string }

      return {
        name: metadata.version ? `${project.name} ${metadata.version}` : file.name,
        versionNumber: metadata.version,
        versionType: versionType(metadata.version),
        loaders: ['velocity'],
        gameVersions: [], // Velocity 通常不绑定特定 MC 版本
        isPrimary: true,
      }
    },
    // Modpacks // todo: 在选择文件后 就应该能推断出是 modpack , 后续需要去看源码了解 什么时候 ui 知道 是 modpack 的, 是否从这里返回 类型
    'modrinth.index.json': async (fileText: string): Promise<VersionInfo> => {
      const metadata = JSON.parse(fileText) as {
        versionId: string
        dependencies: { [key: string]: string }
      }

      const loaders: McLoader[] = []
      if ('forge' in metadata.dependencies) {
        loaders.push('forge')
      }
      if ('neoforge' in metadata.dependencies) {
        loaders.push('neoforge')
      }
      if ('fabric-loader' in metadata.dependencies) {
        loaders.push('fabric')
      }
      if ('quilt-loader' in metadata.dependencies) {
        loaders.push('quilt')
      }

      return {
        name: metadata.versionId ? `${project.name} ${metadata.versionId}` : file.name,
        versionNumber: metadata.versionId,
        versionType: versionType(metadata.versionId),
        loaders,
        gameVersions: metadata.dependencies?.minecraft
          ? releaseVersions.filter(x => x === metadata.dependencies.minecraft)
          : [],
        isPrimary: true,
      }
    },
    // Resource Packs + Data Packs pack.mcmeta 是 Minecraft（MC）官方规范。它是 Mojang Studios 为 Java 版 Minecraft 设计的标准元数据文件，主要用于资源包（Resource Packs）和数据包（Data Packs），帮助游戏检查包的版本兼容性，避免因格式不匹配导致的崩溃或内容缺失
    // , zip: JSZip
    'pack.mcmeta': async (fileText: string, zip: JSZip) => {
      const metadata = JSON.parse(fileText)

      const getRange = (versionA: string, versionB: string) => {
        const startIndex = releaseVersions.indexOf(versionA)
        const endIndex = releaseVersions.indexOf(versionB)
        if (startIndex === -1 || endIndex === -1)
          throw new Error(
            'Invalid version range: one or both versions not found in the list.',
          )
        if (startIndex < endIndex)
          throw new Error(
            'Invalid version range: starting version is lower than ending version.',
          )
        return releaseVersions.slice(endIndex, startIndex + 1).reverse()
      }

      const loaders: McLoader[] = []
      let newGameVersions: string[] = []

      if (project.type === 'mod') {
        loaders.push('datapack')

        switch (metadata.pack.pack_format) {
          case 4:
            newGameVersions = getRange('1.13', '1.14.4')
            break
          case 5:
            newGameVersions = getRange('1.15', '1.16.1')
            break
          case 6:
            newGameVersions = getRange('1.16.2', '1.16.5')
            break
          case 7:
            newGameVersions = getRange('1.17', '1.17.1')
            break
          case 8:
            newGameVersions = getRange('1.18', '1.18.1')
            break
          case 9:
            newGameVersions.push('1.18.2')
            break
          case 10:
            newGameVersions = getRange('1.19', '1.19.3')
            break
          case 11:
            newGameVersions = getRange('23w03a', '23w05a')
            break
          case 12:
            newGameVersions.push('1.19.4')
            break
          default:
        }
      }

      if (project.type === 'resource_pack') {
        // loaders.push("minecraft")
        loaders.push('resourcepack')
        switch (metadata.pack.pack_format) {
          case 1:
            newGameVersions = getRange('1.6.1', '1.8.9')
            break
          case 2:
            newGameVersions = getRange('1.9', '1.10.2')
            break
          case 3:
            newGameVersions = getRange('1.11', '1.12.2')
            break
          case 4:
            newGameVersions = getRange('1.13', '1.14.4')
            break
          case 5:
            newGameVersions = getRange('1.15', '1.16.1')
            break
          case 6:
            newGameVersions = getRange('1.16.2', '1.16.5')
            break
          case 7:
            newGameVersions = getRange('1.17', '1.17.1')
            break
          case 8:
            newGameVersions = getRange('1.18', '1.18.2')
            break
          case 9:
            newGameVersions = getRange('1.19', '1.19.2')
            break
          case 11:
            newGameVersions = getRange('22w42a', '22w44a')
            break
          case 12:
            newGameVersions.push('1.19.3')
            break
          case 13:
            newGameVersions.push('1.19.4')
            break
          case 14:
            newGameVersions = getRange('23w14a', '23w16a')
            break
          case 15:
            newGameVersions = getRange('1.20', '1.20.1')
            break
          case 16:
            newGameVersions.push('23w31a')
            break
          case 17:
            newGameVersions = getRange('23w32a', '1.20.2-pre1')
            break
          case 18:
            newGameVersions.push('1.20.2')
            break
          case 19:
            newGameVersions.push('23w42a')
            break
          case 20:
            newGameVersions = getRange('23w43a', '23w44a')
            break
          case 21:
            newGameVersions = getRange('23w45a', '23w46a')
            break
          case 22:
            newGameVersions = getRange('1.20.3', '1.20.4')
            break
          case 24:
            newGameVersions = getRange('24w03a', '24w04a')
            break
          case 25:
            newGameVersions = getRange('24w05a', '24w05b')
            break
          case 26:
            newGameVersions = getRange('24w06a', '24w07a')
            break
          case 28:
            newGameVersions = getRange('24w09a', '24w10a')
            break
          case 29:
            newGameVersions.push('24w11a')
            break
          case 30:
            newGameVersions.push('24w12a')
            break
          case 31:
            newGameVersions = getRange('24w13a', '1.20.5-pre3')
            break
          case 32:
            newGameVersions = getRange('1.20.5', '1.20.6')
            break
          case 33:
            newGameVersions = getRange('24w18a', '24w20a')
            break
          case 34:
            newGameVersions = getRange('1.21', '1.21.1')
            break
          case 35:
            newGameVersions.push('24w33a')
            break
          case 36:
            newGameVersions = getRange('24w34a', '24w35a')
            break
          case 37:
            newGameVersions.push('24w36a')
            break
          case 38:
            newGameVersions.push('24w37a')
            break
          case 39:
            newGameVersions = getRange('24w38a', '24w39a')
            break
          case 40:
            newGameVersions.push('24w40a')
            break
          case 41:
            newGameVersions = getRange('1.21.2-pre1', '1.21.2-pre2')
            break
          case 42:
            newGameVersions = getRange('1.21.2', '1.21.3')
            break
          case 43:
            newGameVersions.push('24w44a')
            break
          case 44:
            newGameVersions.push('24w45a')
            break
          case 45:
            newGameVersions.push('24w46a')
            break
          case 46:
            newGameVersions.push('1.21.4')
            break
          default:
        }
      }
      if (loaders.length === 0) {
        const loader = await inferPack(zip)
        if (loader) {
          loaders.push(loader)
        }
      }
      console.log('pack.mcmeta:loaders:', loaders)

      return {
        name: project.name,
        versionNumber: null,
        versionType: undefined,
        loaders,
        gameVersions: newGameVersions,
        isPrimary: true,
      }
    },
  }

  const zip = await JSZip.loadAsync(file)

  // 遍历所有可能的配置文件，找到第一个匹配的
  const findAndInferMeta = async () => {
    for (const fileName in inferFunctions) {
      const zipFile = zip.file(fileName)
      if (!zipFile) {
        continue
      }
      const fileText = await zipFile.async('text')
      const inferFunc = inferFunctions[fileName as keyof typeof inferFunctions]
      const result = await inferFunc(fileText, zip)

      // 统一的保障机制：如果配置文件解析的结果缺少关键信息，使用文件名推断补充
      if (
        !result.versionNumber ||
        result.loaders.length === 0 ||
        result.gameVersions.length === 0
      ) {
        console.log(
          `Configuration file ${fileName} missing info, applying fallback mechanism`,
        )
        const fallbackInfo = inferVersionFromFilename(file.name, releaseVersions)

        return {
          name:
            result.versionNumber || fallbackInfo.versionNumber
              ? `${project.name} ${result.versionNumber || fallbackInfo.versionNumber}`
              : result.name || file.name,
          versionNumber: result.versionNumber || fallbackInfo.versionNumber,
          versionType: result.versionType || fallbackInfo.versionType,
          loaders: result.loaders.length > 0 ? result.loaders : fallbackInfo.loaders,
          gameVersions:
            result.gameVersions.length > 0
              ? result.gameVersions
              : fallbackInfo.gameVersions,
          isPrimary: result.isPrimary,
        }
      } else {
        return result as VersionInfo
      }
    }
    console.log('No configuration file matched')
  }
  console.log('开始匹配配置文件')
  const result = await findAndInferMeta()
  if (result) {
    return result
  }
  console.log('No configuration file matched, falling back to filename inference')

  // 保障机制：从文件名推断版本信息
  const fallbackInfo = inferVersionFromFilename(file.name, releaseVersions)

  return {
    name: fallbackInfo.versionNumber
      ? `${project.name} ${fallbackInfo.versionNumber}`
      : file.name,
    versionNumber: fallbackInfo.versionNumber,
    versionType: fallbackInfo.versionType,
    loaders: fallbackInfo.loaders,
    gameVersions: fallbackInfo.gameVersions,
  }
}
