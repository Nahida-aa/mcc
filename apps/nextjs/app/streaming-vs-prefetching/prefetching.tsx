"use client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { waitOpt } from "../streaming/rq";

export function PrefetchingClient() {
  const { data } = useSuspenseQuery(waitOpt(5001))
  return <div>result: {data}</div>
}