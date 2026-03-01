import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import type {
  ActionStatus,
  NotifyContent,
  NotifyType,
} from "@/modules/notify/schema/constants";
import { nanoidWithTimestamps, pgNanoid } from "../../../lib/db/helpers";
import { user } from "../../auth/schema/tables";

// 通知表 - 一条通知可以发给多个用户 notify
export const notify = pgTable(
  "notify",
  {
    ...nanoidWithTimestamps,
    // 通知内容
    type: text("type").$type<NotifyType>().notNull(), // project_member_join_invite, invite_accepted, invite_rejected, project_join_request, request_approved, request_rejected, project_update, version_published, comment_received, etc.

    senderId: text("sender_id").references(() => user.id),
    content: jsonb("content")
      .$type<NotifyContent[NotifyType]>()
      .default({})
      .notNull(), // 通知内容，JSON格式，包含标题、描述等信息
  },
  (table) => [
    index("notify_type_idx").on(table.type),
    index("notify_sender_idx").on(table.senderId),
    index("notify_created_at_idx").on(table.createdAt),
  ],
);
export const notifyRelations = relations(notify, ({ one, many }) => ({
  sender: one(user, {
    fields: [notify.senderId],
    references: [user.id],
  }),
  receiver: many(notifyReceiver),
}));

// 通知接收记录表 - 记录每个用户对通知的阅读状态
export const notifyReceiver = pgTable(
  "notify_receiver",
  {
    id: pgNanoid(),
    notifyId: text("notify_id")
      .notNull()
      .references(() => notify.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // 接收状态
    isRead: boolean("is_read").default(false).notNull(),
    readAt: timestamp("read_at").$onUpdate(() => new Date()), // 最后阅读时间
    actionStatus: text("action_status")
      .$type<ActionStatus>()
      .default("pending")
      .notNull(),
    actionAt: timestamp("action_at"),
  },
  (table) => [
    uniqueIndex("notify_receiver_unique_idx").on(table.notifyId, table.userId),
    index("notify_receiver_user_idx").on(table.userId),
    index("notify_receiver_is_read_idx").on(table.isRead),
  ],
);
export const notifyReceiverRelations = relations(notifyReceiver, ({ one }) => ({
  notify: one(notify, {
    fields: [notifyReceiver.notifyId],
    references: [notify.id],
  }),
}));

// 通知设置表
export const notifySettings = pgTable(
  "notify_settings",
  {
    id: pgNanoid(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // 项目相关通知
    project_invite_received: boolean("project_invite_received")
      .default(true)
      .notNull(), // 收到项目邀请
    project_invite_accepted: boolean("project_invite_accepted")
      .default(true)
      .notNull(), // 项目邀请被接受
    project_invite_rejected: boolean("project_invite_rejected")
      .default(false)
      .notNull(), // 项目邀请被拒绝
    project_request_received: boolean("project_request_received")
      .default(true)
      .notNull(), // 收到项目申请
    project_request_approved: boolean("project_request_approved")
      .default(true)
      .notNull(), // 项目申请被批准
    project_request_rejected: boolean("project_request_rejected")
      .default(false)
      .notNull(), // 项目申请被拒绝
    project_update: boolean("project_update").default(true).notNull(), // 关注的项目更新
    version_published: boolean("version_published").default(true).notNull(), // 关注的项目发布新版本
    project_followed: boolean("project_followed").default(true).notNull(), // 项目被关注
    project_collected: boolean("project_collected").default(true).notNull(), // 项目被收藏

    // 社区相关通知
    community_invite_received: boolean("community_invite_received")
      .default(true)
      .notNull(), // 收到社区邀请
    community_invite_accepted: boolean("community_invite_accepted")
      .default(true)
      .notNull(), // 社区邀请被接受
    community_request_received: boolean("community_request_received")
      .default(true)
      .notNull(), // 收到社区申请
    community_request_approved: boolean("community_request_approved")
      .default(true)
      .notNull(), // 社区申请被批准
    community_member_joined: boolean("community_member_joined")
      .default(true)
      .notNull(), // 有新成员加入社区

    // 互动相关通知
    comment_received: boolean("comment_received").default(true).notNull(), // 收到评论或回复
    comment_liked: boolean("comment_liked").default(false).notNull(), // 评论被点赞
    mention_received: boolean("mention_received").default(true).notNull(), // 被提及

    // 系统通知
    system_announcement: boolean("system_announcement").default(true).notNull(), // 系统公告
    security_alert: boolean("security_alert").default(true).notNull(), // 安全警报

    // 通知渠道设置
    email_enabled: boolean("email_enabled").default(false).notNull(), // 邮件通知
    web_enabled: boolean("web_enabled").default(true).notNull(), // 站内通知
    push_enabled: boolean("push_enabled").default(true).notNull(), // 推送通知
  },
  (table) => [uniqueIndex("notify_settings_user_idx").on(table.user_id)],
);
