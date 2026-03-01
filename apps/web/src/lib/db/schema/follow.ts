import { pgNanoid } from "@/lib/db/helpers";
import { organization, project, user } from "@/lib/db/schema";
import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const userFollow = pgTable(
  "user_follow",
  {
    id: pgNanoid(), // 可选
    ownerId: text("owner_id") // 关注者
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 关注者删 → 清理
    targetId: text("target_id") // 被关注者
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 被关注者删 → 清理
    notifyEnabled: boolean("notify_enabled").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("user_follow_unique_idx").on(t.ownerId, t.targetId), // 防重复
    index("user_follow_owner_idx").on(t.ownerId), // 用户关注列表
    index("user_follow_target_idx").on(t.targetId), // 被关注粉丝列表
  ],
);

export const teamFollow = pgTable(
  "team_follow",
  {
    id: pgNanoid(),
    ownerId: text("owner_id") // 关注者
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    targetId: text("target_id") // 团队
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }), // 团队删 → 清理
    notifyEnabled: boolean("notify_enabled").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("team_follow_unique_idx").on(table.ownerId, table.targetId),
    index("team_follow_ownerId_idx").on(table.ownerId),
    index("team_follow_target_idx").on(table.targetId),
  ],
);

// // 3. 项目关注表（复用您的 projectFollow，添加自动删除）
// export const projectFollow = pgTable(
//   "project_follow",
//   {
//     // 您的现有表，微调
//     id: pgNanoid(),
//     ownerId: text("owner_id")
//       .notNull()
//       .references(() => user.id, { onDelete: "cascade" }),
//     targetId: text("target_id")
//       .notNull()
//       .references(() => project.id, { onDelete: "cascade" }), // 项目删 → 清理
//     // notifyEnabled: boolean("notify_enabled").default(true).notNull(), // 如果无，加这个
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//   },
//   (table) => [
//     // ... 您的索引
//     uniqueIndex("project_follow_unique_idx").on(table.ownerId, table.targetId),
//     index("project_follow_ownerId_idx").on(table.ownerId),
//     index("project_follow_target_idx").on(table.targetId),
//   ],
// );
