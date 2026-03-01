import z from "zod";

// 加入方法枚举
export const joinMethods = [
  "invite",
  "manual_review",
  "discover",
  "system",
] as const;
export const joinMethod = {
  INVITE: "invite", // 通过邀请加入
  MANUAL_REVIEW: "manual_review", // 通过 人工审核(人工检查\验证) 即 申请 加入
  DISCOVER: "discover", // 用户自己发现, 且 社区没有设置 人工审核
  SYSTEM: "system", // 系统创建（如社区创建者）
} as const;

export type JoinMethod = (typeof joinMethods)[number];
// Zod Schema for join method validation
export const JoinMethodSchema = z.enum([
  'invite',
  'request',
  'auto',
  'direct',
  'import',
  'system',
])

// 加入方法的显示名称
export const JoinMethodNames: Record<JoinMethod, string> = {
  [joinMethod.INVITE]: '邀请加入',
  [joinMethod.MANUAL_REVIEW]: '人工审核',
  [joinMethod.DISCOVER]: '发现',
  [joinMethod.SYSTEM]: '系统创建',
}

// 成员统计按加入方式分组
export interface MemberJoinStats {
  total: number
  byJoinMethod: Record<JoinMethod, number>
  recentJoins: Array<{
    date: string
    count: number
    method: JoinMethod
  }>
}
// 加入审计日志
export interface JoinAuditLog {
  id: string
  communityId: string
  userId: string
  action: 'join' | 'leave' | 'kicked' | 'banned'
  joinMethod?: JoinMethod
  inviterId?: string
  reason?: string
  timestamp: Date
  metadata?: Record<string, any>
}

// 加入方法的权限要求
export const JoinMethodPermissions: Record<
  JoinMethod,
  {
    requiresApproval: boolean
    requiresInviter: boolean
    canBeUsedByPublic: boolean
    description: string
  }
> = {
  [joinMethod.INVITE]: {
    requiresApproval: false,
    requiresInviter: true,
    canBeUsedByPublic: true,
    description: '需要有效的邀请链接或被现有成员邀请',
  },
  [joinMethod.MANUAL_REVIEW]: {
    requiresApproval: true,
    requiresInviter: false,
    canBeUsedByPublic: true,
    description: '需要提交申请并等待管理员审批',
  },
  [joinMethod.DISCOVER]: {
    requiresApproval: false,
    requiresInviter: false,
    canBeUsedByPublic: true,
    description: '用户可以直接加入，无需邀请或人工审批',
  },
  [joinMethod.SYSTEM]: {
    requiresApproval: false,
    requiresInviter: false,
    canBeUsedByPublic: false,
    description: '系统自动创建，如社区初始化',
  },
}

/**
 * 检查加入方法是否需要邀请者
 */
export function requiresInviter(method: JoinMethod): boolean {
  return JoinMethodPermissions[method].requiresInviter
}

/**
 * 检查加入方法是否需要审批
 */
export function requiresApproval(method: JoinMethod): boolean {
  return JoinMethodPermissions[method].requiresApproval
}

/**
 * 检查加入方法是否可以被公众使用
 */
export function canBeUsedByPublic(method: JoinMethod): boolean {
  return JoinMethodPermissions[method].canBeUsedByPublic
}

/**
 * 获取加入方法的显示信息
 */
export function getDisplayInfo(method: JoinMethod) {
  return {
    name: JoinMethodNames[method],
    permissions: JoinMethodPermissions[method],
  }
}

