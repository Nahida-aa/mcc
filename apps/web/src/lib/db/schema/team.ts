import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// 视作团队
export const team = pgTable("team", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
  summary: text("summary"),
  description: text("description"),
});

// export const teamMember = pgTable("member", {
//   id: text("id").primaryKey(),
//   teamId: text("organization_id")
//     .notNull()
//     .references(() => team.id, { onDelete: "cascade" }),
//   userId: text("user_id")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),
//   role: text("role").default("member").notNull(),
//   createdAt: timestamp("created_at").notNull(),
// });
