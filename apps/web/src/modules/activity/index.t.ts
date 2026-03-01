import { activityInsertZ } from "@/lib/db/service";
import type z from "zod";

export const activityCreateZ = activityInsertZ.omit({
  actorId: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type ActivityCreate = z.infer<typeof activityCreateZ>;
