import manifestData from '@/data/minecraft-manifest.json' // 静态导入，构建时打包
import type { McVersion } from '@/modules/minecraft/types'

export const getMcVersions = (filter: 'release' | 'all' = 'release'): McVersion[] =>
  manifestData.versions.filter(v => v.type === 'release' || filter === 'all')
// 将 非 release 视为 snapshot
export const mcVersionGroups = (
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
