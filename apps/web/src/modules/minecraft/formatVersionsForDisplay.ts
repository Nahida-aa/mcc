import type { McVersion } from '@/modules/minecraft/types'

export function formatVersionsForDisplay(
  inputVersions: string[],
  allVersions: McVersion[],
) {
  const allSnapshots = allVersions.filter(version => version.type === 'snapshot')
  const allReleases = allVersions.filter(version => version.type === 'release')
  const allLegacy = allVersions.filter(
    version => version.type !== 'snapshot' && version.type !== 'release',
  )
  // 按照 allVersions 的顺序 排序 输入版本, 即 从 大到小
  {
    const indices = allVersions.reduce(
      (map, gameVersion, index) => {
        map[gameVersion.id] = index
        return map
      },
      {} as Record<string, number>,
    )
    inputVersions.sort((a, b) => indices[a] - indices[b]) // 按照 allVersions 排序 输入版本
  }
  console.log('排序后:', inputVersions)
  // 过滤出输入版本中的 release 版本
  const releaseVersions = inputVersions.filter(projVer =>
    allReleases.some(gameVer => gameVer.id === projVer),
  )
  // 找到 输入版本中 release 版本中的第一个版本的发布时间 (最新发布版本)
  const dateString = allReleases.find(
    version => version.id === releaseVersions[0],
  )?.releaseTime
  // 解析 为 时间戳
  const latestReleaseVersionDate = dateString ? Date.parse(dateString) : 0
  // inputVersions 已排序（最新发布在前），find 按顺序遍历，**返回第一个**匹配的 projVer
  const latestSnapshot = inputVersions.find(projVer =>
    allSnapshots.some(
      gameVer =>
        gameVer.id === projVer &&
        (!latestReleaseVersionDate ||
          latestReleaseVersionDate < Date.parse(gameVer.releaseTime)),
    ),
  )
  // 分组 所有 release 版本（用于范围比较）
  const allReleasesGrouped = groupVersions(
    allReleases.map(release => release.id),
    false,
  )
  // 分组 项目 release 版本
  const projectVersionsGrouped = groupVersions(releaseVersions, true)
  // 将 项目 release 版本转为范围字符串
  const releaseVersionsAsRanges = projectVersionsGrouped.map(({ major, minor }) => {
    if (minor.length === 1) {
      return formatMinecraftMinorVersion(major, minor[0]) // 单 minor：直接格式化
    }

    const range = allReleasesGrouped.find(x => x.major === major) // 找对应 major 的全范围
    // 如果项目 minor 覆盖该 major 的所有 minor，用 "major.x"
    if (range?.minor.every((value, index) => value === minor[index])) {
      return `${major}.x`
    }
    // 否则，用起始–结束范围
    return `${formatMinecraftMinorVersion(major, minor[0])}–${formatMinecraftMinorVersion(major, minor[minor.length - 1])}`
  })
  // 分组 legacy 版本为连续范围
  const legacyVersionsAsRanges = groupConsecutiveIndices(
    inputVersions.filter(projVer => allLegacy.some(gameVer => gameVer.id === projVer)),
    allLegacy,
  )
  // 构建输出数组
  let output = [...legacyVersionsAsRanges]

  // show all snapshots if there's no release versions
  // 如果无 release 版本，优先显示所有 snapshot 范围
  if (releaseVersionsAsRanges.length === 0) {
    const snapshotVersionsAsRanges = groupConsecutiveIndices(
      inputVersions.filter(projVer =>
        allSnapshots.some(gameVer => gameVer.id === projVer),
      ),
      allSnapshots,
    )
    output = [...snapshotVersionsAsRanges, ...output]
  } else {
    output = [...releaseVersionsAsRanges, ...output] // 有 release 时，放前面
  }
  // 添加最新 snapshot（如果不在输出中）
  if (latestSnapshot && !output.includes(latestSnapshot)) {
    output = [latestSnapshot, ...output]
  }
  return output
}
// // MC 版本分组函数：将版本字符串按 major/minor 分组，返回范围对象数组
// consecutive=true: 严格连续 minor；false: 宽松分组
const mcVersionRegex = /^([0-9]+.[0-9]+)(.[0-9]+)?$/ // // 匹配 "1.20" 或 "1.20.1"
type VersionRange = {
  major: string
  minor: number[]
}
const groupVersions = (versions: string[], consecutive = false) =>
  versions
    .reverse() // 将顺序 变为 从 小 到 大
    .reduce((ranges: VersionRange[], version: string) => {
      const matchesVersion = version.match(mcVersionRegex)

      if (matchesVersion) {
        const majorVersion = matchesVersion[1]
        const minorVersion = matchesVersion[2]
        const minorNumeric = minorVersion ? parseInt(minorVersion.replace('.', '')) : 0

        const prevInRange = ranges.find(
          x =>
            x.major === majorVersion &&
            (!consecutive || x.minor.at(-1) === minorNumeric - 1),
        )
        if (prevInRange) {
          prevInRange.minor.push(minorNumeric)
          return ranges
        }
        ranges.push({ major: majorVersion, minor: [minorNumeric] })
        return ranges
      }

      return ranges
    }, [])
    .reverse()
function groupConsecutiveIndices(versions: string[], referenceList: McVersion[]) {
  if (!versions || versions.length === 0) {
    return []
  }

  const referenceMap = new Map()
  referenceList.forEach((item, index) => {
    referenceMap.set(item.id, index)
  })

  const sortedList: string[] = versions
    .slice()
    .sort((a, b) => referenceMap.get(a) - referenceMap.get(b))

  const ranges: string[] = []
  let start = sortedList[0]
  let previous = sortedList[0]

  for (let i = 1; i < sortedList.length; i++) {
    const current = sortedList[i]
    if (referenceMap.get(current) !== referenceMap.get(previous) + 1) {
      ranges.push(validateRange(`${previous}–${start}`))
      start = current
    }
    previous = current
  }

  ranges.push(validateRange(`${previous}–${start}`))

  return ranges
}

function validateRange(range: string): string {
  switch (range) {
    case 'rd-132211–b1.8.1':
      return 'All legacy versions'
    case 'a1.0.4–b1.8.1':
      return 'All alpha and beta versions'
    case 'a1.0.4–a1.2.6':
      return 'All alpha versions'
    case 'b1.0–b1.8.1':
      return 'All beta versions'
    case 'rd-132211–inf20100618':
      return 'All pre-alpha versions'
  }
  const splitRange = range.split('–')
  if (splitRange && splitRange[0] === splitRange[1]) {
    return splitRange[0]
  }
  return range
}
function formatMinecraftMinorVersion(major: string, minor: number): string {
  return minor === 0 ? major : `${major}.${minor}`
}
