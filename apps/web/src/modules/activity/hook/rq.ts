import { queryOptions } from "@tanstack/react-query";
import { listProjectActivity } from "..";

export const projectActivityListOpt = () => queryOptions({
  queryKey: ["projectActivityList"],
  queryFn: listProjectActivity
})