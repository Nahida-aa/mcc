"use server";
import { db } from "@/lib/db";
import { projectLike } from "@/lib/db/schema";
import { withAuth } from "@/lib/func/auth";
import { and, eq } from "drizzle-orm";

export const likeProject = withAuth(async (userId, projectId: string) => {
  await db.insert(projectLike).values({
    userId,
    projectId,
  });
});
export const unlikeProject = withAuth(async (userId, projectId: string) => {
  await db
    .delete(projectLike)
    .where(and(eq(projectLike.userId, userId), eq(projectLike.userId, projectId)));
});

export const getProjectLike = withAuth(async (userId, projectId: string) => {
  const [ret] = await db
    .select()
    .from(projectLike)
    .where(and(eq(projectLike.userId, userId), eq(projectLike.projectId, projectId)));
  return ret;
});
