// 公开项目 不检查 部分读取权限

export const projectMemberPermissionsKV = {
  "project:admin": "管理员权限", // 管理员权限包含所有权限
  "project:update": "编辑项目",
  "project:delete": "删除项目", // delete, 转让, visibility, slug
  "version:create": "创建版本", // Maintain
  "version:update": "编辑版本",
  "version:delete": "删除版本",
  "member:create": "邀请成员", // 添加/删除团队成员 (Owner / Team Maintainer)
  "member:update": "设置成员权限", // 设置成员权限 (Owner / Team Maintainer)
  "analysis:read": "查看分析",
  "revenue:read": "查看收入",
} as const

export const projectMemberPermissions = [
  "project:update",
  "project:admin",
  "project:delete",
  "version:create",
  "version:update",
  "version:delete",
  "member:create",
  "member:update",
  "analysis:read",
  "revenue:read",
] as const

export type ProjectMemberPermission = (typeof projectMemberPermissions)[number]

// ✅ 生成选项列表 用于 UI
export const projectMemberPermissionsOptions = Object.entries(
  projectMemberPermissionsKV,
).map(([key, label]) => ({
  key: key as ProjectMemberPermission,
  label,
}))
