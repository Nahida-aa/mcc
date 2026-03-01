export type MinecraftManifest = {
  latest: {
    release: string
    snapshot: string
  }
  versions: McVersionOrigin[]
}

export interface McVersion {
  id: string
  type: string // 'release' | 'snapshot' | 'alpha' | 'beta' | 'other';
  releaseTime: string
  major?: boolean // major: true 表示这是一个大版本（如 1.20、1.21）. Mojang 的 API 不是严格 schema（JSON 灵活），早期版本无 major 键，后期加了（从 1.18+ 流行）.
}

export interface McVersionOrigin {
  id: string
  type: string // 'snapshot' | 'release' | 'old_alpha' | 'old_beta' | 'other';
  url: string
  time: string
  releaseTime: string
  sha1: string
  complianceLevel: number
}

export type McManifest = {
  latest: {
    release: string
    snapshot: string
  }
  versions: McVersion[]
}

// 新增：主要版本列表（基于官方历史，可手动更新）
export const MAJOR_VERSIONS = new Set([
  "1.0",
  "1.1",
  "1.2.1",
  "1.3.1",
  "1.4.2",
  "1.5",
  "1.6.1",
  "1.7.2",
  "1.8",
  "1.9",
  "1.10",
  "1.11",
  "1.12",
  "1.13",
  "1.14",
  "1.15",
  "1.16",
  "1.17",
  "1.18",
  "1.19",
  "1.20",
  "1.21", // 到 1.21，未来更新时添加如 '1.22'
])
