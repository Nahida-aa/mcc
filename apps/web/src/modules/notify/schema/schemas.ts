import { notify, notifyReceiver } from "@/lib/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { notifySelectZ } from "@/lib/db/service";
import z from "zod";
import { userItemZ } from "@/modules/user/schema/schemas";

export const notifyZ = notifySelectZ.extend({
  isRead: z.boolean(),
  readAt: z.date().nullable(),
  sender: userItemZ.nullable(),
});
