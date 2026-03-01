import {
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoidWithTimestamps } from "../helpers";
import { user } from ".";

export const friend = pgTable(
  "friend",
  {
    ...nanoidWithTimestamps,
    user1Id: text("user1_id").notNull(),
    user2Id: text("user2_id").notNull(),
    status: text().default("pending").notNull(),
    reason: text().default("manual_request").notNull(),
    // 新增：单向昵称（null 表示未设置）
    nicknameFromUser1: text("nickname_from_user1"), // user1 为 user2 起的昵称
    nicknameFromUser2: text("nickname_from_user2"), // user2 为 user1 起的昵称
  },
  (table) => [
    // uniqueIndex("friend_unique_user1_user2_idx").using(
    //   "btree",
    //   table.user1Id.asc().nullsLast().op("text_ops"),
    //   table.user2Id.asc().nullsLast().op("text_ops"),
    // ),
    uniqueIndex().on(table.user1Id, table.user2Id),
    foreignKey({
      columns: [table.user1Id],
      foreignColumns: [user.id],
      name: "friend_user1_id_user_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.user2Id],
      foreignColumns: [user.id],
      name: "friend_user2_id_user_id_fk",
    }).onDelete("cascade"),
    // 索引：加速昵称查询
    index("friend_nickname_user1_idx").on(
      table.user1Id,
      table.nicknameFromUser1,
    ),
    index("friend_nickname_user2_idx").on(
      table.user2Id,
      table.nicknameFromUser2,
    ),
  ],
);

// 新表：用户组元数据（带顺序）
export const friendGroup = pgTable(
  "friend_group",
  {
    ...nanoidWithTimestamps,
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 自己
    name: text("name").default("default").notNull(), // e.g., "所有好友"
    order: integer("order").default(0).notNull(), // 排序值：越小越前（用户可改）
    // 可选：加描述或图标
    // description: text("description"),
  },
  (t) => [
    uniqueIndex("friend_group_unique_name_idx").on(t.userId, t.name), // 用户内组名唯一
    index("friend_group_user_order_idx").on(t.userId, t.order), // 加速排序查询
  ],
);

// 简化桥接：好友到组的关联（多对多）
export const friendGroupLink = pgTable(
  "friend_group_link",
  {
    friendId: text("friend_id")
      .notNull()
      .references(() => friend.id, { onDelete: "cascade" }),
    friendGroupId: text("friend_group_id")
      .notNull()
      .references(() => friendGroup.id, { onDelete: "cascade" }),
  },
  (t) => [
    uniqueIndex("friend_group_link_unique_idx").on(t.friendId, t.friendGroupId), // 防止重复关联
    index("friend_group_link_friend_idx").on(t.friendId), // 加速删除/查询
  ],
);
