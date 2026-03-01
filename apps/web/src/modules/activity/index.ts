"use server";

import { desc, eq, getTableColumns, isNotNull, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { pickColumns } from "@/lib/db/helpers";
import { activity, user } from "@/lib/db/schema";
import { withAuth } from "@/lib/func/auth";
import type { ActivityCreate } from "./index.t";
import { userItemFields } from "../user/schema/schemas";

export const createActivity = withAuth(
  async (actorId: string, data: ActivityCreate) => {
    const newActivity = await db
      .insert(activity)
      .values({
        actorId,
        ...data,
      })
      .returning();
    return newActivity[0];
  },
);

// 列出 Team 动态
export const listTeamActivity = async () => {
  const ret = await db
    .select()
    .from(activity)
    .where(isNotNull(activity.teamId))
    .orderBy(desc(activity.createdAt))
    .limit(20);
  return ret;
};
export const listProjectActivity = async () => {
  const ret = await db
    .select({
      ...getTableColumns(activity),
      user: pickColumns(user, userItemFields),
    })
    .from(activity)
    .innerJoin(user, eq(activity.actorId, user.id))
    .where(isNotNull(activity.projectId))
    .orderBy(desc(activity.createdAt))
    .limit(20);
  return ret;
};
export type ActivityWithActor = Awaited<
  ReturnType<typeof listProjectActivity>
>[number];
