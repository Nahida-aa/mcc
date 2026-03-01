import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoidWithTimestamps, pgNanoid } from "@/lib/db/helpers";
import { organization, project, team, user } from "@/lib/db/schema";
import { ActivityMetadata, activityTypes } from "./constants";

// 新增：活动流主表（统一存储团队/项目动态） 动态 Feed, 全服可见
export const activity = pgTable(
  "activity",
  {
    ...nanoidWithTimestamps,
    actorId: text("actor_id")
      .notNull()
      .references(() => user.id), // 触发者（用户ID）
    type: text("type", { enum: activityTypes }).notNull(), // 1.团队的筹备书 2. 成立团队成功 3. 团队的解散; 1. 创建了一个项目, 2. 发布了一个版本, 3. 删除了一个项目
    teamId: text("team_id").references(() => organization.id), // 团队ID（organization.id），NULL for project-only
    projectId: text("project_id").references(() => project.id), // 项目ID，NULL for team-only
    resourceId: text("resource_id"), // 引用的资源ID (e.g., member.id for team join, projectVersion.id for version publish)
    // slug: text("slug").notNull(),
    description: text("description").notNull(), // Markdown描述，e.g., "**小明** 发布了版本 **1.0.0**"
    // mentions: text("mentions").array().default([]).notNull(), // @用户ID数组
    metadata: jsonb("metadata").$type<ActivityMetadata>().notNull(),
  },
  (table) => [
    index().on(table.teamId).where(sql`${table.projectId} IS NULL`),
    index().on(table.projectId).where(sql`${table.teamId} IS NULL`),
    index().on(table.actorId),
    index().on(table.createdAt),
  ],
);

// 关系定义
export const activityRelations = relations(activity, ({ one }) => ({
  actor: one(user, { fields: [activity.actorId], references: [user.id] }),
  team: one(team, { fields: [activity.teamId], references: [team.id] }),
  project: one(project, {
    fields: [activity.projectId],
    references: [project.id],
  }),
}));

// 新增：活动阅读记录（优化查询，避免全扫描）
export const activityRead = pgTable(
  "activity_read",
  {
    id: pgNanoid(),
    activityId: text("activity_id")
      .notNull()
      .references(() => activity.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("activity_read_unique_idx").on(table.activityId, table.userId),
  ],
);
