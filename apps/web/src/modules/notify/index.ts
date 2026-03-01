"use server";
import { and, desc, eq, getTableColumns, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { notify, notifyReceiver, user } from "@/lib/db/schema";
import type {
  PgTable,
  PgTableWithColumns,
  TableConfig,
} from "drizzle-orm/pg-core";
import { pickColumns } from "@/lib/db/helpers";
import { notifyReceiverFields } from "./schema/constants";
import { userItemFields } from "../user/schema/schemas";
import { withAuth } from "@/lib/func/auth";

// 2. listNotify(userId, limit, offset)
export const _listNotify = async (
  authId: string,
  limit: number = 20,
  offset: number = 0,
) => {
  // const notifys = await db.query.notifyReceiver.findMany({
  //   columns: notifyReceiverFields, // 接收状态
  //   where: eq(notifyReceiver.userId, authId),
  //   with: {
  //     notify: {
  //       // 通知信息
  //       with: {
  //         sender: {
  //           // 发送者信息
  //           columns: userItemFields,
  //         },
  //       },
  //     },
  //   },
  //   orderBy: [desc(notify.createdAt)],
  //   limit,
  //   offset,
  // });

  const notifys = await db
    .select({
      // 通知信息
      ...getTableColumns(notify),
      // 接收状态
      receiver: pickColumns(notifyReceiver, notifyReceiverFields),
      // 发送者信息
      sender: pickColumns(user, userItemFields),
    })
    .from(notifyReceiver)
    .innerJoin(notify, eq(notifyReceiver.notifyId, notify.id))
    .leftJoin(user, eq(notify.senderId, user.id))
    .where(eq(notifyReceiver.userId, authId))
    .orderBy(desc(notify.createdAt))
    .limit(limit)
    .offset(offset);

  return notifys;
};
export const listNotify = withAuth(_listNotify);

export type ListNotifyOut = Awaited<ReturnType<typeof _listNotify>>;

// 已读 notifys
export const _markAsRead = async (authId: string, notifyIds: string[]) => {
  await db
    .update(notifyReceiver)
    .set({ isRead: true })
    .where(
      and(
        eq(notifyReceiver.userId, authId),
        inArray(notifyReceiver.id, notifyIds),
      ),
    );
};
export const markAsRead = withAuth(_markAsRead);
