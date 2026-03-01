// export type NotifyType =
//   | 'invite_project_member'
//   | 'invite_accepted'
//   | 'invite_rejected'
//   | 'project_join_request'
//   | 'request_approved'
//   | 'request_rejected'
//   | 'project_update'
//   | 'version_published'
//   | 'comment_received'
//   // 收到关注
//   | 'followed_user' // 用户被关注
//   | 'followed_project' // 项目被关注
//   // 好友请求
//   | 'friend_request' // 收到好友请求
// 提供给 switch-case 使用, 不是 schema
export const notifyType = {
  invite_project_member: "invite_project_member",
  invite_accepted: "invite_accepted",
  invite_rejected: "invite_rejected",
  project_join_request: "project_join_request",
  request_approved: "request_approved",
  request_rejected: "request_rejected",
  project_update: "project_update",
  version_published: "version_published",
  comment_received: "comment_received",
  followed_user: "followed_user",
  followed_project: "followed_project",
  friend_request: "friend_request",
} as const;
// type -> content
// 1. 集中定义所有 content 结构（易扩展：加新类型只需加属性）
export interface NotifyContent {
  default: Record<string, never>;
  friend_request: {
    targetId: string;
    friendTableId: string;
    username: string;
    image?: string | null;
    msg: string;
  };
  invite_join_project: {
    projectId: string;
    projectSlug: string;
    projectIcon: string | null;
    // role: "member" | "admin";
    // msg: string; // 邀请你加入"
  };
  invite_accepted: {
    projectId: string;
    inviteId: string;
  };
  invite_rejected: {
    projectId: string;
    inviteId: string;
    reason?: string;
  };

  // 示例：加一个新类型
  comment_received: {
    projectId: string;
    versionId: string;
    commentId: string;
    body: string;
  };
}

// 2. 从 NotifyContent 的键自动生成 NotifyType（零维护！）
export type NotifyType = keyof NotifyContent;
// 3. 完整的 payload 类型（discriminated union：type 决定 content 形状）
export type NotifyPayload<T extends NotifyType = NotifyType> = {
  type: T;
  senderId: string;
  content: NotifyContent[T]; // 根据 T 精确约束！
};

// 4. build 函数：用泛型重载，签名不变，但类型安全
export const buildNotifyInsert = <T extends NotifyType>(
  type: T,
  senderId: string,
  content: NotifyContent[T], // 自动匹配：e.g., type='friend_request' 时 content 必须有 targetId 等
): NotifyPayload<T> => {
  return {
    type,
    senderId,
    content,
  };
};

export type ActionStatus = "pending" | "accepted" | "rejected" | "ignored";
export const notifyReceiverFields = {
  id: true,
  isRead: true,
  readAt: true,
  actionStatus: true,
  actionAt: true,
} as const;
